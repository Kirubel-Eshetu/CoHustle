"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Sparkles, 
  User, 
  MapPin, 
  Clock, 
  DollarSign, 
  RefreshCw,
  Plus,
  Users,
  TrendingUp
} from "lucide-react"
import PreferenceSetup from "@/components/preference-setup"
import PreferencesEditor from "@/components/preferences-editor"
import SideHustleCard from "@/components/side-hustle-card"
import { SideHustleRecommendation } from "@/lib/ai"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [preferences, setPreferences] = useState<any>(null)
  const [editing, setEditing] = useState(false)
  const [recommendations, setRecommendations] = useState<SideHustleRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("recommendations")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchPreferences()
      fetchRecommendations()
    }
  }, [session])

  const fetchPreferences = async () => {
    try {
      const response = await fetch("/api/preferences")
      if (response.ok) {
        const data = await response.json()
        setPreferences(data)
      }
    } catch (error) {
      console.error("Error fetching preferences:", error)
    }
  }

  const fetchRecommendations = async () => {
    try {
      const response = await fetch("/api/recommendations")
      if (response.ok) {
        const data = await response.json()
        setRecommendations(data)
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error)
    }
  }

  const generateNewRecommendation = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/recommendations/generate", {
        method: "POST",
      })
      if (response.ok) {
        const newRecommendation = await response.json()
        setRecommendations(prev => [newRecommendation, ...prev])
      }
    } catch (error) {
      console.error("Error generating recommendation:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:bg-black dark:bg-none flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (!preferences) {
    return <PreferenceSetup onComplete={fetchPreferences} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:bg-black dark:bg-none">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 dark:bg-black/80 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">CoHustle</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">{session.user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
            <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {session.user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Here are your personalized side hustle recommendations based on your preferences.
          </p>
              <div className="mt-4">
                {editing ? (
                  <PreferencesEditor
                    initial={{
                      country: preferences.country,
                      city: preferences.city,
                      interests: Array.isArray(preferences.interests) ? preferences.interests : [],
                      availableHours: preferences.availableHours,
                      language: preferences.language || "en",
                    }}
                    onCancel={() => setEditing(false)}
                    onSaved={() => {
                      setEditing(false)
                      fetchPreferences()
                    }}
                  />
                ) : (
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-semibold">Location:</span> {preferences.city}, {preferences.country} · {" "}
                      <span className="font-semibold">Interests:</span> {Array.isArray(preferences.interests) ? preferences.interests.join(", ") : ""} · {" "}
                      <span className="font-semibold">Hours:</span> {preferences.availableHours}
                    </div>
                    <Button variant="outline" onClick={() => setEditing(true)}>Edit preferences</Button>
                  </div>
                )}
              </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Total Recommendations</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recommendations.length}</div>
              <p className="text-xs text-muted-foreground">
                AI-generated opportunities
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Location</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{preferences.city}</div>
              <p className="text-xs text-muted-foreground">
                {preferences.country}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Available Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{preferences.availableHours}</div>
              <p className="text-xs text-muted-foreground">
                Per week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recommendations">My Recommendations</TabsTrigger>
            <TabsTrigger value="community">Community Hustles</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Side Hustles</h2>
              <Button 
                onClick={generateNewRecommendation} 
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Generate New</span>
                {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
              </Button>
            </div>

            {recommendations.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No recommendations yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Generate your first side hustle recommendation to get started.
                  </p>
                  <Button onClick={generateNewRecommendation} disabled={isLoading}>
                    Generate First Recommendation
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((recommendation, index) => (
                  <SideHustleCard 
                    key={index} 
                    recommendation={recommendation} 
                    isPersonal={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Community Side Hustles</h2>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">From other users</span>
              </div>
            </div>
            <CommunityHustles />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function CommunityHustles() {
  const [communityHustles, setCommunityHustles] = useState<SideHustleRecommendation[]>([])

  useEffect(() => {
    fetchCommunityHustles()
  }, [])

  const fetchCommunityHustles = async () => {
    try {
      const response = await fetch("/api/community-hustles")
      if (response.ok) {
        const data = await response.json()
        setCommunityHustles(data)
      }
    } catch (error) {
      console.error("Error fetching community hustles:", error)
    }
  }

  if (communityHustles.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No community hustles yet
          </h3>
          <p className="text-gray-600">
            Be the first to share a side hustle with the community!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {communityHustles.map((hustle, index) => (
        <SideHustleCard 
          key={index} 
          recommendation={hustle} 
          isPersonal={false}
        />
      ))}
    </div>
  )
}
