
//** THIRDWEB IMPORTS
import { DirectListingV3, MarketplaceV3, ThirdwebSDK, TransactionResultWithId } from "@thirdweb-dev/sdk";

//** MEMGRAPH IMPORTS
import { Driver, QueryResult, Session,  ManagedTransaction } from 'neo4j-driver-core'

//** CONFIG IMPORTS
import { SECRET_KEY, PRIVATE_KEY, CHAIN } from '../../config/constants';

//** SERVICE IMPORTS
import ContractService from "../contract.services/contracts.service";

//** TYPE INTERFACES
import { CardListingContracts, Listing, ListingData, ListingDataSave } from "./list.interface";
import { Contracts } from "../contract.services/contracts.interface";
import { CardData, SuccessMessage } from "../mint.services/mint.interface";

//** SERVICES IMPORTS
import TokenService from "../security.services/token.service";
import StockService from "../stocks.services/stocks.service";

//** ERROR VALIDATIOn IMPORT
import ValidationError from "../../errors/validation.error";

//** CYPHER IMPORT */
import { removeListingCypher, saveCardUpgradeToDBCypher, saveListToDBCypher, savePackListToDBCypher } from "./list.cypher";


class ListService {

private driver: Driver;

constructor(driver: Driver) {
    this.driver = driver;
  
}
    public async listCard(listing: ListingData, token: string): Promise<SuccessMessage | Error>  {
        const tokenService: TokenService = new TokenService;
            try {
                const lister: string = await tokenService.verifyAccessToken(token);

                const contracts: CardListingContracts = await this.retrieveContracts(token);
                const { cardAssetAddress, marketplaceAddress, beatsTokenAddress, gmrTokenAddress } = contracts as CardListingContracts

                const sdk: ThirdwebSDK = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY, CHAIN, {
                    secretKey: SECRET_KEY
                });

                const { tokenId, quantity, pricePerToken, startTime, endTime, currencyName } = listing as ListingData

                const startTimestamp: Date = new Date(startTime);
                const endTimestamp: Date = new Date(endTime);

                let currencyContractAddress: string;
                if (currencyName === "$BEATS") {
                    currencyContractAddress = beatsTokenAddress;
                } else if (currencyName === "$GMR") {
                    currencyContractAddress = gmrTokenAddress;
                } else {
                    throw new Error("Invalid currency name specified");
                }

                const listingData = { 
                    tokenId, 
                    quantity, 
                    isReservedListing: false, 
                    pricePerToken, 
                    endTimestamp, 
                    startTimestamp, 
                    assetContractAddress: cardAssetAddress, 
                    currencyContractAddress
                };

                // Create a listing on the marketplace
                const cardMarketplace: MarketplaceV3 = await sdk.getContract(marketplaceAddress, 'marketplace-v3')
                const transaction: TransactionResultWithId = await cardMarketplace.directListings.createListing(listingData);

                const listingId: number = transaction.id.toNumber()

                await this.saveCardListToDB(lister, listing, listingId);

                return { success: "Card listing is successful" } as SuccessMessage;
            } catch (error: any) {
                console.log(error)
                throw error;
            }
        };


    public async removeListing(token: string, isCronJob: boolean = false) {
        const tokenService: TokenService = new TokenService();
        const stockService: StockService = new StockService(this.driver);
        try {
            // Verify access token only if the call is not from a cron job
            if (!isCronJob) {
                await tokenService.verifyAccessToken(token);
            }
    
            const cards: CardData[] | Error = await stockService.cardListed();
            const session: Session = this.driver.session();
            for (const card of cards as CardData[]) {
                if (card.endTime) {
                    const endTimeDate: Date = new Date(card.endTime);
                    if (endTimeDate <= new Date()) {
                        await session.run( removeListingCypher,
                            { uri: card.uri }
                        );
                    }
                }
            };
    
            await session.close();
    
            return { success: "Card listing update is successful" } as SuccessMessage;
        } catch(error: any) {
            throw error;
        }
        };


    public async listCardUpgradeItem(token: string, upgradeItemListing: ListingData) {
        const tokenService: TokenService = new TokenService;
            try {
                const lister: string = await tokenService.verifyAccessToken(token);

                const contracts: CardListingContracts = await this.retrieveContracts(token);
                const { beatsTokenAddress, gmrTokenAddress, cardUpgradeItemMarketplaceAddress, cardUpgradeItemAddress } = contracts as CardListingContracts;

                const sdk: ThirdwebSDK = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY, CHAIN, {
                    secretKey: SECRET_KEY
                });

                const { tokenId, quantity, pricePerToken, startTime, endTime, currencyName } = upgradeItemListing as ListingData

                const startTimestamp: Date = new Date(startTime);
                const endTimestamp: Date = new Date(endTime);

                let currencyContractAddress: string;
                if (currencyName === "$BEATS") {
                    currencyContractAddress = beatsTokenAddress;
                } else if (currencyName === "$GMR") {
                    currencyContractAddress = gmrTokenAddress;
                } else {
                    throw new Error("Invalid currency name specified");
                }

                const listingData = { 
                    tokenId, 
                    quantity, 
                    isReservedListing: false, 
                    pricePerToken, 
                    endTimestamp, 
                    startTimestamp, 
                    assetContractAddress: cardUpgradeItemAddress, 
                    currencyContractAddress
                };

                // Create a listing on the marketplace
                const cardMarketplace: MarketplaceV3 = await sdk.getContract(cardUpgradeItemMarketplaceAddress, 'marketplace-v3')
                const transaction: TransactionResultWithId = await cardMarketplace.directListings.createListing(listingData);

                const listingId: number = transaction.id.toNumber()

                await this.saveCardUpgradeListToDB(lister, upgradeItemListing, listingId);

                return { success: "Card upgrade listing is successful" } as SuccessMessage;             
            } catch(error: any) {
                console.log(error)
                throw error;
            }
        }

    
    public async listCardPack(token: string, listing: ListingData): Promise<SuccessMessage | Error>  {
            const tokenService: TokenService = new TokenService;
                try {
                    const lister: string = await tokenService.verifyAccessToken(token);
    
                    const contracts: CardListingContracts = await this.retrieveContracts(token);
                    const { cardAssetAddress, cardPackMarketplaceAddress, beatsTokenAddress, gmrTokenAddress } = contracts as CardListingContracts
    
                    const sdk: ThirdwebSDK = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY, CHAIN, {
                        secretKey: SECRET_KEY
                    });
    
                    const { tokenId, quantity, pricePerToken, startTime, endTime, currencyName } = listing as ListingData
    
                    const startTimestamp: Date = new Date(startTime);
                    const endTimestamp: Date = new Date(endTime);
    
                    let currencyContractAddress: string;
                    if (currencyName === "$BEATS") {
                        currencyContractAddress = beatsTokenAddress;
                    } else if (currencyName === "$GMR") {
                        currencyContractAddress = gmrTokenAddress;
                    } else {
                        throw new Error("Invalid currency name specified");
                    }
    
                    const listingData = { 
                        tokenId, 
                        quantity, 
                        isReservedListing: false, 
                        pricePerToken, 
                        endTimestamp, 
                        startTimestamp, 
                        assetContractAddress: cardAssetAddress, 
                        currencyContractAddress
                    };
    
                    // Create a listing on the marketplace
                    const cardPackMarketplace: MarketplaceV3 = await sdk.getContract(cardPackMarketplaceAddress, 'marketplace-v3')
                    const transaction: TransactionResultWithId = await cardPackMarketplace.directListings.createListing(listingData);
    
                    const listingId: number = transaction.id.toNumber()
    
                    await this.savePackListToDB(lister, listing, listingId);
    
                    return { success: "Card Pack listing is successful" } as SuccessMessage;
                } catch (error: any) {
                    console.log(error)
                    throw error;
                }
        };


    public async cancelListCard(token: string, listingId: string): Promise<SuccessMessage | Error>  {
        const tokenService: TokenService = new TokenService;

        try {
            await tokenService.verifyAccessToken(token);
 
            const contracts: CardListingContracts = await this.retrieveContracts(token);
            const { marketplaceAddress } = contracts as CardListingContracts

            const sdk: ThirdwebSDK = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY, CHAIN, {
                secretKey: SECRET_KEY
            });

            const cardMarketplace: MarketplaceV3 = await sdk.getContract(marketplaceAddress, 'marketplace-v3')
            await cardMarketplace.directListings.cancelListing(listingId);
            await this.removeListing(token, false)

          return { success: "Card listing cancellation is successful" } as SuccessMessage;
        } catch (error: any) {
          throw error;
        }
        };


    private async saveCardListToDB(lister: string | undefined, listingDataSave: ListingData, listingId: number): Promise<void> {
        try {
            const { tokenId } = listingDataSave;
            const session: Session = this.driver.session();
            await session.executeWrite((tx: ManagedTransaction) =>
                tx.run(saveListToDBCypher,
                    { tokenId, lister, listingDataSave, listingId }
                )
            );
            await session.close();
        } catch(error: any) {
            throw error;
        }
        };


    private async savePackListToDB(lister: string | undefined, listingDataSave: ListingData, listingId: number): Promise<void> {
            try {
                const { tokenId } = listingDataSave;
                const session: Session = this.driver.session();
                await session.executeWrite((tx: ManagedTransaction) =>
                    tx.run(savePackListToDBCypher,
                        { tokenId, lister, listingDataSave, listingId }
                    )
                );
                await session.close();
            } catch(error: any) {
                throw error;
            }
        };


    private async saveCardUpgradeListToDB(lister: string | undefined, listingDataSave: ListingData, listingId: number): Promise<void> {
        try {
            const { tokenId } = listingDataSave;
            const session: Session = this.driver.session();
            await session.executeWrite((tx: ManagedTransaction) =>
                tx.run(saveCardUpgradeToDBCypher,
                    { tokenId, lister, listingDataSave, listingId }
                )
            );
            await session.close();
        } catch(error: any) {
            throw error;
        }
        };


    public async retrieveContracts(token: string): Promise<CardListingContracts> {
            const contractService = new ContractService();
            const contracts: Contracts[] | Error = await contractService.getContracts(token);
        
            if (!Array.isArray(contracts) || contracts.length === 0) {
                throw new Error("Contracts are not available or empty");
            }
        
            const [firstContract] = contracts;
            if (!firstContract) {
                throw new Error("Contracts are undefined");
            }
        
            const { 
                cardMarketplaceAddress: marketplaceAddress, 
                cardAddress: cardAssetAddress, 
                beatsAddress: beatsTokenAddress, 
                cardMarketplaceUpgradeItemAddress: cardUpgradeItemMarketplaceAddress, 
                cardItemUpgradeAddress: cardUpgradeItemAddress, 
                bundleMarketplaceAddress: cardPackMarketplaceAddress,
                bundleAddress: cardPackAddress,
              
            } = firstContract
        
            if (!marketplaceAddress) {
                throw new Error("Card Marketplace address is undefined");
            }
        
            return { 
                marketplaceAddress, 
                cardAssetAddress, 
                beatsTokenAddress, 
                cardUpgradeItemMarketplaceAddress, 
                cardUpgradeItemAddress, 
                cardPackMarketplaceAddress,
                cardPackAddress
            } as CardListingContracts;
        };
        

}

export default ListService
