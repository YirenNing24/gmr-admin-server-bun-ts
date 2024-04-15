/**
 * Represents details for transferring a card.
 *
 * @interface CardTransferDetails
 * @property {number[]} amount - The amount of cards to transfer.
 * @property {string} address - The address to transfer the cards to.
 * @property {string[]} tokenId - The token ID(s) of the cards to transfer.
 */
export interface CardTransferDetails {
    amount: number[];
    address: string;
    tokenId: string[];
}
