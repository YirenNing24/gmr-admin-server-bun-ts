//** RETHINKDB IMPORT
import rt from 'rethinkdb';
import { getRethinkDB } from "../../db/rethink";

//** INTERFACE IMPORTS
import { NewUser } from "../user.services/interface";
import ValidationError from '../../errors/validation.error';


class SecurityService {
    public async checkAccess(username: string): Promise<string | Error> {
        try {
            const connection: rt.Connection = await getRethinkDB();
    
            // Get the cursor for the query
            const cursor = await rt.db('admin')
                .table('users')
                .filter({ username })
                .run(connection);
    
            // Get the first result from the cursor
            const result = await cursor.next();
    
            if (!result) {
                throw new ValidationError('User not found', 'User not found');
            }
    
            // Extract the access property from the result
            const { access } = result as NewUser;
    
            return access as string;
        } catch (error: any) {
            console.log(error);
            return error;
        }
    }
    
}

export default SecurityService;