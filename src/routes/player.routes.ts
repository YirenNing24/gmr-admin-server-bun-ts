//** ELYSIA IMPORT
import Elysia from 'elysia';

//** MEMGRAPH IMPORTS
import { Driver } from 'neo4j-driver';
import { getDriver } from '../db/memgraph';

//** TYPE IMPORTS & SCHEMA IMPORTS
import { PlayerData } from "../services/player.services/player.interface";
import { getPlayerSchema } from "../services/player.services/player.schema";

//** SERVICE IMPORTS
import PlayerServices from "../services/player.services/player.service";


const players = (app: Elysia): void => {

    app.post('/admin/players/list', async ({ headers, body }): Promise<PlayerData[]> => {
       try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);



        const driver: Driver = getDriver() as Driver;
        const playerService: PlayerServices = new PlayerServices(driver)
        const output: PlayerData[] =  await playerService.getPlayers(body, jwtToken)

        return output as PlayerData[]
       } catch (error: any) {
         return error
        } 
      }, getPlayerSchema
    );

    
  };
  
  export default players;
  