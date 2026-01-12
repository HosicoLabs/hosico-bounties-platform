import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Crown, Trophy, Check, X } from "lucide-react";
import { isEnded } from "@/utils/bounties";
import { Bounty } from "@/app/types";
import { SubmissionCard } from "./submission-card";

interface SelectWinnersTabContentProps {
    bounty: Bounty;
    onWinnersAnnounced: () => void;
}

export function SelectWinnersTabContent({ bounty, onWinnersAnnounced }: SelectWinnersTabContentProps) {
    const [selectedWinners, setSelectedWinners] = useState<{ [key: number]: string }>({});
    const [isSelectingWinners, setIsSelectingWinners] = useState(false);
    const [selectedWinnersSuccess, setSelectedWinnersSuccess] = useState(false);
    const [selectedWinnersError, setSelectedWinnersError] = useState("");

    const handleWinnerSelection = (submissionId: number, position: string) => {
        setSelectedWinners(prev => {
            const next = { ...prev };
            if (position === "No Prize") {
                delete next[submissionId];
            } else {
                next[submissionId] = position;
            }
            return next;
        });
    };

    const announceWinners = async () => {
        setIsSelectingWinners(true);
        try {
            const data = await (await fetch("/api/admin/bounty/select-winners", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    bountyId: Number(bounty.id),
                    winners: selectedWinners,
                }),
            })).json();

            if (data?.error) {
                throw new Error(data.error || "Failed to announce winners");
            }

            setSelectedWinnersSuccess(true);
            onWinnersAnnounced();

            setTimeout(() => {
                setSelectedWinnersSuccess(false);
            }, 5000);
        } catch (err) {
            console.error("Error announcing winners:", err);
            setSelectedWinnersError((err as Error).message);
        } finally {
            setIsSelectingWinners(false);
        }
    };

    return (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
                <div className="flex items-center space-x-2">
                    <Crown className="w-5 h-5 text-[#fdc700]" />
                    <CardTitle className="text-[#1c398e]">Select Winners</CardTitle>
                </div>
                <CardDescription>Choose winners for this bounty and assign their positions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="bg-[#1c398e]/5 rounded-lg p-4">
                    <h4 className="font-semibold text-[#1c398e] mb-3">Prize Structure</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {bounty.prizes.map((prize, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                                <span className="font-medium">{prize.place} Place</span>
                                <span className="font-bold text-[#ff6900]">
                                    {Number.parseFloat(prize.prize.toString()).toLocaleString()} HOSICO
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-[#1c398e] mb-4">Submissions</h4>

                    {bounty?.submissions && bounty?.submissions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {bounty.submissions.map((submission) => (
                                <SubmissionCard
                                    key={submission.id}
                                    submission={submission}
                                    showWalletAddress={true}
                                    showWinnerBadge={true}
                                    winnerPosition={selectedWinners[submission.id]}
                                    additionalActions={
                                        <Select
                                            disabled={isSelectingWinners}
                                            value={selectedWinners[submission.id] || "No Prize"}
                                            onValueChange={(value) => handleWinnerSelection(submission.id, value)}
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue placeholder="Select position" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {bounty.prizes.map((prize, index) => (
                                                    <SelectItem key={index} value={prize.place}>
                                                        {prize.place} Place
                                                    </SelectItem>
                                                ))}
                                                <SelectItem value="No Prize">No Prize</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    }
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground bg-gray-100 py-4 px-2 rounded-md">
                            There are no submissions yet.
                        </p>
                    )}
                </div>

                <div className="pt-4 border-t">
                    <Button
                        onClick={announceWinners}
                        className="bg-[#1c398e] hover:bg-[#1c398e]/90 text-white"
                        disabled={Object.keys(selectedWinners).length === 0 || isSelectingWinners || !isEnded(bounty.end_date)}
                    >
                        <Trophy className="w-4 h-4 mr-2" />
                        {isEnded(bounty.end_date) ? "Announce Winners" : "Bounty has not ended"}
                    </Button>
                </div>

                {isSelectingWinners && <p>Selecting winners...</p>}

                {selectedWinnersSuccess && (
                    <div className="flex justify-start items-center gap-4">
                        <Check />
                        <p className="text-green-500 font-semibold">Winners successfully selected!</p>
                    </div>
                )}

                {selectedWinnersError && (
                    <div className="flex justify-start items-center gap-4">
                        <X />
                        <p className="text-red-500 font-semibold">Error selecting winners: {selectedWinnersError}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
