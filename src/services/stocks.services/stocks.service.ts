//**MEMGRAPH IMPORTS */
import { Driver, ManagedTransaction, QueryResult, Session } from 'neo4j-driver-core';

//** THIRDWEB SDK IMPORT
import { Edition, MarketplaceV3, ThirdwebSDK } from '@thirdweb-dev/sdk';

//** TYPE INTERFACE IMPORT
import { CardListingContracts } from '../list.services/list.interface';
import { CardData } from '../mint.services/mint.interface';

//** CONFIGS IMPORT
import { CHAIN, PRIVATE_KEY, SECRET_KEY } from '../../config/constants';

//** SERVICE IMPORT
import ListService from '../list.services/list.service';
import TokenService from '../security.services/token.service';
import AuthService from '../user.services/auth.service';
import { CardsListedValid, MintedCardMetaData, PackMetadata, StoreCardUpgradeData } from './stocks.interface';

//** CYPHER IMPORT
import {
    cardListedCypher, cardPackStockAllCypher, cardSoldCypher, cardStockAllCypher,
    cardStockAllUnpacked, cardUpgradeItemAllCypher, saveCardListedCypher,
    saveCardValidCypher, saveCardValidCypherMerge
} from './stock.cypher';
import { CardPackData } from '../gacha.services/gacha.interface';



class StockService {
    private driver: Driver;

    constructor(driver: Driver) {
        this.driver = driver;
    }

    public async cardStock(): Promise<CardData[] | Error> {
        try {
            const session: Session = this.driver.session();
            const result: QueryResult = await session.executeRead((tx: ManagedTransaction) =>
                tx.run(cardStockAllCypher)
            );
            await session.close();

            const cards: CardData[] = result.records.map(record => record.get("c").properties);



            return cards as CardData[];
        } catch (error: any) {
            return error;
        }
    }

    public async cardStockUnpacked() {
        try {
            const session: Session = this.driver.session();
            const result: QueryResult = await session.executeRead((tx: ManagedTransaction) =>
                tx.run(cardStockAllUnpacked)
            );
            await session.close();

            const cards: CardData[] = result.records.map(record => record.get("c").properties);

            return cards as CardData[];
        } catch (error: any) {
            return error;
        }
    }

    public async cardListed(): Promise<CardData[] | Error> {
        try {
            const session: Session = this.driver.session();
            const res: QueryResult = await session.executeRead((tx: ManagedTransaction) =>
                tx.run(cardListedCypher)
            );
    
            await session.close();
    
            const currentDate = new Date();
            const cards: CardData[] = res.records
                .map(record => record.get("c").properties)
                .filter(card => {
                    const [month, day, year] = card.endTime.split('/');
                    const endTime = new Date(`20${year}-${month}-${day}`);
                    return endTime >= currentDate;
                });
    
            return cards as CardData[];
        } catch (error: any) {
            return error;
        }
    }

    public async cardSold(): Promise<CardData[] | Error> {
        try {
            const session: Session = this.driver.session();
            const res: QueryResult = await session.executeRead((tx: ManagedTransaction) =>
                tx.run(cardSoldCypher)
            );
            await session.close();

            const cards: CardData[] = res.records.map(record => record.get("c").properties);

            return cards as CardData[];
        } catch (error: any) {
            return error;
        }
    }

