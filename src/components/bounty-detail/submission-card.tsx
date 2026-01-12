import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Submission } from "@/app/types";
import { ExternalLink, AlertCircle } from "lucide-react";
import { CachedTweet } from "./cached-tweet";

interface SubmissionCardProps {
    submission: Submission;
    showWalletAddress?: boolean;
    showWinnerBadge?: boolean;
    winnerPosition?: string;
    additionalActions?: React.ReactNode;
}

function extractTweetId(url: string): string | null {
    try {
        const match = url.match(/(?:twitter\.com|x\.com)\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)/);
        return match ? match[2] : null;
    } catch {
        return null;
    }
}

function TweetFallback({ url }: { url: string }) {
    return (
        <div className="mt-4 border border-amber-200 bg-amber-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-amber-900 mb-1">
                        Unable to load tweet
                    </p>
                    <p className="text-xs text-amber-700 mb-2">
                        The tweet link appears to be invalid or the tweet may have been deleted.
                    </p>
                    <Link
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                        View original link <ExternalLink className="w-3 h-3" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export function SubmissionCard({
    submission,
    showWalletAddress = false,
    showWinnerBadge = false,
    winnerPosition,
    additionalActions
}: SubmissionCardProps) {
    const tweetId = extractTweetId(submission.tweet_link);

    return (
        <Card className="border border-[#1c398e]/20">
            <CardContent className="p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2 flex-wrap">
                                <span className="text-sm font-semibold text-gray-700 inline-block">Participant:</span>
                                <Link href={`https://x.com/${submission.twitter_handle}`} target="_blank" rel="noopener noreferrer">
                                    <h4 className="font-semibold text-[#1c398e] underline text-sm">{submission.twitter_handle}</h4>
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
                                        className="underline text-blue-600 break-all inline-flex items-center gap-1"
                                    >
                                        Tweet link <ExternalLink className="w-3 h-3" />
                                    </Link>
                                </li>
                                {showWalletAddress && (
                                    <li>
                                        <p className="text-sm text-muted-foreground mt-5 break-all">
                                            <span className="font-semibold text-gray-700">Wallet address:</span> {submission.wallet_address}
                                        </p>
                                    </li>
                                )}
                            </ul>


                        </div>
                        {additionalActions && (
                            <div className="flex items-center flex-shrink-0">
                                {additionalActions}
                            </div>
                        )}
                    </div>

                    <p className="text-sm text-muted-foreground break-words">
                        <span className="font-semibold text-gray-700">Extra info:</span> {
                            submission.extra_info ? submission.extra_info : "N/A"
                        }
                    </p>

                    {tweetId ? (
                        <div className="[&>div]:mx-auto" data-theme="light">
                            <CachedTweet id={tweetId} />
                        </div>
                    ) : (
                        <TweetFallback url={submission.tweet_link} />
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
