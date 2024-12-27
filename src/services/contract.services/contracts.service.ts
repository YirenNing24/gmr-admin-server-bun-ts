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

    public async updateContracts(token: string, contracts: Contracts): Promise<SuccessMessage | Error> {
        try {
            const tokenService: TokenService = new TokenService();
            const securityService: SecurityService = new SecurityService();
    
            // Verify the token and check user access
            const username: string = await tokenService.verifyAccessToken(token);
            const access: string | Error = await securityService.checkAccess(username);
    
            if (access !== "0") {
                return new ValidationError("Access Denied", "User does not have permission to update contracts");
            }
    
            // Connect to MongoDB
            const client: MongoClient = await mongoDBClient.connect();
            const collection = client.db("admin").collection("contracts");
    
            // Prepare updated data
            const updatedContracts = { ...contracts, lastUpdate: Date.now(), updatedBy: username };
    
            // Update the existing document, or insert it if it doesn't exist
            const result = await collection.updateOne(
                { _id: contracts._id }, // Filter: match by unique identifier
                { $set: updatedContracts }, // Update: apply changes
                { upsert: true } // Option: insert if no match is found
            );
    
            if (result.matchedCount > 0) {
                return { success: "Contracts address updated successfully" };
            } else if (result.upsertedCount > 0) {
                return { success: "Contracts address added successfully (new document inserted)" };
            } else {
                throw new Error("No changes were made to the database.");
            }
        } catch (error: any) {
            console.error("Error updating contracts:", error);
            throw error;
        } finally {
            await mongoDBClient.close(); // Ensure the MongoDB client is closed
        }
    }
    

    public async getContracts(token: string): Promise<Contracts[]> {
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
            const client: MongoClient = await mongoDBClient.connect();
            const collection: Collection<Document> = client.db("admin").collection("contracts");

            // Fetch contracts from the collection
            const contracts: Contracts[] = await collection.find().toArray() as unknown as Contracts[];

            // Return contracts
            return contracts;
        } catch (error: any) {
            console.error("Error getting contracts:", error.message);
            throw error;
        } finally {
          await mongoDBClient.close();// Ensure the MongoDB client is closed
        }
    }
}
    
export default ContractService;
