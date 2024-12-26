//**MEMGRAPH IMPORTs
import { Driver, Session, QueryResult, ManagedTransaction } from 'neo4j-driver-core'

//** THIRDWEB IMPORTS */

//** VALIDATION ERROR IMPORT
import ValidationError from '../../errors/validation.error';

//** SERVICE IMPORTS

import TokenService from '../security.services/token.service';

//** TYPE IMPORTS
import { PlayerData, Skip } from './player.interface';


class PlayerService {

    private driver: Driver;
    constructor(driver: Driver) {
        this.driver = driver;
    }

    public async getPlayers(skipAmount: Skip, token: string): Promise<PlayerData[]> {
        const tokenService: TokenService = new TokenService();
        await tokenService.verifyAccessToken(token);
    
        try {
            const session: Session = this.driver.session();
            const { skip } = skipAmount as Skip;
    
            // Find the user nodes within a Read Transaction
            const result: QueryResult = await session.executeRead((tx: ManagedTransaction) =>
                tx.run(`MATCH (u:User) RETURN u SKIP ${skip} LIMIT 10`)
            );
    
            await session.close();
    
            // Verify the users exist
            if (result.records.length === 0) {
                throw new ValidationError(`No players found.`, "");
            }
    
            // Extract properties from each user node
            const players: PlayerData[] = result.records.map(record => record.get('u').properties);
    
            // Log user properties
            return players;
    
        } catch (error: any) {
            throw error;
        }
    }
    

}

export default PlayerService