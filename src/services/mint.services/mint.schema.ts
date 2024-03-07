//** ELYSIA TYPE VALIDATION IMPORT
import { t } from "elysia";

/**
 * Schema for validating the body of a contract update request.
 * 
 * @typedef {Object} CreateCardSchema
 * @property {Object} headers - The headers of the request.
 * @property {string} headers.authorization - The authorization token.
 * @property {Object} body - The body of the request.
 * @property {string} body.description - The description of the card.
 * @property {string} body.era - The era of the card.
 * @property {string} body.healboost - The heal boost of the card.
 * @property {string} body.level - The level of the card.
 * @property {string} body.name - The name of the card.
 * @property {string} body.position - The position of the card.
 * @property {string} body.position2 - The secondary position of the card.
 * @property {string} body.rarity - The rarity of the card.
 * @property {string} body.scoreboost - The score boost of the card.
 * @property {string} body.skill - The skill of the card.
 * @property {string} body.tier - The tier of the card.
 * @property {string} body.breakthrough - The breakthrough of the card.
 * @property {string} body.stars - The stars of the card.
 * @property {number} body.supply - The supply of the card.
 * @property {Array<number>} body.imageByte - The byte array of the card image.
 */
export const createCardSchema = {
    headers: t.Object({ authorization: t.String() }),
    body: t.Object({ 
        description: t.String(),
        era: t.String(), 
        healboost: t.String(),
        level: t.String(),
        name: t.String(),
        position: t.String(),
        position2: t.String(),
        rarity: t.String(),
        scoreboost: t.String(),
        skill: t.String(),
        tier: t.String(),
        breakthrough: t.String(),
        experience: t.String(),
        stars: t.String(),
        supply: t.Number(),
        imageByte: t.String()
    })
};

interface Meta {
    description: string;
    era: string;
    experience: string;
    healboost: string;
    level: string;
    name: string;
    position: string;
    position2: string;
    rarity: string;
    scoreboost: string;
    skill: string;
    tier: string;
    breakthrough: string
    stars: string
  }