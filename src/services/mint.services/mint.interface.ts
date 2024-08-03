/**
 * Represents the data structure for creating a card.
 * 
 * @interface CreateCard
 * @property {string} description - The description of the card.
 * @property {string} era - The era of the card.
 * @property {string} healboost - The heal boost of the card.
 * @property {string} level - The level of the card.
 * @property {string} name - The name of the card.
 * @property {string} position - The position of the card.
 * @property {string} position2 - The secondary position of the card.
 * @property {string} rarity - The rarity of the card.
 * @property {string} scoreboost - The score boost of the card.
 * @property {string} skill - The skill of the card.
 * @property {string} tier - The tier of the card.
 * @property {string} breakthrough - The breakthrough of the card.
 * @property {string} stars - The stars of the card.
 * @property {string} experience - The experience of the card.
 * @property {number} supply - The supply of the card.
 * @property {number[]} imageByte - The byte array of the card image.
 */
export interface CreateCard {
        description: string;
        era: string;
        healboost: string;
        artist: string; 
        level: string;
        name: string;
        group: string;
        position: string;   
        position2: string;
        rarity: string;
        scoreboost: string;
        slot: string;
        awakenCount: string;
        boostCount: string;
        skill: string;
        tier: string;
        breakthrough: boolean;
        stars: string;
        experience: string
        supply: number;
        imageByte: string;
}

/**
 * Represents metadata with supply for creating a card.
 * 
 * @interface MetadataWithSupply
 * @property {number} supply - The supply of the card.
 * @property {Object} metadata - The metadata of the card.
 * @property {string} metadata.name - The name of the card.
 * @property {string} metadata.description - The description of the card.
 * @property {string} metadata.image - The image of the card.
 * @property {string} metadata.era - The era of the card.
 * @property {string} metadata.experience - The experience of the card.
 * @property {string} metadata.healboost - The heal boost of the card.
 * @property {string} metadata.level - The level of the card.
 * @property {string} metadata.position - The position of the card.
 * @property {string} metadata.position2 - The secondary position of the card.
 * @property {string} metadata.scoreboost - The score boost of the card.
 * @property {string} metadata.skill - The skill of the card.
 * @property {string} metadata.rarity - The rarity of the card.
 * @property {string} metadata.tier - The tier of the card.
 * @property {string} metadata.breakthrough - The breakthrough of the card.
 * @property {string} metadata.stars - The stars of the card.
 * @property {string} metadata.uploader - The uploader of the card.
 */
export interface MetadataWithSupply {
    supply: number;
    metadata: {
        name: string;
        description: string;
        image: string;
        era: string;
        experience: string;
        healboost: string;
        level: string;
        position: string;
        position2: string;
        scoreboost: string;
        skill: string;
        rarity: string;
        tier: string;
        breakthrough: string;
        stars: string;
        uploader: string;
    };
}

/**
 * Represents data for the card box.
 * 
 * @interface CardBoxData
 * @property {string} contents - The contents of the card box.
 * @property {string} description - The description of the card box.
 * @property {string} name - The name of the card box.
 * @property {string} openStartTime - The start time for opening the card box.
 * @property {string} quantity - The quantity of the card box.
 * @property {string} quantityPerReward - The quantity per reward of the card box.
 * @property {string} rewardsPerPack - The rewards per pack of the card box.
 * @property {string} token - The token associated with the card box.
 * @property {string} totalRewards - The total rewards of the card box.
 * @property {string} type - The type of the card box.
 */
export interface CardBundleData {
    contents: string;
    description: string;
    name: string;
    openStartTime: string;
    quantity: string;
    quantityPerReward: string;
    rewardsPerPack: string;
    token: string;
    totalRewards: string;
    type: string;
}

/**
 * Represents data for a card field.
 *
 * @interface CardField
 * @property {string} name - The name of the card field.
 * @property {string} tokenId - The token ID of the card field.
 * @property {string} quantityPerReward - The quantity per reward of the card field.
 * @property {string} totalRewards - The total rewards of the card field.
 * @property {string} assetContract - The asset contract of the card field.
 */
export interface CardField {
    name: string;
    tokenId: string;
    quantityPerReward: string;
    totalRewards: string;
    assetContract: string;
}



export interface SuccessMessage {
    success: string
}

