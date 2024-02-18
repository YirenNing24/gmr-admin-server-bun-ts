import Elysia from "elysia";// Replace "express" with your actual dependency if needed
import stocks from "./stocks.routes";
import auth from "./auth.routes";
import contracts from "./contracts.routes";
import search from "./search.routes";
import list from "./list.routes";
import mint from "./mint.routes";
import user from "./user.routes";


const routes = (app: Elysia): void => {

    app.use(auth)
    .use(mint)
    .use(stocks)
    .use(contracts)
    .use(list)
    .use(user)
    .use(search)

};

export default routes;
