//** ELYSIA IMPORT
import Elysia from "elysia";

//** DRIVER IMPORT
import { getDriver } from "../db/memgraph";
import { Driver } from "neo4j-driver";

//** SERVICE IMPORT
import StockService from "../services/stocks.services/stocks.service";

//** TYPE INTERFACE
import { CardData, SuccessMessage } from "../services/mint.services/mint.interface";
import { populateCardListSchema } from "../services/stocks.services/stock.schema";

//** SCHEMA IMPORT
import { PackMetadata, StoreCardUpgradeData } from "../services/stocks.services/stocks.interface";
import { authorizationBearerSchema } from "../services/contract.services/contract.schema";


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
  })


  .get('/admin/card/listed', async (): Promise<CardData[] | Error> => {
    try {
      const driver = getDriver() as Driver
      const stockService = new StockService(driver);
      const output: CardData[] | Error = await stockService.cardListed();
      
      return output as CardData[] | Error
    } catch (error: any) {
      return error
    }
  })


  .get('/admin/card/unpacked', async (): Promise<CardData[] | Error> => {
    try {
      const driver = getDriver() as Driver
      const stockService = new StockService(driver);
      const output: CardData[] | Error = await stockService.cardStockUnpacked();
      
      return output as CardData[] | Error
    } catch (error: any) {
      return error
    }
  })


  .get('/admin/card/sold', async (): Promise<CardData[] | Error> => {
    try {
      const driver = getDriver() as Driver
      const stockService = new StockService(driver);
      const output: CardData[] | Error = await stockService.cardSold();
      
      return output as CardData[] | Error
    } catch (error: any) {
      return error;
    }
  })


  .post('/admin/card/populate-card-list', async ({ headers, body }): Promise<SuccessMessage> => {
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
  )


  .get('/admin/upgrade/card-level', async (): Promise<StoreCardUpgradeData[]> => {
    try {
      const driver = getDriver() as Driver
      const stockService: StockService = new StockService(driver);
      const output: StoreCardUpgradeData[] = await stockService.cardUpgradeItemStock();
      
      return output as StoreCardUpgradeData[]
    } catch (error: any) {
      return error;
    }
  })


  .get('/admin/upgrade/card-level', async (): Promise<StoreCardUpgradeData[]> => {
    try {
      const driver = getDriver() as Driver
      const stockService: StockService = new StockService(driver);
      const output: StoreCardUpgradeData[] = await stockService.cardUpgradeItemStock();
      
      return output as StoreCardUpgradeData[]
    } catch (error: any) {
      return error;
    }
  })


  .get('/admin/cardpacks/', async ({ headers }): Promise<PackMetadata[]> => {
    try {

      const authorizationHeader: string = headers.authorization;
      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
      };

      const jwtToken: string = authorizationHeader.substring(7);

      const driver = getDriver() as Driver;
      const stockService: StockService = new StockService(driver);
      const output: Error | PackMetadata[] = await stockService.cardPackStock(jwtToken);
      
      return output as PackMetadata[];
    } catch (error: any) {
      return error;
    }
    }, authorizationBearerSchema
  );


};


export default stocks;