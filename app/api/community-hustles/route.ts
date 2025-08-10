import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Get side hustles from other users (excluding the current user)
    const communityHustles = await prisma.sideHustle.findMany({
      where: {
        userId: {
          not: null // Only get hustles that have a user (not system-generated)
        }
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20 // Limit to 20 most recent
    })

    // Format the response to include user names
    const formattedHustles = communityHustles.map(hustle => ({
      ...hustle,
      userName: hustle.user?.name || 'Anonymous'
    }))

    return NextResponse.json(formattedHustles)
  } catch (error) {
    console.error("Error fetching community hustles:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
