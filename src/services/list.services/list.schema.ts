//** ELYSIA TYPE VALIDATION IMPORT
import { t } from "elysia";

/**
 * Schema for validating the body of a card listing for sale request.
 *
 * @type {Object}
 * @property {Object} headers - The headers of the request.
 * @property {string} headers.authorization - The authorization token.
 * @property {Object} body - The body of the request.
 * @property {string} body.currencyName - The name of the currency.
 * @property {string} body.tokenId - The token ID.
 * @property {number} body.quantity - The quantity.
 * @property {string} body.price - The price.
 * @property {string} body.startDate - The start date.
 * @property {string} body.endDate - The end date.
 */
export const listCardSchema = {
    headers: t.Object({ authorization: t.String() }),
    body: t.Object({ 
        currencyName: t.String(),
        tokenId: t.String(), 
        quantity: t.Number(),
        pricePerToken: t.Number(),
        startTime: t.String(),
        endTime: t.String()
    })
};
