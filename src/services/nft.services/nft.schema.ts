//** ELYSIA TYPE VALIDATION IMPORT
import { t } from "elysia";



/**
 * Schema for card transfer request.
 *
 * @const {Object} cardTransferSchema
 * @property {Object} headers - The headers object containing authorization.
 * @property {string} headers.authorization - The authorization token.
 * @property {Object} body - The body object containing transfer details.
 * @property {number[]} body.amount - The amount of cards to transfer.
 * @property {string} body.address - The address to transfer the cards to.
 * @property {number[]} body.tokenId - The token ID(s) of the cards to transfer.
 */
export const cardTransferSchema = {
    headers: t.Object({ authorization: t.String() }),
    body: t.Object({
        amounts: t.Array(t.Number()),
        toAddress: t.String(),
        tokenIds: t.Array(t.String())
    })
};
