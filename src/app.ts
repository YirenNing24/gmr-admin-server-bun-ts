//** ELYSIA IMPORTS
import Elysia from "elysia";
import { cors } from '@elysiajs/cors';

//** MEMGRAPH INIT
import { initDriver } from './db/memgraph';

//** CONFIG IMPORTS
import { NEO4J_PASSWORD, NEO4J_URI, NEO4J_USERNAME, KEYDB_PASSWORD, HOST, KEYDB_PORT } from './config/constants';

//** ROUTE IMPORT
import routes from "./routes";

// Initialize Elysia with options for serving (e.g., maxRequestBodySize)
const app: Elysia = new Elysia({
	serve: {
		maxRequestBodySize: 1024 * 1024 * 512,  // 256MB
    idleTimeout: 30
	}
});

app.use(cors({
  methods: ["GET", "POST", "HEAD", "PUT", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "content-Type",
    "authorization",
    "origin",
    "x-Requested-with",
    "accept",
  ],
  credentials: true,
  maxAge: 600
}));

//@ts-ignore
initDriver(NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD);

//@ts-ignore
app.use(routes);

export default app;
