import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const preferences = await prisma.userPreference.findUnique({
      where: {
        userId: session.user.id
      }
    })

    if (!preferences) {
      return NextResponse.json(null)
    }

    return NextResponse.json({
      ...preferences,
      interests: JSON.parse(preferences.interests)
    })
  } catch (error) {
    console.error("Error fetching preferences:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { country, city, interests, availableHours, language } = body

    // Validate required fields
    if (!country || !city || !interests || !availableHours) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create or update preferences
    const preferences = await prisma.userPreference.upsert({
      where: {
        userId: session.user.id
      },
      update: {
        country,
        city,
        interests: typeof interests === 'string' ? interests : JSON.stringify(interests),
        availableHours,
        language: language || 'en'
      },
      create: {
        userId: session.user.id,
        country,
        city,
        interests: typeof interests === 'string' ? interests : JSON.stringify(interests),
        availableHours,
        language: language || 'en'
      }
    })

    return NextResponse.json({
      ...preferences,
      interests: JSON.parse(preferences.interests)
    })
  } catch (error) {
    console.error("Error saving preferences:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
