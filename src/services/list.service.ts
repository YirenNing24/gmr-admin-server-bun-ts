import { MarketplaceV3, ThirdwebSDK } from "@thirdweb-dev/sdk";
import { SECRET_KEY, PRIVATE_KEY, CHAIN } from '../config/constants';
import { Driver, QueryResult, Session } from 'neo4j-driver-core'



interface ListingMetadata {
    id: string;
    currencyName: string;
    assetContractAddress: string;
    tokenId: string;
    currencyContractAddress: string;
    pricePerToken: number;
    startTimestamp: Date;
    endTimestamp: Date;
    isReservedListing: boolean;
    lister: string
    cardMarketplaceAddress: string;
}


interface Listing {
    metadata: ListingMetadata;
}


interface ListingData {
    currencyName: string;
    assetContractAddress: string;
    tokenId: string;
    quantity: number;
    currencyContractAddress: string;
    pricePerToken: number;
    startTimestamp: Date;
    endTimestamp: Date;
    isReservedListing: boolean;


}

interface ListingDataSave {
    currencyName: string;
    assetContractAddress: string;
    tokenId: string;
    quantity: number;
    currencyContractAddress: string;
    pricePerToken: number;
    startTimestamp: Date;
    endTimestamp: Date;
    isReservedListing: boolean;
    lister: string


}


interface Metadata {
    boostCount: string;
    breakthrough: string;
    cardAddress: string;
    description: string;
    era: string;
    experience: string;
    experienceRequired: string;
    group: string;
    healBoost: string;
    id: string;
    image: string;
    itemType: string;
    level: string;
    name: string;
    position: string;
    position2: string;
    rarity: string;
    scoreBoost: string;
    skill: string;
    slot: string;
    stars: string;
    supply: string;
    tier: string;
    uri: string;
}


interface List {
    price: number;
    assetContractAddress: string;
    tokenId: string;
    quantity: number;
    currencyContractAddress: string;
    pricePerToken: number; // Note: This field appears to be a string in your data
    startTimestamp: Date;
    endTimestamp: Date;
    isReservedListing: boolean;
    id: string;
    metadata: Metadata;
    owner: string;
    supply: string;
    type: string;
    lister: string;

}

export default class ListService {
/**
 * @type {neo4j.Driver}
 */
private driver: Driver;

/**
 * The constructor expects an instance of the Neo4j Driver, which will be
 * used to interact with Neo4j.
 *
 * @param {neo4j.Driver} driver
 */
constructor(driver: Driver) {
    this.driver = driver;
  
}

    async listCard(listing: any): Promise<void | Error>  {
        try {  
            const {
                currencyName,
                assetContractAddress,
                tokenId,
                currencyContractAddress,
                pricePerToken,
                startTimestamp,
                endTimestamp,
                isReservedListing,
                id,
                lister,
                cardMarketplaceAddress,
            } = listing;

            // Initiate sdk
            const sdk = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY, CHAIN, {
                secretKey: SECRET_KEY
            });

            const cardMarketplace: MarketplaceV3 = await sdk.getContract(cardMarketplaceAddress, 'marketplace-v3')
            const startDate: Date = new Date(startTimestamp);
            const endDate: Date = new Date(endTimestamp);

            // Create a listing object
            const listingData: ListingData = {
                currencyName,
                assetContractAddress,
                tokenId,
                quantity: 1,
                currencyContractAddress,
                pricePerToken,
                startTimestamp: startDate,
                endTimestamp: endDate,
                isReservedListing: false
            };


            const listingDataSave: ListingDataSave = {
                currencyName,
                assetContractAddress,
                tokenId,
                quantity: 1,
                currencyContractAddress,
                pricePerToken,
                startTimestamp: startDate,
                endTimestamp: endDate,
                isReservedListing: false,
                lister
            };
 
            // Create a listing on the marketplace
            await cardMarketplace.directListings.createListing(listingData)

            const allListings = await cardMarketplace.directListings.getAllValid();

            const session: Session = this.driver.session()
            const res: QueryResult = await session.executeWrite(tx =>
                tx.run(
                  `MATCH (c:Card {id: $id}), (u:User {username: $lister})
                   CREATE (c)-[:LISTED]->(u)
                   SET c += $listingDataSave`,
                  { id, lister, listingDataSave }
                )
              );

            await session.close()
        } catch (error) {
            throw error;
        }
    };
    
}


