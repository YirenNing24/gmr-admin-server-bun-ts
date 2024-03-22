//** ELYSIA IMPORT
import Elysia from 'elysia';


//** MEMGRAPH IMPORT
import { getDriver } from '../db/memgraph';
import { Driver } from 'neo4j-driver-core';

//** SERVICE IMPORT
import ListService from '../services/list.services/list.service';

//** TYPE INTERFACE AND SCHEMA IMPORT
import { SuccessMessage } from '../services/mint.services/mint.interface';
import { listCardSchema } from '../services/list.services/list.schema';
import { authorizationBearerSchema } from '../services/contract.services/contract.schema';


const list = (app: Elysia): void => {
    app.post('/admin/post-card', async ({ headers, body }): Promise<SuccessMessage | Error> => {
        try {
            const authorizationHeader: string | undefined = headers.authorization;
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                throw new Error('Bearer token not found in Authorization header');
            }
            const jwtToken: string = authorizationHeader.substring(7);
            const driver: Driver = getDriver() as Driver
            const listService: ListService = new ListService(driver);
            
            const output: SuccessMessage | Error = await listService.listCard(body, jwtToken);

            return output as SuccessMessage | Error;
        } catch (error: any) {
          console.log(error)
          throw error;
        }
      }, listCardSchema
    );

    app.get('/admin/update-card-list', async ({ headers }): Promise<SuccessMessage | Error> => {
      try {
          const authorizationHeader: string | undefined = headers.authorization;
          if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
              throw new Error('Bearer token not found in Authorization header');
          }

          
          const jwtToken: string = authorizationHeader.substring(7);
          const driver: Driver = getDriver() as Driver;
          const listService: ListService = new ListService(driver);
          
          const output: SuccessMessage | Error = await listService.updateCardList(jwtToken);

          
          return output as SuccessMessage | Error;
      } catch (error: any) {
        console.log(error)
        throw error;
      }
    }, authorizationBearerSchema
  );
};

export default list;
