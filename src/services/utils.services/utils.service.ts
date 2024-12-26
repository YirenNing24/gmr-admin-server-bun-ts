//** THIRDWEB IMPORTS */
import { createThirdwebClient, ThirdwebClient } from "thirdweb";
import { Engine } from "@thirdweb-dev/engine";


//** CONFIG IMPORTS */
import { ENGINE_ACCESS_TOKEN, ENGINE_URI, SECRET_KEY } from "../../config/constants";
import { resolveScheme, upload } from "thirdweb/storage";


export const client = createThirdwebClient({ 
    secretKey: SECRET_KEY
   });


 export const engine = new Engine({
    url: ENGINE_URI,
    accessToken: ENGINE_ACCESS_TOKEN,
  });
  
  export const uploadImage = async (imageBuffer: Buffer, name: string): Promise<string> => {
    try {
      // Upload the image to IPFS
      const uri: string = await upload({
        client,
        files: [{ name, buffer: imageBuffer }], // Fixed object property name
      });
  
      // Resolve IPFS URL from the initial URI
      const ipfsURL: string = resolveScheme({ client, uri });
  
      // Fetch metadata from IPFS
      const response = await fetch(ipfsURL);
      if (!response.ok) {
        throw new Error(`Failed to fetch IPFS data: ${response.statusText}`);
      }
  
      const result = await response.json() as unknown as { name: string; buffer: string };
  
      // Validate result.buffer before using it
      if (!result.buffer) {
        throw new Error("Missing 'buffer' property in IPFS response.");
      }
  
      return resolveScheme({ client, uri: result.buffer });;
    } catch (error: any) {
      console.error("Error in uploadImage: ", error.message);
      throw error;
    }
  };
  