import { createClient } from "@/utils/supabase/server";

export async function PUT(req: Request) {
    try {
        const { bountyId, winners, walletAddress }: { bountyId: number, winners: { [key: number]: string }, walletAddress: string } = await req.json();

        if (!walletAddress) {
            return new Response(JSON.stringify({ error: "Wallet address is required" }), { status: 400 });
        }

        const supabase = await createClient();

        const { data: adminWallet, error: adminError } = await supabase
            .from("admin-wallet-list")
            .select("wallet_address")
            .eq("wallet_address", walletAddress)
            .single();

        if (adminError || !adminWallet) {
            return new Response(JSON.stringify({ error: "Unauthorized - Admin access required" }), { status: 403 });
        }

        const { data: bounty, error: bountyError } = await supabase.from("bounties").select("winners").eq("id", bountyId).single();

        if (bounty && bounty.winners) {
            return new Response(JSON.stringify({ error: "The winners have already been selected!" }), { status: 400 });
        }

        if (bountyError) {
            console.error("Supabase error:", bountyError);
            return new Response(JSON.stringify({ error: bountyError.message }), { status: 500 });
        }

        const { data, error } = await supabase.from("bounties").update([
            {
                winners: JSON.stringify(winners),
            }
        ])
            .eq("id", bountyId)
            .select("*")
            .single();
        ;

        if (error) {
            console.error("Supabase error:", error);
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        return new Response(
            JSON.stringify({
                message: "Bounty updated successfully",
                bounty: data ? data : null,
            }),
            { status: 200 }
        );
    } catch (err) {
        console.error(err)
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}