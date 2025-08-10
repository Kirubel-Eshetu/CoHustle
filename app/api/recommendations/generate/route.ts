import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateSideHustleRecommendation, UserPreferences } from "@/lib/ai"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user preferences
    const userPreferences = await prisma.userPreference.findUnique({
      where: {
        userId: session.user.id
      }
    })

    if (!userPreferences) {
      return NextResponse.json({ error: "User preferences not found" }, { status: 404 })
    }

    // Get previous recommendations to avoid duplicates
    const previousRecommendations = await prisma.sideHustle.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        title: true,
        description: true,
        category: true,
        requirements: true,
        estimatedEarnings: true,
        timeCommitment: true,
        location: true,
        source: true
      }
    })

    // Generate new recommendation
    const preferences: UserPreferences = {
      country: userPreferences.country,
      city: userPreferences.city,
      interests: JSON.parse(userPreferences.interests),
      availableHours: userPreferences.availableHours,
      language: userPreferences.language
    }

    const newRecommendation = await generateSideHustleRecommendation(
      { ...preferences, name: session.user?.name || undefined },
      previousRecommendations
    )

    // Save to database
    const savedRecommendation = await prisma.sideHustle.create({
      data: {
        userId: session.user.id,
        title: newRecommendation.title,
        description: newRecommendation.description,
        category: newRecommendation.category,
        requirements: newRecommendation.requirements,
        estimatedEarnings: newRecommendation.estimatedEarnings,
        timeCommitment: newRecommendation.timeCommitment,
        location: newRecommendation.location,
        source: newRecommendation.source,
        aiGenerated: true
      }
    })

    return NextResponse.json(savedRecommendation)
  } catch (error) {
    console.error("Error generating recommendation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
