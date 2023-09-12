import { Driver, Record } from "neo4j-driver-core";
import ValidationError from "../errors/validation.error";
import { compare } from 'bcrypt-ts';
import { CookieRequest } from "@elysiajs/cookie";

interface AuthenticationResponse {
    safeProperties: {
        admin: string;
        userId: string;
        username: string;
    };
    success: string;
}



export default class AuthService {
/**
 * @type {neo4j.Driver}
 */
private driver: Driver;

/**
 * The constructor expects an instance of the Neo4j Driver, which will be
 * used to interact with Neo4j.
 *
 * @param {neo4j.Driver} driver
 */
constructor(driver: Driver) {
    this.driver = driver;
}

    async authenticate(userName: string, unencryptedPassword: string): Promise<object| Error> {
        try {
            // Open a new session
            const session = this.driver.session();

            // Find the user node within a Read Transaction
            const result = await session.executeRead(tx =>
                tx.run('MATCH (u:User {username: $userName}) RETURN u', { userName })
            );

            // Close the session
            await session.close();

            // Verify the user exists
            const userRecord: Record | undefined = result.records[0];
            if (!userRecord) {
                throw new ValidationError(`Authentication Error`, `User with username '${userName}' not found`);
            }

            const user = userRecord.get('u');
            const encryptedPassword: string = user.properties.password;
            const correct: boolean = await compare(unencryptedPassword, encryptedPassword);

            if (!correct) {
                throw new ValidationError('Authentication Error.', 'Incorrect password');
            }
        // Return User Details 
        const { password, ...safeProperties } = user.properties as {password: string, safeProperties: AuthenticationResponse}

        return { safeProperties, "success": "You are now logged-in!" }
        } catch (error) {
            // Handle any errors that occur during authentication
            return error;
        }
    }
}
