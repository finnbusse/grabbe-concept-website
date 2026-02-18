# User/Teacher Profile Management System - Implementation Documentation

## Übersicht

Dieses Dokument beschreibt die Implementierung des erweiterten Benutzer-/Lehrerverwaltungssystems für das Grabbe-Gymnasium CMS.

## Funktionen

### 1. Erweitertes Benutzerprofil
Lehrer können jetzt folgende Informationen verwalten:
- **Vorname** (first_name)
- **Nachname** (last_name)
- **Titel** (z.B. "Dr.", "Prof. Dr.")
- **E-Mail-Adresse** (von Supabase Auth verwaltet)
- **Passwort** (von Supabase Auth verwaltet)
- **Profilbild** (profile_image_url)

### 2. Profilbild-Upload
- Unterstützte Formate: Alle Bildformate
- Maximale Dateigröße: 5 MB
- Speicherort: Supabase Storage Bucket "media" im Ordner "profile-images"
- Automatische URL-Generierung

### 3. CMS-Dashboard Profilverwaltung
Lehrer können im CMS-Dashboard unter "/cms/profil":
- Ihr Profil ansehen und bearbeiten
- Profilbild hochladen und ändern
- Name und Titel aktualisieren
- Vorschau ihres Profils sehen

### 4. Automatische Autorenzuordnung
Bei Newsbeiträgen:
- Der angemeldete Benutzer wird automatisch als Autor zugeordnet (user_id)
- Name und Profilbild werden aus dem Profil geladen
- Fallback auf author_name Feld falls kein Profil vorhanden
- Fallback auf E-Mail-Präfix wenn weder Profil noch author_name vorhanden

### 5. Öffentliche Anzeige
Auf der öffentlichen Website (News-Seiten):
- Kleines Avatar-Bild des Autors wird angezeigt
- Name des Autors (mit Titel, falls vorhanden)
- Anzeige auf:
  - Homepage (News-Section)
  - Aktuelles-Übersicht (/aktuelles)
  - Einzelne Newsbeiträge (/aktuelles/[slug])

### 6. "Angemeldet bleiben" Funktion
Im Login-System:
- Checkbox "Angemeldet bleiben" auf der Login-Seite
- Speichert Präferenz in localStorage
- Nutzt Supabase's automatische Session-Refresh (30 Tage Refresh Token)
- Präferenz wird beim Logout gelöscht

## Datenbankschema

### Neue Tabelle: user_profiles

```sql
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  title TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Row Level Security (RLS)

- **SELECT**: Öffentlich zugänglich (für Autor-Anzeige auf Website)
- **INSERT**: Nur eigenes Profil erstellen
- **UPDATE**: Nur eigenes Profil bearbeiten
- **DELETE**: Nur eigenes Profil löschen

### Indizes
- `idx_user_profiles_user_id` auf `user_id` für schnelle Lookups

## Migration

### Dateien
1. **scripts/migration_add_user_profiles.sql** - Migrations-Skript
2. **scripts/complete_schema.sql** - Aktualisiertes vollständiges Schema

### Anwendung der Migration
```sql
-- In Supabase SQL Editor ausführen:
\i migration_add_user_profiles.sql
```

## API-Endpunkte

Keine neuen API-Endpunkte erforderlich. Alle Operationen verwenden direkte Supabase-Clientabfragen.

## Komponenten

### Neue Seiten
- `/app/cms/profil/page.tsx` - Profil-Editor für Lehrer

### Aktualisierte Komponenten
- `components/cms/cms-sidebar.tsx` - Navigation mit "Mein Profil" Link
- `components/news-section.tsx` - Autor-Avatar auf Homepage
- `app/aktuelles/page.tsx` - Autor-Avatar auf Übersichtsseite
- `app/aktuelles/[slug]/page.tsx` - Autor-Avatar auf Detailseite
- `app/cms/users/page.tsx` - Anzeige von Profilinformationen
- `app/auth/login/page.tsx` - "Angemeldet bleiben" Checkbox

### Datenbankabfragen mit Profilen
Beispiel für Posts mit Profil-Join:
```typescript
const { data: posts } = await supabase
  .from("posts")
  .select(`
    *,
    user_profiles (
      first_name,
      last_name,
      title,
      profile_image_url
    )
  `)
  .eq("published", true)
