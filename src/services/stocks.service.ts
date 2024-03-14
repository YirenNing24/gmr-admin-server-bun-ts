import { Edition, SmartContract, ThirdwebSDK } from "@thirdweb-dev/sdk";
import { SECRET_KEY, EDITION_ADDRESS, PRIVATE_KEY, CARD_MARKETPLACE, BUNDLE_MARKETPLACE, RDB_DB_ADMIN } from '../config/constants';
import { Driver, QueryResult, Session } from 'neo4j-driver-core'

interface CardData {
    name: string;
    description: string;
    image: string;
    id: string;
    uri: string;
    era: string;
    experience: string;
    healboost: string;
    level: string;
    position: string;
    position2: string;
    scoreboost: string;
    skill: string;
    rarity: string;
    tier: string;
    stars: string;
    type: string;
    supply: string;
  }
  
  
export default class StockService {
private driver: Driver;
constructor(driver: Driver) {
    this.driver = driver;
}

    async cardListAll(): Promise <CardData[] | Error> {
        try {
            const session = this.driver.session();
            const res: QueryResult = await session.executeRead((tx) =>
            tx.run( `MATCH (c:Card)
            WHERE NOT EXISTS((c)-[:LISTED]->(:User))
            RETURN c`)
            );
            await session.close();

            const cards: CardData [] = res.records.map(record => record.get("c").properties);

            return cards
        } catch (error) {
            console.error('An error occurred:', error);
            return error;
        }
    }


    async cardListPosted(): Promise <CardData[]  | Error> {
        try {
            const session = this.driver.session();
            const res: QueryResult = await session.executeRead((tx) =>
            tx.run( `MATCH (c:Card)-[:LISTED]->(u:User)
            RETURN c`)
            );
            await session.close();

            const cards: CardData[] = res.records.map(record => record.get("c").properties);

            return cards
        } catch (error) {
            console.error('An error occurred:', error);
            return error;
        }
    }

    async cardListSold(): Promise <CardData[] | Error> {
        try {
            const session = this.driver.session();
            const res: QueryResult = await session.executeRead((tx) =>
            tx.run( `MATCH (c:Card)-[:SOLD]->(u:User)
            RETURN c`)
            );
            await session.close();

            const cards: CardData [] = res.records.map(record => record.get("c").properties);

            return cards
        } catch (error) {
            console.error('An error occurred:', error);
            return error;
        }
    }

}

