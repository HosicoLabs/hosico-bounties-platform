import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Coins, Users, Clock, Calendar, CheckCircle, Crown } from "lucide-react"
import Link from "next/link"

// Mock data for active bounties
const activeBounties = [
  {
    id: 1,
    title: "Tweet with #HosicoCommunity Tag",
    description: "Share something positive about Hosico on X/Twitter and tag #HosicoCommunity to spread awareness",
    reward: "100 HOSICO",
    difficulty: "Easy",
    participants: 47,
    timeLeft: "Daily",
    category: "Social",
    status: "active",
  },
  {
    id: 2,
    title: "Create Hosico TikTok Video",
    description: "Make a fun 30-second TikTok video featuring Hosico memes or community highlights",
    reward: "500 HOSICO",
    difficulty: "Easy",
    participants: 23,
    timeLeft: "2 days",
    category: "Social",
    status: "active",
  },
  {
    id: 3,
    title: "Write Community Spotlight Article",
    description: "Feature a community member's story or contribution in a 500-word article",
    reward: "750 HOSICO",
    difficulty: "Medium",
    participants: 12,
    timeLeft: "1 week",
    category: "Content",
    status: "active",
  },
  {
    id: 4,
    title: "Host Hosico Discord Event",
    description: "Organize and host a community event in our Discord server (games, AMAs, contests)",
    reward: "1,200 HOSICO",
    difficulty: "Medium",
    participants: 8,
    timeLeft: "3 days",
    category: "Community",
    status: "active",
  },
  {
    id: 5,
    title: "Create Hosico Meme Contest",
    description: "Design the funniest Hosico meme for our community",
    reward: "1,000 HOSICO",
    difficulty: "Easy",
    participants: 24,
    timeLeft: "3 days",
    category: "Creative",
    status: "active",
  },
  {
    id: 6,
    title: "Refer New Community Members",
    description: "Invite friends to join Hosico community and complete onboarding (5+ referrals)",
    reward: "300 HOSICO",
    difficulty: "Easy",
    participants: 31,
    timeLeft: "Ongoing",
    category: "Growth",
    status: "active",
  },
  {
    id: 7,
    title: "Solana DeFi Integration Guide",
    description: "Write a comprehensive guide on integrating Hosico with Solana DeFi protocols",
    reward: "5,000 HOSICO",
    difficulty: "Hard",
    participants: 8,
    timeLeft: "1 week",
    category: "Technical",
    status: "active",
  },
  {
    id: 8,
    title: "Community Twitter Campaign",
    description: "Create engaging Twitter content to grow our community",
    reward: "2,500 HOSICO",
    difficulty: "Medium",
    participants: 15,
    timeLeft: "5 days",
    category: "Marketing",
    status: "active",
  },
  {
    id: 9,
    title: "Instagram Story Challenge",
    description: "Post daily Instagram stories featuring Hosico for a week with community hashtags",
    reward: "400 HOSICO",
    difficulty: "Easy",
    participants: 19,
    timeLeft: "6 days",
    category: "Social",
    status: "active",
  },
]

// Mock data for finalized bounties
const finalizedBounties = [
  {
    id: 101,
    title: "Hosico Logo Design Contest",
    description: "Create a modern logo design for the Hosico community brand",
    reward: "3,000 HOSICO",
    difficulty: "Medium",
    participants: 45,
    completedDate: "2024-01-15",
    category: "Creative",
    status: "finalized",
    winner: "CryptoDesigner_X",
    submissions: 67,
  },
  {
    id: 102,
    title: "Community Guidelines Document",
    description: "Write comprehensive community guidelines for Discord and social media",
    reward: "1,500 HOSICO",
    difficulty: "Medium",
    participants: 23,
    completedDate: "2024-01-12",
    category: "Content",
    status: "finalized",
    winner: "CommunityMod_Sarah",
    submissions: 12,
  },
  {
    id: 103,
    title: "Hosico Mascot Animation",
    description: "Create a 10-second animated GIF of Hosico for social media use",
    reward: "2,000 HOSICO",
    difficulty: "Hard",
    participants: 18,
    completedDate: "2024-01-10",
    category: "Creative",
    status: "finalized",
    winner: "AnimatorPro_Mike",
    submissions: 25,
  },
  {
    id: 104,
    title: "Telegram Bot Development",
    description: "Develop a Telegram bot for community management and token price tracking",
    reward: "4,500 HOSICO",
    difficulty: "Hard",
    participants: 12,
    completedDate: "2024-01-08",
    category: "Technical",
    status: "finalized",
    winner: "DevMaster_Alex",
    submissions: 8,
  },
  {
    id: 105,
    title: "Holiday Meme Competition",
    description: "Create the best holiday-themed Hosico meme for December celebrations",
    reward: "800 HOSICO",
    difficulty: "Easy",
    participants: 89,
    completedDate: "2024-01-05",
    category: "Creative",
    status: "finalized",
    winner: "MemeKing_2024",
    submissions: 156,
  },
  {
    id: 106,
    title: "Community Onboarding Video",
    description: "Create a 2-minute welcome video for new community members",
    reward: "1,800 HOSICO",
    difficulty: "Medium",
    participants: 15,
    completedDate: "2024-01-03",
    category: "Content",
    status: "finalized",
    winner: "VideoCreator_Luna",
    submissions: 22,
  },
]

