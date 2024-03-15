import { CardData } from "./mint.services/mint.schema";
import { Driver, QueryResult, Session, ManagedTransaction } from 'neo4j-driver-core';

export default class StockService {
    private driver: Driver;

    constructor(driver: Driver) {
        this.driver = driver;
    }

    public async cardListAll(): Promise<CardData[] | Error> {
        try {
            const session: Session = this.driver.session();
            const res: QueryResult = await session.executeRead((tx: ManagedTransaction) =>
                tx.run(`MATCH (c:Card)
                        WHERE NOT EXISTS((c)-[:LISTED]->(:User))
                        RETURN c`)
            );
            await session.close();

            const cards: CardData[] = res.records.map(record => record.get("c").properties);

            return cards as CardData[];
        } catch (error: any) {
            return error;
        }
    }

    async cardListPosted(): Promise<CardData[] | Error> {
        try {
            const session: Session = this.driver.session();
            const res: QueryResult = await session.executeRead((tx: ManagedTransaction) =>
                tx.run(`MATCH (c:Card)-[:POSTED]->(u:User)
                        RETURN c`)
            );
            await session.close();

            const cards: CardData[] = res.records.map(record => record.get("c").properties);

            return cards;
        } catch (error: any) {
            return error;
        }
    }

    async cardListSold(): Promise<CardData[] | Error> {
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
