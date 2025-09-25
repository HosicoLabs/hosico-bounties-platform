import { createClient } from "@/utils/supabase/server";

type Ctx = { params: { id: string } };

export async function GET({ params }: Ctx) {
  try {
    const idNum = Number(params.id);
    if (!Number.isFinite(idNum) || idNum <= 0) {
      return new Response(JSON.stringify({ error: "Invalid id" }), { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("bounties")
      .select(`
        *,
        category:categories(*)
      `)
      .eq("id", idNum)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    if (!data) {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ bounty: data }), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
