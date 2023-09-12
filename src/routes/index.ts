import Elysia from "elysia";// Replace "express" with your actual dependency if needed
import stocks from "./stocks.routes";
import auth from "./auth.routes";
import contracts from "./contracts.routes";
import search from "./search.routes";
// import list from "./list.routes";

const routes = (app: any) => {

    app.use(auth);
    app.use(stocks);

    app.use(contracts);
    app.use(search);
    // app.use(list)
}

export default routes;
