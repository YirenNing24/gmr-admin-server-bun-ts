//** ELYSIA TYPE VALIDATION IMPORT
import { t } from "elysia";

/**
 * Schema for validating the body of a contract update request.
 * @constant {Object} updateContractSchema
 * @property {Object} headers - The headers object containing authorization.
 * @property {string} headers.authorization - The authorization token.
 * @property {Object} body - The body of the request.
 * @property {string} body.beatsAddress - The $BEATS contract address.
 * @property {string} body.gmrAddress - The $GMR contract address.
 * @property {string} body.cardAddress - The Card contract address.
 * @property {string} body.cardMarketplaceAddress - The Card Marketplace contract address.
 * @property {string} body.bundleAddress - The Bundle contract address.
 * @property {string} body.bundleMarketplaceAddress - The Bundle Marketplace contract address.
 * @property {string} body.cardItemUpgradeAddress - The Card Item Upgrade contract address.
 * @property {string} body.cardMarketplaceUpgradeItemAddress - The Card Marketplace Upgrade Item contract address.
 */
export const updateContractSchema = {
    headers: t.Object({ authorization: t.String() }),
    body: t.Object({ 
        beatsAddress: t.String(),
        gmrAddress: t.String(), 
        cardAddress: t.String(),
        cardMarketplaceAddress: t.String(),
        bundleAddress: t.String(),
        bundleMarketplaceAddress: t.String(),
        cardItemUpgradeAddress: t.String(),
        cardMarketplaceUpgradeItemAddress: t.String()
     })
};


/**
 * Schema for validating the authorization header with a bearer token.
 *
 * @type {Object}
 * @property {Object} headers - The headers of the request.
 * @property {string} headers.authorization - The bearer token for authorization.
 */
export const authorizationBearerSchema = { 
    headers: t.Object({ authorization: t.String() })
}