//** ELYSIA IMPORT
import Elysia from 'elysia';

//** CONTRACT SERVICE IMPORT 
import ContractService from '../services/contract.services/contracts.service';
import { Contracts } from '../services/contract.services/contracts.interface'

//** VALIDATOR SCHEMA IMPORT
import { authorizationBearerSchema, updateContractSchema } from '../services/contract.services/contract.schema';

const contracts = (app: Elysia): void => {
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

            return output as string | Error;
        } catch (error: any) {
            return error;
        }
    }, updateContractSchema);

    app.get('/admin/contracts', async ({ headers }): Promise<Contracts[] | Error> => {
        try {
            const authorizationHeader: string = headers.authorization;
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                throw new Error('Bearer token not found in Authorization header');
            }

            const jwtToken: string = authorizationHeader.substring(7);
            const contractService: ContractService = new ContractService();
            const output: Contracts[] | Error = await contractService.getContracts(jwtToken);

            return output as Contracts[] | Error;
        } catch (error: any) {
          return error;
        }
    }, authorizationBearerSchema);
};

export default contracts;
