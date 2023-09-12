import Elysia from 'elysia';
import { getDriver } from '../db/memgraph';

import ContractService from '../services/contracts.service';
import { Driver } from 'neo4j-driver';

interface Contracts {
    beatsAddress: string;
    kmrAddress: string;
    thumpinAddress: string;
    cardAddress: string;
    cardMarketplaceAddress: string;
    packAddress: string;
    packMarketplaceAddress: string;
}

const contracts = (app: Elysia ) => {
  app.post('/admin/update-contracts', async (context) => {
    try {
        const contracts: Contracts = context.body as 
        { beatsAddress: string, kmrAddress: string, thumpinAddress: string, cardAddress: string, 
        cardMarketplaceAddress: string, packAddress: string, packMarketplaceAddress: string  }

        const driver: Driver = getDriver();
        const contractService: ContractService = new ContractService(driver);
        const output = await  contractService.updateContracts(contracts)
      return output
    } catch (error) {
      return(error);
    }
  });

  app.get('/admin/contracts', async (context) => {
    try {
        const driver: Driver = getDriver();
        const contractService: ContractService = new ContractService(driver)
        const output = await contractService.contracts()
      return output
    } catch (error) {
        return error;
    }
  });


};

export default contracts;
