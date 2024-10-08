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
        name: t.String(),
        description: t.String(),
        era: t.String(), 
        group: t.String(),
        artist: t.String(),
        healboost: t.String(),
        slot: t.String(),
        level: t.String(),
        awakenCount: t.String(),
        boostCount: t.String(),
        position: t.String(),
        position2: t.String(),  
        rarity: t.String(),
        scoreboost: t.String(),
        skill: t.String(),
        tier: t.String(),
        breakthrough: t.Boolean(),
        stars: t.String(),
        experience: t.String(),
        supply: t.Number(),
        imageByte: t.String()
    })
};




/**
 * Schema for creating an upgrade item.
 * @constant {Object} createUpgradeItemSchema
 * @property {Object} headers - The headers object containing authorization.
 * @property {string} headers.authorization - The authorization token.
 * @property {Object} body - The body object containing item details.
 * @property {string} body.type - The type of the upgrade item.
 * @property {string} body.tier - The tier of the upgrade item.
 * @property {string} body.quantity - The quantity of the upgrade item.
 * @property {number} body.experience - The experience points provided by the upgrade item.
 * @property {boolean} body.minted - Indicates whether the item has been minted.
 */
export const createUpgradeItemSchema ={
    headers: t.Object({ authorization: t.String() }),
    body: t.Object({ 
        itemType: t.String(),
        tier: t.String(),
        quantity: t.Number(),
        experience: t.Number(),
        minted: t.Boolean(),
        imageByte: t.String(),
  
    })

}


export const createPackSchema ={
    headers: t.Object({ authorization: t.String() }),
    body: t.Object({ 
        imageByte: t.String(),
        name: t.String(),
        description: t.String(),
        supply: t.Number()
    })

}