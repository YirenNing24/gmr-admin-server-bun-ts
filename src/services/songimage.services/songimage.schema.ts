//** ELYSIA TYPE VALIDATION IMPORT
import { t } from "elysia";

/**
 * Schema for validating the body of a song image upload request.
 * 
 * @typedef {Object} songImageSchema
 * @property {Object} headers - The headers of the request.
 * @property {string} headers.authorization - The authorization token.
 * @property {Object} body - The body of the request.
 * @property {string} body.songBuffer - The buffer containing song data.
 * @property {string} body.imageBuffer - The buffer containing image data.
 */
export const songImageSchema = {
    headers: t.Object({ authorization: t.String() }),
    body: t.Object({ 
        songBuffer: t.String(),
        imageBuffer: t.String(),
        songTitle: t.String()
    })
};
