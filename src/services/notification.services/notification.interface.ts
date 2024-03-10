/**
 * Represents the data structure for a notification related to user events.
 * 
 * @interface Notification
 * @property {string} username - The username of the user who performed the event.
 * @property {string} eventType - The type of event, e.g., 'picture_upload'.
 * @property {string} eventDescription - A brief description of the event.
 * @property {Date} timestamp - The timestamp when the event occurred.
 * @property {boolean} success - Indicates whether the event was successful.
 * @property {string} [errorMessage] - An optional error message if the event failed.
 * @property {string} [blockchainTransactionId] - The ID of the transaction on the blockchain.
 */
export interface Notification {
    username: string;
    eventType: "status" | "mintCard" |"registration" | "mintBundle";
    eventDescription: string;
    success: boolean;
    errorMessage?: string;
    blockchainTransactionId?: string;
    id?: string;
}
