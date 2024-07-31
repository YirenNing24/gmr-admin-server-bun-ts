//** THIRDWEB IMPORTS */
import { createThirdwebClient } from "thirdweb";
import { Engine } from "@thirdweb-dev/engine";
import { upload } from "thirdweb/storage";
import { FileOrBufferOrString } from "@thirdweb-dev/storage";

//** CONFIG IMPORTS */
import { ENGINE_ACCESS_TOKEN, SECRET_KEY } from "../../config/constants";



export const client = createThirdwebClient({ 
    secretKey: SECRET_KEY
   });


 export const engine = new Engine({
    url: "http://0.0.0.0:3005",
    accessToken: ENGINE_ACCESS_TOKEN,
  });
  

export const ipfsUpload  = async (file: FileOrBufferOrString): Promise<string[]> => {
    const files = [file]
    const uri: string[] = await upload({ client, files})
    return uri
}