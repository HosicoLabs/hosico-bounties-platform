import { createClient } from "@/utils/supabase/server";

export async function GET(_req: Request) {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("bounties")
            .select(`
                *,
                category:categories(*)
            `)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Supabase error:", error);
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        return new Response(JSON.stringify({
            bounties: data
        }), { status: 200 });
    } catch (err) {
        console.error(err)
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}