import Elysia from 'elysia';
import { getDriver } from '../db/memgraph'
import MintService from "../services/mint.services/mint.service";
import { Driver } from 'neo4j-driver';
import { createCardSchema } from '../services/mint.services/mint.schema';
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

    // app.post('/admin/create-card-box', async (context) => {
    //     try {
    //         const { data, base64, cardFields, uploader, packAddress } = 
    //         context.body as { data: CardBoxData, base64: string, cardFields: CardField[] , uploader: string, packAddress: string}

    //         const driver = getDriver() as Driver
    //         const mintService: MintService = new MintService(driver);
    //         const output: void | Error = await mintService.createCardBox( data, base64, cardFields, uploader, packAddress);

    //     return({ success: true, message: "Card box creation successful" });
    //     } catch (error) {
    //         console.error('Error creating card:', error);
    //         return({ success: false, error });
    //     }
    // });


};

export default mint;
