// import Elysia from 'elysia';
// import { getDriver } from '../db/memgraph'
// import MintService from "../services/mint.service";
// import { Driver } from 'neo4j-driver';

// interface Metadata {
//     description: string;
//     era: string;
//     experience: string;
//     healboost: string;
//     level: string;
//     name: string;
//     position: string;
//     position2: string;
//     rarity: string;
//     scoreboost: string;
//     skill: string;
//     tier: string;
//     breakthrough: string;
//     stars: string;
// }

// interface CardBoxData {
//     contents: string;
//     description: string;
//     name: string;
//     openStartTime: string;
//     quantity: string;
//     quantityPerReward: string;
//     rewardsPerPack: string;
//     token: string;
//     totalRewards: string;
//     type: string;
// }

// interface CardField {
//     name: string;
//     tokenId: string;
//     quantityPerReward: string;
//     totalRewards: string;
//     assetContract: string;
// }



// const router = (app: Elysia ) => {
//     app.post('/admin/create-card', async (context) => {
//         try {
//             const { metadata, supply, base64Image, uploader, editionAddress }: 
//                 { metadata: Metadata, supply: number, base64Image: string, uploader: string, editionAddress: string, } = context.body as {
//                     metadata: Metadata,
//                     supply: number,
//                     base64Image: string,
//                     uploader: string,
//                     editionAddress: string,
//                 };

//                 const driver: Driver = getDriver();
//                 const mintService: MintService = new MintService(driver);
//                 const output: void | Error = await mintService.createCard( metadata, supply, base64Image, uploader, editionAddress);

//         return({ success: true, message: "Card creation successful" });
//         } catch (error) {
//             console.error('Error creating card:', error);
//             return({ success: false, error });
//         }
//     });

//     app.post('/admin/create-card-box', async (context) => {
//         try {
//             const { data, base64, cardFields, uploader, packAddress } = 
//             context.body as { data: CardBoxData, base64: string, cardFields: CardField[] , uploader: string, packAddress: string}

//             const driver: Driver = getDriver();
//             const mintService: MintService = new MintService(driver);
//             const output: void | Error = await mintService.createCardBox( data, base64, cardFields, uploader, packAddress);

//         return({ success: true, message: "Card box creation successful" });
//         } catch (error) {
//             console.error('Error creating card:', error);
//             return({ success: false, error });
//         }
//     });


// };

// export default router;
