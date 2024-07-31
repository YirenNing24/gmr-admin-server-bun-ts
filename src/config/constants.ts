// Import required modules

import { ArbitrumSepolia } from "@thirdweb-dev/chains";
import { SmartWalletConfig } from "@thirdweb-dev/wallets";
// import { ConnectionOptions } from 'rethinkdb';

// Load config from .env file

// API Configuration
export const API_PREFIX: string = process.env.API_PREFIX || "/api";
export const APP_PORT: number = Number(process.env.APP_PORT) || 3000;
export const HOST: string = process.env.HOST || "localhost";
export const JWT_SECRET: string = process.env.JWT_SECRET || "a secret key";
export const SALT_ROUNDS: number = Number(process.env.SALT_ROUNDS) || 10;

// Neo4j Database Configuration
export const NEO4J_URI: string | undefined = process.env.NEO4J_URI;
export const NEO4J_USERNAME: string | undefined = process.env.NEO4J_USERNAME;
export const NEO4J_PASSWORD: string | undefined = process.env.NEO4J_PASSWORD;

// RethinkDB Configuration
export const RDB_DATABASE: string | undefined = process.env.RDB_DATABASE;
export const RDB_DB_ADMIN: string | undefined = process.env.RDB_DB_ADMIN;
export const RDB_PORT: number = Number(process.env.RDB_PORT) || 28015;

// KeyDB Configuration
export const KEYDB_PASSWORD: string | undefined = process.env.KEYDB_PASSWORD;
export const KEYDB_PORT: string | undefined = process.env.KEYDB_PORT;
export const KEYDB_HOST: string | undefined = process.env.KEYDB_HOST;

export const KDB: {
  host: string | undefined;
  port: string | number;
  password: string | undefined;
} = {
  host: process.env.KEYDB_HOST,
  port: process.env.KEYDB_PORT || 6379,
  password: process.env.KEYDB_PASSWORD,
};

// Thirdweb SDK Configuration
export const API_KEY: string | undefined = process.env.API_KEY;
export const API_ID: string | undefined = process.env.API_ID;
export const SECRET_KEY: string = process.env.SECRET_KEY || "";
export const PRIVATE_KEY: string = process.env.THIRDWEB_AUTH_PRIVATE_KEY || "";

// Chain and Wallet Factory Configuration
export const CHAIN: typeof ArbitrumSepolia = ArbitrumSepolia;
export const ARBITRUM_SEPOLIA: string = "421614";
export const FACTORIES: Record<number, string> = {
  [ArbitrumSepolia.chainId]: "0x514f1d6B8d22911eE84f97eDececE0479e38E1b6",
};

export const ENGINE_ACCESS_TOKEN: string = process.env.ENGINE_ACCESS_TOKEN || ""
// Contract Addresses
export const BEATS_TOKEN: string = "0xAA95DA3D6EbdAb099630b6d4Cf0fcb904a44C2ab";
export const GMR_TOKEN: string = "0x7dce27C81b7e112018FA6C2e27f8444b5D39688B";

export const CARD_ADDRESS: string =
  "0x64252262370FeDD38d6E85c6d3229E77887A00E6";
export const CARD_MARKETPLACE: string =
  "0xaa7f29eFc54ECE04dA4fe567666d90634e02F4c9";

export const PACK_ADDRESS: string =
  "0xa9D89AF49694Dc7BaC3B8154cc3B78592AaaACe7";
export const PACK_MARKETPLACE: string =
  "0x708562FEC05711B3fdf69D01c4CcbC0DfF2c15b0";

export const ADMIN_WALLET_ADDRESS: string =
  "0x0AfF10A2220aa27fBe83C676913aebeb3801DfB6";

const factoryAddress: string | undefined = FACTORIES[CHAIN.chainId];
export const SMART_WALLET_CONFIG: SmartWalletConfig = {
  chain: CHAIN,
  factoryAddress,
  gasless: true,
  secretKey: SECRET_KEY,
};
