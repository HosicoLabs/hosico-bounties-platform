import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Submission } from "@/app/types";

interface SubmissionCardProps {
    submission: Submission;
    showWalletAddress?: boolean;
    showWinnerBadge?: boolean;
    winnerPosition?: string;
    additionalActions?: React.ReactNode;
}

export function SubmissionCard({ 
    submission, 
    showWalletAddress = false,
    showWinnerBadge = false,
    winnerPosition,
    additionalActions 
}: SubmissionCardProps) {
    return (
        <Card className="border border-[#1c398e]/20">
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-10">
                    <div className="flex-1">
                        <span className="text-xs text-gray-500 inline-block mb-2">Participant</span>
                        <div className="flex items-center space-x-3 mb-2">
                            <Link href={`https://x.com/${submission.twitter_handle}`} target="_blank" rel="noopener noreferrer">
                                <h4 className="font-semibold text-[#1c398e] underline">{submission.twitter_handle}</h4>
                            </Link>
                            {showWinnerBadge && winnerPosition && winnerPosition !== "No Prize" && (
                                <Badge className="bg-[#fdc700] text-[#1c398e]">
                                    {winnerPosition} Place
                                </Badge>
                            )}
                        </div>
                        <ul className="mt-4 flex flex-col space-y-1 text-sm text-muted-foreground">
                            <li>
                                <Link
                                    href={submission.tweet_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline text-blue-600"
                                >
                                    Tweet link
                                </Link>
                            </li>
                            {showWalletAddress && (
                                <li>
                                    <p className="text-sm text-muted-foreground mt-5">
                                        <span className="font-semibold text-gray-700">Wallet address:</span> {submission.wallet_address}
                                    </p>
                                </li>
                            )}
                        </ul>
                    </div>
                    {additionalActions && (
                        <div className="flex items-center space-x-3">
                            {additionalActions}
                        </div>
                    )}
                </div>
                {submission?.extra_info && (
                    <p className="text-sm text-muted-foreground mt-5">
                        <span className="font-semibold text-gray-700">Extra info:</span> {submission.extra_info}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
