"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Coins, Clock, FileText, Star, ArrowLeft, CheckCircle, Crown } from "lucide-react";
import { useAdmin } from "@/components/admin/use-admin";

type Prize = { place: string; prize: number; description?: string };
type Category = { id: number; name: string };
type Bounty = {
    id: number;
    title: string;
    description: string;
    requirements?: string | string[];
    end_date: string;
    category?: Category | null;
    prizes: Prize[];
    submissions?: number;
    status?: string;
    total_prize?: number;
};

const mockSubmissions = [
    { id: 1, user: "MemeLord42", title: "Hosico to the Moon!", submittedAt: "2 hours ago", votes: 15, status: "pending" },
    { id: 2, user: "CryptoArtist", title: "When HOSICO pumps", submittedAt: "5 hours ago", votes: 23, status: "pending" },
];


export default function BountyDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [bounty, setBounty] = useState<Bounty | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    // submission form state
    const [submissionText, setSubmissionText] = useState("");
    const [submissionTitle, setSubmissionTitle] = useState("");
    const [submissionLink, setSubmissionLink] = useState("");
    const [tweetLink, setTweetLink] = useState("");
    const [additionalInfo, setAdditionalInfo] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const { isAdmin } = useAdmin();
    const [selectedWinners, setSelectedWinners] = useState<{ [key: number]: string }>({});
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setErr(null);

        (async () => {
            try {
                const res = await fetch(`/api/bounties/${id}`, { cache: "no-store" });
                const json = await res.json();
                if (!res.ok) throw new Error(json?.error || "Failed to load bounty");
                if (!mounted) return;
                setBounty(json.bounty);
            } catch (e) {
                if (!mounted) return;
                const errorMessage = (e instanceof Error) ? e.message : "Failed to load bounty";
                setErr(errorMessage);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [id]);

    const totalPrize = useMemo(
        () => (bounty?.prizes ?? []).reduce((sum, p) => sum + (Number(p.prize) || 0), 0),
        [bounty]
    );

    const handleSubmission = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: post to your submissions endpoint
        setSubmissionSuccess(true);
        setSubmissionTitle(""); setSubmissionText(""); setSubmissionLink("");
        setTweetLink(""); setAdditionalInfo(""); setUploadedFiles([]);
        setTimeout(() => setSubmissionSuccess(false), 3000);
    };

    const SubmissionForm = () => (
        <form onSubmit={handleSubmission} className="space-y-6">
            {submissionSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <p className="text-green-800 font-medium">Submission successful! Your entry has been recorded.</p>
                    </div>
                </div>
            )}

            <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">We can&apos;t wait to see what you&apos;ve created!</p>
                <p className="text-xs text-gray-500">Note: You can edit this submission until the bounty deadline.</p>
            </div>

            <div>
                <Label htmlFor="submission-link" className="text-sm font-medium text-gray-900 flex items-center">
                    Link to Your Submission <span className="text-red-500 ml-1">*</span>
                </Label>
                <p className="text-xs text-gray-500 mb-2">Make sure this link is accessible by everyone!</p>
                <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
                        https://
                    </span>
                    <Input
                        id="submission-link"
                        placeholder="Add a link"
                        value={submissionLink}
                        onChange={(e) => setSubmissionLink(e.target.value)}
                        className="rounded-l-none border-l-0 focus:ring-2 focus:ring-[#1c398e] focus:border-[#1c398e]"
                        required
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="tweet-link" className="text-sm font-medium text-gray-900">Tweet Link</Label>
                <p className="text-xs text-gray-500 mb-2">
                    This helps sponsors discover (and maybe repost) your work on X!
                </p>
                <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
                        https://
                    </span>
                    <Input
                        id="tweet-link"
                        placeholder="Add a tweet's link"
                        value={tweetLink}
                        onChange={(e) => setTweetLink(e.target.value)}
                        className="rounded-l-none border-l-0 focus:ring-2 focus:ring-[#1c398e] focus:border-[#1c398e]"
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="additional-info" className="text-sm font-medium text-gray-900">Anything Else?</Label>
                <div className="relative">
                    <Textarea
                        id="additional-info"
                        placeholder="Add info or link"
                        rows={3}
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
                className="w-full bg-[#ff6900] hover:bg-[#ff6900]/90 text-white font-medium"
                disabled={!submissionLink}
            >
                Submit Entry
            </Button>
        </form>
    );

    const handleWinnerSelection = (submissionId: number, position: string) =>
        setSelectedWinners((prev) => ({ ...prev, [submissionId]: position }));

    const announceWinners = () => {
        console.log("Selected winners:", selectedWinners);
    };

    if (loading) {
        return (
            <div className="min-h-screen grid place-items-center">
                <p className="text-sm text-muted-foreground">Loading bounty…</p>
            </div>
        );
    }

    if (err || !bounty) {
        return (
            <div className="min-h-screen grid place-items-center">
                <div className="text-center">
                    <p className="font-semibold text-red-600">Failed to load bounty</p>
                    <p className="text-sm text-muted-foreground">{err ?? "Not found"}</p>
                    <div className="mt-4">
                        <Link href="/"><Button variant="outline">Back</Button></Link>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1c398e]/5 to-[#ff6900]/5">
            <main className="container mx-auto px-4 py-8">
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

                <div className="grid grid-cols-1 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <Badge variant="outline" className="border-[#1c398e] text-[#1c398e]">
                                                {bounty.category?.name ?? "—"}
                                            </Badge>
                                            <Badge className="bg-[#ff6900] text-white">{bounty.status ?? "Active"}</Badge>
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
                                                {totalPrize.toLocaleString()} HOSICO
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <FileText className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Submissions</p>
                                            <p className="font-bold">{bounty.submissions ?? 0}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Clock className="w-5 h-5 text-red-500" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Ends</p>
                                            <p className="font-bold text-red-500">
                                                {new Date(bounty.end_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Tabs defaultValue="details" className="space-y-6">
                            <TabsList className={`grid w-full ${isAdmin ? "grid-cols-3" : "grid-cols-2"} bg-white/80 backdrop-blur-sm`}>
                                <TabsTrigger value="details" className="data-[state=active]:bg-[#ff6900] data-[state=active]:text-white">Details</TabsTrigger>
                                <TabsTrigger value="submit" className="data-[state=active]:bg-[#ff6900] data-[state=active]:text-white">Submit Entry</TabsTrigger>
                                {isAdmin ? (
                                    <TabsTrigger value="winners" className="data-[state=active]:bg-[#ff6900] data-[state=active]:text-white">Select Winners</TabsTrigger>
                                ) : ""}
                            </TabsList>

                            <TabsContent value="details">
                                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="text-[#1c398e]">Requirements & Guidelines</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div>
                                            <h4 className="font-semibold text-[#1c398e] mb-3">Submission Requirements</h4>
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

                                        <div>
                                            <h4 className="font-semibold text-[#1c398e] mb-3">Prize Distribution</h4>
                                            <div className="space-y-3">
                                                {(bounty.prizes ?? []).map((prize, index) => (
                                                    <div key={index} className="flex items-center justify-between p-3 bg-[#1c398e]/5 rounded-lg">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-8 h-8 bg-[#fdc700] rounded-full flex items-center justify-center">
                                                                <span className="text-sm font-bold text-[#1c398e]">{prize.place}</span>
                                                            </div>
                                                            <span className="font-medium">{prize.description ?? ""}</span>
                                                        </div>
                                                        <span className="font-bold text-[#ff6900]">{Number(prize.prize).toLocaleString()} HOSICO</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="submit">
                                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="text-[#1c398e]">Submit Your Entry</CardTitle>
                                        <CardDescription>Upload your submission for this bounty challenge</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <SubmissionForm />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {isAdmin && (
                                <TabsContent value="winners">
                                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                        <CardHeader>
                                            <div className="flex items-center space-x-2">
                                                <Crown className="w-5 h-5 text-[#fdc700]" />
                                                <CardTitle className="text-[#1c398e]">Select Winners</CardTitle>
                                            </div>
                                            <CardDescription>Choose winners for this bounty and assign their positions</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {/* Prize Structure Display */}
                                            <div className="bg-[#1c398e]/5 rounded-lg p-4">
                                                <h4 className="font-semibold text-[#1c398e] mb-3">Prize Structure</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    {bounty.prizes.map((prize, index) => (
                                                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                                                            <span className="font-medium">{prize.place} Place</span>
                                                            <span className="font-bold text-[#ff6900]">{prize.prize}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Submissions with Winner Selection */}
                                            <div className="space-y-4">
                                                <h4 className="font-semibold text-[#1c398e]">Submissions for Review</h4>
                                                {mockSubmissions.map((submission) => (
                                                    <Card key={submission.id} className="border border-[#1c398e]/20">
                                                        <CardContent className="p-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center space-x-3 mb-2">
                                                                        <h4 className="font-semibold text-[#1c398e]">{submission.title}</h4>
                                                                        {selectedWinners[submission.id] && (
                                                                            <Badge className="bg-[#fdc700] text-[#1c398e]">
                                                                                {selectedWinners[submission.id]} Place
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-sm text-muted-foreground mb-1">
                                                                        By {submission.user} • {submission.submittedAt}
                                                                    </p>
                                                                    <div className="flex items-center space-x-1">
                                                                        <Star className="w-4 h-4 text-[#fdc700]" />
                                                                        <span className="text-sm font-medium">{submission.votes} community votes</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center space-x-3">
                                                                    <Select
                                                                        value={selectedWinners[submission.id] || "No Prize"}
                                                                        onValueChange={(value) => handleWinnerSelection(submission.id, value)}
                                                                    >
                                                                        <SelectTrigger className="w-32">
                                                                            <SelectValue placeholder="Select position" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="1st">1st Place</SelectItem>
                                                                            <SelectItem value="2nd">2nd Place</SelectItem>
                                                                            <SelectItem value="3rd">3rd Place</SelectItem>
                                                                            <SelectItem value="No Prize">No Prize</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <Button size="sm" variant="outline">
                                                                        View Details
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>

                                            <div className="pt-4 border-t">
                                                <Button
                                                    onClick={announceWinners}
                                                    className="bg-[#1c398e] hover:bg-[#1c398e]/90 text-white"
                                                    disabled={Object.keys(selectedWinners).length === 0}
                                                >
                                                    <Trophy className="w-4 h-4 mr-2" />
                                                    Announce Winners
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            )}
                        </Tabs>
                    </div>
                </div>
            </main>
        </div>
    )
}
