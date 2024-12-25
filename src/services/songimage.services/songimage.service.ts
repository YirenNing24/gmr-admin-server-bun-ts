//** MONGO DB IMPORTS
import { mongoDBClient } from '../../db/mongodb.client';
import { MongoClient } from 'mongodb';

//** TYPE INTERFACE IMPORTS
import { SongImage } from './songimage.interface';
import { SuccessMessage } from '../mint.services/mint.interface';

//** SERVICE IMPORT
import TokenService from '../security.services/token.service';
import SecurityService from '../security.services/security.service';
import ValidationError from '../../errors/validation.error';

class SongImageService {

	public async saveSongImage(token: string, songImage: SongImage): Promise<SuccessMessage | Error> {
        const client: MongoClient = await mongoDBClient.connect();
		try {
			const tokenService: TokenService = new TokenService();
			const securityService: SecurityService = new SecurityService();

			const username: string = await tokenService.verifyAccessToken(token);
			const access: string | Error = await securityService.checkAccess(username);

			if (access !== "0") {
				return new ValidationError("Access Denied", "User does not have permission to update contracts");
			}

            const beatMap: Object = {}
			const imageSong = { ...songImage, lastUpdate: Date.now(), uploader: username, beatMap };

            const collection = client.db("admin").collection("songImage");
            await collection.insertOne(imageSong);

			return { success: "Song and image saved successfully" }
		} catch (error: any) {
			console.error("Error updating contracts:", error);
			throw error;
        } finally {
            if (client) {
                await client.close(); // Ensure the MongoDB client is closed
            }
        }
	}

    public async getSongImages(token: string): Promise<SongImage[]> {
        const client: MongoClient = await mongoDBClient.connect();
        try {
            const tokenService: TokenService = new TokenService();
            const securityService: SecurityService = new SecurityService();
    
            const username: string = await tokenService.verifyAccessToken(token);
            const access: string | Error = await securityService.checkAccess(username);
    
            if (access !== "0") {
                throw new ValidationError("Access Denied", "User does not have permission to view contracts");
            }
    
            const collection = client.db("admin").collection("songImage");
            const songImages: SongImage[] = await collection.find().toArray() as unknown as SongImage[];

            return songImages;
        } catch (error: any) {
            console.error("Error retrieving song images:", error);
            throw error;
        } finally {
            if (client) {
                await client.close(); // Ensure the MongoDB client is closed
            }
        }
    }
    
}

export default SongImageService;
