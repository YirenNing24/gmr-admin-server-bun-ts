
/**
 * Cypher query to retrieve all cards in stock that are not listed and not transferred.
 */
export const cardStockAllCypher: string = `
    MATCH (c:Card) 
    WHERE NOT EXISTS((c)-[:LISTED]->())
    AND c.transferred IS NULL 
    RETURN c`;

/**
 * Cypher query to retrieve cards that have a LISTED relationship with a CardStore.
 */
export const cardListedCypher: string = `
    MATCH (c:Card)-[:LISTED]->(:CardStore)
    RETURN c`;

/**
 * Cypher query to retrieve cards that have been sold to a user.
 */
export const cardSoldCypher: string = `
    MATCH (c:Card)-[:SOLD]->(u:User)
    RETURN c`;

/**
 * Cypher query to save card data and associate it with a lister and listing ID.
 * @param tokenId The ID of the card to save.
 * @param parameters Additional parameters to set for the card.
 * @param lister The user who listed the card.
 * @param listingId The ID of the listing.
 */
export const saveCardValidCypher: string = `
    MATCH (c:Card {id: $tokenId})
    SET c += $parameters
    SET c.lister = $lister
    SET c.listingId = $listingId`;

/**
 * Cypher query to associate a card with a user who uploaded it.
 * @param id The ID of the card.
 * @param uploader The username of the user who uploaded the card.
 */
export const saveCardValidCypherMerge: string = `
    MATCH (p:Card {id: $id})
    MATCH (u:User {username: $uploader})
    MERGE (p)-[:UPLOADED]->(u)`;

export const saveCardListedCypher: string = `
    MERGE (c:Card {id: $id})
    ON CREATE SET c += $parameters`

