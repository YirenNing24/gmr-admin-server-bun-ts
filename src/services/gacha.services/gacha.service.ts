//** TYPE IMPORTS
import ValidationError from "../../errors/validation.error";
import SecurityService from "../security.services/security.service";

//** SERVICE IMPORTS
import TokenService from "../security.services/token.service";
import { CardPackData } from "./gacha.interface";

//** RETHINK DB IMPORTS
import rt from 'rethinkdb'
import { getRethinkDB } from "../../db/rethink";

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
                .table('contracts')
                .insert(cardpackData)
                .run(connection);


            return { success: "Card pack settings created" };
        } catch (error: any) {
            throw new ValidationError("Error processing request", error.message);
        }
    }


}

export default GachaService;
