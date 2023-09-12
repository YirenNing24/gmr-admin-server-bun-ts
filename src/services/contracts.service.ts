import { Driver, QueryResult, Session } from 'neo4j-driver-core'


interface Contracts {
    beatsAddress: string;
    kmrAddress: string;
    thumpinAddress: string;
    cardAddress: string;
    cardMarketplaceAddress: string;
    packAddress: string;
    packMarketplaceAddress: string;
}

export default class ContractService {
    /**
 * @type {neo4j.Driver}
 */
private driver: Driver;

/**
 * The constructor expects an instance of the Neo4j Driver, which will be
 * used to interact with Neo4j.
 *
 * @param {neo4j.Driver} driver
 */
constructor(driver: Driver) {
    this.driver = driver;
  
}
    async updateContracts(contracts: Contracts): Promise<string | Error> {
        const { beatsAddress, kmrAddress, thumpinAddress, cardAddress, cardMarketplaceAddress, packAddress, packMarketplaceAddress } = contracts as Contracts
        try {
            const session: Session = this.driver.session()
            const res: QueryResult = await session.executeWrite(
                tx => tx.run(
                  
                  `MATCH (c:Contracts {id: 'contracts'})
                  SET c.beatsAddress = $beatsAddress, 
                      c.cardAddress = $cardAddress,
                      c.kmrAddress = $kmrAddress,
                      c.packAddress = $packAddress,
                      c.cardMarketplaceAddress = $cardMarketplaceAddress,
                      c.packMarketplaceAddress = $packMarketplaceAddress,
                      c.thumpinAddress = $thumpinAddress
                  RETURN c`
                  ,
                  { beatsAddress, kmrAddress, thumpinAddress, cardAddress, cardMarketplaceAddress, packAddress, packMarketplaceAddress  }
                )
              );

            return 'Update complete';
        } catch (error) {
            return new Error(`Error updating contracts: ${error}`);
        }  
    }

    async contracts(): Promise<Contracts[] | Error> {
        try {
            const session: Session = this.driver.session();
            const res: QueryResult = await session.executeRead(tx =>
                tx.run(
                `MATCH (c:Contracts {id: 'contracts'})
                    RETURN c.beatsAddress AS beatsAddress,
                        c.kmrAddress AS kmrAddress,
                        c.thumpinAddress AS thumpinAddress,
                        c.cardAddress AS cardAddress,
                        c.cardMarketplaceAddress AS cardMarketplaceAddress,
                        c.packAddress AS packAddress,
                        c.packMarketplaceAddress AS packMarketplaceAddress`
                )
            );
    
            // Check if any records were returned
            if (res.records.length === 0) {
                return new Error('No contract data found.');
            }
    
            // Extract the contract data from the query result
            const contractData = res.records[0].toObject();
    
            // Create a Contracts object with the extracted data
            const contracts: Contracts[] = [{
                beatsAddress: contractData.beatsAddress,
                kmrAddress: contractData.kmrAddress,
                thumpinAddress: contractData.thumpinAddress,
                cardAddress: contractData.cardAddress,
                cardMarketplaceAddress: contractData.cardMarketplaceAddress,
                packAddress: contractData.packAddress,
                packMarketplaceAddress: contractData.packMarketplaceAddress,
            }];
    
            return contracts;
        } catch (error) {
            return new Error(`Error retrieving contracts: ${error}`);
        }
    }
    
}
