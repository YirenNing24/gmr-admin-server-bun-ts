//**MEMGRAPH IMPORTS
import { Driver, Session, ManagedTransaction } from 'neo4j-driver-core'

//** THIRDWEB IMPORTS
import { NFT, ThirdwebSDK, TransactionResultWithId } from "@thirdweb-dev/sdk";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

//** VALIDATION ERROR IMPORT
import ValidationError from '../../errors/validation.error';

//** SERVICE IMPORTS
import SecurityService from '../security.services/security.service';
import TokenService from '../security.services/token.service';
import ContractService from '../contract.services/contracts.service';

//** TYPE IMPORTS
import { Contracts } from '../contract.services/contracts.interface';
import { CreateCard, CreatePack, MetadataWithSupply, MintedUpgradeItemMetadata, SuccessMessage, UpgradeItemData } from './mint.interface';
import { MintedCardMetaData, MintedPackMetaData } from '../stocks.services/stocks.interface';

//** BUFFER IMPORT
import { Buffer } from "buffer";

//** CONFIG IMPORTS
import { SECRET_KEY, PRIVATE_KEY, CHAIN } from '../../config/constants'


class MintService {

    private driver: Driver;
    constructor(driver: Driver) {
        this.driver = driver;
    };

    public async createCard(token: string, createCardData: CreateCard): Promise<SuccessMessage | Error> {
        const tokenService: TokenService = new TokenService();
        const securityService: SecurityService = new SecurityService();
    
        const username: string = await tokenService.verifyAccessToken(token);
        const access: string | Error = await securityService.checkAccess(username);
    
        try {
            if (access !== "0" && access !== "1") {
                return new ValidationError("Access Denied", "User does not have permission to create cards");
            }
    
            const contractAddress = await this.retrieveContracts(token);
            const { editionAddress } = contractAddress;
    
            if (!editionAddress) {
                throw new Error("Edition address is undefined");
            }
    
            const storage: ThirdwebStorage = new ThirdwebStorage({
                secretKey: SECRET_KEY,
            });
    
            const sdk: ThirdwebSDK = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY, CHAIN, {
                secretKey: SECRET_KEY,
            });
    
            const { imageByte, ...metadata } = createCardData;
    
            const byteImage: number[] = JSON.parse(createCardData.imageByte);
            const buffer: Buffer = Buffer.from(byteImage);
            const [imageURI, cardContract] = await Promise.all([
                storage.upload(buffer),
                sdk.getContract(editionAddress, 'edition'),
            ]);
    
            const supplyAmount: number = createCardData.supply;
            const metadataWithSupply: MetadataWithSupply[] = Array(supplyAmount).fill({
                supply: 1,
                metadata: {
                    metadata,
                    image: imageURI,
                    uploader: "beats"
                }
            });
    
            const trans: TransactionResultWithId<NFT>[] = await cardContract.erc1155.mintBatch(metadataWithSupply);

            let mintedCardArray: any[] = []; // Initialize an array to store card data

            // Use map to create an array of promises, then use Promise.all to wait for all of them
            await Promise.all(trans.map(async card => {
                try {
                    const cards = await cardContract.erc1155.get(card.id); // Fetch card data
                    mintedCardArray.push(cards); // Push the fetched card data into the array
                } catch (error) {
                    console.error(`Failed to fetch card with id ${card.id}:`, error);
                }
            }));


            
            // Now, mintedCardArray should be fully populated
            await this.saveCardToMemgraph(mintedCardArray, editionAddress, username, imageByte);
            
    
            return { success: "Card mint is successful" } as SuccessMessage;
        } catch (error: any) {
            console.log(error)
            throw error;
        }
    }


    private async saveCardToMemgraph(stocks: MintedCardMetaData[], editionAddress: string, uploaderBeats: string, imageByte: string): Promise<void> {
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
    
                    // Extract the nested metadata
                    //@ts-ignore
                    const { metadata: nestedMetadata, ...otherMetadata } = metadata;
    
                    // Combine all the necessary properties into the parameters object
                    const parameters = {
                        ...otherMetadata,        // Spread the outer metadata key-value pairs
                        ...nestedMetadata,       // Spread the nested metadata key-value pairs
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
    }
    

    public async createPack(token: string, createPack: CreatePack): Promise<SuccessMessage> {
        try {
            const tokenService: TokenService = new TokenService();
            const securityService: SecurityService = new SecurityService();
            
            const username: string = await tokenService.verifyAccessToken(token);
            const access: string | Error = await securityService.checkAccess(username);
            
            if (access !== "0" && access !== "1") {
                throw new ValidationError("Access Denied", "User does not have permission to create pack");
            }
            
            const contractAddress = await this.retrieveContracts(token);
            const { editionAddress } = contractAddress;
            
            if (!editionAddress) {
                throw new Error("Edition address is undefined");
            }
            
            const storage: ThirdwebStorage = new ThirdwebStorage({
                secretKey: SECRET_KEY,
            });
            
            const sdk: ThirdwebSDK = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY, CHAIN, {
                secretKey: SECRET_KEY,
            });
            
            const { imageByte, name, description, supply } = createPack;
            console.log(name, description, supply)
            
            const byteImage: number[] = JSON.parse(imageByte);
            const buffer: Buffer = Buffer.from(byteImage);
            
            const [imageURI, cardContract] = await Promise.all([
                storage.upload(buffer),
                sdk.getContract(editionAddress, 'edition'),
            ]);
            
            const metadataWithSupply = {
                supply: 100,
                metadata: {
                    name,
                    description,
                    image: imageURI,
                    uploader: "beats",
                    type: "pack"
                }
            }

            
            const result = await cardContract.erc1155.mint(metadataWithSupply); 
            const packs = await cardContract.erc1155.get(result.id) as unknown as MintedPackMetaData;


            await this.savePackToMemgraph(username, packs);
            

            return { success: "Pack mint is successful" } as SuccessMessage; 
        } catch (error) {
            throw error;
        }
    }


    private async savePackToMemgraph(uploader: string, packs: MintedPackMetaData): Promise<void> {
        const session: Session = this.driver.session();
        try {
            const { id, name, description, image, type, uri } = packs.metadata;
            await session.executeWrite(async (tx: ManagedTransaction) => {
                await tx.run(
                    `
                    MERGE (p:Pack {id: $id})
                    ON CREATE SET
                        p.description = $description,
                        p.image = $image,
                        p.name = $name,
                        p.uri = $uri,

                        p.type = $type,
                        p.uploader = $uploader
                    RETURN p
                    `,
                    {
                        id,
                        description,
                        image,
                        name,
                        uri,
                        owner: packs.owner,
                        type,
                        uploader
                    }
                );
            });
    
            // Create a relationship between the Pack and uploader
            await session.executeWrite(async (tx: ManagedTransaction) => {
                await tx.run(
                    `
                    MATCH (p:Pack {id: $id})
                    MATCH (u:User {username: $uploader})
                    MERGE (p)-[:UPLOADED]->(u)
                    `,
                    {
                        id,
                        uploader
                    }
                );
            });
        } finally {
            await session.close();
        }
    }
    

    public async retrieveContracts(token: string): Promise<{editionAddress: string | undefined, cardItemUpgrade: string | undefined, packAddress: string | undefined}> {
        const contractService: ContractService = new ContractService();
        const contracts: Error | Contracts[] = await contractService.getContracts(token);

        let editionAddress: string | undefined; 
        let cardItemUpgrade: string | undefined;// Initialize to undefined
        let packAddress: string | undefined;
        if (Array.isArray(contracts)) {
            const [firstContract] = contracts;
            if (firstContract) {
                const { cardAddress, cardItemUpgradeAddress, bundleAddress  } = firstContract;
                editionAddress = cardAddress;
                cardItemUpgrade = cardItemUpgradeAddress;
                packAddress = bundleAddress
            }
        }

        if (!editionAddress) {
            throw new Error("Edition address is undefined");
        }

        return { editionAddress, cardItemUpgrade, packAddress }
    }


    public async createUpgradeItem(token: string, upgradeItemData: UpgradeItemData): Promise<SuccessMessage> {
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
            console.log(error);
            throw error;

        }
    }


    private async saveUpgradeItemToMemgraph(stocks: MintedUpgradeItemMetadata[], editionAddress: string, uploaderBeats: string,): Promise<void> {
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

    }


}    

export default  MintService