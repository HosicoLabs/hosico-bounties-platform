import { BountyPrize } from "@/app/types"

 export const calculateTotalPrize = (bountyPrizes: BountyPrize[]) => {
    return bountyPrizes.reduce((total, position) => {
      return total + (Number.parseFloat(position.prize.toString()) || 0)
    }, 0).toLocaleString()
  }