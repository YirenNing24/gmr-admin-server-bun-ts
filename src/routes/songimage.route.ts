//** ELYSIA IMPORT
import Elysia from "elysia";

//** SERVICE IMPORT
import SongImageService from "../services/songimage.services/songimage.service";

//** TYPE INTERFACE AND SCHEMA
import { SuccessMessage } from "../services/mint.services/mint.interface";
import { songImageSchema } from "../services/songimage.services/songimage.schema";
import { SongImage } from "../services/songimage.services/songimage.interface";

const songImage = (app: Elysia<any, any>): void => {

  app.post('/admin/songimage/save', async ({ headers, body }): Promise<SuccessMessage> => {
    try {
      const authorizationHeader: string = headers.authorization;
      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
      };

      const jwtToken: string = authorizationHeader.substring(7);

      const songImageService = new SongImageService;
      const output: Error | SuccessMessage = await songImageService.saveSongImage(jwtToken, body);

      return output as SuccessMessage;
    } catch (error: any) {
      throw error;

    }
    }, songImageSchema
  );

  app.get('/admin/songimage/get', async ({ headers }): Promise<SongImage[]> => {
    try {
      const authorizationHeader: string = headers.authorization;
      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
      };

      const jwtToken: string = authorizationHeader.substring(7);

      const songImageService = new SongImageService;
      const output: SongImage[] = await songImageService.getSongImages(jwtToken);

      return output as SongImage[];
    } catch (error: any) {
      throw error;

    }
    }, songImageSchema
  );

}

export default songImage;