import ListService from '../services/list.services/list.service';
import { getDriver } from '../db/memgraph';
import { Driver } from 'neo4j-driver-core';
import Elysia from 'elysia';
import { SuccessMessage } from '../services/mint.services/mint.interface';
import { ListingData } from '../services/list.services/list.interface';
import { listCardSchema } from '../services/list.services/list.schema';


const list = (app: Elysia): void => {
    app.post('/admin/list-card', async ({ headers, body}): Promise<SuccessMessage | Error> => {
        try {
            const authorizationHeader: string | undefined = headers.authorization;
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                throw new Error('Bearer token not found in Authorization header');
            }
            const jwtToken: string = authorizationHeader.substring(7);
            const driver: Driver = getDriver() as Driver
            const listService: ListService = new ListService(driver);
            
            const output: SuccessMessage | Error = await listService.listCard(body, jwtToken);
            return output;
        } catch (error: any) {
          return error;
        }
      }, listCardSchema
    );
};

export default list;
