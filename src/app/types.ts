export interface BountyCategory {
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
    category_id: number,
    end_date: string,
    prizes: BountyPrize[],

    category?: BountyCategory | null;
}