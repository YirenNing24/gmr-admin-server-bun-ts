import { createThirdwebClient } from "thirdweb";
import { CHAIN, ENGINE_ADMIN_WALLET_ADDRESS, SECRET_KEY } from "./src/config/constants";
import { upload } from "thirdweb/storage";
import { readFile } from "fs/promises"; // Import the promises API for fs
import { engine, uploadImage } from "./src/services/utils.services/utils.service";
import { resolveScheme } from "thirdweb/storage";


const createCard = async () => {
    try {
        const filePath = "./cardImage.png"; // Path to the image
        const buffer: Buffer = await readFile(filePath);
    
        const client = createThirdwebClient({ secretKey: SECRET_KEY });
        const imageUri: string = await uploadImage(client, buffer, 'test');
    
        const supply: string = "1";
        const requestBody = {
            receiver: "0x6d2de42d71b6dC3bb02e0Ef465497bFCD2050287",
            metadataWithSupply: [
                {
                    metadata: {
                        name: "try",
                        description: "test",
                        image: imageUri,
                        uploader: "beats"
    
                    },
                    supply,
                }
            ],
        };
        
        await engine.erc1155.mintBatchTo(CHAIN, "0x31F90F18Cd93F11fC347362e9f8850E90176d4e5", ENGINE_ADMIN_WALLET_ADDRESS, requestBody, true);

        const cards = await engine.erc1155.getAll(CHAIN, "0x31F90F18Cd93F11fC347362e9f8850E90176d4e5");
        console.log(cards.result)

    } catch(error: any) {
      throw error
    }


};



// https://398b99804c8ec6898626c44191275be0.ipfscdn.io/ipfs/4d004ded4be87946e706e070ad3b0cf8


createCard();
