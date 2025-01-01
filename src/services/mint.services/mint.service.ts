//**MEMGRAPH IMPORTS
import { Driver, Session, ManagedTransaction } from 'neo4j-driver-core'

//** VALIDATION ERROR IMPORT
import ValidationError from '../../errors/validation.error';

//** SERVICE IMPORTS
import SecurityService from '../security.services/security.service';
import TokenService from '../security.services/token.service';
import ContractService from '../contract.services/contracts.service';

//** TYPE IMPORTS
import { Contracts } from '../contract.services/contracts.interface';
import { CreateCard, CreatePack, SuccessMessage } from './mint.interface';
import { MintedCardMetaData, MintedPackMetaData } from '../stocks.services/stocks.interface';

//** BUFFER IMPORT
import { Buffer } from "buffer";

//** CONFIG IMPORTS
import { CHAIN, ENGINE_ADMIN_WALLET_ADDRESS, TREASURY_WALLET } from '../../config/constants'

//** THIRDWEB UTIL IMPORTS
import { engine, uploadImage } from '../utils.services/utils.service';


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

            const { imageByte, ...metadata } = createCardData;
    
            const byteImage: number[] = JSON.parse(createCardData.imageByte);
            const buffer: Buffer = Buffer.from(byteImage);
            const imageUri: string = await uploadImage(buffer, metadata.name);

            const supply: number = createCardData.supply;
            const metadataWithSupply = Array.from({ length: supply }, () => ({
                metadata: { ...metadata, image: imageUri, uploader: "beats",},
                supply: "1" })); // Each item has a supply of 1

            const requestBody = {
                receiver: TREASURY_WALLET,
                metadataWithSupply,
            };

             await engine.erc1155.mintBatchTo(CHAIN, editionAddress, ENGINE_ADMIN_WALLET_ADDRESS, requestBody, true);
             const cards = await engine.erc1155.getAll(CHAIN, editionAddress);
             const mintedCardArray = cards.result

             //@ts-ignore
             this.saveCardToMemgraph(mintedCardArray, editionAddress, username);
            return { success: "Card mint is successful" } as SuccessMessage;
        } catch (error: any) {
            console.log(error)
            throw error;
        }
    }


    private async saveCardToMemgraph(stocks: MintedCardMetaData[], editionAddress: string, uploaderBeats: string, ): Promise<void> {
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
            const { packAddress } = contractAddress;
            
            if (!packAddress) {
                throw new Error("Edition address is undefined");
            }
              
            const { imageByte, name, description, supply } = createPack;
         
            
            const byteImage: number[] = JSON.parse(imageByte);
            const buffer: Buffer = Buffer.from(byteImage);

            const imageUri: string = await uploadImage(buffer, name);

            const supplyAmount: string = supply.toString();
            const metadataWithSupply = {
                metadata: { name, description, image: imageUri,uploader: "beats", type: "pack"
                }, supply: supplyAmount
            }

            const requestBody = {
                receiver: TREASURY_WALLET,
                metadataWithSupply,
            };

            await engine.erc1155.mintTo(CHAIN, packAddress, ENGINE_ADMIN_WALLET_ADDRESS, requestBody, true);

            const lastMintedPacks = await engine.erc1155.getAll(CHAIN, packAddress);
            const mintedPacksresult: MintedPackMetaData[] = lastMintedPacks.result as unknown as MintedPackMetaData[];
            const lastPacks: MintedPackMetaData  = mintedPacksresult.at(-1) as unknown as MintedPackMetaData ;

            this.savePackToMemgraph(username, lastPacks);
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



    //NOT UPGRADED YET!!!

    // public async createUpgradeItem(token: string, upgradeItemData: UpgradeItemData): Promise<SuccessMessage> {
    //     const tokenService: TokenService = new TokenService();
    //     const username: string = await tokenService.verifyAccessToken(token);
    //     try {
    //         const contractAddress = await this.retrieveContracts(token)
    //         const { cardItemUpgrade } = contractAddress
    //         if (!cardItemUpgrade) {
    //             throw new Error("Edition address is undefined");
    //         };



    //         const byteImage: number[] = JSON.parse(upgradeItemData.imageByte);
    //         const buffer: Buffer = Buffer.from(byteImage);

    //         const imageUri = uploadImage(buffer, "Upgrade Item")




    //         const {imageByte, quantity, ...metadata } = upgradeItemData
    //         const namedMetada = {...metadata, name: }

    //         // const stringQuantity: string = quantity.toString();
    //         // const metadataWithSupply: MetadataWithSupply[] = Array(1).fill({
    //         //     supply: stringQuantity,
    //         //     metadata: { 
    //         //         ...itemData, 
    //         //         image: imageUri,
    //         //         uploader: "beats"
    //         //     }
    //         // });


    //         const metadataWithSupply = Array.from({ length: 1 }, () => ({
    //             metadata: { metadata, image: imageUri, uploader: "beats",},
    //             supply: "1" })); // Each item has a supply of 1



    //         const requestBody = {
    //             receiver: TREASURY_WALLET,
    //             metadataWithSupply,
    //         };

    //         await engine.erc1155.mintBatchTo(CHAIN, cardItemUpgrade, ENGINE_ADMIN_WALLET_ADDRESS, requestBody)

    //         //@ts-ignore
    //         const stocks: MintedUpgradeItemMetadata[] = await cardUpgradeContract.erc1155.getOwned();
    //         await this.saveUpgradeItemToMemgraph(stocks, cardItemUpgrade, username);

    //         return { success: "Card item upgrade has been created"} as SuccessMessage
    //     } catch(error: any) {
    //         console.log(error);
    //         throw error;

    //     }
    // }


    // private async saveUpgradeItemToMemgraph(stocks: MintedUpgradeItemMetadata[], editionAddress: string, uploaderBeats: string,): Promise<void> {
    //     try {
    //         const session: Session = this.driver.session();
    //         await session.executeWrite(async (tx: ManagedTransaction) => {
    //             for (const upgradeItem of stocks) {
    //                 const { metadata, owner, quantityOwned, supply, type } = upgradeItem as MintedUpgradeItemMetadata
    
    //                 const parameters = {
    //                     ...metadata,
    //                     editionAddress,
    //                     owner,
    //                     quantityOwned,
    //                     supply,
    //                     type,
    //                     uploaderBeats,
    //                     skillEquipped: false
    //                 };
    
    //                 await tx.run(
    //                     `
    //                     MERGE (c:CardUpgrade {id: $id})
    //                     ON CREATE SET
    //                         c += $parameters
    //                     RETURN c
    //                     `, { id: metadata.id, parameters }
    //                 );
    
    //                 await tx.run(
    //                     `
    //                     MATCH (p:Card {id: $id})
    //                     MATCH (u:User {username: $uploader})
    //                     MERGE (p)-[:UPLOADED]->(u)
    //                     `, { id: metadata.id, uploader: owner }
    //                 );
    //             }
    //         });
    //         await session.close();
    //     } catch (error: any) {
    //         console.log(error)
    //         throw error;
    //     }

    // }


}    

export default  MintService