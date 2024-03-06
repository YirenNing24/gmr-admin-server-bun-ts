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

export default class ContractService {

    public async updateContracts(token: string, contracts: Contracts): Promise<string | Error> {
        try {
            const tokenService: TokenService = new TokenService();
            const securityService: SecurityService = new SecurityService();
    
            const username: string = await tokenService.verifyAccessToken(token);
            const access: string = await securityService.checkAccess(username);
    
            if (access !== "0") {
                return new ValidationError("Access Denied", "User does not have permission to update contracts");
            }
    
            const connection: rt.Connection = await getRethinkDB();
            const updatedContracts = { ...contracts, lastUpdate: Date.now() };
    
            await rt.db('admin')
                .table('users')
                .insert(updatedContracts)
                .run(connection);
    
            return "Contracts updated successfully";
        } catch (error: any) {
            console.error("Error updating contracts:", error);
            throw error;
        }
    }
    

    // async contracts(): Promise<Contracts[] | Error> {
    //     try {
    //         const session: Session = this.driver.session();
    //         const res: QueryResult = await session.executeRead(tx =>
    //             tx.run(
    //             `MATCH (c:Contracts {id: 'contracts'})
    //                 RETURN c.beatsAddress AS beatsAddress,
    //                     c.kmrAddress AS kmrAddress,
    //                     c.thumpinAddress AS thumpinAddress,
    //                     c.cardAddress AS cardAddress,
    //                     c.cardMarketplaceAddress AS cardMarketplaceAddress,
    //                     c.packAddress AS packAddress,
    //                     c.packMarketplaceAddress AS packMarketplaceAddress`
    //             )
    //         );
    
    //         // Check if any records were returned
    //         if (res.records.length === 0) {
    //             return new Error('No contract data found.');
    //         }
    
    //         // Extract the contract data from the query result
    //         const contractData = res.records[0].toObject();
    
    //         // Create a Contracts object with the extracted data
    //         const contracts: Contracts[] = [{
    //             beatsAddress: contractData.beatsAddress,
    //             kmrAddress: contractData.kmrAddress,
    //             thumpinAddress: contractData.thumpinAddress,
    //             cardAddress: contractData.cardAddress,
    //             cardMarketplaceAddress: contractData.cardMarketplaceAddress,
    //             packAddress: contractData.packAddress,
    //             packMarketplaceAddress: contractData.packMarketplaceAddress,
    //         }];
    
    //         return contracts;
    //     } catch (error) {
    //         return new Error(`Error retrieving contracts: ${error}`);
    //     }
    // }
    
}
