//** ELYSIA IMPORT
import Elysia from "elysia";

//** DRIVER IMPORT
import { getDriver } from "../db/memgraph";
import { Driver } from "neo4j-driver";

//** SERVICE IMPORT
import StockService from "../services/stocks.services/stocks.service";
import { CardData, SuccessMessage } from "../services/mint.services/mint.interface";
import { populateCardListSchema } from "../services/stocks.services/stock.schema";

const stocks = (app: Elysia<any, any>): void => {
  app.get('/admin/card/stock', async () => {
    try {
      const driver = getDriver() as Driver
      const stockService: StockService = new StockService(driver);
      const output: CardData[] | Error = await stockService.cardStock();

      return output as CardData[] | Error
    } catch (error: any) {
      return error
    }
  });

  app.get('/admin/card/listed', async () => {
    try {
      const driver = getDriver() as Driver
      const stockService = new StockService(driver);
      const output: CardData[] | Error = await stockService.cardListed();
      
      return output as CardData[] | Error
    } catch (error: any) {
      return error
    }
  });

  app.get('/admin/card/sold', async () => {
    try {
      const driver = getDriver() as Driver
      const stockService = new StockService(driver);
      const output: CardData[] | Error = await stockService.cardSold();
      
      return output as CardData[] | Error
    } catch (error: any) {
      return error;
    }
  });

  app.post('/admin/update/populate-card-list', async ({ headers, body }): Promise<SuccessMessage> => {
    try {
      const authorizationHeader: string = headers.authorization;
      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
      };

      const jwtToken: string = authorizationHeader.substring(7);

      const driver = getDriver() as Driver
      const stockService = new StockService(driver);
      const output: SuccessMessage = await stockService.populateCardListFromContract(jwtToken, body.password);
      
      return output as SuccessMessage
    } catch (error: any) {
      return error;
    }
    }, populateCardListSchema
  );
};

export default stocks;
