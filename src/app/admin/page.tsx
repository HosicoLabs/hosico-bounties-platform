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
import { Eye, Trash2, Plus, X } from "lucide-react"
import { useAdmin } from "@/components/admin/use-admin"

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

export default function AdminPanel() {
  const { isAdmin } = useAdmin()

  const [bountyTitle, setBountyTitle] = useState("")
  const [bountyDescription, setBountyDescription] = useState("")
  const [bountyRequirements, setBountyRequirements] = useState("")
  const [bountyCategory, setBountyCategory] = useState("")
  const [bountyEndDate, setBountyEndDate] = useState("")
  const [bountyPrizes, setBountyPrizes] = useState([
    { place: "1st", prize: "" },
    { place: "2nd", prize: "" },
    { place: "3rd", prize: "" },
  ])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const [activeBountiesState, setActiveBountiesState] = useState(activeBounties)

  const handleDeleteBounty = (bountyId: number) => {
    setActiveBountiesState((prev) => prev.filter((bounty) => bounty.id !== bountyId))
  }

  const addWinnerPosition = () => {
    const nextPlace = `${bountyPrizes.length + 1}${getOrdinalSuffix(bountyPrizes.length + 1)}`
    setBountyPrizes([...bountyPrizes, { place: nextPlace, prize: "" }])
  }

  const removeWinnerPosition = (index: number) => {
    if (bountyPrizes.length > 1) {
      setBountyPrizes(bountyPrizes.filter((_, i) => i !== index))
    }
  }

  const updateWinnerPrize = (index: number, prize: string) => {
    const updated = [...bountyPrizes]
    updated[index].prize = prize
    setBountyPrizes(updated)
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
    return bountyPrizes.reduce((total, position) => {
      return total + (Number.parseFloat(position.prize) || 0)
    }, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault()

      console.log(
        bountyTitle,
        bountyDescription,
        bountyRequirements,
        bountyCategory,
        bountyEndDate,
        bountyPrizes
      )
      if (!bountyTitle || !bountyDescription || !bountyRequirements || !bountyCategory || !bountyEndDate || bountyPrizes.length === 0) {
        throw new Error("Please fill in all required fields.")
      }

      const formData = JSON.stringify({
        title: bountyTitle,
        description: bountyDescription,
        requirements: bountyRequirements,
        category: bountyCategory,
        endDate: bountyEndDate,
        prizes: bountyPrizes,
      })

      setIsSubmitting(true)

      const response = await fetch("/api/admin/create-bounty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create bounty")
      }

      setIsSuccess(true)
      setError(null)
      setBountyTitle("")
      setBountyDescription("")
      setBountyRequirements("")
      setBountyCategory("")
      setBountyEndDate("")
      setBountyPrizes([{ place: "1st", prize: "" }, { place: "2nd", prize: "" }, { place: "3rd", prize: "" }])
    } catch (err) {
      console.error("Failed to create bounty", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAdmin) {
    return (
      <p>404</p>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c398e]/5 to-[#ff6900]/5">
      <main className="container mx-auto px-4 py-8">
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1">
                    <div className="space-y-4 mb-4">
                      <div>
                        <Label htmlFor="title">Bounty Title</Label>
                        <Input
                          id="title"
                          placeholder="Enter bounty title"
                          required
                          onChange={(e) => setBountyTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Provide detailed description of the bounty requirements..."
                          rows={4}
                          required
                          onChange={(e) => setBountyDescription(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="requirements">Requirements & Guidelines</Label>
                        <Textarea
                          id="requirements"
                          placeholder="List specific requirements, submission guidelines, and evaluation criteria..."
                          rows={4}
                          required
                          onChange={(e) => setBountyRequirements(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-4 md:grid-cols-2 gap-6 md:grid">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select required onValueChange={(value) => setBountyCategory(value)}>
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
                      <div>
                        <Label htmlFor="duration">Duration (days)</Label>
                        <Input id="duration" placeholder="Enter duration in days" type="date" onChange={(e) => setBountyEndDate(e.target.value)} />
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
                        {bountyPrizes.map((position, index) => (
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
                                  required
                                />
                              </div>
                            </div>
                            {bountyPrizes.length > 1 && (
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
                  <div className="flex space-x-4">
                    <Button type="submit" className="bg-[#ff6900] hover:bg-[#ff6900]/90 text-white">Create Bounty</Button>
                  </div>
                </form>

                {isSuccess ? (
                  <p className="text-green-600 font-medium">Bounty created successfully!</p>
                ) : error ? (
                  <p className="text-red-600 font-medium">Error: {error}</p>
                ) : ""}

                {
                  isSubmitting ? (
                    <p className="text-muted-foreground">Submitting bounty...</p>
                  ) : ""
                }
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
