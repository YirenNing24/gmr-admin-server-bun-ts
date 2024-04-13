//** ELYSIA TYPE VALIDATION IMPORT
import { t } from "elysia";


/**
 * Schema for validating the authorization header with a bearer token.
 *
 * @type {Object}
 * @property {Object} headers - The headers of the request.
 * @property {string} headers.authorization.password - The password of the requester.
 */
export const populateCardListSchema = { 
    headers: t.Object({ authorization: t.String() }),
    body: t.Object({ password: t.String() })
}