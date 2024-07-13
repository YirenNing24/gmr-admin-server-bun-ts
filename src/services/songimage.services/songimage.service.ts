//** RETHINK DB IMPORTS
import rt from 'rethinkdb'
import { getRethinkDB } from '../../db/rethink';

//** TYPE INTERFACE IMPORTS
import { SongImage } from './songimage.interface';
import { SuccessMessage } from '../mint.services/mint.interface';

//** SERVICE IMPORT
import TokenService from '../security.services/token.service';
import SecurityService from '../security.services/security.service';
import ValidationError from '../../errors/validation.error';

class SongImageService {

	public async saveSongImage(token: string, songImage: SongImage): Promise<SuccessMessage | Error> {
		try {
			const tokenService: TokenService = new TokenService();
			const securityService: SecurityService = new SecurityService();

			const username: string = await tokenService.verifyAccessToken(token);
			const access: string = await securityService.checkAccess(username);

			if (access !== "0") {
				return new ValidationError("Access Denied", "User does not have permission to update contracts");
			}

            const beatMap: Object = {}
			const connection: rt.Connection = await getRethinkDB();
			const imageSong = { ...songImage, lastUpdate: Date.now(), uploader: username, beatMap };

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

    public async getSongImages(token: string): Promise<SongImage[]> {
        try {
            const tokenService: TokenService = new TokenService();
            const securityService: SecurityService = new SecurityService();
    
            const username: string = await tokenService.verifyAccessToken(token);
            const access: string = await securityService.checkAccess(username);
    
            if (access !== "0") {
                throw new ValidationError("Access Denied", "User does not have permission to view contracts");
            }
    
            const connection: rt.Connection = await getRethinkDB();
            const cursor = await rt.db('admin')
                .table('songImage')
                .run(connection);
    
            const songImages: SongImage[] = await cursor.toArray();

            return songImages;
        } catch (error: any) {
            console.error("Error retrieving song images:", error);
            throw error;
        }
    }
    
}

export default SongImageService;
