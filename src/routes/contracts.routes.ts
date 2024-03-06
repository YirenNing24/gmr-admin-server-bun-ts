//** ELYSIA IMPORT
import Elysia from 'elysia';

//** CONTRACT SERVICE IMPORT 
import ContractService from '../services/contract.services/contracts.service';
import { Contracts } from '../services/contract.services/contracts.interface'

//** VALIDATOR SCHEMA IMPORT
import { updateContractSchema } from '../services/contract.services/contract.schema';


const contracts = (app: Elysia ): void => {
  app.post('/admin/update-contracts', async ({ body, headers }): Promise<string | Error> => {
    try {

        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);

        const contracts: Contracts = body as Contracts;

        const contractService: ContractService = new ContractService();
        const output: string | Error = await contractService.updateContracts(jwtToken, contracts);

      return output
    } catch (error: any) {
      return error;
      }
    }, updateContractSchema
  );

  // app.get('/admin/contracts', async (_context) => {
  //   try {
  //       const driver: Driver = getDriver();
  //       const contractService: ContractService = new ContractService(driver)
  //       const output: Error | Contracts[] = await contractService.contracts()

  //     return output
  //   } catch (error) {
  //     return error;
  //   }
  // });


};

export default contracts;
