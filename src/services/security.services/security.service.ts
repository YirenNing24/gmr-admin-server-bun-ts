//** MONGO DB IMPORTS
import { mongoDBClient } from '../../db/mongodb.client';
import { Collection, Document, MongoClient } from 'mongodb';


//** INTERFACE IMPORTS
import { NewUser } from "../user.services/interface";
import ValidationError from '../../errors/validation.error';


class SecurityService {
    public async checkAccess(username: string): Promise<string | Error> {
        const client: MongoClient = await mongoDBClient.connect();
        try {
            const collection = client.db("admin").collection("users")
            const result = await collection.findOne({username}) as unknown as NewUser;

            if (!result) {
                throw new ValidationError('User not found', 'User not found');
            }

            // Extract the access property from the result
            const { access } = result as NewUser;
    
            return access as string;
        } catch (error: any) {
            console.log(error);
            return error;
        } finally {
            if (client) {
                await client.close(); // Ensure the MongoDB client is closed
            }
        }
    }
    
}

export default SecurityService;