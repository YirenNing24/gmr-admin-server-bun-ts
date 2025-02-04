import { createThirdwebClient } from "thirdweb";
import { BEATS_TOKEN, CARD_MARKETPLACE, CHAIN, ENGINE_ADMIN_WALLET_ADDRESS, SECRET_KEY } from "./src/config/constants";
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


const buyCard = async () => {
  try {
      const BUYER_WALLET_ADDRESS_NASHAR6: string = "0xe4fC08F3876a43Ed06d2500BF929bFdA47E0A46B"        
      const MARKETPLACE_ADDRESS: string = "0x033d72A6fACD989396D64D9704ED57F7cABF2Ebc"
      const GBEATS_ADDRESS: string = "0xfD842Fa70bC97EA64D81F61b7930cA1983d576f5"



        const requestBody = { listingId: "6", quantity: "1", buyer: BUYER_WALLET_ADDRESS_NASHAR6 };
        await engine.erc20.setAllowance(CHAIN, GBEATS_ADDRESS, BUYER_WALLET_ADDRESS_NASHAR6, {spenderAddress: MARKETPLACE_ADDRESS, amount: '20000'});
        const tx = await engine.marketplaceDirectListings.buyFromListing(CHAIN, MARKETPLACE_ADDRESS, BUYER_WALLET_ADDRESS_NASHAR6, requestBody);

        const status = await engine.transaction.status(tx.result.queueId)

  } catch(error: any) {
    console.log(error)
    throw error
  }

}
  const checkBalance = async () => {
    try {
        const BUYER_WALLET_ADDRESS_NASHAR6: string = "0xe4fC08F3876a43Ed06d2500BF929bFdA47E0A46B"        
        const MARKETPLACE_ADDRESS: string = "0x033d72A6fACD989396D64D9704ED57F7cABF2Ebc"
        const GBEATS_ADDRESS: string = "0xfD842Fa70bC97EA64D81F61b7930cA1983d576f5"


        const balance = await engine.erc20.balanceOf("0xe4fC08F3876a43Ed06d2500BF929bFdA47E0A46B", CHAIN, GBEATS_ADDRESS);
        console.log(balance)
        
    } catch(error: any) {
      console.log(error)
      throw error
    }


};



export const getWalletBalance = async (walletAddress: string) => {
	try {
		// Token constants
		const BEATS_TOKEN = "0xfD842Fa70bC97EA64D81F61b7930cA1983d576f5";
		const GMR_TOKEN = "0xYourGmrTokenAddress"; // Replace with the actual GMR token address

		// Fetch balances
		const [arbitrumToken, beatsToken] = await Promise.all([
			engine.backendWallet.getBalance(CHAIN, walletAddress),
			engine.erc20.balanceOf(walletAddress, CHAIN, BEATS_TOKEN),
		]);

		// Return wallet data
		return {
			smartWalletAddress: walletAddress,
			beatsBalance: beatsToken.result.displayValue,
			gmrBalance: "0",
			nativeBalance: arbitrumToken.result.displayValue,
		};
	} catch (error: any) {
		console.error("Error fetching wallet balance:", error);
		throw error;
	}
};

// Example usage
// (async () => {
// 	try {
// 		const balance = await getWalletBalance("0xF5B59677A2A6D72077897833Ec21630C37E66b52");
// 		console.log(balance);
// 	} catch (error) {
// 		console.error("Error in balance check:", error);
// 	}
// })();



const createBackendandAccountFactory = async () => {
  try {
      const backAddress = await engine.backendWallet.create({ label: 'test', type: 'local' })
      const address = await engine.accountFactory.createAccount(CHAIN, "0x09c9C21E33DacCE2Fdd20911388Ee6Ddb7f784c9", ENGINE_ADMIN_WALLET_ADDRESS, {adminAddress: backAddress.result.walletAddress});



    console.log(address.result.deployedAddress)
  } catch(error: any) {
    console.log(error)
    throw error
    
  }
}


export const cardPurchase = async (listingId = 18, buyerWalletAddress = "0xAC4F8ef1748051E4cD91fc0db656788d9f7d117d") => {
	try {
		// Constructing the request body
		const requestBody = {
			listingId: listingId.toString(), // Convert listingId to string
			quantity: "1", // Default quantity for ERC721 tokens
			buyer: buyerWalletAddress // The buyer's wallet address
		};

		// Set allowance for the transaction


    await engine.erc20.setAllowance(CHAIN, "0xfD842Fa70bC97EA64D81F61b7930cA1983d576f5", "0xaEdCad39Efcbfb6b1B7e36D4316a948F77B1CaE4", {
      spenderAddress: "0xaEdCad39Efcbfb6b1B7e36D4316a948F77B1CaE4",
      amount: "1000"
   }, false, "", buyerWalletAddress, "0x09c9C21E33DacCE2Fdd20911388Ee6Ddb7f784c9");

    
		 await engine.erc20.setAllowance(CHAIN, "0xfD842Fa70bC97EA64D81F61b7930cA1983d576f5", "0xaEdCad39Efcbfb6b1B7e36D4316a948F77B1CaE4", {
		 	spenderAddress: "0x033d72A6fACD989396D64D9704ED57F7cABF2Ebc",
		 	amount: "1000"
		}, false, "", buyerWalletAddress, "0x09c9C21E33DacCE2Fdd20911388Ee6Ddb7f784c9");

		// Execute the card purchase
		 const transaction = (await engine.marketplaceDirectListings.buyFromListing(
       CHAIN, "0x033d72A6fACD989396D64D9704ED57F7cABF2Ebc", "0xaEdCad39Efcbfb6b1B7e36D4316a948F77B1CaE4", requestBody,
       false,
       "",
       buyerWalletAddress, "0x09c9C21E33DacCE2Fdd20911388Ee6Ddb7f784c9"
		 )).result;

		// Check transaction status
		// let status = await engine.transaction.status(transaction.queueId);

		// // Wait for the transaction to be mined
		// while (status.result.minedAt === null) {
		// 	await new Promise((resolve) => setTimeout(resolve, 500));
		// 	status = await engine.transaction.status(transaction.queueId);
		// }
	} catch (error: any) {
		console.error("Error during card purchase: ", error);
		throw new Error("Failed to complete the card purchase.");
	}
};


cardPurchase();