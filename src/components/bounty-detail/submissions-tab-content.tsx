import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bounty } from "@/app/types";
import { SubmissionCard } from "./submission-card";

interface SubmissionsTabContentProps {
    bounty: Bounty;
}

export function SubmissionsTabContent({ bounty }: SubmissionsTabContentProps) {
    return (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-[#1c398e]">All Submissions</CardTitle>
                <CardDescription>View all submissions for this bounty</CardDescription>
            </CardHeader>
            <CardContent>
                {bounty?.submissions && bounty?.submissions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {bounty.submissions.map((submission) => (
                            <SubmissionCard
                                key={submission.id}
                                submission={submission}
                                showWalletAddress={false}
                                showWinnerBadge={false}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground bg-gray-100 py-4 px-2 rounded-md">
                        There are no submissions yet.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
