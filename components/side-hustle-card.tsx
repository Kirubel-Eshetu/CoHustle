"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  DollarSign, 
  Clock, 
  MapPin, 
  User, 
  ExternalLink,
  Heart,
  Share2
} from "lucide-react"
import { SideHustleRecommendation } from "@/lib/ai"

interface SideHustleCardProps {
  recommendation: SideHustleRecommendation
  isPersonal: boolean
}

export default function SideHustleCard({ recommendation, isPersonal }: SideHustleCardProps) {
  const [isLiked, setIsLiked] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    // TODO: Implement like functionality
  }

  const handleShare = () => {
    // TODO: Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: recommendation.title,
        text: recommendation.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(`${recommendation.title}: ${recommendation.description}`)
    }
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{recommendation.title}</CardTitle>
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {recommendation.category}
              </Badge>
              {isPersonal && (
                <Badge variant="outline" className="text-xs">
                  AI Generated
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`p-1 h-8 w-8 ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="p-1 h-8 w-8 text-gray-400"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-sm leading-relaxed">
          {recommendation.description}
        </CardDescription>

        <div className="space-y-3">
          {/* Requirements */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Requirements</h4>
            <p className="text-sm text-gray-600">{recommendation.requirements}</p>
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-500">Earnings</p>
                <p className="text-sm font-medium">{recommendation.estimatedEarnings}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500">Time</p>
                <p className="text-sm font-medium">{recommendation.timeCommitment}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm font-medium">{recommendation.location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-orange-600" />
              <div>
                <p className="text-xs text-gray-500">Source</p>
                <p className="text-sm font-medium">{recommendation.source}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <Button className="flex-1" size="sm">
              Learn More
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
            {isPersonal && (
              <Button variant="outline" size="sm" className="flex-1">
                Save
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
