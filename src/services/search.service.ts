import { stat } from "fs";
import meili from "../db/meilisearch";
import { Driver, QueryResult } from 'neo4j-driver-core';

export default class SearchService {
  /**
   * @type {Driver | undefined}
   */
  private driver?: Driver;

  /**
   * The constructor expects an instance of the Neo4j Driver, which will be
   * used to interact with Neo4j.
   *
   * @param {Driver} [driver]
   */
  constructor(driver?: Driver) {
    this.driver = driver;
  }

  async createIndex(indexName: string, primaryKey: string): Promise<string | Error> {
    try {
        await meili.createIndex(indexName, {primaryKey: primaryKey });
        return `Index '${indexName}' created successfully.`;
      }
      catch (error) { 
      console.error(`Error creating index '${indexName}': ${error}`);
      return new Error(`Error creating index '${indexName}': ${error}`);
    }
  }

  async listIndexes(): Promise<any[] | Error> {
    try {
      const indexesResponse = await meili.getRawIndexes();
      const indexes = indexesResponse.results;
  
      // Retrieve stats for each index and add numberOfDocuments to the result
      const indexStats = await Promise.all(
        indexes.map(async (index) => {
          const stats = await meili.index(index.uid).getStats();
          return {
            ...index,
            numberOfDocuments: stats.numberOfDocuments,
          };
        })
      );
  
      return indexStats;
    } catch (error) {
      console.error(`Error listing indexes: ${error}`);
      return new Error(`Error listing indexes: ${error}`);
    }
  }

  async populatePlayerSearch(): Promise<string | Error> {
    try {
      const playerIndex = await meili.getIndex('playersAdmin');
  
      const session = this.driver.session();
      const res: QueryResult = await session.executeRead((tx) =>
        tx.run(`MATCH (c:User)
            RETURN c`)
      );
      await session.close();
  
      const players = res.records.map(record => record.get("c").properties);

      await playerIndex.addDocuments(players);
      return `Players added to index "players" successfully.`;
    } catch (error) {
      console.error(`Error adding users to index "users": ${error}`);
      return new Error(`Error adding users to index "users": ${error}`);
    }
  }

  async deleteIndex(indexName: string): Promise<string | Error> {
    try {
      // Delete the specified index
      await meili.deleteIndex(indexName);
  
      // Return a success message upon successful deletion
      return `Index '${indexName}' deleted successfully.`;
    } catch (error) {
      console.error(`Error deleting index '${indexName}': ${error}`);
      return new Error(`Error deleting index '${indexName}': ${error}`);
    }
  }

}