const stats = [
  { label: "Total Bounties", value: "156", icon: Trophy, color: "text-[#ff6900]" },
  { label: "Active Bounties", value: "9", icon: Clock, color: "text-[#1c398e]" },
  { label: "Finalized Bounties", value: "147", icon: CheckCircle, color: "text-green-600" },
  { label: "Total Rewards", value: "125K HOSICO", icon: Coins, color: "text-[#fdc700]" },
]

export default function BountiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c398e]/5 to-[#ff6900]/5">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="active" className="data-[state=active]:bg-[#ff6900] data-[state=active]:text-white">
              Active Bounties ({activeBounties.length})
            </TabsTrigger>
            <TabsTrigger value="finalized" className="data-[state=active]:bg-[#ff6900] data-[state=active]:text-white">
              Finalized Bounties ({finalizedBounties.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#1c398e]">Currently Active</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  All Categories
                </Button>
                <Button variant="outline" size="sm">
                  Social
                </Button>
                <Button variant="outline" size="sm">
                  Creative
                </Button>
                <Button variant="outline" size="sm">
                  Technical
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {activeBounties.map((bounty) => (
                <Card
                  key={bounty.id}
                  className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge
                        variant="secondary"
                        className={`mb-2 ${
                          bounty.difficulty === "Easy"
                            ? "bg-green-100 text-green-800"
                            : bounty.difficulty === "Medium"
                              ? "bg-[#ff6900] text-white"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {bounty.difficulty}
                      </Badge>
                      <Badge variant="outline" className="border-[#1c398e] text-[#1c398e]">
                        {bounty.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-[#1c398e] text-balance">{bounty.title}</CardTitle>
                    <CardDescription className="text-pretty">{bounty.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Coins className="w-4 h-4 text-[#fdc700]" />
                          <span className="font-bold text-[#ff6900]">{bounty.reward}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{bounty.timeLeft}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{bounty.participants} participants</span>
                        </div>
                        <Link href={`/bounty/${bounty.id}`}>
                          <Button className="bg-[#ff6900] hover:bg-[#ff6900]/90 text-white">View Details</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="finalized" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#1c398e]">Completed Bounties</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  All Categories
                </Button>
                <Button variant="outline" size="sm">
                  Creative
                </Button>
                <Button variant="outline" size="sm">
                  Technical
                </Button>
                <Button variant="outline" size="sm">
                  Content
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {finalizedBounties.map((bounty) => (
                <Card
                  key={bounty.id}
                  className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary" className="mb-2 bg-green-100 text-green-800">
                        Completed
                      </Badge>
                      <Badge variant="outline" className="border-[#1c398e] text-[#1c398e]">
                        {bounty.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-[#1c398e] text-balance">{bounty.title}</CardTitle>
                    <CardDescription className="text-pretty">{bounty.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Coins className="w-4 h-4 text-[#fdc700]" />
                          <span className="font-bold text-[#ff6900]">{bounty.reward}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{bounty.completedDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{bounty.submissions} submissions</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Crown className="w-4 h-4 text-[#fdc700]" />
                          <span className="text-sm font-medium text-[#1c398e]">{bounty.winner}</span>
                        </div>
                      </div>
                      <Link href={`/bounty/${bounty.id}`}>
                        <Button variant="outline" className="w-full bg-transparent">
                          View Results
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
