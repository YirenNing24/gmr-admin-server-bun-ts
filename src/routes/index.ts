//** ROUTE IMPORTS
import stocks from "./stocks.routes";
import auth from "./auth.routes";
import contracts from "./contracts.routes";
import list from "./list.routes";
import mint from "./mint.routes";
import user from "./player.routes";
import nft from "./nft.routes";
import songImage from "./songimage.route";


const routes = (app: any): void => {
    [
        auth,
        mint,
        stocks,
        contracts,
        list,
        user,
        nft,
        songImage
    ].forEach(route => route(app))
};

export default routes;
