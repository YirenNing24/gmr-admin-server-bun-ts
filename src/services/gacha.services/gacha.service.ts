//** TYPE IMPORTS
import ValidationError from "../../errors/validation.error";
import SecurityService from "../security.services/security.service";

//** SERVICE IMPORTS
import TokenService from "../security.services/token.service";
import { CardPackData } from "./gacha.interface";

class GachaService {

    public async createCardPackSettings(token: string, cardpackData: CardPackData[]) {
        try {
            const tokenService: TokenService = new TokenService();
            const securityService: SecurityService = new SecurityService();
        
            const username: string = await tokenService.verifyAccessToken(token);
            const access: string = await securityService.checkAccess(username);
        
            if (access !== "0" && access !== "1") {
                return new ValidationError("Access Denied", "User does not have permission to create packs");
            }

            // Proceed with creating card pack settings here
            // Example: await someService.createCardPack(cardpackData);

        } catch (error: any) {
            throw new ValidationError("Error processing request", error.message);
        }
    }
}

export default GachaService;
