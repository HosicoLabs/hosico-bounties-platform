import { Bounty } from "@/app/types";
import { SubmissionCard } from "./submission-card";

interface WinnersSectionProps {
    winners: Bounty["winners"];
}

export function WinnersSection({ winners }: WinnersSectionProps) {
    if (!winners || winners.length === 0) {
        return (
            <>
                <h4 className="font-semibold text-[#1c398e] mb-3">Winners</h4>
                <p className="text-center text-muted-foreground bg-gray-100 py-4 px-2 rounded-md">
                    The winners have not yet been announced.
                </p>
            </>
        );
    }

    return (
        <div>
            <h4 className="font-semibold text-[#1c398e] mb-3">Winners</h4>
            <div className="space-y-3">
                {winners.map(({ position, submission }) => (
                    <SubmissionCard
                        key={submission.id}
                        submission={submission}
                        showWalletAddress={true}
                        showWinnerBadge={true}
                        winnerPosition={position}
                    />
                ))}
            </div>
        </div>
    );
}
