import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy } from "lucide-react";

export function BountyHeader() {
    return (
        <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
                <Link href="/">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </Link>
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#ff6900] to-[#fdc700] rounded-full flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-[#1c398e]">Bounty Details</h1>
                </div>
            </div>
        </div>
    );
}