/**
 * Represents data for a card.
 * 
 * @interface CardData
 * @property {string} name - The name of the card.
 * @property {string} description - The description of the card.
 * @property {string} group - The group to which the card belongs.
 * @property {string} era - The era of the card.
 * @property {string} scoreboost - The score boost of the card.
 * @property {string} healboost - The heal boost of the card.
 * @property {string} skill - The skill of the card.
 * @property {string} stars - The stars rating of the card.
 * @property {string} slot - The slot of the card.
 * @property {string} boostCount - The boost count of the card.
 * @property {string} awakenCount - The awaken count of the card.
 * @property {boolean} breakthrough - Indicates if the card has undergone a breakthrough.
 * @property {string} artist - The artist of the card.
 * @property {string} position - The position of the card.
 * @property {string} position2 - The secondary position of the card.
 * @property {string} rarity - The rarity of the card.
 * @property {string} level - The level of the card.
 * @property {string} experience - The experience of the card.
 * @property {string} owner - The owner of the card.
 * @property {string} imageByte - The image data of the card.
 * @property {string} id - The ID of the card.
 * @property {string} cardAddress - The address of the card.
 * @property {string} uploader - The uploader of the card.
 * @property {string} uri - The URI of the card.
 * @property {string} supply - The supply of the card.
 * @property {string} tier - The tier of the card.
 * @property {string} tokenId - The token ID of the card.
 * @property {number} quantity - The quantity of the card.
 * @property {string} quantityOwned - The quantity owned of the card.
 * @property {string} startTime - The start time of the card availability.
 * @property {string} endTime - The end time of the card availability.
 * @property {string} lister - The lister of the card.
 * @property {boolean} sold - Indicates if the card has been sold.
 * @property {number} pricePerToken - The price per token of the card.
 * @property {string} currencyName - The currency name of the card.
 */
export interface CardData {
    name: string;
    description: string;
    group: string
    era: string;
    scoreboost: string;
    healboost: string;
    skill: string;
    stars: string;
    slot: string;
    tier: string;
    
    boostCount: string;
    awakenCount: string;
    breakthrough: boolean;
    artist: string; 
    position: string;   
    position2: string;
    rarity: string;
    level: string;
    experience: string;

    imageByte: string;
    uri: string;

    owner: string;
    tokenId: string
    id: string;
    
    cardAddress: string;
    uploader: string;

    supply: string;

    quantity: 1
    listingId?: number;
    quantityOwned: string
    startTime?: string;
    endTime?: string;
    lister?: string;
    pricePerToken?: number
    currencyName?: string
    packed?: boolean
  }

/**
 * Represents data for an upgrade item.
 * @interface UpgradeItemData
 * @property {string} type - The type of the upgrade item. Currently only supports "general".
 * @property {string} tier - The tier of the upgrade item.
 * @property {number} quantity - The quantity of the upgrade item.
 * @property {boolean} minted - Indicates whether the item has been minted.
 * @property {number} experience - The experience points provided by the upgrade item.
 * @property {string} [uri] - The URI of the upgrade item.
 * @property {string} imageByte - The image byte data of the upgrade item.
 * @properry {string} 
 */
export interface UpgradeItemData {
    itemType: string;
    tier: string;
    quantity: number;
    experience: number;
    minted: boolean;
    uri?: string;
    imageByte: string;
    id?: string;
}

/**
 * Represents metadata for a minted upgrade item.
 * @interface MintedUpgradeItemMetadata
 * @property {string} [quantityOwned] - The quantity of the upgrade item owned by the owner (optional).
 * @property {string} owner - The owner of the upgrade item.
 * @property {UpgradeItemData} metadata - The metadata of the upgrade item.
 * @property {string} type - The type of the upgrade item.
 * @property {string} supply - The supply of the upgrade item.
 */
export interface MintedUpgradeItemMetadata {
    quantityOwned?: string
    owner: string;
    metadata: UpgradeItemData;
    type: string;
    supply: string;
}


/**
 * Represents data about a card pack.
 * @interface
 * @property {string} contents - The contents of the card box.
 * @property {string} description - The description of the card box.
 * @property {string} name - The name of the card box.
 * @property {string} openStartTime - The start time for opening the card box.
 * @property {string} quantity - The quantity of the card box.
 * @property {string} quantityPerReward - The quantity per reward associated with the card box.
 * @property {string} rewardsPerPack - The rewards per pack of the card box.
 * @property {string} token - The token associated with the card box.
 * @property {string} totalRewards - The total number of rewards associated with the card box.
 * @property {string} type - The type of the card box.
 */
export interface CardPackData {
    

    name: string;
    description: string;
    contents: string;
    openStartTime: string;
    type: string;
    tokenField: TokenField
    cardField: CardField[];
    rewardsPerPack: string;
    imageByte: string;
}

export interface TokenField {
    token: string;
    quantity: string;
    quantityPerReward: string;
    totalRewards: string;

}


/**
 * Represents the mandatory params of a card
 * @interface
 * @property {string} name - The name of the card.
 * @property {string} tokenId - The token ID associated with the card field.
 * @property {string} quantityPerReward - The quantity of the field per reward.
 * @property {string} totalRewards - The total number of rewards associated with the card field.
 * @property {string} assetContract - The asset contract associated with the card field.
 */
export interface CardField {
    name: string;
    tokenId: string;
    quantityPerReward: string;
    totalRewards: string;
    assetContract: string;
}