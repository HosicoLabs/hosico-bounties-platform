import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Bounty } from "@/app/types";
import { isEnded } from "@/utils/bounties";
import { PrizeDistribution } from "./prize-distribution";
import { WinnersSection } from "./winners-section";

interface DetailsTabContentProps {
    bounty: Bounty;
}

export function DetailsTabContent({ bounty }: DetailsTabContentProps) {
    return (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-[#1c398e]">Submission Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <ul className="space-y-2">
                        {(Array.isArray(bounty.requirements)
                            ? bounty.requirements
                            : String(bounty.requirements ?? "")
                                .split("\n")
                                .filter(Boolean)
                        ).map((req, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{req}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <PrizeDistribution prizes={bounty.prizes} tokenSymbol={bounty?.token_symbol} />

                {!isEnded(bounty?.end_date) ? (
                    <p className="text-center text-muted-foreground bg-gray-100 py-4 px-2 rounded-md">
                        The winners will be announced once the bounty has been finalized.
                    </p>
                ) : (
                    <WinnersSection winners={bounty.winners} />
                )}
            </CardContent>
        </Card>
    );
}
