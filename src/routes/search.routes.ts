import Elysia from "elysia";
import { getDriver } from '../db/memgraph';
import { Driver } from 'neo4j-driver';
import SearchService from "../services/search.service";


const search = (app: Elysia) => {

    app.get('/admin/search-indexes/', async () => {
      try {
        const driver: Driver = getDriver();
        const searchService: SearchService = new SearchService(driver);
        const output = await searchService.listIndexes() 

        return output
      } catch (error) {
        return error
      } 
    });

    app.post('/admin/get-documents/', async (context) => {
      try {
        const { indexName } = context.body as { indexName: string }

        const searchService: SearchService = new SearchService();
        const output = await searchService.getDocuments(indexName)

        return output
      } catch (error) {
        return error
      } 
    });
    
    app.post('/admin/create-index/', async (context) => {
        try {
          const {indexName, primaryKey} = 
          context.body as {indexName: string, primaryKey: string}
        
          const searchService: SearchService = new SearchService();
          const output = await searchService.createIndex(indexName, primaryKey) 

          return output
        } catch (error) {
          return error
        } 
    });

    app.delete('/admin/delete-index/', async (context) => {
        try {
          const {indexName } = 
          context.body as {indexName: string }
        
          const searchService: SearchService = new SearchService();
          const output = await searchService.deleteIndex(indexName) 

          return output
        } catch (error) {
          return error
        } 
    });

    app.post('/admin/update-document/', async (context) => {
      try {
        const {indexName, update } = 
        context.body as { indexName: string, update: string }
      
        const searchService: SearchService = new SearchService();
        await searchService.updateDocument(indexName, update) 

      } catch (error) {
        return error
      } 
    });

    app.put('/admin/populate-player-search/', async () => {
      try {

        const driver: Driver = getDriver();
        const searchService: SearchService = new SearchService(driver);
        const output = await searchService.populatePlayerSearch()

        return output
      } catch (error) {
        return error
      } 
    });

    
  };
  
  export default search;