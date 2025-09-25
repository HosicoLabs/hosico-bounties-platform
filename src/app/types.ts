export interface BountryCategory {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface BountyPrize {
    place: string;
    prize: number;
}

export interface Bounty {
    id: number;
    title: string,
    description: string,
    requirements: string,
    category: BountryCategory,
    endDate: string,
    prizes: BountyPrize[],
}