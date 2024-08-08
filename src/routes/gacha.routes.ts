//** ELYSIA IMPORT
import Elysia from 'elysia';


//** MEMGRAPH IMPORT
import { getDriver } from '../db/memgraph';
import { Driver } from 'neo4j-driver-core';

//** SERVICE IMPORT
import GachaService from '../services/gacha.services/gacha.service';

//** TYPE INTERFACE AND SCHEMA IMPORT
import { SuccessMessage } from '../services/mint.services/mint.interface';
import { cardPackDataSchema } from '../services/gacha.services/gacha.schema';




const gacha = (app: Elysia): void => {
    app.post('/admin/card_pack/create_settings', async ({ headers, body }): Promise<SuccessMessage | Error> => {
        try {
            const authorizationHeader: string | undefined = headers.authorization;
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                throw new Error('Bearer token not found in Authorization header');
            }
            const jwtToken: string = authorizationHeader.substring(7);
            const gachaService: GachaService = new GachaService();
            
            const output: SuccessMessage | Error = await gachaService.createCardPackSettings(jwtToken, body);

            return output as SuccessMessage | Error;
        } catch (error: any) {
          console.log(error)
          throw error;
        }
      }, cardPackDataSchema
    )

    .get('/admin/card_pack/settings', async ({ headers, params }) => {
      try {
        const authorizationHeader: string | undefined = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);
        const gachaService: GachaService = new GachaService();
        
        const output = await gachaService.getCardPackSettings(jwtToken, params);

        return output;
      } catch(error: any) {
        throw error
      }
      }
    )

}

export default gacha