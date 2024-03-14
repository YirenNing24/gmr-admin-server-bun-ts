//**  TYPE INTERFACE
/**
 * Represents a user in the system.
 *
 * @interface User
 * @property {string} userName - The username of the user.
 * @property {string} password - The password of the user.
 */
export interface User {
  userName: string
  password: string
}

/**
 * Represents the token scheme containing both a refresh token and an access token.
 *
 * @interface TokenScheme
 * @property {string} refreshToken - The refresh token used for obtaining a new access token.
 * @property {string} accessToken - The access token used for authentication and authorization.
 * @property {string} username - The username associated with the tokens.
 */
export interface TokenScheme {
  refreshToken: string
  accessToken: string
  userName: string
}

/**
 * Represents the structure of access and refresh tokens.
 *
 * @interface AccessRefresh
 * @property {string} accessToken - The access token used for authentication and authorization.
 * @property {string} userName - The username associated with the tokens.
 */
export interface AccessRefresh {
  accessToken: string;
  userName: string;
}

/**
 * Represents the player's level information.
 *
 * @interface PlayerLevel
 * @property {string} kind - The type of player level.
 * @property {number} level - The player's current level.
 * @property {string} minExperiencePoints - The minimum experience points for the current level.
 * @property {string} maxExperiencePoints - The maximum experience points for the current level.
 */
interface PlayerLevel {
  kind: string;
  level: number;
  minExperiencePoints: string;
  maxExperiencePoints: string;
}

/**
 * Represents the profile settings of a player.
 *
 * @interface ProfileSettings
 * @property {string} kind - The type of profile settings.
 * @property {boolean} profileVisible - Indicates if the player's profile is visible.
 * @property {string} friendsListVisibility - The visibility of the friends list.
 */
interface ProfileSettings {
  kind: string;
  profileVisible: boolean;
  friendsListVisibility: string;
}

/**
 * Represents information about a player's experience.
 *
 * @interface PlayerExperienceInfo
 * @property {string} kind - The type of player experience information.
 * @property {string} currentExperiencePoints - The current experience points of the player.
 * @property {PlayerLevel} currentLevel - The player's current level information.
 * @property {PlayerLevel} nextLevel - The player's next level information.
 */
interface PlayerExperienceInfo {
  kind: string;
  currentExperiencePoints: string;
  currentLevel: PlayerLevel;
  nextLevel: PlayerLevel;
}

/**
 * Represents information about a player.
 *
 * @interface PlayerInfo
 * @property {string} kind - The type of player information.
 * @property {string} playerId - The unique identifier of the player.
 * @property {string} displayName - The display name of the player.
 * @property {string} avatarImageUrl - The URL of the player's avatar image.
 * @property {string} bannerUrlPortrait - The URL of the player's portrait banner.
 * @property {string} bannerUrlLandscape - The URL of the player's landscape banner.
 * @property {ProfileSettings} profileSettings - The player's profile settings.
 * @property {PlayerExperienceInfo} experienceInfo - The player's experience information.
 * @property {string} title - The title associated with the player.
 */
export interface PlayerInfo {
  kind: string;
  playerId: string;
  displayName: string;
  avatarImageUrl: string;
  bannerUrlPortrait: string;
  bannerUrlLandscape: string;
  profileSettings: ProfileSettings;
  experienceInfo: PlayerExperienceInfo;
  title: string;
}

/**
 * Represents the result of a Google registration check.
 *
 * @interface GoogleToken
 * @property {string} serverToken - A google token generated from the client side to be exchanged for a server-token 
 */
export interface GoogleToken { 
  serverToken: string 
}
