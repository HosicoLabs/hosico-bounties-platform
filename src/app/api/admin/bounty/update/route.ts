import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { bounty, walletAddress } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    const { data: adminWallet, error: adminError } = await supabase
      .from("admin-wallet-list")
      .select("wallet_address")
      .eq("wallet_address", walletAddress)
      .single();

    if (adminError || !adminWallet) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    if (!bounty?.id) {
      return NextResponse.json(
        { error: "Bounty ID is required" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (bounty.title) updateData.title = bounty.title;
    if (bounty.description) updateData.description = bounty.description;
    if (bounty.requirements) updateData.requirements = bounty.requirements;
    if (bounty.category) updateData.category = bounty.category;
    if (bounty.end_date) updateData.end_date = bounty.end_date;
    if (bounty.prizes) updateData.prizes = bounty.prizes;
    if (bounty.token_symbol !== undefined) updateData.token_symbol = bounty.token_symbol;
    if (bounty.token_address !== undefined) updateData.token_address = bounty.token_address;
    if (bounty.is_custom_token !== undefined) updateData.is_custom_token = bounty.is_custom_token;

    updateData.updated_at = new Date().toISOString();

    const { data: updatedBounty, error: updateError } = await supabase
      .from("bounties")
      .update(updateData)
      .eq("id", bounty.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating bounty:", updateError);
      return NextResponse.json(
        { error: "Failed to update bounty", details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, bounty: updatedBounty },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating bounty:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
