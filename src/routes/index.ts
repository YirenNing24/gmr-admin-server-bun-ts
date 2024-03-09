import Elysia from "elysia";// Replace "express" with your actual dependency if needed
import stocks from "./stocks.routes";
import auth from "./auth.routes";
import contracts from "./contracts.routes";
import search from "./search.routes";
import list from "./list.routes";
import mint from "./mint.routes";
import user from "./user.routes";
import notifications from "./websocket.routes";

const routes = (app: Elysia): void => {
    app.use(auth)
    app.use(mint)
    app.use(stocks)
    app.use(contracts)
    app.use(list)
    app.use(user)
    app.use(search)
    app.use(notifications)
};

export default routes;
