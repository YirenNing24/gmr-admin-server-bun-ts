//** ERROR VALIDATION IMPORT
import ValidationError from "../errors/validation.error";

//** MEMGRAPH IMPORTS
import { Driver, Record, Session, QueryResult, Node, RecordShape, ManagedTransaction } from "neo4j-driver-core";

//** BCRYPT IMPORT
import { compare } from 'bcrypt-ts';

interface AuthenticationResponse {
    success: string;
    userProperties: UserProperties;
}

interface UserProperties {
    admin: string;
    userId: string;
    username: string;
}

export default class AuthService {

    private driver: Driver;

    constructor(driver: Driver) {
        this.driver = driver;
    }

    async authenticate(userName: string, unencryptedPassword: string): Promise<AuthenticationResponse | Error> {
        try {
            // Open a new session
            const session: Session = this.driver.session();

            // Find the user node within a Read Transaction
            const result: QueryResult<RecordShape> = await session.executeRead(async (tx: ManagedTransaction) => {
                const response = await tx.run('MATCH (u:User {username: $userName}) RETURN u', { userName });
                return response;
            });

            // Close the session
            await session.close();

            // Verify the user exists
            const userRecord: Record | undefined = result.records[0];
            if (!userRecord) {
                throw new ValidationError(`Authentication Error`, `User with username '${userName}' not found`);
            }

            const user: Node = userRecord.get('u');
            const encryptedPassword: string = user.properties.password;
            const correct: boolean = await compare(unencryptedPassword, encryptedPassword);

            if (!correct) {
                throw new ValidationError('Authentication Error.', 'Incorrect password');
            }

            // Return User Details 
            const safeProperties: UserProperties = {
                admin: user.properties.admin,
                userId: user.properties.userId,
                username: user.properties.username,
            };

            return { userProperties: safeProperties, success: "You are now logged-in!" } as AuthenticationResponse
        } catch (error) {
            // Handle any errors that occur during authentication
            return error as Error;
        }
    }
}
