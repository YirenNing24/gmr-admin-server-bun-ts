//** ELYSIA TYPE VALIDATION IMPORT
import { t } from "elysia";

//
/**
 * Schema for validating the body of a admin dashboard login request.
 *
 * @type {Object}
 * @property {Object} body - The body of the request.
 * @property {string} body.username - The username for login.
 * @property {string} body.password - The password for login.
 */
export const adminLoginSchema = {
    body: t.Object({ username: t.String(), password: t.String() })
}