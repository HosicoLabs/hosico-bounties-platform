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

export interface Submission {
    id: number;
    bounty_id: number;
    wallet_address: string;
    twitter_handle: string;
    tweet_link: string;
    extra_info?: string | null;
}

export interface Bounty {
    id: number;
    title: string,
    description: string,
    requirements: string,
    category: number,
    end_date: string,
    prizes: BountyPrize[],
    token_symbol?: string | null;
    token_address?: string | null;
    is_custom_token?: boolean | null;

    category?: BountyCategory | null;

    submissions?: Submission[];
    submissions_total?: number;

    winners?: {
        position: string,
        submission: Submission
    }[]
}