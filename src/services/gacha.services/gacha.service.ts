//** TYPE IMPORTS
import ValidationError from "../../errors/validation.error";
import SecurityService from "../security.services/security.service";

//** SERVICE IMPORTS
import TokenService from "../security.services/token.service";
import { CardPackData } from "./gacha.interface";

//** RETHINK DB IMPORTS
import rt from 'rethinkdb'
import { getRethinkDB } from "../../db/rethink";

//** THIRDWEB IMPORTS
import thirdweb from 'thirdweb';



class GachaService {

    public async createCardPackSettings(token: string, cardpackData: CardPackData) {
        try {
            const tokenService: TokenService = new TokenService();
            const securityService: SecurityService = new SecurityService();
        
            const username: string = await tokenService.verifyAccessToken(token);
            const access: string = await securityService.checkAccess(username);
        
            if (access !== "0" && access !== "1") {
                return new ValidationError("Access Denied", "User does not have permission to create packs");
            }

            const connection: rt.Connection = await getRethinkDB();

            await rt.db('admin')
                .table('cardPacks')
                .insert(cardpackData)
                .run(connection);


            return { success: "Card pack settings created" };
        } catch (error: any) {
            console.log(error)
            throw new ValidationError("Error processing request", error.message);
        }
    }


    public async getCardPackSettings(token: string) {
        try {
            const tokenService: TokenService = new TokenService();
            const securityService: SecurityService = new SecurityService();
            
            const username: string = await tokenService.verifyAccessToken(token);
            const access: string = await securityService.checkAccess(username);
            
            if (access !== "0" && access !== "1") {
                return new ValidationError("Access Denied", "User does not have permission to view packs");
            }
    
            const connection: rt.Connection = await getRethinkDB();
            
            const result = await rt.db('admin')
                .table('cardPacks')
                .run(connection);
    
            const cardPacks: CardPackData[] = await result.toArray();
            
            if (cardPacks.length === 0) {
                return [];
            }
    
            return cardPacks;
        } catch (error: any) {
            console.log(error);
            throw error
        }
    }


    public async mintCardPack(token: string, mintCardPack: any) {
        try {
            const tokenService: TokenService = new TokenService();
            const securityService: SecurityService = new SecurityService();
        
            const username: string = await tokenService.verifyAccessToken(token);
            const access: string = await securityService.checkAccess(username);
        
            if (access !== "0" && access !== "1") {
                return new ValidationError("Access Denied", "User does not have permission to create packs");
            }




        } catch(error: any) {
          throw error
        }
    }
    


}

export default GachaService;
