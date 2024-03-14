//** ELYSIA IMPORT
import Elysia from "elysia";

//** DRIVER IMPORT
import { getDriver } from "../db/memgraph";
import { Driver } from "neo4j-driver";

//** SERVICE IMPORT
import StockService from "../services/stocks.service";

const stocks = (app: Elysia<any, any>): void => {
  app.get('/admin/card-list-all', async () => {
    try {
      const driver: Driver = getDriver();
      const stockService = new StockService(driver);
      const output = await stockService.cardListAll();

      return output
    } catch (error) {
      return error
    }
  });

  app.get('/admin/card-list-posted', async () => {
    try {
      const driver: Driver = getDriver()
      const stockService = new StockService(driver);
      const output = await stockService.cardListPosted();
      
      return output;
    } catch (error) {
      return error
    }
  });

  app.get('/admin/card-list-sold', async () => {
    try {
      const driver: Driver = getDriver()
      const stockService = new StockService(driver);
      const output = await stockService.cardListSold();
      
      return output
    } catch (error) {
      return error;
    }
  });
};

export default stocks;
