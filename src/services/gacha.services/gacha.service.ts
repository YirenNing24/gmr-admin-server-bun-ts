//** TYPE IMPORTS
import ValidationError from "../../errors/validation.error";
import SecurityService from "../security.services/security.service";

//** SERVICE IMPORTS
import TokenService from "../security.services/token.service";
import { CardPackData } from "./gacha.interface";

//** MONGO DB IMPORTS
import { mongoDBClient } from '../../db/mongodb.client';
import { MongoClient } from 'mongodb';


import { SuccessMessage } from "../mint.services/mint.interface";





class GachaService {

    public async createCardPackSettings(token: string, cardpackData: CardPackData): Promise<SuccessMessage | ValidationError> {
        const client: MongoClient = await mongoDBClient.connect();
        try {
            const tokenService: TokenService = new TokenService();
            const securityService: SecurityService = new SecurityService();
        
            const username: string = await tokenService.verifyAccessToken(token);
            const access: string | Error = await securityService.checkAccess(username);
        
            if (access !== "0" && access !== "1") {
                return new ValidationError("Access Denied", "User does not have permission to create packs");
            }

            const collection = client.db("admin").collection("cardPacks");
            await collection.insertOne(cardpackData)

            return { success: "Card pack settings created" };
        } catch (error: any) {
            console.log(error)
            throw new ValidationError("Error processing request", error.message);
        } finally {
            if (client) {
                await client.close(); // Ensure the MongoDB client is closed
            }
        }
    }

    public async getCardPackSettings(token: string): Promise<CardPackData[] | Error> {
        const client: MongoClient = await mongoDBClient.connect();
        try {
            const tokenService: TokenService = new TokenService();
            const securityService: SecurityService = new SecurityService();
            
            const username: string = await tokenService.verifyAccessToken(token);
            const access: string | Error = await securityService.checkAccess(username);
            
            if (access !== "0" && access !== "1") {
                return new ValidationError("Access Denied", "User does not have permission to view packs");
            }
            const collection = client.db("admin").collection("cardPacks");
            
    
            const cardPacks = await collection.find().toArray() as unknown as CardPackData[];
            if (cardPacks.length === 0) {
                return [];
            }
    
            return cardPacks;
        } catch (error: any) {
            console.log(error);
            throw error
        } finally {
            if (client) {
                await client.close(); // Ensure the MongoDB client is closed
            }
        }
    }


    public async mintCardPack(token: string, mintCardPack: any) {
        try {
            const tokenService: TokenService = new TokenService();
            const securityService: SecurityService = new SecurityService();
        
            const username: string = await tokenService.verifyAccessToken(token);
            const access: string | Error = await securityService.checkAccess(username);
        
            if (access !== "0" && access !== "1") {
                return new ValidationError("Access Denied", "User does not have permission to create packs");
            }

        } catch(error: any) {
          throw error
        }
    }
    
}

export default GachaService;
