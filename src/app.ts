import Elysia from "elysia";
import { cookie } from '@elysiajs/cookie'
import { cors } from '@elysiajs/cors'
import cryptoRandomString from "crypto-random-string";

import { initDriver } from './db/memgraph';
import { JWT_SECRET, NEO4J_PASSWORD, NEO4J_URI, NEO4J_USERNAME, KEYDB_PASSWORD, HOST, KEYDB_PORT } from './config/constants';
import routes from "./routes";
import { MeiliSearch } from 'meilisearch'

const app: Elysia = new Elysia()


app.use(cookie({
    secret: cryptoRandomString({ length: 32, type: "base64" }),
  }))

app.use(cors({
  origin: ['http://localhost:8888'],
  methods: ["GET", "POST", "HEAD", "PUT", "OPTIONS"],
  allowedHeaders: [
    "content-Type",
    "authorization",
    "origin",
    "x-Requested-with",
    "accept",
  ],
  credentials: true,
  maxAge: 600,

    
  }))








//@ts-ignore
initDriver(NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD);

//@ts-ignore
app.use(routes)








export default app