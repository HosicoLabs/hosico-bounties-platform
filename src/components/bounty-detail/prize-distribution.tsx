import { Bounty } from "@/app/types";

interface PrizeDistributionProps {
    prizes: Bounty["prizes"];
    tokenSymbol?: string | null;
}

export function PrizeDistribution({ prizes, tokenSymbol }: PrizeDistributionProps) {
    return (
        <div>
            <h4 className="font-semibold text-[#1c398e] mb-3">Prize Distribution</h4>
            <div className="space-y-3">
                {(prizes ?? []).map((prize, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[#1c398e]/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-[#fdc700] rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-[#1c398e]">{prize.place}</span>
                            </div>
                        </div>
                        <span className="font-bold text-[#ff6900]">{Number(prize.prize).toLocaleString()} {tokenSymbol || "HOSICO"}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
