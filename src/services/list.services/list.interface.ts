export interface ListingMetadata {
    id: string;
    currencyName: string;
    assetContractAddress: string;
    tokenId: string;
    currencyContractAddress: string;
    pricePerToken: number;
    startTimestamp: Date;
    endTimestamp: Date;
    isReservedListing: boolean;
    lister: string
    cardMarketplaceAddress: string;
}


export interface Listing {
    metadata: ListingMetadata;
}

export interface ListingData {
    currencyName: string;
    tokenId: string;
    quantity: number;
    pricePerToken: number;
    startTime: string;
    endTime: string;
}

export interface ListingDataSave {
    currencyName: string;
    assetContractAddress: string;
    tokenId: string;
    quantity: number;
    currencyContractAddress: string;
    pricePerToken: number;
    startDate: Date;
    endDate: Date;
    isReservedListing: boolean;
    lister?: string
    id?: string
}

export interface Metadata {
    boostCount: string;
    breakthrough: string;
    cardAddress: string;
    description: string;
    era: string;
    experience: string;
    experienceRequired: string;
    group: string;
    healBoost: string;
    id: string;
    image: string;
    itemType: string;
    level: string;
    name: string;
    position: string;
    position2: string;
    rarity: string;
    scoreBoost: string;
    skill: string;
    slot: string;
    stars: string;
    supply: string;
    tier: string;
    uri: string;
}


export interface List {
    price: number;
    assetContractAddress: string;
    tokenId: string;
    quantity: number;
    currencyContractAddress: string;
    pricePerToken: number;
    startTimestamp: Date;
    endTimestamp: Date;
    isReservedListing: boolean;
    id: string;
    metadata: Metadata;
    owner: string;
    supply: string;
    type: string;
    lister: string;

}

// beatsAddress: t.String(),
// gmrAddress: t.String(), 
// cardAddress: t.String(),
// cardMarketplaceAddress: t.String(),
// bundleAddress: t.String(),
// bundleMarketplaceAddress: t.String(),
// cardItemUpgradeAddress: t.String(),
// cardMarketplaceUpgradeItemAddress: t.String()
export interface CardListingContracts { 
    marketplaceAddress: string;
    cardAssetAddress: string;
    beatsTokenAddress: string;
    gmrTokenAddress: string;
    cardMarketplaceUpgradeItemAddress: string

}