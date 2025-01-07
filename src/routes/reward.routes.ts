//** ELYSIA IMPORT
import Elysia from 'elysia';



//** SERVICE IMPORTS
import RewardService from '../services/reward.services/reward.service';
import { collectionMissionSchema, personalMissionSchema } from '../services/reward.services/reward.schema';
import { authorizationBearerSchema } from '../services/contract.services/contract.schema';

const reward = (app: Elysia): void => {

    app.post('/reward/create/personal-mission', async ({ headers, body }) => {
       try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);

        const rewardService: RewardService = new RewardService();
        const output =  await rewardService.createPersonalMission(jwtToken, body);

        return output
       } catch (error: any) {
         console.log(error)
         return error
        } 
      }, personalMissionSchema
    );


    app.post('/reward/create/collection-mission', async ({ headers, body }) => {
        try {
            const authorizationHeader: string = headers.authorization;
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                throw new Error('Bearer token not found in Authorization header');
            }
            const jwtToken: string = authorizationHeader.substring(7);
    
            const rewardService: RewardService = new RewardService();
            const output =  await rewardService.createCollectionMission(jwtToken, body);
    
            return output
           } catch (error: any) {
             console.log(error)
             return error
            } 
        },  collectionMissionSchema
    );

    app.get('/reward/get/personal-missions', async ({ headers }) => {
        try {
            const authorizationHeader: string = headers.authorization;
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                throw new Error('Bearer token not found in Authorization header');
            }
            const jwtToken: string = authorizationHeader.substring(7);
    
            const rewardService: RewardService = new RewardService();
            const output =  await rewardService.getPersonalMissions(jwtToken);
    
            return output
           } catch (error: any) {
             console.log(error)
             return error
            } 
        }, authorizationBearerSchema
    );


    app.get('/reward/get/collection-missions', async ({ headers }) => {
        try {
            const authorizationHeader: string = headers.authorization;
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                throw new Error('Bearer token not found in Authorization header');
            }
            const jwtToken: string = authorizationHeader.substring(7);
    
            const rewardService: RewardService = new RewardService();
            const output = await rewardService.getCollectionMissions(jwtToken);
    
            return output
           } catch (error: any) {
             console.log(error)
             return error
            } 
        }, authorizationBearerSchema
    );

}
  export default reward;
  