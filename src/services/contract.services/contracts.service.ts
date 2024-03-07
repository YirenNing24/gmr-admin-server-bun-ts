//** RETHINK DB IMPORTS
import rt from 'rethinkdb'
import { getRethinkDB } from '../../db/rethink';

//** TYPE INTERFACE IMPORTS
import { Contracts } from '../contract.services/contracts.interface'

//** TOKEN SERVICE IMPORT
import TokenService from '../user.services/token.service';
import SecurityService from '../security.services/security.service';
import ValidationError from '../../errors/validation.error';
;

class ContractService {

    public async updateContracts(token: string, contracts: Contracts): Promise<any| Error> {
        try {
            const tokenService: TokenService = new TokenService();
            const securityService: SecurityService = new SecurityService();
    
            const username: string = await tokenService.verifyAccessToken(token);
            const access: string = await securityService.checkAccess(username);
    
            if (access !== "0") {
                return new ValidationError("Access Denied", "User does not have permission to update contracts");
            }
    
            const connection: rt.Connection = await getRethinkDB();
            const updatedContracts = { ...contracts, lastUpdate: Date.now(), updatedBy: username };
    
            await rt.db('admin')
                .table('contracts')
                .insert(updatedContracts)
                .run(connection);
    
            return { success: "Contracts address updated successfully" }
        } catch (error: any) {
            console.error("Error updating contracts:", error);
            throw error;
        }
    }

    public async getContracts(token: string): Promise<Contracts[] | Error> {
        try {
            const tokenService: TokenService = new TokenService();
            const securityService: SecurityService = new SecurityService();

            const username: string = await tokenService.verifyAccessToken(token);
            const access: string = await securityService.checkAccess(username);

            if (access !== "0" && access !== "1") {
                return new ValidationError("Access Denied", "User does not have permission to get the contracts");
            }

            const connection: rt.Connection = await getRethinkDB();

            const query: rt.Cursor = await rt.db('admin')
                .table('contracts')
                .orderBy(rt.desc('lastUpdate'))
                .limit(2)
                .run(connection);

            const contracts: Contracts[] = await query.toArray()

            return contracts as Contracts[]
        } catch (error: any) {
            console.error("Error getting latest update:", error);
            throw error;
        }
    }
}
    
export default ContractService;
