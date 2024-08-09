import Elysia from 'elysia';
import { getDriver } from '../db/memgraph'
import MintService from "../services/mint.services/mint.service";
import { Driver } from 'neo4j-driver';
import { createCardSchema, createPackSchema, createUpgradeItemSchema } from '../services/mint.services/mint.schema';
import { SuccessMessage } from '../services/mint.services/mint.interface';


const mint = (app: Elysia ) => {
    app.post('/admin/mint-card', async ({ headers, body }): Promise<SuccessMessage | Error> => {
        try {
            const authorizationHeader: string = headers.authorization;
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                throw new Error('Bearer token not found in Authorization header');
            }
            const jwtToken: string = authorizationHeader.substring(7);

            const driver: Driver = getDriver() as Driver;
            const mintService: MintService = new MintService(driver);
            const output: SuccessMessage | Error = await mintService.createCard(jwtToken, body);

          return output as SuccessMessage | Error
        } catch (error: any) {
          throw error
        }
        }, createCardSchema
    );


    app.post('/admin/create-upgrade-item', async ({ headers, body }): Promise<SuccessMessage> => {
      try {
          const authorizationHeader: string = headers.authorization;
          if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
              throw new Error('Bearer token not found in Authorization header');
          }
          const jwtToken: string = authorizationHeader.substring(7);

          const driver: Driver = getDriver() as Driver;
          const mintService: MintService = new MintService(driver);
          const output: SuccessMessage = await mintService.createUpgradeItem(jwtToken, body);
          return output as SuccessMessage

      } catch(error: any) {
        throw error
      }
    }, createUpgradeItemSchema
  )

     .post('/admin/create_card_pack', async ({ headers, body }) => {
         try {
          const authorizationHeader: string = headers.authorization;
          if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
              throw new Error('Bearer token not found in Authorization header');
          }
          const jwtToken: string = authorizationHeader.substring(7);


             const driver: Driver = getDriver() as Driver;
             const mintService: MintService = new MintService(driver);
             const output: SuccessMessage = await mintService.createPack(jwtToken, body);

             return output;
         } catch (error) {
             console.error('Error creating card:', error);
             throw error
         }
    }, createPackSchema
  
  );


};

export default mint;
