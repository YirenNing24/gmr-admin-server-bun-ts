
//** THIRDWEB IMPORTS
import { DirectListingV3, MarketplaceV3, ThirdwebSDK } from "@thirdweb-dev/sdk";

//** MEMGRAPH IMPORTS
import { Driver, QueryResult, Session } from 'neo4j-driver-core'

//** CONFIG IMPORTS
import { SECRET_KEY, PRIVATE_KEY, CHAIN } from '../../config/constants';

//** SERVICE IMPORTS
import ContractService from "../contract.services/contracts.service";

//** TYPE INTERFACES
import { CardListingContracts, Listing, ListingData, ListingDataSave } from "./list.interface";
import { Contracts } from "../contract.services/contracts.interface";
import { CardData, SuccessMessage } from "../mint.services/mint.interface";

//** SERVICES IMORTS
import TokenService from "../security.services/token.service";
import StockService from "../stocks.service";

//** ERROR VALIDATIOn IMPORT
import ValidationError from "../../errors/validation.error";


export default class ListService {

private driver: Driver;

constructor(driver: Driver) {
    this.driver = driver;
  
}
    public async listCard(listing: ListingData, token: string): Promise<SuccessMessage | Error>  {
        const tokenService: TokenService = new TokenService;

        try {
            const lister: string = await tokenService.verifyAccessToken(token);
 
            const contracts: CardListingContracts = await this.retrieveContracts(token);
            const { cardAssetAddress, marketplaceAddress, beatsTokenAddress } = contracts as CardListingContracts

            const sdk: ThirdwebSDK = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY, CHAIN, {
                secretKey: SECRET_KEY
            });

            const {  tokenId, quantity, pricePerToken, startTime, endTime} = listing as ListingData

            const startTimestamp: Date = new Date(startTime);
            const endTimestamp: Date = new Date(endTime);

            const listingData = { 
                tokenId, quantity, 
                isReservedListing: false, pricePerToken, 
                endTimestamp, startTimestamp, 
                assetContractAddress: cardAssetAddress, 
                currencyContractAddress: beatsTokenAddress }

            // Create a listing on the marketplace
            const cardMarketplace: MarketplaceV3 = await sdk.getContract(marketplaceAddress, 'marketplace-v3')
            await cardMarketplace.directListings.createListing(listingData);
            await this.savetoMemgraph(lister, listing);

          return { success: "Card listing is successful" } as SuccessMessage;
        } catch (error: any) {
          throw error;
        }
    };

    public async updateCardList(token: string, isCronJob: boolean = false) {
        const tokenService: TokenService = new TokenService();
        const stockService: StockService = new StockService(this.driver);
        try {
            // Verify access token only if the call is not from a cron job
            if (!isCronJob) {
                await tokenService.verifyAccessToken(token);
            }
    
            const cards: CardData[] | Error = await stockService.cardListPosted();
            const session: Session = this.driver.session();
            for (const card of cards as CardData[]) {
                if (card.endTime) {
                    const endTimeDate: Date = new Date(card.endTime);
                    if (endTimeDate <= new Date()) {
                        await session.run(
                            `MATCH (c:Card {uri: $uri})
                             WHERE c.sold IS NULL
                             REMOVE c.lister`,
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

          return { success: "Card listing cancellation is successful" } as SuccessMessage;
        } catch (error: any) {
          throw error;
        }
    };


    private async savetoMemgraph(lister: string | undefined, listingDataSave: ListingData): Promise<void> {
        try {
            const { tokenId } = listingDataSave;
            const session: Session = this.driver.session();
            await session.executeWrite((tx) =>
                tx.run(
                    `MATCH (c:Card {id: $tokenId})
                     SET c += $listingDataSave
                     SET c.lister = $lister`,
                    { tokenId, lister, listingDataSave }
                )
            );
            await session.close();
        } catch(error: any) {
            throw error;
        }
    };

    private async retrieveContracts(token: string): Promise<CardListingContracts> {
        const contractService: ContractService = new ContractService();
        const contracts: Error | Contracts[] = await contractService.getContracts(token);

        let marketplaceAddress: string | undefined;
        let cardAssetAddress: string | undefined;
        let beatsTokenAddress: string | undefined;

        if (Array.isArray(contracts)) {
            const [firstContract] = contracts;
            if (firstContract) {
                const { cardMarketplaceAddress, cardAddress, beatsAddress } = firstContract as Contracts;
                marketplaceAddress = cardMarketplaceAddress;
                cardAssetAddress = cardAddress;
                beatsTokenAddress = beatsAddress
            }
        };

        if (!marketplaceAddress) {
            throw new Error("Edition address is undefined");
        };

        return { marketplaceAddress, cardAssetAddress, beatsTokenAddress } as CardListingContracts
    };




    
}


