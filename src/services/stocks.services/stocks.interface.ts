interface CurrencyValuePerToken {
    name: string;
    symbol: string;
    decimals: number;
    value: any; // This should be typed according to the actual data structure
    displayValue: string;
}

interface Asset {
    name: string;
    description: string;
    image: string;
    id: string;
    uri: string;
    era: string;
    group: string;
    experience: string;
    healboost: string;
    artist: string;
    slot: string;
    level: string;
    awakenCount: string;
    boostCount: string;
    position: string;
    position2: string;
    scoreboost: string;
    skill: string;
    rarity: string;
    tier: string;
    breakthrough: boolean;
    stars: string;
    uploader: string;
}

export interface AllCardsListed {
    assetContractAddress: string;
    currencyContractAddress: string;
    pricePerToken: string;
    currencyValuePerToken: CurrencyValuePerToken;
    id: string;
    tokenId: string;
    quantity: string;
    startTimeInSeconds: number;
    asset: Asset;
    endTimeInSeconds: number;
    creatorAddress: string;
    isReservedListing: boolean;
    status: number;
}


export interface ListingData {
    currencyName: string;
    tokenId: string;
    quantity: number;
    pricePerToken: number;
    startTime: string;
    endTime: string;
}

export interface CardsListedValid {
    assetContractAddress: string;
    currencyContractAddress: string;
    pricePerToken: string;
    currencyValuePerToken: CurrencyValuePerToken;
    id: string;
    tokenId: string;
    quantity: string;
    startTimeInSeconds: number;
    asset: Asset;
    endTimeInSeconds: number;
    creatorAddress: string;
    isReservedListing: boolean;
    status: 4; //A Active
}


interface Metadata {
    name: string;
    description: string;
    image: string;
    id: string;
    uri: string;
    era: string;
    group: string;
    experience: string;
    healboost: string;
    artist: string;
    slot: string;
    level: string;
    awakenCount: string;
    boostCount: string;
    position: string;
    position2: string;
    scoreboost: string;
    skill: string;
    rarity: string;
    tier: string;
    breakthrough: boolean;
    stars: string;
    uploader: string;
}

export interface MintedCardMetaData {
    quantityOwned?: string
    owner: string;
    metadata: Metadata;
    type: string;
    supply: string;
}

