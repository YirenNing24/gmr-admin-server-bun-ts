import { Driver, QueryResult, Record } from "neo4j-driver";
import ValidationError from "../errors/validation.error";

export default class UserService {
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

    async getUserProfile(userName: string) {
        try {
            // Open a new session
            const session = this.driver.session();

            // Find the user node within a Read Transaction
            const result: QueryResult = await session.executeRead(tx =>
                tx.run(
                    'MATCH (u:User {username: $userName}) RETURN u', 
                    { userName })
            );

            // Close the session
            await session.close();

            // Verify the user exists
            const userRecord: Record | undefined = result.records[0];
            if (!userRecord) {
                throw new ValidationError(`Authentication Error`, `User with username '${userName}' not found`);
            }

            const user = userRecord.get('u');

        // Return User Details 
        const { userProperties } = user.properties

        return userProperties 
        } catch (error) {
            // Handle any errors that occur during authentication
            return error;
        }

    }




}