//**MEMGRAPH IMPORTS */
import { Driver, QueryResult, Session, ManagedTransaction } from 'neo4j-driver-core';

//** TYPE INTERFACE IMPORT
import { CardData } from './mint.services/mint.interface';

export default class StockService {
    private driver: Driver;

    constructor(driver: Driver) {
        this.driver = driver;
    }

    public async cardListAll(): Promise<CardData[] | Error> {
        try {
            const session: Session = this.driver.session();
            const result: QueryResult = await session.executeRead((tx: ManagedTransaction) =>
                tx.run(`MATCH (c:Card) WHERE c.lister IS NULL RETURN c`)
            );
            await session.close();

            const cards: CardData[] = result.records.map(record => record.get("c").properties);

            return cards as CardData[];
        } catch (error: any) {
            return error;
        }
    }

    public async cardListPosted(): Promise<CardData[] | Error> {
        try {
            const session: Session = this.driver.session();
            const res: QueryResult = await session.executeRead((tx: ManagedTransaction) =>
                tx.run(`MATCH (c:Card) WHERE c.lister IS NOT NULL RETURN c`)
            );
            await session.close();

            const cards: CardData[] = res.records.map(record => record.get("c").properties);

            return cards as CardData[]
        } catch (error: any) {
          return error;
        }
    }

    public async cardListSold(): Promise<CardData[] | Error> {
        try {
            const session: Session = this.driver.session();
            const res: QueryResult = await session.executeRead((tx: ManagedTransaction) =>
                tx.run(`MATCH (c:Card)-[:SOLD]->(u:User)
                        RETURN c`)
            );
            await session.close();

            const cards: CardData[] = res.records.map(record => record.get("c").properties);

            return cards as CardData[];
        } catch (error: any) {
            return error;
        }
    }

}
