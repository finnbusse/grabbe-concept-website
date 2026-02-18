"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { UserCircle, Save, Upload, Loader2 } from "lucide-react"
import Image from "next/image"

interface UserProfile {
  id: string
  user_id: string
  first_name: string | null
  last_name: string | null
  title: string | null
  profile_image_url: string | null
  created_at: string
  updated_at: string
}

export default function ProfilPage() {
  const supabase = createClient()
  const [userEmail, setUserEmail] = useState<string>("")
  const [userId, setUserId] = useState<string>("")
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [title, setTitle] = useState("")
  const [profileImageUrl, setProfileImageUrl] = useState("")
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    setLoading(true)
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setMessage("Nicht angemeldet")
        return
      }

      setUserEmail(user.email || "")
      setUserId(user.id)

      // Load profile
      const { data: profileData, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (error && error.code !== "PGRST116") { // PGRST116 is "no rows returned"
        console.error("Error loading profile:", error)
        // Profile doesn't exist yet - will be created on first save
      } else if (profileData) {
        setProfile(profileData as UserProfile)
        setFirstName((profileData as UserProfile).first_name || "")
        setLastName((profileData as UserProfile).last_name || "")
        setTitle((profileData as UserProfile).title || "")
        setProfileImageUrl((profileData as UserProfile).profile_image_url || "")
      }
    } catch (err) {
      console.error("Error:", err)
      setMessage("Fehler beim Laden des Profils")
    } finally {
      setLoading(false)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Bild ist zu gross (max. 5MB)")
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setMessage("Bitte waehlen Sie eine Bilddatei aus")
      return
    }

    setUploading(true)
    setMessage("")

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `profile-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from("media")
        .getPublicUrl(filePath)

      setProfileImageUrl(publicUrl)
      setMessage("Bild hochgeladen. Bitte speichern Sie Ihr Profil.")
    } catch (err) {
      console.error("Upload error:", err)
      setMessage(err instanceof Error ? err.message : "Fehler beim Hochladen")
    } finally {
      setUploading(false)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage("")

    try {
      const profileData = {
        user_id: userId,
        first_name: firstName || null,
        last_name: lastName || null,
        title: title || null,
        profile_image_url: profileImageUrl || null,
        updated_at: new Date().toISOString(),
      }

      if (profile) {
        // Update existing profile
        const { error } = await supabase
          .from("user_profiles")
          .update(profileData as any)
          .eq("id", profile.id)

        if (error) throw error
      } else {
        // Create new profile
        const { error } = await supabase
          .from("user_profiles")
          .insert(profileData as any)

        if (error) throw error
      }

      setMessage("✓ Profil erfolgreich gespeichert")
      await loadProfile() // Reload to get updated data
    } catch (err) {
      console.error("Save error:", err)
      setMessage("✗ Fehler beim Speichern: " + (err instanceof Error ? err.message : "Unbekannter Fehler"))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Mein Profil</h1>
        <p className="text-sm text-muted-foreground">Verwalten Sie Ihre persoenlichen Informationen</p>
      </div>

      {message && (
        <div className={`rounded-lg border p-4 text-sm ${
          message.startsWith("✓") 
            ? "border-primary/20 bg-primary/5 text-primary" 
            : message.startsWith("✗")
            ? "border-destructive/20 bg-destructive/5 text-destructive"
            : "border-primary/20 bg-primary/5 text-primary"
        }`}>
          {message}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profilinformationen</CardTitle>
          <CardDescription>Diese Informationen werden bei Ihren Beitraegen angezeigt</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-start gap-6">
              <div className="flex flex-col items-center gap-3">
                <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-border bg-muted">
                  {profileImageUrl ? (
                    <Image
                      src={profileImageUrl}
                      alt="Profilbild"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <UserCircle className="h-20 w-20 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("profileImage")?.click()}
                    disabled={uploading}
                    className="gap-2"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Hochladen...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Bild aendern
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">E-Mail (nicht aenderbar)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userEmail}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Titel (optional)</Label>
                    <Input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Dr., Prof. Dr., etc."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">Vorname</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Max"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Nachname</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Mustermann"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="submit" disabled={saving} className="gap-2">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Speichere...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Profil speichern
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profilvorschau</CardTitle>
          <CardDescription>So wird Ihr Name bei Beitraegen angezeigt</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full border border-border bg-muted">
              {profileImageUrl ? (
                <Image
                  src={profileImageUrl}
                  alt="Vorschau"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <UserCircle className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {title && `${title} `}
                {firstName || lastName ? `${firstName} ${lastName}`.trim() : userEmail.split("@")[0]}
              </p>
              <p className="text-xs text-muted-foreground">Autor</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
