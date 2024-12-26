import { createThirdwebClient } from "thirdweb";
import { CHAIN, ENGINE_ADMIN_WALLET_ADDRESS, SECRET_KEY } from "./src/config/constants";
import { upload } from "thirdweb/storage";
import { readFile } from "fs/promises"; // Import the promises API for fs
import { engine, uploadImage } from "./src/services/utils.services/utils.service";
import { resolveScheme } from "thirdweb/storage";


const transferCard = async () => {
    try {
        const NASHAR_WALLET_ADDRESS: string = "0x5336E0e7917e667BbE237369BF29bcEDd50ad3Aa"        
        const CARD_CONTRACT_ADDRESS: string = "0x31F90F18Cd93F11fC347362e9f8850E90176d4e5"

        // const trys = { operator: ENGINE_ADMIN_WALLET_ADDRESS, approved: true,}
        // const result = await engine.erc1155.setApprovalForAll(CHAIN, CARD_CONTRACT_ADDRESS, "0xBb7E452C4e05BAC4a6c3FA29ef5b666F418ddcC7", trys);
        

      
        // const yes = { from: "0xBb7E452C4e05BAC4a6c3FA29ef5b666F418ddcC7", to: ENGINE_ADMIN_WALLET_ADDRESS, tokenId: "3", amount: "1" };
        // await engine.erc1155.transferFrom(CHAIN, CARD_CONTRACT_ADDRESS, ENGINE_ADMIN_WALLET_ADDRESS, yes)

        const result = await engine.erc1155.getOwned(ENGINE_ADMIN_WALLET_ADDRESS, CHAIN, CARD_CONTRACT_ADDRESS)
        console.log(result.result)

    } catch(error: any) {
      console.log(error)
      throw error
    }


};



// https://398b99804c8ec6898626c44191275be0.ipfscdn.io/ipfs/4d004ded4be87946e706e070ad3b0cf8


transferCard();
