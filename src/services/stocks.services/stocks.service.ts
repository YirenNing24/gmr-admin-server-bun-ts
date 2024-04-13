//**MEMGRAPH IMPORTS */
import { Driver, QueryResult, Session, ManagedTransaction } from 'neo4j-driver-core';

//** THIRDWEB SDK IMPORT
import { DirectListingV3, Edition, MarketplaceV3, NFT, ThirdwebSDK } from '@thirdweb-dev/sdk';

//** TYPE INTERFACE IMPORT
import { CardData } from '../mint.services/mint.interface';
import { CardListingContracts } from '../list.services/list.interface';

//** CONFIGS IMPORT
import { PRIVATE_KEY, SECRET_KEY } from '../../config/constants';

//** SERVice IMPORT
import ListService from '../list.services/list.service';
import { AllCardsListed, CardsListedValid, MintedCardMetaData } from './stocks.interface';
import AuthService from '../user.services/auth.service';
import TokenService from '../security.services/token.service';


export default class StockService {
    private driver: Driver;

    constructor(driver: Driver) {
        this.driver = driver;
    }

    public async cardListAll(): Promise<CardData[] | Error> {
        try {
            const session: Session = this.driver.session();
            const result: QueryResult = await session.executeRead((tx: ManagedTransaction) =>
                tx.run(`MATCH (c:Card) WHERE c.lister IS NULL RETURN c`)
            );
            await session.close();

            const cards: CardData[] = result.records.map(record => record.get("c").properties);

            return cards as CardData[];
        } catch (error: any) {
            return error;
        }
    }

    public async cardListPosted(): Promise<CardData[] | Error> {
        try {
            const session: Session = this.driver.session();
            const res: QueryResult = await session.executeRead((tx: ManagedTransaction) =>
                tx.run(`MATCH (c:Card) WHERE c.lister IS NOT NULL RETURN c`)
            );
            await session.close();

            const cards: CardData[] = res.records.map(record => record.get("c").properties);

            return cards as CardData[]
        } catch (error: any) {
          return error;
        }
    }

    public async cardListSold(): Promise<CardData[] | Error> {
        try {
            const session: Session = this.driver.session();
            const res: QueryResult = await session.executeRead((tx: ManagedTransaction) =>
                tx.run(`MATCH (c:Card)-[:SOLD]->(u:User)
                        RETURN c`)
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
            const sdk: ThirdwebSDK = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY, "mumbai", {
                secretKey: SECRET_KEY,
            });
            const marketplaceContract: MarketplaceV3 =  await sdk.getContract(contracts.marketplaceAddress, 'marketplace-v3');
            const cardContract: Edition = await sdk.getContract(contracts.cardAssetAddress, "edition");
    
            // Fetch all card listings and NFTs in parallel
            const [cardsValid, cardNFTs] = await Promise.all([
                //@ts-ignore
                marketplaceContract.directListings.getAllValid() as Promise<CardsListedValid[]>,
                //@ts-ignore
                cardContract.getAll() as Promise<MintedCardMetaData[]>
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

        console.log(card)
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

                await tx.run(
                    `MATCH (c:Card {id: $tokenId})
                    SET c += $parameters
                    SET c += $listingData
                    SET c.lister = $lister
                    SET c.listingId = $listingId
                    SET c.sold = false`, 
                    { tokenId: card.tokenId, parameters, listingData, listingId: card.id, lister: card.asset.uploader }
                );

                await tx.run(
                    `
                    MATCH (p:Card {id: $id})
                    MATCH (u:User {username: $uploader})
                    MERGE (p)-[:UPLOADED]->(u)
                    `, { id: card.tokenId, uploader: "beats" }
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
                tx.run(
                    `MERGE (c:Card {id: $id})
                    ON CREATE SET c += $parameters, c.sold = false`, 
                    { id: card.metadata.id, parameters }
                );
    
            });
            await session.close();
        } catch(error: any) {
            throw error;
        }
    }
}    
