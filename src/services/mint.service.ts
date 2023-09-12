import { Driver, QueryResult, Session } from 'neo4j-driver-core'
import { Edition, Pack, ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { SECRET_KEY, PRIVATE_KEY } from '../config/constants';
import { Buffer } from "buffer";


interface Meta {
    description: string;
    era: string;
    experience: string;
    healboost: string;
    level: string;
    name: string;
    position: string;
    position2: string;
    rarity: string;
    scoreboost: string;
    skill: string;
    tier: string;
    breakthrough: string
    stars: string
  }

interface MetadataWithSupply {
    supply: number;
    metadata: {
      name: string;
      description: string;
      image: string;
      era: string;
      experience: string;
      healboost: string;
      level: string;
      position: string;
      position2: string;
      scoreboost: string;
      skill: string;
      rarity: string;
      tier: string;
      breakthrough: string;
      stars: string;
      uploader: string;
    };
  }

interface CardBoxData {
    contents: string;
    description: string;
    name: string;
    openStartTime: string;
    quantity: string;
    quantityPerReward: string;
    rewardsPerPack: string;
    token: string;
    totalRewards: string;
    type: string;
  }

interface CardField {
    name: string;
    tokenId: string;
    quantityPerReward: string;
    totalRewards: string;
    assetContract: string;
  }



export default class MintService {
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
async createCard(metadata: Meta, supply: number, base64Image: string, uploader: string, editionAddress: string): Promise<void | Error> {
    try {
        const storage: ThirdwebStorage = new ThirdwebStorage({
            secretKey: SECRET_KEY,
        });

        const sdk: ThirdwebSDK = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY, "mumbai", {
            secretKey: SECRET_KEY
        });

        const buffer: Buffer = Buffer.from(base64Image, "base64");
        const [imageURI, cardContract] = await Promise.all([
            storage.upload(buffer),
            sdk.getContract(editionAddress, 'edition')
        ]);
        
        const {
            description, era, experience, healboost, level,
            name, position, position2, rarity, scoreboost, skill, tier, breakthrough, stars
        } = metadata;

        const metadataWithSupply: MetadataWithSupply[] = Array(supply).fill({
            supply: 1,
            metadata: {
              name,
              description,
              image: imageURI,
              era,
              experience,
              healboost,
              level,
              position,
              position2,
              scoreboost,
              skill,
              rarity,
              tier,
              breakthrough,
              stars,
              uploader
            }
          });

        await cardContract.erc1155.mintBatch(metadataWithSupply)
        const stocks = await cardContract.erc1155.getOwned()

        for (const card of stocks) {
            const {
              metadata: {
                id, breakthrough, description, era, experience,
                healboost, image, level, name, position, position2, rarity,
                scoreboost, skill, tier, uri, stars, uploader,
              },
              owner, quantityOwned, supply, type
            } =  card;

        const session: Session = this.driver.session()
        const res: QueryResult = await session.executeWrite(
            tx => tx.run(
              `
              MERGE (c:Card {id: $id})
              ON CREATE SET
                c.breakthrough = $breakthrough,
                c.cardAddress = $editionAddress,
                c.description = $description,
                c.era = $era,
                c.experience = $experience,
                c.healboost = $healboost,
                c.image = $image,
                c.level = $level,
                c.name = $name,
                c.position = $position,
                c.position2 = $position2,
                c.rarity = $rarity,
                c.scoreboost = $scoreboost,
                c.skill = $skill,
                c.tier = $tier,
                c.uri = $uri,
                c.owner = $owner,
                c.quantityOwned = $quantityOwned,
                c.supply = $supply,
                c.type = $type,
                c.stars = $stars,
                c.uploader = $uploader
              RETURN c
              `,
              { id, breakthrough, editionAddress, description,
                era, experience, healboost, image, level,
                name, position, position2, rarity, scoreboost,
                skill, tier, uri, owner, quantityOwned,
                supply, type, stars, uploader,
              }
            )
          );
          await session.executeWrite((tx) =>
          tx.run(
              `
              MATCH (p:Card {id: $id})
              MATCH (u:User {username: $uploader})
              MERGE (p)-[:UPLOADED]->(u)
              `,
              { id, uploader }
            )
          );
        await session.close()
        }

    } catch (error) {
            console.error('An error occurred:', error);
            throw error
        }
    }

    async createCardBox(cardBoxData: CardBoxData, base64Image: string, cardFields: CardField[], uploader: string, packAddress: string): Promise<void | Error> {
      try {
          const storage: ThirdwebStorage = new ThirdwebStorage({
              secretKey: SECRET_KEY,
          });
  
          const sdk: ThirdwebSDK = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY, "mumbai", {
              secretKey: SECRET_KEY
          });
  
          const editionAddress = cardFields[0].assetContract;
          const buffer: Buffer = Buffer.from(base64Image, "base64");
          const [imageURI, cardBoxContract, editionContract]: [string, Pack, Edition] = await Promise.all([
              storage.upload(buffer),
              sdk.getContract(packAddress, 'pack'),
              sdk.getContract(editionAddress, 'edition')
          ]);
  
          // Set approval for the pack contract to manage editions
          await editionContract.setApprovalForAll(packAddress, true);
  
          const {
              description, name, openStartTime,
              quantity, quantityPerReward, rewardsPerPack,
              token, totalRewards, type
          } = cardBoxData;
  
          const erc1155Rewards = cardFields.map((cardField) => ({
              contractAddress: cardField.assetContract,
              tokenId: cardField.tokenId,
              quantityPerReward: cardField.quantityPerReward,
              totalRewards: cardField.totalRewards,
          }));
  
          const pack = {
              packMetadata: {
                  name,
                  description,
                  image: imageURI,
                  type,
                  uploader,
              },
              erc20Rewards: [
                  {
                      contractAddress: token,
                      quantityPerReward,
                      quantity,
                      totalRewards,
                  }
              ],
              erc1155Rewards,
              openStartTime: new Date(openStartTime),
              rewardsPerPack,
          };
  
          // Create the card box
          const transaction = await cardBoxContract.create(pack);
  
          // Fetch the stocks
          const stocks = await cardBoxContract.erc1155.getOwned();
  
          const session: Session = this.driver.session();
          for (const cardBox of stocks) {
              const {
                  metadata: { id, name, description, image, type, uri, owner }
              } = cardBox;
  
              // Create or update the Pack node in Neo4j
              await session.executeWrite((tx) =>
                  tx.run(
                      `
                      MERGE (p:Pack {id: $id})
                      ON CREATE SET
                          p.description = $description,
                          p.image = $image,
                          p.name = $name,
                          p.uri = $uri,
                          p.owner = $owner,
                          p.type = $type,
                          p.uploader = $uploader
                      RETURN p
                      `,
                      { id, description, image, name, uri, owner, type, uploader }
                  )
              );
  
              // Create a relationship between the Pack and User nodes
              await session.executeWrite((tx) =>
                  tx.run(
                      `
                      MATCH (p:Pack {id: $id})
                      MATCH (u:User {username: $uploader})
                      MERGE (p)-[:UPLOADED]->(u)
                      `,
                      { id, uploader }
                  )
              );
          }
  
          await session.close();
      } catch (error) {
          console.error('An error occurred:', error);
          throw error;
      }
  }
  

}

