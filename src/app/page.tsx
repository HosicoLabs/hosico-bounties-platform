'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Coins, Users, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { CategoryButtonsSkeleton } from "@/components/skeletons/category-buttons-skeleton"
import { BountryCategory } from "./types"

const mockBounties = [
  {
    id: 1,
    title: "Tweet with #HosicoCommunity Tag",
    description: "Share something positive about Hosico on X/Twitter and tag #HosicoCommunity to spread awareness",
    reward: "100 HOSICO",
    submissions: 47,
    timeLeft: "Daily",
    category: "Social",
    status: "active",
  },
  {
    id: 2,
    title: "Create Hosico TikTok Video",
    description: "Make a fun 30-second TikTok video featuring Hosico memes or community highlights",
    reward: "500 HOSICO",
    submissions: 23,
    timeLeft: "2 days",
    category: "Social",
    status: "active",
  },
  {
    id: 3,
    title: "Write Community Spotlight Article",
    description: "Feature a community member's story or contribution in a 500-word article",
    reward: "750 HOSICO",
    submissions: 12,
    timeLeft: "1 week",
    category: "Content",
    status: "active",
  },
  {
    id: 4,
    title: "Host Hosico Discord Event",
    description: "Organize and host a community event in our Discord server (games, AMAs, contests)",
    reward: "1,200 HOSICO",
    submissions: 8,
    timeLeft: "3 days",
    category: "Community",
    status: "active",
  },
  {
    id: 5,
    title: "Create Hosico Meme Contest",
    description: "Design the funniest Hosico meme for our community",
    reward: "1,000 HOSICO",
    submissions: 24,
    timeLeft: "3 days",
    category: "Creative",
    status: "active",
  },
  {
    id: 6,
    title: "Refer New Community Members",
    description: "Invite friends to join Hosico community and complete onboarding (5+ referrals)",
    reward: "300 HOSICO",
    submissions: 31,
    timeLeft: "Ongoing",
    category: "Growth",
    status: "active",
  },
  {
    id: 7,
    title: "Solana DeFi Integration Guide",
    description: "Write a comprehensive guide on integrating Hosico with Solana DeFi protocols",
    reward: "5,000 HOSICO",
    submissions: 8,
    timeLeft: "1 week",
    category: "Technical",
    status: "active",
  },
  {
    id: 8,
    title: "Community Twitter Campaign",
    description: "Create engaging Twitter content to grow our community",
    reward: "2,500 HOSICO",
    submissions: 15,
    timeLeft: "5 days",
    category: "Marketing",
    status: "active",
  },
  {
    id: 9,
    title: "Instagram Story Challenge",
    description: "Post daily Instagram stories featuring Hosico for a week with community hashtags",
    reward: "400 HOSICO",
    submissions: 19,
    timeLeft: "6 days",
    category: "Social",
    status: "active",
  },
]

export default function Home() {
  const [categories, setCategories] = useState<string[]>(["All Categories"])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All Categories")

  const filteredBounties =
    selectedCategory === "All Categories"
      ? mockBounties
      : mockBounties.filter((bounty) => bounty.category === selectedCategory)

  const fetchCategories = async () => {
    try {
      const data = await (await fetch("/api/categories")).json()
      const categoriesName = data.categories.map((cat: { name: BountryCategory }) => cat.name)
      setCategories(["All Categories", ...categoriesName])
    } catch (err) {
      console.error("Failed to fetch categories", err)
    } finally {
      setCategoriesLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c398e]/20 to-[#1c398e]/10">
      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8 border-0 shadow-xl overflow-auto" style={{ backgroundColor: "#1c398e" }}>
          <CardContent className="p-0 relative">
            <Image height={256} width={1504} src="/images/hosico-banner.png" alt="Hosico Banner" className="w-full h-64 object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1c398e]/80 to-[#1c398e]/60"></div>
            <div className="absolute inset-0 p-8 flex flex-col lg:flex-row items-center justify-between">
              <div className="lg:w-2/3 mb-6 lg:mb-0 z-10">
                <h2 className="text-3xl font-bold mb-4 text-white">
                  Earn HOSICO Tokens by Contributing to Our Community
                </h2>
                <p className="text-lg opacity-90 text-white">
                  Join bounty challenges, showcase your skills, and get rewarded with HOSICO tokens. From creative
                  content to technical development - there&apos;s something for everyone!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 gap-5">
            <h3 className="text-2xl font-bold text-[#1c398e]">Active Bounties</h3>
            <div className="flex flex-wrap gap-2 justify-end">
              {
                categoriesLoading ? (
                  <CategoryButtonsSkeleton />
                ) : (
                  categories.length > 0 && categories.map((cat) => (<Button
                    key={cat}
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className={
                      selectedCategory === cat
                        ? "bg-[#fdc700] text-[#1c398e] border-[#fdc700] font-bold"
                        : "hover:bg-[#fdc700]/20 text-[#1c398e]"
                    }
                  >
                    {cat}
                  </Button>))
                )
              }
            </div>
          </div>

          {filteredBounties.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBounties.map((bounty) => (
                <Card
                  key={bounty.id}
                  className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="border-[#1c398e] text-[#1c398e]">
                        {bounty.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-[#1c398e]">{bounty.title}</CardTitle>
                    <CardDescription>{bounty.description}</CardDescription>
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
                          <span className="text-sm text-muted-foreground">End date: {bounty.timeLeft}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{bounty.submissions} Submissions</span>
                        </div>
                        <Link href={`/bounties/${bounty.id}`}>
                          <Button className="bg-[#ff6900] hover:bg-[#ff6900]/90 text-white">Join Bounty</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground bg-gray-100 py-4 px-2 rounded-md">
              No active bounties at the moment. Please check back later!
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
