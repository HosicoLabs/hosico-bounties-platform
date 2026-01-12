import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { isEnded } from "@/utils/bounties";
import { WalletDropdown } from "@/components/wallet-dropdown";
import { Bounty, Submission } from "@/app/types";

interface SubmitTabContentProps {
    bounty: Bounty;
    connected: boolean;
    walletAddress?: string;
    submission: Submission | null;
    onSubmissionSuccess: (submission: Submission) => void;
}

export function SubmitTabContent({ 
    bounty, 
    connected, 
    walletAddress,
    submission,
    onSubmissionSuccess 
}: SubmitTabContentProps) {
    const [submissionLoading, setSubmissionLoading] = useState(false);
    const [twitterHandle, setTwitterHandle] = useState(submission?.twitter_handle || "");
    const [tweetLink, setTweetLink] = useState(submission?.tweet_link || "");
    const [additionalInfo, setAdditionalInfo] = useState(submission?.extra_info || "");
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    const handleSubmission = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmissionLoading(true);

        try {
            if (!twitterHandle) {
                throw new Error("Twitter Handle is required");
            }

            const submissionPayload = {
                submission: {
                    bounty_id: Number(bounty.id),
                    wallet_address: walletAddress,
                    twitter_handle: twitterHandle,
                    tweet_link: tweetLink || "",
                    extra_info: additionalInfo || "",
                }
            };

            let data = null;

            if (submission?.id) {
                data = await (await fetch("/api/submissions/update", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        submissionId: submission.id,
                        submission: submissionPayload.submission
                    }),
                })).json();
            } else {
                data = await (await fetch("/api/submissions/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(submissionPayload),
                })).json();
            }

            if (!data || data.error) {
                throw new Error(data?.error || "Failed to submit your entry");
            }

            onSubmissionSuccess(data.submission);
            setSubmissionSuccess(true);
            setTimeout(() => setSubmissionSuccess(false), 3000);
        } catch (err) {
            console.error("Submission error:", err);
        } finally {
            setSubmissionLoading(false);
        }
    };

    if (!connected) {
        return (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-[#1c398e]">Submit Your Entry</CardTitle>
                    <CardDescription>Upload your submission for this bounty challenge</CardDescription>
                    <p className="text-xs">We can&apos;t wait to see what you&apos;ve created!</p>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col justify-center items-center gap-5 text-center text-muted-foreground bg-gray-100 py-4 px-2 rounded-md">
                        <p>Please, connect a wallet to submit your participation!</p>
                        <WalletDropdown />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-[#1c398e]">Submit Your Entry</CardTitle>
                <CardDescription>Upload your submission for this bounty challenge</CardDescription>
                <p className="text-xs">We can&apos;t wait to see what you&apos;ve created!</p>
            </CardHeader>
            <CardContent>
                {isEnded(bounty.end_date) && (
                    <div className="p-6 text-center">
                        <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-[#1c398e] mb-2">Bounty Finalized</h2>
                    </div>
                )}

                <form onSubmit={handleSubmission} className="space-y-6">
                    <div>
                        <Label htmlFor="tweet-link" className="text-sm font-medium text-gray-900">
                            Tweet Link <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <p className="text-xs text-gray-500 mb-2">
                            This helps sponsors discover (and maybe repost) your work on X!
                        </p>
                        <div className="flex">
                            <Input
                                id="tweet-link"
                                placeholder="Add a tweet's link"
                                type="url"
                                disabled={submissionLoading || isEnded(bounty.end_date)}
                                value={tweetLink}
                                onChange={(e) => setTweetLink(e.target.value)}
                                className="focus:ring-2 focus:ring-[#1c398e] focus:border-[#1c398e]"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="twitter-handle" className="text-sm font-medium text-gray-900 flex items-center">
                            Twitter Handle <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <p className="text-xs text-gray-500 mb-2">Make sure this link is accessible by everyone!</p>
                        <div className="flex">
                            <Input
                                id="twitter-handle"
                                placeholder="Add your Twitter handle. e.g @Hosico_on_sol"
                                type="text"
                                value={twitterHandle}
                                disabled={submissionLoading || isEnded(bounty.end_date)}
                                onChange={(e) => setTwitterHandle(e.target.value)}
                                className="focus:ring-2 focus:ring-[#1c398e] focus:border-[#1c398e]"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="additional-info" className="text-sm font-medium text-gray-900">
                            Anything Else?
                        </Label>
                        <div className="relative">
                            <Textarea
                                id="additional-info"
                                placeholder="Add info or link"
                                rows={3}
                                disabled={submissionLoading || isEnded(bounty.end_date)}
                                value={additionalInfo}
                                onChange={(e) => setAdditionalInfo(e.target.value)}
                                className="focus:ring-2 focus:ring-[#1c398e] focus:border-[#1c398e] pr-10"
                            />
                            <div className="absolute right-3 top-3">
                                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                    <FileText className="w-3 h-3 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className={cn(
                            "w-full bg-[#ff6900] hover:bg-[#ff6900]/90 text-white font-medium",
                            isEnded(bounty.end_date) || submissionLoading ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
                        )}
                        disabled={!twitterHandle || submissionLoading || isEnded(bounty.end_date)}
                    >
                        {submission?.id ? "Update Submission" : "Submit Entry"}
                    </Button>

                    {submissionLoading && <p className="text-sm text-muted-foreground">Submitting your entry…</p>}

                    {submissionSuccess && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                <p className="text-green-800 font-medium">
                                    {submission?.id ? "Submission updated successfully!" : "Submission created successfully!"}
                                </p>
                            </div>
                        </div>
                    )}

                    {submission?.id && (
                        <span>You can update your submission until the Bounty&apos;s end date.</span>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
