# Security Hardening Checklist (Deployment Gate)

Diese Checkliste muss vor jedem produktiven Rollout vollständig erfüllt sein.

- [ ] **Secrets ausschließlich in Secret-Store** hinterlegt (keine produktiven Tokens in `site_settings`)
  - [ ] `INVITATION_HMAC_SECRET` gesetzt
  - [ ] `IP_HASH_SALT` gesetzt
  - [ ] `BUFFER_ACCESS_TOKEN` gesetzt (falls Social-Media-Funktionen genutzt werden)
- [ ] **DB-Migrationen** vollständig angewendet
  - [ ] `scripts/migration_security_hardening_p0.sql`
  - [ ] bestehende RBAC-/RLS-Migrationen aus `scripts/`
- [ ] **RLS-Policies** in Produktion verifiziert
  - [ ] keine breiten `authenticated`-Schreibrechte auf sensible Tabellen
  - [ ] `invitations`, `site_settings`, `contact_submissions`, `anmeldung_submissions` auf service-pfade reduziert
- [ ] **Permission-Checks** aktiv
  - [ ] privilegierte API-Routen liefern für Nicht-Berechtigte `403`
  - [ ] keine unautorisierten `createAdminClient()`-Pfade
- [ ] **Rate Limiting** aktiv und fail-closed
  - [ ] Login-nahe Flows + Kontakt/Anmeldung geben bei Überschreitung `429` + `Retry-After`
  - [ ] fehlende Salt-/Config-Werte deaktivieren Limits nicht
- [ ] **Audit Logging** aktiv
  - [ ] Nutzer-/Rollen-/Settings-/globale Löschaktionen erzeugen Einträge in `audit_logs`
- [ ] **Regressionen geprüft**
  - [ ] `node --test lib/*.test.js` erfolgreich
  - [ ] zusätzliche Security-Regressionstests erfolgreich
- [ ] **Code Review + Security Scan**
  - [ ] Code Review ohne offene sicherheitsrelevante Findings
  - [ ] CodeQL-Lauf durchgeführt und Findings bewertet
