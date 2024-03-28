//** THIRDWEB IMPORTS */
import { Edition, NFT, Pack, ThirdwebSDK, TransactionResultWithId } from "@thirdweb-dev/sdk";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { SECRET_KEY, PRIVATE_KEY } from "../config/constants";




const getContents = async () => {
    const sdk: ThirdwebSDK = ThirdwebSDK.fromPrivateKey(PRIVATE_KEY, "mumbai", {
        secretKey: SECRET_KEY,
    });

    const contract = await sdk.getContract("0xBDcD6300617AF9FbcC34Cf7f55ce36c842A49f79", "pack");

    const packId = 2;
    const contents = await contract.getPackContents(packId);
    console.log(contents.erc20Rewards);
    console.log(contents.erc721Rewards);
    console.log(contents.erc1155Rewards);
}

getContents()