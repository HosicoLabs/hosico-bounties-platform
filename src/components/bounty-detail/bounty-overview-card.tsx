import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Clock, FileText } from "lucide-react";
import { calculateTotalPrize, isEnded } from "@/utils/bounties";
import { cn } from "@/lib/utils";
import { Bounty } from "@/app/types";

interface BountyOverviewCardProps {
    bounty: Bounty;
}

export function BountyOverviewCard({ bounty }: BountyOverviewCardProps) {
    return (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                            <Badge variant="outline" className="border-[#1c398e] text-[#1c398e]">
                                {bounty.category?.name ?? "—"}
                            </Badge>
                            <Badge className={cn(isEnded(bounty?.end_date) ? "border-[#1c398e] text-[#1c398e] bg-transparent" : "bg-[#ff6900] text-white border-[#ff6900]")}>
                                {isEnded(bounty.end_date) ? "Finalized" : "Active"}
                            </Badge>
                        </div>
                        <CardTitle className="text-2xl text-[#1c398e] text-balance mb-2">
                            {bounty.title}
                        </CardTitle>
                        <CardDescription className="text-base text-pretty">
                            {bounty.description}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                        <Coins className="w-5 h-5 text-[#fdc700]" />
                        <div>
                            <p className="text-sm text-muted-foreground">Total Reward</p>
                            <p className="font-bold text-[#ff6900]">
                                {calculateTotalPrize(bounty.prizes)} HOSICO
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">Submissions</p>
                            <p className="font-bold">{bounty.submissions && bounty.submissions.length > 0 ? bounty.submissions?.length : 0}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Clock className={cn(isEnded(bounty.end_date) ? "w-5 h-5 text-red-500" : "text-[#ff6900]")} />
                        <div>
                            <p className="text-sm text-muted-foreground">Ends</p>
                            <p className={cn("font-bold", isEnded(bounty.end_date) ? "text-red-500" : "text-[#ff6900]")}>
                                {new Date(bounty.end_date).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
