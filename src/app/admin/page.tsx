"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trophy, Users, Eye, Trash2, DollarSign, Plus, X } from "lucide-react"

const activeBounties = [
  {
    id: 1,
    title: "Create Hosico Meme Contest",
    submissions: 12,
    reward: "1,000 HOSICO",
    status: "Active",
    endDate: "2024-01-15",
  },
  {
    id: 2,
    title: "Solana DeFi Integration Guide",
    submissions: 3,
    reward: "5,000 HOSICO",
    status: "Active",
    endDate: "2024-01-20",
  },
]

const adminStats = [
  { label: "Active Bounties", value: "8", icon: Trophy, color: "text-[#ff6900]" },
  { label: "Total Participants", value: "1,234", icon: Users, color: "text-[#1c398e]" },
  { label: "HOSICO Earned", value: "250K HOSICO", icon: DollarSign, color: "text-green-600" },
]

export default function AdminPanel() {
  const [winnerPositions, setWinnerPositions] = useState([
    { place: "1st", prize: "" },
    { place: "2nd", prize: "" },
    { place: "3rd", prize: "" },
  ])

  const [activeBountiesState, setActiveBountiesState] = useState(activeBounties)

  const handleDeleteBounty = (bountyId: number) => {
    setActiveBountiesState((prev) => prev.filter((bounty) => bounty.id !== bountyId))
  }

  const addWinnerPosition = () => {
    const nextPlace = `${winnerPositions.length + 1}${getOrdinalSuffix(winnerPositions.length + 1)}`
    setWinnerPositions([...winnerPositions, { place: nextPlace, prize: "" }])
  }

  const removeWinnerPosition = (index: number) => {
    if (winnerPositions.length > 1) {
      setWinnerPositions(winnerPositions.filter((_, i) => i !== index))
    }
  }

  const updateWinnerPrize = (index: number, prize: string) => {
    const updated = [...winnerPositions]
    updated[index].prize = prize
    setWinnerPositions(updated)
  }

  const getOrdinalSuffix = (num: number) => {
    const j = num % 10
    const k = num % 100
    if (j === 1 && k !== 11) return "st"
    if (j === 2 && k !== 12) return "nd"
    if (j === 3 && k !== 13) return "rd"
    return "th"
  }

  const calculateTotalPrize = () => {
    return winnerPositions.reduce((total, position) => {
      return total + (Number.parseFloat(position.prize) || 0)
    }, 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c398e]/5 to-[#ff6900]/5">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {adminStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-[#1c398e]">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="bounties" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="bounties" className="data-[state=active]:bg-[#ff6900] data-[state=active]:text-white">
              Bounties
            </TabsTrigger>
            <TabsTrigger value="create" className="data-[state=active]:bg-[#ff6900] data-[state=active]:text-white">
              Create Bounty
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bounties" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[#1c398e]">Active Bounties Management</CardTitle>
                <CardDescription>Monitor and manage currently active bounties</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeBountiesState.map((bounty) => (
                    <Card key={bounty.id} className="border border-[#1c398e]/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-[#1c398e] mb-2">{bounty.title}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Submissions:</span>
                                <span className="ml-2 font-medium">{bounty.submissions}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Reward:</span>
                                <span className="ml-2 font-medium text-[#ff6900]">{bounty.reward}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">End Date:</span>
                                <span className="ml-2 font-medium">{bounty.endDate}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive">
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Bounty</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete &quot;{bounty.title}&quot;? This action cannot be undone and
                                    will remove all submissions associated with this bounty.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteBounty(bounty.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete Bounty
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[#1c398e]">Create New Bounty</CardTitle>
                <CardDescription>Set up a new bounty challenge for the community</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Bounty Title</Label>
                      <Input id="title" placeholder="Enter bounty title" />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="creative">Creative</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="community">Community</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="duration">Duration (days)</Label>
                      <Input id="duration" placeholder="Enter duration in days" type="number" />
                    </div>
                  </div>
                </div>

                <Card className="border border-[#1c398e]/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg text-[#1c398e]">Prize Distribution</CardTitle>
                        <CardDescription>Set rewards for each winner position</CardDescription>
                      </div>
                      <Button
                        type="button"
                        onClick={addWinnerPosition}
                        size="sm"
                        className="bg-[#ff6900] hover:bg-[#ff6900]/90 text-white"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Winner
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {winnerPositions.map((position, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2 min-w-0 flex-1">
                            <div className="w-8 h-8 bg-[#fdc700] rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-bold text-[#1c398e]">{position.place}</span>
                            </div>
                            <div className="flex-1">
                              <Label htmlFor={`prize-${index}`} className="text-sm">
                                {position.place} Place Prize (HOSICO)
                              </Label>
                              <Input
                                id={`prize-${index}`}
                                placeholder="Enter prize amount"
                                type="number"
                                value={position.prize}
                                onChange={(e) => updateWinnerPrize(index, e.target.value)}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          {winnerPositions.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removeWinnerPosition(index)}
                              size="sm"
                              variant="outline"
                              className="flex-shrink-0"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">Total Prize Pool</Label>
                        <span className="text-lg font-bold text-[#ff6900]">
                          {calculateTotalPrize().toLocaleString()} HOSICO
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed description of the bounty requirements..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="requirements">Requirements & Guidelines</Label>
                  <Textarea
                    id="requirements"
                    placeholder="List specific requirements, submission guidelines, and evaluation criteria..."
                    rows={4}
                  />
                </div>
                <div className="flex space-x-4">
                  <Button className="bg-[#ff6900] hover:bg-[#ff6900]/90 text-white">Create Bounty</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
