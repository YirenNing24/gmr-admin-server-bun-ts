import ListService from '../services/list.service';
import { getDriver } from '../db/memgraph';
import { Driver } from 'neo4j-driver-core';
import Elysia from 'elysia';

interface ListingMetadata {
    currencyName: string;
    assetContractAddress: string;
    tokenId: string;
    currencyContractAddress: string;
    pricePerToken: number;
    startTimestamp: Date;
    endTimestamp: Date;
    isReservedListing: boolean;
    id: string;
    lister: string;
    cardMarketplaceAddress: string;
}

interface Listing {
    metadata: ListingMetadata;
}

const list = (app: Elysia): void => {
    app.post('/admin/list-card', async (context) => {
        try {
            const { listing } = context.body as { listing: Listing };
            const driver: Driver = getDriver();
            const listService: ListService = new ListService(driver);
            const output: void | Error = await listService.listCard(listing);
            return output;
        } catch (error) {
            return error;
        }
    });
};

export default list;
