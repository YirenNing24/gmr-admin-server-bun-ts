//**MEMGRAPH IMPORTs
import { Driver, Session, QueryResult, ManagedTransaction } from 'neo4j-driver-core'

//** THIRDWEB IMPORTS */
import { Edition, NFT, Pack, ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { SECRET_KEY, PRIVATE_KEY } from '../../config/constants';

//** VALIDATION ERROR IMPORT
import ValidationError from '../../errors/validation.error';

//** SERVICE IMPORTS
import SecurityService from '../security.services/security.service';
import TokenService from '../security.services/token.service';
import ContractService from '../contract.services/contracts.service'; 

//** TYPE IMPORTS
import { Contracts } from '../contract.services/contracts.interface';
import { Buffer } from "buffer";
import { PlayerData } from '../user.services/user.service.interface';



class PlayerServices {
    private driver: Driver;
    constructor(driver: Driver) {
        this.driver = driver;
    }


    public async getPlayers(skip: number): Promise<PlayerData[]> {
        try {
            const session: Session = this.driver.session();
            // Find the user node within a Read Transaction
            const result: QueryResult = await session.executeRead((tx: ManagedTransaction) =>
                tx.run(`MATCH (u:User) RETURN u SKIP ${skip} LIMIT 10`)
            );
    
            await session.close();
            // Verify the user exists
            if (result.records.length === 0) {
                throw new ValidationError(`No players found.`, "");
            }
    
            // Compare Passwords
            const players: PlayerData[] = result.records[0].get('u')

            // Return User Details
            // const { password, localWallet, localWalletKey, playerStats, userId, username, cardInventory, powerUpInventory, ...safeProperties } = users.properties

            return players as PlayerData[]
            console.log(players)

        } catch (error: any) {
          throw error;
        }

    }

}

export default PlayerServices