"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sparkles, MapPin, Clock, Heart, Globe } from "lucide-react"

const INTERESTS = [
  "Technology", "Writing", "Design", "Marketing", "Sales", "Teaching", 
  "Customer Service", "Data Entry", "Translation", "Virtual Assistant",
  "Social Media", "Content Creation", "Photography", "Video Editing",
  "Web Development", "Mobile Development", "Graphic Design", "UI/UX",
  "SEO", "Digital Marketing", "E-commerce", "Freelancing", "Consulting"
]

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "am", name: "Amharic" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "tr", name: "Turkish" }
]

interface PreferenceSetupProps {
  onComplete: () => void
}

export default function PreferenceSetup({ onComplete }: PreferenceSetupProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    country: "",
    city: "",
    interests: [] as string[],
    availableHours: "",
    language: "en"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleSubmit = async () => {
    if (!formData.country || !formData.city || formData.interests.length === 0 || !formData.availableHours) {
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          interests: JSON.stringify(formData.interests),
          availableHours: formData.availableHours
        }),
      })

      if (response.ok) {
        onComplete()
      }
    } catch (error) {
      console.error("Error saving preferences:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.country && formData.city
      case 2:
        return formData.interests.length > 0
      case 3:
        return formData.availableHours
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CoHustle</span>
          </div>
          <CardTitle className="text-2xl">Let's Find Your Perfect Side Hustle</CardTitle>
          <CardDescription>
            Tell us about yourself so we can recommend the best opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step > stepNumber ? "bg-blue-600" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Location */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Where are you located?</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="e.g., Ethiopia"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="e.g., Addis Ababa"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Preferred Language</Label>
                <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Interests */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold">What interests you?</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Select all that apply. This helps us find opportunities that match your skills and interests.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {INTERESTS.map((interest) => (
                  <Badge
                    key={interest}
                    variant={formData.interests.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-blue-50"
                    onClick={() => handleInterestToggle(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Time Commitment */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold">How much time can you commit?</h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">Available Hours per Week</Label>
                <Select value={formData.availableHours} onValueChange={(value) => setFormData(prev => ({ ...prev, availableHours: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hours per week" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">1-5 hours</SelectItem>
                    <SelectItem value="5-10">5-10 hours</SelectItem>
                    <SelectItem value="10-20">10-20 hours</SelectItem>
                    <SelectItem value="20-30">20-30 hours</SelectItem>
                    <SelectItem value="30+">30+ hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => setStep(prev => Math.max(1, prev - 1))}
              disabled={step === 1}
            >
              Previous
            </Button>
            
            {step < 3 ? (
              <Button
                onClick={() => setStep(prev => prev + 1)}
                disabled={!canProceed()}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
              >
                {isSubmitting ? "Setting up..." : "Complete Setup"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
