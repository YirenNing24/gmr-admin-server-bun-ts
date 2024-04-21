/**
 * Cypher query string for removing a listing of a card from a CardStore.
 * This query deletes the LISTED relationship between a card and a CardStore,
 * indicating that the card is no longer listed for sale.
 * @param {string} uri - The URI of the card whose listing is being removed.
 * @returns {string} - Cypher query string
 */
export const removeListingCypher: string = `
    MATCH (c:Card {uri: $uri})-[l:LISTED]->(cs:CardStore)
    WHERE c.sold IS NULL
    DELETE l;`;
