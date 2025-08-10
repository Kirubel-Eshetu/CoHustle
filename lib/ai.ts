import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface UserPreferences {
  country: string
  city: string
  interests: string[]
  availableHours: string
  language: string
}

export interface SideHustleRecommendation {
  title: string
  description: string
  category: string
  requirements: string
  estimatedEarnings: string
  timeCommitment: string
  location: string
  source: string
}

export async function generateSideHustleRecommendation(
  preferences: UserPreferences,
  previousRecommendations: SideHustleRecommendation[] = []
): Promise<SideHustleRecommendation> {
  const systemPrompt = `You are a side hustle expert who helps people find the perfect side hustle based on their location, interests, and available time. 

Generate a personalized side hustle recommendation that:
1. Is suitable for the user's country and city
2. Matches their interests and skills
3. Fits within their available time commitment
4. Has realistic earning potential for their location
5. Is different from previous recommendations

Format your response as a JSON object with these exact fields:
{
  "title": "Side hustle title",
  "description": "Detailed description of the side hustle",
  "category": "Category (e.g., Freelancing, E-commerce, Services, etc.)",
  "requirements": "Skills, tools, or requirements needed",
  "estimatedEarnings": "Realistic earning range for their location",
  "timeCommitment": "How much time is needed",
  "location": "Where this can be done (remote, local, etc.)",
  "source": "Where you found this information or inspiration"
}

Be specific, realistic, and actionable. Consider local market conditions and opportunities.`

  const userPrompt = `User Preferences:
- Country: ${preferences.country}
- City: ${preferences.city}
- Interests: ${preferences.interests.join(', ')}
- Available Hours: ${preferences.availableHours}
- Language: ${preferences.language}

${previousRecommendations.length > 0 ? `Previous recommendations to avoid repeating:
${previousRecommendations.map((rec, i) => `${i + 1}. ${rec.title}`).join('\n')}` : ''}

Please generate a new side hustle recommendation that's different from the previous ones.`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    // Try to parse JSON response
    try {
      const recommendation = JSON.parse(response)
      return recommendation as SideHustleRecommendation
    } catch (parseError) {
      // Fallback: create a structured response from text
      return {
        title: "AI-Generated Side Hustle",
        description: response,
        category: "General",
        requirements: "Varies based on opportunity",
        estimatedEarnings: "Varies by location and effort",
        timeCommitment: preferences.availableHours,
        location: preferences.city + ", " + preferences.country,
        source: "AI-generated recommendation"
      }
    }
  } catch (error) {
    console.error('Error generating side hustle recommendation:', error)
    throw new Error('Failed to generate recommendation')
  }
}

export async function searchSideHustles(
  query: string,
  location: string
): Promise<SideHustleRecommendation[]> {
  const systemPrompt = `You are a side hustle research assistant. Search for real side hustle opportunities based on the user's query and location. 

Return results as a JSON array of side hustle opportunities, each with these fields:
{
  "title": "Side hustle title",
  "description": "Description",
  "category": "Category",
  "requirements": "Requirements",
  "estimatedEarnings": "Earning potential",
  "timeCommitment": "Time needed",
  "location": "Location details",
  "source": "Source of information"
}

Focus on real, actionable opportunities available in the specified location.`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Search for side hustles related to: "${query}" in ${location}` }
      ],
      temperature: 0.5,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      return []
    }

    try {
      const results = JSON.parse(response)
      return Array.isArray(results) ? results : [results]
    } catch {
      return []
    }
  } catch (error) {
    console.error('Error searching side hustles:', error)
    return []
  }
}
