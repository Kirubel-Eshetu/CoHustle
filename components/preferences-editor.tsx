"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Preferences = {
  country: string
  city: string
  interests: string[]
  availableHours: string
  language: string
}

interface PreferencesEditorProps {
  initial: Preferences
  onCancel: () => void
  onSaved: () => void
}

export default function PreferencesEditor({ initial, onCancel, onSaved }: PreferencesEditorProps) {
  const [form, setForm] = useState<Preferences>({ ...initial })
  const [interestsInput, setInterestsInput] = useState(initial.interests.join(", "))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const parseInterests = (value: string) =>
    value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

  const handleSave = async () => {
    setSaving(true)
    setError("")
    const interests = parseInterests(interestsInput)
    try {
      const res = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: form.country,
          city: form.city,
          interests: JSON.stringify(interests),
          availableHours: form.availableHours,
          language: form.language,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || "Failed to save preferences")
      } else {
        onSaved()
      }
    } catch (e) {
      setError("Network error. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-black/60">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={form.country}
            onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={form.city}
            onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="interests">Interests (comma-separated)</Label>
          <Input
            id="interests"
            placeholder="e.g., Writing, Marketing, Design"
            value={interestsInput}
            onChange={(e) => setInterestsInput(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Available Hours per Week</Label>
          <Select
            value={form.availableHours}
            onValueChange={(v) => setForm((p) => ({ ...p, availableHours: v }))}
          >
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
        <div className="space-y-2">
          <Label>Preferred Language</Label>
          <Select value={form.language} onValueChange={(v) => setForm((p) => ({ ...p, language: v }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="am">Amharic</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  )
}


