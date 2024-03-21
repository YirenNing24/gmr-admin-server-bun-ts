//** ELYSIA IMPORT
import Elysia from "elysia";

//** DRIVER IMPORT
import { getDriver } from "../db/memgraph";
import { Driver } from "neo4j-driver";

//** SERVICE IMPORT
import StockService from "../services/stocks.service";
import { CardData } from "../services/mint.services/mint.schema";

const stocks = (app: Elysia<any, any>): void => {
  app.get('/admin/card/list/listed', async () => {
    try {
      const driver = getDriver() as Driver
      const stockService: StockService = new StockService(driver);
      const output: CardData[] | Error = await stockService.cardListAll();

      return output as CardData[] | Error
    } catch (error: any) {
      return error
    }
  });

  app.get('/admin/card/list/posted', async () => {
    try {
      const driver = getDriver() as Driver
      const stockService = new StockService(driver);
      const output: CardData[] | Error = await stockService.cardListPosted();
      
      return output as CardData[] | Error
    } catch (error: any) {
      return error
    }
  });

  app.get('/admin/card-list-sold', async () => {
    try {
      const driver = getDriver() as Driver
      const stockService = new StockService(driver);
      const output: CardData[] | Error = await stockService.cardListSold();
      
      return output as CardData[] | Error
    } catch (error: any) {
      return error;
    }
  });
};

export default stocks;
