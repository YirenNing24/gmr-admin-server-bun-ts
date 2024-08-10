



export interface CardPackData {
    cardPackData: CardNameWeight[];
    packName: string;

}


export interface MintedCardPackData {
    cardPackData: CardNameWeight[];
    packName: string;

}

export interface CardNameWeight {
    cardName: string;
    weight: number;
}