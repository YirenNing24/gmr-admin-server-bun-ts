
//** THIRDWEB IMPORTS
import { MarketplaceV3, ThirdwebSDK } from "@thirdweb-dev/sdk";

//** MEMGRAPH IMPORTS
import { Driver, QueryResult, Session } from 'neo4j-driver-core'

//** CONFIG IMPORTS
import { SECRET_KEY, PRIVATE_KEY, CHAIN } from '../../config/constants';

//** SERVICE IMPORTS
import ContractService from "../contract.services/contracts.service";

//** TYPE INTERFACES
import { CardListingContracts, Listing, ListingData, ListingDataSave } from "./list.interface";
import { Contracts } from "../contract.services/contracts.interface";
import { SuccessMessage } from "../mint.services/mint.interface";

//** SERVICES IMORTS
import TokenService from "../security.services/token.service";
import SecurityService from "../security.services/security.service";

//** ERROR VALIDATIOn IMPORT
import ValidationError from "../../errors/validation.error";


export default class ListService {

private driver: Driver;

constructor(driver: Driver) {
    this.driver = driver;
  
}
    public async listCard(listing: ListingData, token: string): Promise<SuccessMessage | Error>  {
        const tokenService: TokenService = new TokenService;
        const securityService: SecurityService = new SecurityService();
        try {
            const lister: string = await tokenService.verifyAccessToken(token);
            // const access: string = await securityService.checkAccess(lister);

            // if (access !== "0" || "1") {
            //     return new ValidationError("Access Denied", "User does not have permission to list card");
            // };

            const contracts: CardListingContracts = await this.retrieveContracts(token);
            const { cardAssetAddress, marketplaceAddress } = contracts as CardListingContracts

            const sdk: ThirdwebSDK = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY, CHAIN, {
                secretKey: SECRET_KEY
            });

            const {  tokenId, quantity, pricePerToken, startTime, endTime} = listing as ListingData

            const startTimestamp: Date = new Date(startTime);
            const endTimestamp: Date = new Date(endTime);

            const listingData = { tokenId, quantity, pricePerToken, isReservedListing: false, startTimestamp, endTimestamp, assetContractAddress: cardAssetAddress,  }

            console.log(listingData)
 
            // Create a listing on the marketplace
            const cardMarketplace: MarketplaceV3 = await sdk.getContract(marketplaceAddress, 'marketplace-v3')
            await cardMarketplace.directListings.createListing(listingData);
            await this.savetoMemgraph(lister, listing);

          return { success: "Card listing is successful" } as SuccessMessage;
        } catch (error: any) {
          throw error;
        }
    };

    // CREATE (u:User { 
    //     accountType: "beats",
    //     userId: $userId,
    //     username: $userName,
    //     password: $encrypted,
    //     localWallet: $localWallet, 
    //     localWalletKey: $locKey,
    //     cardInventory: $inventoryCard,
    //     powerUpInventory: $inventoryPowerUp,
    //     inventoryCapacity: $inventoryCapacity,
    //     iveEquip: $equipIve,
    //     playerStats: $statsPlayer
    //   })

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
    }

    private async retrieveContracts(token: string): Promise<CardListingContracts> {
        const contractService: ContractService = new ContractService();
        const contracts: Error | Contracts[] = await contractService.getContracts(token);

        let marketplaceAddress: string | undefined;
        let cardAssetAddress: string | undefined;

        if (Array.isArray(contracts)) {
            const [firstContract] = contracts;
            if (firstContract) {
                const { cardMarketplaceAddress, cardAddress } = firstContract as Contracts;
                marketplaceAddress = cardMarketplaceAddress;
                cardAssetAddress = cardAddress;
            }
        };

        if (!marketplaceAddress) {
            throw new Error("Edition address is undefined");
        };

        return { marketplaceAddress, cardAssetAddress } as CardListingContracts
    };
    
}


