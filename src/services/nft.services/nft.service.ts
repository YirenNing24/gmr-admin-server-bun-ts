//**MEMGRAPH IMPORTs
import { Driver, Session, ManagedTransaction } from 'neo4j-driver-core'

//** THIRDWEB IMPORTS */
import { Edition, NFT, Pack, ThirdwebSDK, TransactionResultWithId } from "@thirdweb-dev/sdk";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { SECRET_KEY, PRIVATE_KEY, CHAIN } from '../../config/constants';

//** VALIDATION ERROR IMPORT
import ValidationError from '../../errors/validation.error';

//** SERVICE IMPORTS
import SecurityService from '../security.services/security.service';
import TokenService from '../security.services/token.service';
import ContractService from '../contract.services/contracts.service';

//** TYPE IMPORTS
import { Contracts } from '../contract.services/contracts.interface';
import { SuccessMessage } from '../mint.services/mint.interface';
import { CardTransferDetails } from './nft.interface';

class NFTService {
    private driver: Driver;
    constructor(driver: Driver) {
        this.driver = driver;
    }

    public async transferCards(token: string, cardTransferDetails: CardTransferDetails): Promise < SuccessMessage | Error > {
        const tokenService: TokenService = new TokenService();
        const securityService: SecurityService = new SecurityService();

        const username: string = await tokenService.verifyAccessToken(token);
        const access: string = await securityService.checkAccess(username);
        try {
            if (access !== "0" && access !== "1") {
                return new ValidationError("Access Denied", "User doest not have  permission to create cards");
            };
            
            const editionAddress: string = await this.retrieveContracts(token)
            if (!editionAddress) {
                throw new Error("Edition address is undefined");
            };

            const sdk: ThirdwebSDK = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY, CHAIN, {
                secretKey: SECRET_KEY,
            });

            const [ cardContract ] = await Promise.all([ sdk.getContract(editionAddress, 'edition')]);

            const { toAddress, tokenIds, amounts, uris } = cardTransferDetails as CardTransferDetails

            await cardContract.transferBatch(toAddress, tokenIds, amounts);
            await this.addTransferredProp(uris, username);

            return { success: "Card Transfer is successful" } as SuccessMessage;
        } catch (error: any) {
            console.error(error)
          throw error
        }
    };

    public async retrieveContracts(token: string): Promise<string> {
        const contractService: ContractService = new ContractService();
        const contracts: Error | Contracts[] = await contractService.getContracts(token);

        let editionAddress: string | undefined; // Initialize to undefined
        if (Array.isArray(contracts)) {
            const [firstContract] = contracts;
            if (firstContract) {
                const { cardAddress } = firstContract;
                editionAddress = cardAddress;
            }
        }

        if (!editionAddress) {
            throw new Error("Edition address is undefined");
        }

        return editionAddress
    };

    private async addTransferredProp(uris: string[], username: string) {
        try {
            const session: Session = this.driver.session();
            await session.executeWrite(async (tx: ManagedTransaction) => {
                for (const uri of uris) {
                    await tx.run(`
                        MATCH (c:Card {uri: $uri})
                        SET c.transferred = $username
                    `, { uri, username });
                }
            });
            await session.close();
        } catch (error: any) {
            console.error(error)
            throw error
        }
    }

    private async getUsername(walletAddress: string) {
        try {
            const session: Session = this.driver.session();
            await session.executeWrite(async (tx: ManagedTransaction) => {
                for (const uri of uris) {
                    await tx.run(`
                        MATCH (c:Card {uri: $uri})
                        SET c.transferred = $username
                    `, { uri, username });
                }
            });
            await session.close();
        } catch (error: any) {
            console.error(error)
            throw error
        }
    }


    



}

export default NFTService