```

## Benutzerfluss

### Profil erstellen/bearbeiten
1. Lehrer meldet sich im CMS an
2. Navigiert zu "Mein Profil" in der Sidebar
3. Füllt Vor- und Nachname aus (optional: Titel)
4. Lädt Profilbild hoch (optional)
5. Speichert Profil
6. Vorschau zeigt, wie Name auf Website erscheint

### Beitrag erstellen
1. Lehrer erstellt neuen Beitrag
2. `user_id` wird automatisch gesetzt
3. Profil wird automatisch mit Beitrag verknüpft
4. Auf der Website wird Autor mit Profilbild angezeigt

### "Angemeldet bleiben"
1. Benutzer wählt Checkbox beim Login
2. Session-Refresh Token gilt 30 Tage
3. Benutzer bleibt automatisch angemeldet
4. Bei Logout wird Präferenz gelöscht

## Rückwärtskompatibilität

Das System ist vollständig rückwärtskompatibel:
- Bestehende Beiträge funktionieren weiterhin
- `author_name` Feld bleibt als Fallback erhalten
- Posts ohne Profilinformationen zeigen "Redaktion" als Autor
- Bestehende Benutzer können Profil jederzeit erstellen

## Sicherheit

### Profilbilder
- Größenlimit: 5 MB
- Type-Checking: Nur Bilddateien erlaubt
- Speicherung in Supabase Storage mit öffentlichem Zugriff

### Datenschutz
- Profildaten sind öffentlich sichtbar (für Autor-Anzeige)
- E-Mail-Adresse wird NICHT öffentlich angezeigt
- Nur Name, Titel und Profilbild sind öffentlich

### RLS-Policies
- Benutzer können nur eigene Profile bearbeiten
- Alle können Profile lesen (für Autor-Anzeige)
- Cascade Delete: Profil wird gelöscht, wenn Benutzer gelöscht wird

## Testen

### Manuelle Tests
1. **Profil erstellen**
   - Als Lehrer anmelden
   - Zu /cms/profil navigieren
   - Alle Felder ausfüllen
   - Profilbild hochladen
   - Speichern und Vorschau prüfen

2. **Beitrag erstellen**
   - Neuen Beitrag erstellen
   - Veröffentlichen
   - Auf Homepage prüfen (Avatar sichtbar?)
   - Auf /aktuelles prüfen (Avatar sichtbar?)
   - Einzelnen Beitrag öffnen (Avatar sichtbar?)

3. **Remember Me**
   - Mit "Angemeldet bleiben" anmelden
   - Browser schließen und neu öffnen
   - Session sollte bestehen bleiben
   - Ausloggen
   - Neu anmelden OHNE "Angemeldet bleiben"
   - Session sollte nach Standard-Timeout ablaufen

## Zukünftige Erweiterungen

Mögliche Erweiterungen:
- Zusätzliche Profilfelder (Fächer, Sprechzeiten, etc.)
- Lehrer-Profilseiten auf der öffentlichen Website
- E-Mail-Benachrichtigungen bei Profiländerungen
- Profil-Completion-Status (z.B. "80% vollständig")

## Support

Bei Fragen oder Problemen:
1. Prüfen Sie die Supabase-Logs im Dashboard
2. Prüfen Sie Browser-Console auf Fehler
3. Prüfen Sie RLS-Policies in Supabase

## Changelog

### Version 1.0 (2026-02-18)
- Initial Release
- User Profiles mit Profilbild-Upload
- Automatische Autorenzuordnung bei Posts
- Öffentliche Autor-Anzeige mit Avatar
- "Angemeldet bleiben" Funktion
- Vollständige Rückwärtskompatibilität
