"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdmin } from "@/components/admin/use-admin";
import { useSolana } from "@/components/solana/use-solana";
import { Bounty, Submission } from "@/app/types";
import { BountyHeader } from "@/components/bounty-detail/bounty-header";
import { BountyOverviewCard } from "@/components/bounty-detail/bounty-overview-card";
import { DetailsTabContent } from "@/components/bounty-detail/details-tab-content";
import { SubmitTabContent } from "@/components/bounty-detail/submit-tab-content";
import { SubmissionsTabContent } from "@/components/bounty-detail/submissions-tab-content";
import { SelectWinnersTabContent } from "@/components/bounty-detail/select-winners-tab-content";
import { EditTabContent } from "@/components/bounty-detail/edit-tab-content";

export default function BountyDetailPage() {
    const { id } = useParams<{ id: string }>();

    const [bounty, setBounty] = useState<Bounty | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    const { connected, wallet } = useSolana()
    const { isAdmin } = useAdmin();

    const [submission, setSubmission] = useState<Submission | null>(null);

    const fetchBounty = useCallback(async () => {
        let mounted = true;
        setLoading(true);
        setErr(null);

        try {
            const res = await fetch(`/api/bounties/${id}`, { cache: "no-store" });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || "Failed to load bounty");
            if (!mounted) return;
            setBounty(json.bounty);
        } catch (err) {
            if (!mounted) return;
            const errorMessage = (err instanceof Error) ? err.message : "Failed to load bounty";
            setErr(errorMessage);
        } finally {
            if (mounted) setLoading(false);
        }

        return () => {
            mounted = false;
        };
    }, [id])

    useEffect(() => {
        fetchBounty()
    }, [id, fetchBounty]);

    const findExistingSubmission = useCallback(async () => {
        if (!connected || !wallet?.accounts?.length || !bounty?.id || !id) return;

        try {
            const data = await (await fetch("/api/submissions/find", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    bounty_id: Number(id),
                    wallet_address: wallet?.accounts[0]?.address,
                }),
            })).json()

            if (data?.submission?.id) {
                setSubmission(data.submission);
            }
        } catch (err) {
            console.error("Error fetching existing submission:", err);
        }
    }, [connected, wallet?.accounts, id, bounty?.id]);

    useEffect(() => {
        findExistingSubmission()
    }, [wallet?.accounts, id, findExistingSubmission])

    if (loading) {
        return (
            <div className="min-h-screen grid place-items-center">
                <p className="text-sm text-muted-foreground">Loading bounty…</p>
            </div>
        );
    }

    if (err || !bounty) {
        return (
            <div className="min-h-screen grid place-items-center">
                <div className="text-center">
                    <p className="font-semibold text-red-600">Failed to load bounty</p>
                    <p className="text-sm text-muted-foreground">{err ?? "Not found"}</p>
                    <div className="mt-4">
                        <Link href="/"><Button variant="outline">Back</Button></Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-[#1c398e]/5 to-[#ff6900]/5">
            <main className="container mx-auto px-4 py-8">
                <BountyHeader />

                <div className="grid grid-cols-1 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <BountyOverviewCard bounty={bounty} />

                        <Tabs defaultValue="details" className="space-y-6">
                            <TabsList className={`grid w-full ${isAdmin ? "grid-cols-5" : "grid-cols-3"} bg-white/80 backdrop-blur-sm`}>
                                <TabsTrigger value="details" className="data-[state=active]:bg-[#ff6900] data-[state=active]:text-white">Details</TabsTrigger>
                                <TabsTrigger value="submit" className="data-[state=active]:bg-[#ff6900] data-[state=active]:text-white">Submit Entry</TabsTrigger>
                                <TabsTrigger value="submissions" className="data-[state=active]:bg-[#ff6900] data-[state=active]:text-white">Submissions</TabsTrigger>
                                {isAdmin ? (
                                    <>
                                        <TabsTrigger value="edit" className="data-[state=active]:bg-[#ff6900] data-[state=active]:text-white">Edit Bounty</TabsTrigger>
                                        <TabsTrigger value="winners" className="data-[state=active]:bg-[#ff6900] data-[state=active]:text-white">Select Winners</TabsTrigger>
                                    </>
                                ) : ""}
                            </TabsList>

                            <TabsContent value="details">
                                <DetailsTabContent bounty={bounty} />
                            </TabsContent>

                            <TabsContent value="submit">
                                <SubmitTabContent
                                    bounty={bounty}
                                    connected={connected}
                                    walletAddress={wallet?.accounts[0]?.address}
                                    submission={submission}
                                    onSubmissionSuccess={setSubmission}
                                />
                            </TabsContent>

                            <TabsContent value="submissions">
                                <SubmissionsTabContent bounty={bounty} />
                            </TabsContent>

                            {isAdmin && (
                                <>
                                    <TabsContent value="edit">
                                        <EditTabContent
                                            bounty={bounty}
                                            onBountyUpdated={fetchBounty}
                                        />
                                    </TabsContent>

                                    <TabsContent value="winners">
                                        <SelectWinnersTabContent
                                            bounty={bounty}
                                            onWinnersAnnounced={fetchBounty}
                                        />
                                    </TabsContent>
                                </>
                            )}
                        </Tabs>
                    </div>
                </div>
            </main>
        </div>
    )
}
