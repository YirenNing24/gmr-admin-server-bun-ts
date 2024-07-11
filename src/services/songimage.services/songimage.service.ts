//** RETHINK DB IMPORTS
import rt from 'rethinkdb'
import { getRethinkDB } from '../../db/rethink';

//** TYPE INTERFACE IMPORTS
import { SongImage } from './songimage.interface';
import { SuccessMessage } from '../mint.services/mint.interface';

//** TOKEN SERVICE IMPORT
import TokenService from '../security.services/token.service';
import SecurityService from '../security.services/security.service';
import ValidationError from '../../errors/validation.error';





class SongImageService {

    public async saveSongImage(token: string, songImage: SongImage): Promise< SuccessMessage | Error> {
        try {
            const tokenService: TokenService = new TokenService();
            const securityService: SecurityService = new SecurityService();
    
            const username: string = await tokenService.verifyAccessToken(token);
            const access: string = await securityService.checkAccess(username);
    
            if (access !== "0") {
                return new ValidationError("Access Denied", "User does not have permission to update contracts");
            };
    
            const connection: rt.Connection = await getRethinkDB();
            const imageSong = { ...songImage, lastUpdate: Date.now(), uploader: username };

            await rt.db('admin')
                .table('songImage')
                .insert(imageSong)
                .run(connection);
    
            return { success: "Song and image saved successfully" }
        } catch (error: any) {
            console.error("Error updating contracts:", error);
            throw error;
        }
    }

    // public async getContracts(token: string): Promise<Contracts[] | Error> {
    //     try {
    //         const tokenService: TokenService = new TokenService();
    //         const securityService: SecurityService = new SecurityService();

    //         const username: string = await tokenService.verifyAccessToken(token);
    //         const access: string = await securityService.checkAccess(username);

    //         if (access !== "0" && access !== "1") {
    //             return new ValidationError("Access Denied", "User does not have permission to get the contracts");
    //         }

    //         const connection: rt.Connection = await getRethinkDB();

    //         const query: rt.Cursor = await rt.db('admin')
    //             .table('contracts')
    //             .orderBy(rt.desc('lastUpdate'))
    //             .limit(2)
    //             .run(connection);

    //         const contracts: Contracts[] = await query.toArray()

    //         return contracts as Contracts[]
    //     } catch (error: any) {
    //         console.error("Error getting latest update:", error);
    //         throw error;
    //     }
    // }
}
    
export default SongImageService;
