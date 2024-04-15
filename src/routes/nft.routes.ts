//** ELYSIA IMPORT
import Elysia from 'elysia';

//** MEMGRAPH IMPORT
import { getDriver } from '../db/memgraph';
import { Driver } from 'neo4j-driver-core';

//** SERVICE IMPORT
import NFTService from '../services/nft.services/nft.service';

//** TYPE INTERFACE AND SCHEMA IMPORT
import { SuccessMessage } from '../services/mint.services/mint.interface';
import { cardTransferSchema } from '../services/nft.services/nft.schema';


const nft = (app: Elysia): void => {
    app.post('/admin/transfer-card', async ({ headers, body }): Promise<SuccessMessage | Error> => {
        try {
            const authorizationHeader: string | undefined = headers.authorization;
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                throw new Error('Bearer token not found in Authorization header');
            }
            const jwtToken: string = authorizationHeader.substring(7);
            const driver: Driver = getDriver() as Driver
            const nftService: NFTService = new NFTService(driver);
            
            const output: SuccessMessage | Error = await nftService.transferCard(jwtToken, body)

            return output as SuccessMessage | Error;
        } catch (error: any) {
          console.log(error)
          throw error;
        }
      }, cardTransferSchema
    );

//     app.get('/admin/get-internal-transactions', async ({ headers }): Promise<SuccessMessage | Error> => {
//       try {
//           const authorizationHeader: string | undefined = headers.authorization;
//           if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
//               throw new Error('Bearer token not found in Authorization header');
//           }

          
//           const jwtToken: string = authorizationHeader.substring(7);
//           const driver: Driver = getDriver() as Driver;
//           const listService: ListService = new ListService(driver);
          
//           const output: SuccessMessage | Error = await listService.updateCardList(jwtToken);

          
//           return output as SuccessMessage | Error;
//       } catch (error: any) {
//         console.log(error)
//         throw error;
//       }
//     }, authorizationBearerSchema
//   );
};

export default nft;
