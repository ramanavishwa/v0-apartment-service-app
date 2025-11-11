"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { addFavorite, removeFavorite, isFavorite } from "@/lib/favorites-utils"

interface FavoriteButtonProps {
  issueId: string
  userId: string
  size?: number
}

export function FavoriteButton({ issueId, userId, size = 20 }: FavoriteButtonProps) {
  const [isFav, setIsFav] = useState(false)

  useEffect(() => {
    setIsFav(isFavorite(userId, issueId))
  }, [userId, issueId])

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isFav) {
      removeFavorite(userId, issueId)
      setIsFav(false)
    } else {
      addFavorite(userId, issueId)
      setIsFav(true)
    }
  }

  return (
    <Button onClick={handleToggle} variant="ghost" size="sm" className={isFav ? "text-red-500" : "text-gray-400"}>
      <Heart size={size} className={isFav ? "fill-red-500" : ""} />
    </Button>
  )
}
