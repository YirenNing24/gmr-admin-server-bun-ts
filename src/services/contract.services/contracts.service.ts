//** MONGO DB IMPORTS
import { mongoDBClient } from '../../db/mongodb.client';
import { Collection, Document, MongoClient } from 'mongodb';

//** TYPE INTERFACE IMPORTS
import { Contracts } from '../contract.services/contracts.interface'

//** TOKEN SERVICE IMPORT
import TokenService from '../security.services/token.service';
import SecurityService from '../security.services/security.service';

//** ERROR CONSTRUCTOR IMPORT
import ValidationError from '../../errors/validation.error';
import { SuccessMessage } from '../mint.services/mint.interface';


class ContractService {

    public async updateContracts(token: string, contracts: Contracts): Promise<SuccessMessage| Error> {
        const client: MongoClient = await mongoDBClient.connect();
        try {
            const tokenService: TokenService = new TokenService();
            const securityService: SecurityService = new SecurityService();
    
            const username: string = await tokenService.verifyAccessToken(token);
            const access: string | Error = await securityService.checkAccess(username);
    
            if (access !== "0") {
                return new ValidationError("Access Denied", "User does not have permission to update contracts");
            };
    
            const collection = client.db("admin").collection("contracts")
            const updatedContracts = { ...contracts, lastUpdate: Date.now(), updatedBy: username };

            // Insert contracts into the collection
			await collection.insertOne(updatedContracts);

            return { success: "Contracts address updated successfully" };
        } catch (error: any) {
            console.error("Error updating contracts:", error);
            throw error;
        } finally {
            if (client) {
                await client.close(); // Ensure the MongoDB client is closed
            }
        }
    }

    public async getContracts(token: string): Promise<Contracts[]> {
        const client: MongoClient = await mongoDBClient.connect();
        try {
            const tokenService: TokenService = new TokenService();
            const securityService: SecurityService = new SecurityService();

            // Verify access token
            const username: string = await tokenService.verifyAccessToken(token);

            // Check user access level
            const access: string | Error = await securityService.checkAccess(username);
            if (access !== "0" && access !== "1") {
                throw new ValidationError("Access Denied", "User does not have permission to get the contracts");
            };

            // Connect to MongoDB
            const collection: Collection<Document> = client.db("admin").collection("contracts");

            // Fetch contracts from the collection
            const contracts: Contracts[] = await collection.find().toArray() as unknown as Contracts[];

            // Return contracts
            return contracts;
        } catch (error: any) {
            console.error("Error getting contracts:", error.message);
            throw error;
        } finally {
          await client.close(); // Ensure the MongoDB client is closed
        }
    }
}
    
export default ContractService;