    public async populateCardListFromContract(token: string, password: string) {
        const listService: ListService = new ListService(this.driver);
        const authenticateService: AuthService = new AuthService();
        const tokenService: TokenService = new TokenService();
        try {
            // Retrieve contracts and SDK initialization

            const username: string = await tokenService.verifyAccessToken(token);
            await authenticateService.authenticate(username, password);

            const contracts: CardListingContracts = await listService.retrieveContracts(token);
            const sdk: ThirdwebSDK = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY, CHAIN, {
                secretKey: SECRET_KEY,
            });
            const marketplaceContract: MarketplaceV3 =  await sdk.getContract(contracts.marketplaceAddress, 'marketplace-v3');
            const cardContract: Edition = await sdk.getContract(contracts.cardAssetAddress, "edition");
    
            // Fetch all card listings and NFTs in parallel
            const [cardsValid, cardNFTs] = await Promise.all([

                marketplaceContract.directListings.getAllValid() as unknown as Promise<CardsListedValid[]>,

                cardContract.getAll() as unknown as Promise<MintedCardMetaData[]>
            ]);
    
            // Fetch all images in parallel

            for (const validCard of cardsValid) {
                for (const card of cardNFTs) {
                    if (validCard.asset.uri === card.metadata.uri) {
                        // Pushing promises to imagePromises array

                    }
                }
            }

            // Process matches and save card data
            for (let i = 0; i < cardsValid.length; i++) {
                const validCard: CardsListedValid = cardsValid[i];
                const card: MintedCardMetaData = cardNFTs[i];

                
                if (validCard.asset.uri === card.metadata.uri) {
                    const imageByteArrayString: string = await this.getImageByte(validCard.asset.image);

                    await this.saveCardValid(validCard, imageByteArrayString);
                }
            }
        
            // Save all listed cards
            for (let i = 0; i < cardNFTs.length; i++) {
                const card: MintedCardMetaData = cardNFTs[i];
                const imageByteArrayString: string = await this.getImageByte(card.metadata.image);
                await this.saveCardListed(card, imageByteArrayString);
            }
    
            return { success: "Card populated successfully" };
        } catch(error: any) {
            console.error(error);
            throw error;
        }
    }


    

    public async cardPackStock(token: string): Promise<PackMetadata[]| Error> {
        try {
            const tokenService: TokenService = new TokenService();
            await tokenService.verifyAccessToken(token);

            const session: Session = this.driver.session();
            const result: QueryResult = await session.executeRead((tx: ManagedTransaction) =>
                tx.run(cardPackStockAllCypher)
            );
            await session.close();

            const cardPacks: PackMetadata[] = result.records.map(record => record.get("c").properties);

            return cardPacks as PackMetadata[];
        } catch (error: any) {
            return error;
        }
    }












    private async getImageByte(imageUri: string): Promise<string> {
        try {
            const response: Response = await fetch(imageUri);
    
            const imageBuffer: ArrayBuffer = await response.arrayBuffer();
            const uint8Array: Uint8Array = new Uint8Array(imageBuffer);
    
            const array = Array.from(uint8Array);
            const byteArray: number[] = Array.from(array);
    
            // Stringify the array
            const byteArrayString: string = JSON.stringify(byteArray);
            return byteArrayString;
        } catch(error: any) {
            throw error;
        }
    }
    
    private async saveCardValid(card: CardsListedValid, imageByteStringValid: string) {


        try {
            const { asset, assetContractAddress, quantity, startTimeInSeconds, endTimeInSeconds,   } = card as CardsListedValid;
            const startDate = new Date(startTimeInSeconds * 1000); // Convert seconds to milliseconds
            const endDate = new Date(endTimeInSeconds * 1000);

            const startTime = `${startDate.getMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear().toString().slice(-2)}`;
            const endTime = `${endDate.getMonth() + 1}/${endDate.getDate()}/${endDate.getFullYear().toString().slice(-2)}`;

            const parameters = {
                ...asset,
                editionAddress: assetContractAddress,
                owner: "0xx",
                supply: quantity,
                type: 'ERC1155',
                uploaderBeats: "beats",
                imageByte: imageByteStringValid,
                
            };

            const priceToNumber: string = card.currencyValuePerToken.displayValue
            const listingData = {
                currencyName: "$BEATS",
                quantity,
                pricePerToken: priceToNumber,
                startTime,
                endTime,
            };

            
            const session: Session = this.driver.session();
            await session.executeWrite(async (tx: ManagedTransaction) => {

                await tx.run(saveCardValidCypher, 
                    { tokenId: card.tokenId, parameters, listingData, listingId: card.id, lister: card.asset.uploader }
                );

                await tx.run(saveCardValidCypherMerge, 
                    { id: card.tokenId, uploader: "beats" }
                );
            }
        );
            await session.close();

        } catch(error: any) {
            throw error
        }
    }

    private async saveCardListed(card: MintedCardMetaData, imageByteStringListed: string) {
        try {
            const session: Session = this.driver.session();

            const parameters = {
                ...card.metadata,
                tokenId: card.metadata.id,
                uploader: 'beats',
                imageByte: imageByteStringListed,
                supply: card.supply
            };

            await session.executeWrite((tx: ManagedTransaction) => {
                tx.run(saveCardListedCypher, 
                    { id: card.metadata.id, parameters }
                );
    
            });
            await session.close();
        } catch(error: any) {
            throw error;
        }
    }

    public async cardUpgradeItemStock(): Promise<StoreCardUpgradeData[]> {
        try {
            const session: Session = this.driver.session();
            const result: QueryResult = await session.executeRead((tx: ManagedTransaction) =>
                tx.run(cardUpgradeItemAllCypher)
            );
            await session.close();

            const cardUpgradeItem: StoreCardUpgradeData[] = result.records.map(record => record.get("c").properties);

            return cardUpgradeItem as StoreCardUpgradeData[];
        } catch (error: any) {
            return error;
        }      
    }

}    


export default StockService