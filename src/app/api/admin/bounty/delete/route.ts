import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { bountyId, walletAddress }: { bountyId: number; walletAddress: string } = await req.json();
    
    if (!walletAddress) {
      return new Response(JSON.stringify({ error: "Wallet address is required" }), { status: 400 });
    }

    const idNum = Number(bountyId);
    if (!Number.isFinite(idNum) || idNum <= 0) {
      return new Response(JSON.stringify({ error: "Invalid bounty id" }), { status: 400 });
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

    const { data, error } = await supabase
      .from("bounties")
      .delete()
      .eq("id", idNum)
      .select("*")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    if (!data) {
      return new Response(JSON.stringify({ error: "Bounty not found" }), { status: 404 });
    }

    return new Response(
      JSON.stringify({ message: "Bounty deleted successfully", bounty: data }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
