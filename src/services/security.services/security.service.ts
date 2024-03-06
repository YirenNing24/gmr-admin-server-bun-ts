//** RETHINKDB IMPORT
import rt from 'rethinkdb';
import { getRethinkDB } from "../../db/rethink";

//** INTERFACE IMPORTS
import { NewUser } from "../user.services/interface";


class SecurityService {


    public async checkAccess(userName: string): Promise<string> {
        try {
            const connection: rt.Connection = await getRethinkDB();

            const query = await rt.db('admin')
                .table('users')
                .get(userName)
                .run(connection);

            const { access } = query as NewUser;

            return access;
        } catch (error: any) {
          return error;
        }
    }
}

export default SecurityService;