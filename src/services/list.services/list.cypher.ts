/**
 * Cypher query string for removing a listing of a card from a CardStore.
 * This query deletes the LISTED relationship between a card and a CardStore,
 * indicating that the card is no longer listed for sale.
 * @param {string} uri - The URI of the card whose listing is being removed.
 * @returns {string} - Cypher query string
 */
export const removeListingCypher: string = `
    MATCH (c:Card {uri: $uri})-[l:LISTED]->(cs:CardStore)
    WHERE NOT EXISTS( (c)-[:SOLD]-(cs) )
    DELETE l;`;

/**
 * Cypher query schema for saving a card listing to the database.
 * This query creates a 'LISTED' relationship between a card node and a card store node,
 * and sets various properties of the card node.
 * @param {string} tokenId - The ID of the card node.
 * @param {object} listingDataSave - The data to be saved to the card node.
 * @param {string} lister - The user who listed the card.
 * @param {string} listingId - The ID of the listing.
 * @returns {string} The Cypher query.
 */
export const saveListToDBCypher: string = `
    MATCH (c:Card {id: $tokenId})
    MATCH (cs:CardStore)
    CREATE (c)-[:LISTED]->(cs)
    SET c += $listingDataSave
    SET c.lister = $lister
    SET c.listingId = $listingId`;



export const saveCardUpgradeToDBCypher: string = `
    MATCH (c:CardUpgrade {id: $tokenId})
    MATCH (cs:CardUpgradeStore)
    CREATE (c)-[:LISTED]->(cs)
    SET c += $listingDataSave
    SET c.lister = $lister
    SET c.listingId = $listingId`;



export const savePackListToDBCypher: string = `
    MATCH (p:Pack {id: $tokenId})
    MATCH (ps:PackStore)
    CREATE (p)-[:LISTED]->(ps)
    SET p += $listingDataSave
    SET p.lister = $lister
    SET p.listingId = $listingId`;