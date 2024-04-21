import { ArbitrumSepolia } from "@thirdweb-dev/chains";




import { smartWallet } from "thirdweb/wallets";
import { SECRET_KEY } from "../config/constants";
 
const wallet = smartWallet({
  factoryAddress: "0x1234...",
  chain: {  id: 421614,
    name: 'Arbitrum Sepolia Rollup Testnet Explorer',
    rpc: `https://421614.rpc.thirdweb.com/${SECRET_KEY}`},
  gasless: true,
});


