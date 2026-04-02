# Database Schema & Migrations Documentation

This directory contains the SQL schema definitions for the Grabbe-Gymnasium CMS.

## Architecture

The project relies on **PostgreSQL** hosted via Supabase. It uses a combination of Core Content tables, Role-Based Access Control (RBAC), and System configuration tables.

### 1. Bootstrapping vs. Incremental Migrations (Task 86)
- **Bootstrap (`complete_schema.sql`):** This is the definitive, single-source-of-truth file. If you are setting up a *fresh* environment, run this file **once** in the Supabase SQL Editor. It provisions all tables, functions, and RLS policies.
- **Incremental Migrations:** If the database is already running in production, do **not** re-run `complete_schema.sql`. Instead, write targeted `ALTER TABLE` statements in a new migration file (e.g., `20260401_add_feature.sql`) and apply it.

### 2. Core Tables
- `pages`, `posts`, `events`, `documents`
- `tags`, `post_tags`, `event_tags`, `document_tags`
- `navigation_items`
- `teachers`, `subjects`, `teacher_subjects`

### 3. Security & RBAC
- `cms_roles`: Defines system roles (e.g., `administrator`, `schulleitung`).
- `user_roles`: Maps `auth.users` to `cms_roles`.
- `user_profiles`: Stores public profile data (name, avatar).
- `invitations`: Stores **hashed** invitation tokens for secure onboarding.
- `audit_logs`: Tracks administrative actions.

### 4. Abuse Prevention
- `rate_limit_login_ip`, `rate_limit_login_account`: State tables for persistent exponential backoff and rate-limiting.

## Applying the Schema

1. Open the Supabase Dashboard -> SQL Editor.
2. Paste the contents of `scripts/complete_schema.sql`.
3. Click "Run".

*Note: The schema is idempotent (`CREATE TABLE IF NOT EXISTS`), but dropping/recreating policies may interrupt active sessions briefly.*
