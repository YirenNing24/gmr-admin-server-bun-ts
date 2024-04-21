import neo4j, { Driver } from 'neo4j-driver';

let driver: Driver | undefined;

export async function initDriver(uri: string, username: string, password: string): Promise<Driver> {
  driver = neo4j.driver(
    uri,
    neo4j.auth.basic(
      username,
      password
    )
  );

  await driver.getServerInfo()
  return driver;
}

/**
 * Get the instance of the Neo4j Driver created in the
 * `initDriver` function
 *
 * @returns {neo4j.Driver | undefined}
 */
export function getDriver(): Driver | undefined {
  return driver;
}

/**
 * If the driver has been instantiated, close it and all
 * remaining open sessions
 *
 * @returns {Promise<void>}
 */
export async function closeDriver(): Promise<void> {
  if (driver) {
    await driver.close();
  }
}



//** INIT */

//** CREATE CARD STORE NODE  */
//** CONSTRAINT ONLY ONE CARD STORE NODE */

//** CARD ID CONSTRAINT */
//** CARD ID CONSTRAINT */

