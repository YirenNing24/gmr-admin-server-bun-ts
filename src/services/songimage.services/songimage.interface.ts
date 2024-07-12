/**
 * Represents a song with an associated image.
 * 
 * @interface SongImage
 * 
 * @property {string} songBuffer - The buffer containing the song data.
 * @property {string} imageBuffer - The buffer containing the image data.
 * @property {string} songTitle - The title of the song.
 * @property {string} [uploader] - The optional uploader of the song.
 * @property {number} [timestamp] - The optional timestamp when the song was uploaded.
 */
export interface SongImage {
	songBuffer: string;
	imageBuffer: string;
	songTitle: string;
	uploader?: string;
	timestamp?: number;
}
