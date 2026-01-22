"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X } from "lucide-react"
import { useBounties } from "@/components/bounties-provider"
import { useSolana } from "@/components/solana/use-solana"
import { cn } from "@/lib/utils"
import { Bounty } from "@/app/types"

interface EditTabContentProps {
  bounty: Bounty
  onBountyUpdated: () => void
}

interface PrizePosition {
  place: string
  prize: string
}

export function EditTabContent({ bounty, onBountyUpdated }: EditTabContentProps) {
  const { categories } = useBounties()
  const { wallet } = useSolana()

  const [bountyTitle, setBountyTitle] = useState("")
  const [bountyDescription, setBountyDescription] = useState("")
  const [bountyRequirements, setBountyRequirements] = useState("")
  const [bountyCategory, setBountyCategory] = useState<number | null>(null)
  const [bountyEndDate, setBountyEndDate] = useState("")
  const [bountyPrizes, setBountyPrizes] = useState<PrizePosition[]>([])

  const [selectedToken, setSelectedToken] = useState("hosico")
  const [customTokenName, setCustomTokenName] = useState("")
  const [customTokenAddress, setCustomTokenAddress] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (bounty) {
      setBountyTitle(bounty.title || "")
      setBountyDescription(bounty.description || "")
      setBountyRequirements(bounty.requirements || "")
      
      const categoryId = typeof bounty.category === 'number' ? bounty.category : (bounty.category as any)?.id || null
      setBountyCategory(categoryId)
      
      if (bounty.end_date) {
        const date = new Date(bounty.end_date)
        const formattedDate = date.toISOString().split('T')[0]
        setBountyEndDate(formattedDate)
      }

      if (bounty.prizes && bounty.prizes.length > 0) {
        setBountyPrizes(
          bounty.prizes.map((p) => ({
            place: p.place,
            prize: String(p.prize),
          }))
        )
      }

      if (bounty.is_custom_token) {
        setSelectedToken("custom")
        setCustomTokenName(bounty.token_symbol || "")
        setCustomTokenAddress(bounty.token_address || "")
      } else if (bounty.token_symbol === "SOL") {
        setSelectedToken("sol")
      } else if (bounty.token_symbol === "USDC") {
        setSelectedToken("usdc")
      } else {
        setSelectedToken("hosico")
      }
    }
  }, [bounty, categories])

  function getOrdinalSuffix(num: number): string {
    const j = num % 10
    const k = num % 100
    if (j === 1 && k !== 11) return "st"
    if (j === 2 && k !== 12) return "nd"
    if (j === 3 && k !== 13) return "rd"
    return "th"
  }

  function addWinnerPosition() {
    const nextPlace = `${bountyPrizes.length + 1}${getOrdinalSuffix(bountyPrizes.length + 1)}`
    setBountyPrizes([...bountyPrizes, { place: nextPlace, prize: "" }])
  }

  function removeWinnerPosition(index: number) {
    if (bountyPrizes.length > 1) {
      setBountyPrizes(bountyPrizes.filter((_, i) => i !== index))
    }
  }

  function updateWinnerPrize(index: number, prize: string) {
    const updated = [...bountyPrizes]
    updated[index].prize = prize
    setBountyPrizes(updated)
  }

  function getTokenSymbol(): string {
    if (selectedToken === "custom") return customTokenName || "TOKEN"
    if (selectedToken === "sol") return "SOL"
    if (selectedToken === "usdc") return "USDC"
    return "HOSICO"
  }

  function calculateTotalPrize(): number {
    return bountyPrizes.reduce((total, position) => {
      return total + (Number.parseFloat(position.prize) || 0)
    }, 0)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setIsSuccess(false)

    try {
      if (!bountyTitle || !bountyDescription || !bountyRequirements || !bountyCategory || !bountyEndDate || bountyPrizes.length === 0) {
        throw new Error("Please fill in all required fields.")
      }

      const tokenData = selectedToken === "custom" 
        ? {
            token_symbol: customTokenName,
            token_address: customTokenAddress,
            is_custom_token: true,
          }
        : selectedToken === "hosico"
        ? {
            token_symbol: "HOSICO",
            token_address: "Dx2bQe2UPv4k3BmcW8G2KhaL5oKsxduM5XxLSV3Sbonk",
            is_custom_token: false,
          }
        : selectedToken === "sol"
        ? {
            token_symbol: "SOL",
            token_address: "So11111111111111111111111111111111111111111",
            is_custom_token: false,
          }
        : {
            token_symbol: "USDC",
            token_address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            is_custom_token: false,
          }

      const walletAddress = wallet?.accounts?.[0]?.address

      if (!walletAddress) {
        throw new Error("Wallet not connected")
      }

      const formData = JSON.stringify({
        bounty: {
          id: bounty.id,
          title: bountyTitle,
          description: bountyDescription,
          requirements: bountyRequirements,
          category: bountyCategory,
          end_date: bountyEndDate,
          prizes: bountyPrizes,
          ...tokenData,
        },
        walletAddress,
      })

      const response = await fetch("/api/admin/bounty/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update bounty")
      }

      setIsSuccess(true)
      setError(null)
      onBountyUpdated()
    } catch (err) {
      console.error("Failed to update bounty", err)
      setError(err instanceof Error ? err.message : "Failed to update bounty")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-[#1c398e]">Edit Bounty</CardTitle>
        <CardDescription>Update bounty details and requirements</CardDescription>
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
                  disabled={isSubmitting}
                  value={bountyTitle}
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
                  disabled={isSubmitting}
                  value={bountyDescription}
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
                  disabled={isSubmitting}
                  value={bountyRequirements}
                  onChange={(e) => setBountyRequirements(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-4 md:grid-cols-2 gap-6 md:grid">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  key={`category-${bounty.id}-${bountyCategory}`}
                  disabled={isSubmitting} 
                  required 
                  value={bountyCategory !== null ? bountyCategory.toString() : undefined} 
                  onValueChange={(value) => setBountyCategory(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(({ id, name }) => (
                      <SelectItem key={id} value={id.toString()}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">End Date</Label>
                <Input 
                  required 
                  disabled={isSubmitting} 
                  id="duration" 
                  placeholder="Enter end date" 
                  type="date" 
                  value={bountyEndDate}
                  onChange={(e) => setBountyEndDate(e.target.value)} 
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="token">Reward Token</Label>
                <Select
                  key={`token-${bounty.id}-${selectedToken}`}
                  disabled={isSubmitting} 
                  value={selectedToken} 
                  onValueChange={(value) => setSelectedToken(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reward token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hosico">Hosico (HOSICO)</SelectItem>
                    <SelectItem value="sol">Solana (SOL)</SelectItem>
                    <SelectItem value="usdc">USD Coin (USDC)</SelectItem>
                    <SelectItem value="custom">Custom Token</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedToken === "custom" && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-[#1c398e]/20">
                  <div>
                    <Label htmlFor="customTokenName">Custom Token Name</Label>
                    <Input
                      id="customTokenName"
                      placeholder="e.g., BONK, WIF"
                      required
                      disabled={isSubmitting}
                      value={customTokenName}
                      onChange={(e) => setCustomTokenName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="customTokenAddress">Custom Token Address</Label>
                    <Input
                      id="customTokenAddress"
                      placeholder="e.g., DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
                      required
                      disabled={isSubmitting}
                      value={customTokenAddress}
                      onChange={(e) => setCustomTokenAddress(e.target.value)}
                    />
                  </div>
                </div>
              )}
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
                  disabled={isSubmitting}
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
                      <div className="w-8 h-8 bg-[#fdc700] rounded-full flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-[#1c398e]">{position.place}</span>
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={`prize-${index}`} className="text-sm">
                          {position.place} Place Prize ({getTokenSymbol()})
                        </Label>
                        <Input
                          id={`prize-${index}`}
                          placeholder="Enter prize amount"
                          type="number"
                          value={position.prize}
                          onChange={(e) => updateWinnerPrize(index, e.target.value)}
                          className="mt-1"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    {bountyPrizes.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeWinnerPosition(index)}
                        size="sm"
                        variant="outline"
                        className="shrink-0"
                        disabled={isSubmitting}
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
                    {calculateTotalPrize().toLocaleString()} {getTokenSymbol()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex space-x-4">
            <Button
              type="submit"
              className={cn("hover:bg-[#ff6900]/90 text-white", isSubmitting ? "opacity-50 cursor-not-allowed pointer-events-none bg-gray-400" : "bg-[#ff6900]")}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Bounty"}
            </Button>
          </div>
        </form>

        {isSuccess && (
          <p className="text-green-600 font-medium">Bounty updated successfully!</p>
        )}
        {error && (
          <p className="text-red-600 font-medium">Error: {error}</p>
        )}
      </CardContent>
    </Card>
  )
}
