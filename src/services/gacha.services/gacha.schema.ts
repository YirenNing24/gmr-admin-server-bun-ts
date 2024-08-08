import { t } from "elysia";

/**
 * Schema for validating the card pack data.
 *
 * @type {Object}
 * @property {Object[]} body.cardPackData - Array of card name and weight pairs.
 * @property {string} body.packName - The name of the card pack.
 */
export const cardPackDataSchema = {
    body: t.Object({
        cardPackData: t.Array(t.Object({
            cardName: t.String(),
            weight: t.Number()
        })),
        packName: t.String()
    })
};
