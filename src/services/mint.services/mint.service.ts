//**MEMGRAPH IMPORTs
import { Driver, Session, ManagedTransaction } from 'neo4j-driver-core'

//** THIRDWEB IMPORTS */
import { Edition, NFT, Pack, ThirdwebSDK, TransactionResultWithId } from "@thirdweb-dev/sdk";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { SECRET_KEY, PRIVATE_KEY, CHAIN } from '../../config/constants';

//** VALIDATION ERROR IMPORT
import ValidationError from '../../errors/validation.error';

//** SERVICE IMPORTS
import SecurityService from '../security.services/security.service';
import TokenService from '../security.services/token.service';
import ContractService from '../contract.services/contracts.service';

//** TYPE IMPORTS
import { Contracts } from '../contract.services/contracts.interface';
import { CardBundleData, CardField, CreateCard, MetadataWithSupply, MintedUpgradeItemMetadata, SuccessMessage, UpgradeItemData } from './mint.interface';
import { Buffer } from "buffer";
import { MintedCardMetaData } from '../stocks.services/stocks.interface';

export default class MintService {

    private driver: Driver;
    constructor(driver: Driver) {
        this.driver = driver;
    };

    public async createCard(token: string, createCardData: CreateCard): Promise < SuccessMessage | Error > {
        const tokenService: TokenService = new TokenService();
        const securityService: SecurityService = new SecurityService();

        const username: string = await tokenService.verifyAccessToken(token);
        const access: string = await securityService.checkAccess(username);
        try {
            if (access !== "0" && access !== "1") {
                return new ValidationError("Access Denied", "User doest not have  permission to create cards");
            };
            
            const contractAddress = await this.retrieveContracts(token)
            const { editionAddress } = contractAddress

            if (!editionAddress) {
                throw new Error("Edition address is undefined");
            };

            const storage: ThirdwebStorage = new ThirdwebStorage({
                secretKey: SECRET_KEY,
            });

            const sdk: ThirdwebSDK = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY, CHAIN, {
                secretKey: SECRET_KEY,
            });

            const imageByte: string = createCardData.imageByte
            const byteImage: number[] = JSON.parse(createCardData.imageByte);
            const buffer: Buffer = Buffer.from(byteImage);
            const [imageURI, cardContract] = await Promise.all([
                storage.upload(buffer),
                sdk.getContract(editionAddress, 'edition'),
            ]);

            const supplyAmount: number = createCardData.supply
            const metadataWithSupply: MetadataWithSupply[] = Array(supplyAmount).fill({
                supply: 1,
                metadata: { 
                    ...createCardData, 
                    image: imageURI,
                    uploader: "beats"
                }
            });

            await cardContract.erc1155.mintBatch(metadataWithSupply)

            //@ts-ignore
            const stocks: MintedCardMetaData[] = await cardContract.erc1155.getOwned()

            await this.saveCardToMemgraph(stocks, editionAddress, username, imageByte);

            return { success: "Card mint is successful" } as SuccessMessage;
        } catch (error: any) {
            console.error(error)
          throw error
        }
    };

    private async saveCardToMemgraph(stocks: MintedCardMetaData[], editionAddress: string, uploaderBeats: string, imageByte: string) {
        try {
            const session: Session = this.driver.session();
            await session.executeWrite(async (tx: ManagedTransaction) => {
                for (const card of stocks) {
                    const {
                        metadata,
                        owner,
                        quantityOwned,
                        supply,
                        type
                    } = card;
    
                    const parameters = {
                        ...metadata,
                        editionAddress,
                        owner,
                        quantityOwned,
                        supply,
                        type,
                        uploaderBeats,
                        imageByte,
                        skillEquipped: false
                    };
    
                    await tx.run(
                        `
                        MERGE (c:Card {id: $id})
                        ON CREATE SET
                            c += $parameters
                        RETURN c
                        `, { id: metadata.id, parameters }
                    );
    
                    await tx.run(
                        `
                        MATCH (p:Card {id: $id})
                        MATCH (u:User {username: $uploader})
                        MERGE (p)-[:UPLOADED]->(u)
                        `, { id: metadata.id, uploader: owner }
                    );
                }
            });
            await session.close();
        } catch (error) {

            throw error;
        }
    };
    

    public async createCardBox(cardBoxData: CardBundleData, base64Image: string, cardFields: CardField[], uploader: string, packAddress: string): Promise < void | Error > {
        try {
            const storage: ThirdwebStorage = new ThirdwebStorage({
                secretKey: SECRET_KEY,
            });

            const sdk: ThirdwebSDK = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY, CHAIN, {
                secretKey: SECRET_KEY
            });

            const editionAddress = cardFields[0].assetContract;
            const buffer: Buffer = Buffer.from(base64Image, "base64");
            const [imageURI, cardBoxContract, editionContract]: [string, Pack, Edition] = await Promise.all([
                storage.upload(buffer),
                sdk.getContract(packAddress, 'pack'),
                sdk.getContract(editionAddress, 'edition')
            ]);

            // Set approval for the pack contract to manage editions
            await editionContract.setApprovalForAll(packAddress, true);

            const {
                description,
                name,
                openStartTime,
                quantity,
                quantityPerReward,
                rewardsPerPack,
                token,
                totalRewards,
                type
            } = cardBoxData;

            const erc1155Rewards = cardFields.map((cardField) => ({
                contractAddress: cardField.assetContract,
                tokenId: cardField.tokenId,
                quantityPerReward: cardField.quantityPerReward,
                totalRewards: cardField.totalRewards,
            }));

            const pack = {
                packMetadata: {
                    name,
                    description,
                    image: imageURI,
                    type,
                    uploader,
                },
                erc20Rewards: [{
                    contractAddress: token,
                    quantityPerReward,
                    quantity,
                    totalRewards,
                }],
                erc1155Rewards,
                openStartTime: new Date(openStartTime),
                rewardsPerPack,
            };

            // Create the card box
            const transaction = await cardBoxContract.create(pack);

            // Fetch the stocks
            const stocks = await cardBoxContract.erc1155.getOwned();

            const session: Session = this.driver.session();
            for (const cardBox of stocks) {
                const {
                    metadata: {
                        id,
                        name,
                        description,
                        image,
                        type,
                        uri,
                        owner
                    }
                } = cardBox;

                // Create or update the Pack node in Neo4j
                await session.executeWrite((tx) =>
                    tx.run(
                        `
                      MERGE (p:Pack {id: $id})
                      ON CREATE SET
                          p.description = $description,
                          p.image = $image,
                          p.name = $name,
                          p.uri = $uri,
                          p.owner = $owner,
                          p.type = $type,
                          p.uploader = $uploader
                      RETURN p
                      `, {
                            id,
                            description,
                            image,
                            name,
                            uri,
                            owner,
                            type,
                            uploader
                        }
                    )
                );

                // Create a relationship between the Pack and User nodes
                await session.executeWrite((tx) =>
                    tx.run(
                        `
                      MATCH (p:Pack {id: $id})
                      MATCH (u:User {username: $uploader})
                      MERGE (p)-[:UPLOADED]->(u)
                      `, {
                            id,
                            uploader
                        }
                    )
                );
            }

            await session.close();
        } catch (error) {
            console.error('An error occurred:', error);
            throw error;
        }
    };

    public async retrieveContracts(token: string): Promise<{editionAddress: string | undefined, cardItemUpgrade: string | undefined}> {
        const contractService: ContractService = new ContractService();
        const contracts: Error | Contracts[] = await contractService.getContracts(token);

        let editionAddress: string | undefined; 
        let cardItemUpgrade: string | undefined;// Initialize to undefined
        if (Array.isArray(contracts)) {
            const [firstContract] = contracts;
            if (firstContract) {
                const { cardAddress, cardItemUpgradeAddress } = firstContract;
                editionAddress = cardAddress;
                cardItemUpgrade = cardItemUpgradeAddress;
            }
        }

        if (!editionAddress) {
            throw new Error("Edition address is undefined");
        }

        return { editionAddress, cardItemUpgrade }
    };

    public async createUpgradeItem(token: string, upgradeItemData: UpgradeItemData) {
        const tokenService: TokenService = new TokenService();
        const username: string = await tokenService.verifyAccessToken(token);
        try {
            const contractAddress = await this.retrieveContracts(token)
            const { cardItemUpgrade } = contractAddress
            if (!cardItemUpgrade) {
                throw new Error("Edition address is undefined");
            };

            const storage: ThirdwebStorage = new ThirdwebStorage({
                secretKey: SECRET_KEY,
            });

            const sdk: ThirdwebSDK = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY, CHAIN, {
                secretKey: SECRET_KEY,
            });

            const byteImage: number[] = JSON.parse(upgradeItemData.imageByte);
            const buffer: Buffer = Buffer.from(byteImage);
            const [imageURI, cardUpgradeContract] = await Promise.all([
                storage.upload(buffer),
                sdk.getContract(cardItemUpgrade, "edition"),
            ]);

            const {imageByte, quantity, ...itemData } = upgradeItemData
            const metadataWithSupply: MetadataWithSupply[] = Array(1).fill({
                supply: quantity,
                metadata: { 
                    ...itemData, 
                    image: imageURI,
                    uploader: "beats"
                }
            });

            await cardUpgradeContract.erc1155.mintBatch(metadataWithSupply);

            //@ts-ignore
            const stocks: MintedUpgradeItemMetadata[] = await cardUpgradeContract.erc1155.getOwned();
            await this.saveUpgradeItemToMemgraph(stocks, cardItemUpgrade, username);

            return { success: "Card item upgrade has been created"} as SuccessMessage
        } catch(error: any) {
            console.log(error)
            throw error

        }



    };


    private async saveUpgradeItemToMemgraph(stocks: MintedUpgradeItemMetadata[], editionAddress: string, uploaderBeats: string,) {
        try {
            const session: Session = this.driver.session();
            await session.executeWrite(async (tx: ManagedTransaction) => {
                for (const upgradeItem of stocks) {
                    const { metadata, owner, quantityOwned, supply, type } = upgradeItem as MintedUpgradeItemMetadata
    
                    const parameters = {
                        ...metadata,
                        editionAddress,
                        owner,
                        quantityOwned,
                        supply,
                        type,
                        uploaderBeats,
                        skillEquipped: false
                    };
    
                    await tx.run(
                        `
                        MERGE (c:CardUpgrade {id: $id})
                        ON CREATE SET
                            c += $parameters
                        RETURN c
                        `, { id: metadata.id, parameters }
                    );
    
                    await tx.run(
                        `
                        MATCH (p:Card {id: $id})
                        MATCH (u:User {username: $uploader})
                        MERGE (p)-[:UPLOADED]->(u)
                        `, { id: metadata.id, uploader: owner }
                    );
                }
            });
            await session.close();
        } catch (error: any) {
            console.log(error)
            throw error;
        }

    };
}