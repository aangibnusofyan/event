# SpotEvent.id — Laravel Setup Guide & Skills Reference

> Project: **SpotEvent.id** — Platform event & ticketing di Indonesia  
> Laravel 13 + Inertia.js v3 (React) + Tailwind CSS v4  
> Lokasi file: `.kilo/command/laravel-setup-skill.md`

---

## Bagian 1: Workflow Instalasi Laravel

### Tech Stack Project

| Layer | Teknologi | Versi |
|-------|-----------|-------|
| Backend | Laravel Framework | ^13.17 |
| PHP | PHP | ^8.3 (runtime: 8.4) |
| Auth | Laravel Fortify | ^1.37 |
| Frontend | Inertia.js + React | ^3.0 / ^19.2 |
| Build | Vite + vite-plus | ^8.0 |
| Styling | Tailwind CSS | ^4.0 + shadcn/ui |
| Routes (TS) | Laravel Wayfinder | ^0.1.14 |
| Testing | Pest | ^5.1 |
| Lint | Laravel Pint | ^1.27 |
| Static Analysis | PHPStan + Larastan | ^3.9 |
| Dev Server | Laravel Herd | — |
| Database | MySQL 8.x | — |

### Prerequisites

| Tool | Minimum Version | Catatan |
|------|----------------|---------|
| PHP | 8.3+ | Perlu ekstensi: `bcmath`, `ctype`, `fileinfo`, `json`, `mbstring`, `openssl`, `pdo`, `session`, `tokenizer`, `xml` |
| Composer | 2.x | PHP dependency manager |
| Node.js | 22.x | Gunakan [nvm](https://github.com/nvm-sh/nvm) untuk management versi |
| Database | MySQL 8.x / MariaDB 10.5+ | SQLite juga didukung untuk dev lokal |

Verifikasi prerequisites:

```bash
php -v        # PHP 8.3+
composer -V   # Composer 2.x
node -v       # Node.js 22+
npm -v        # npm 10+
```

### Langkah-Instalasi

#### 1. Clone Repository

```bash
git clone <repository-url>
cd <project-directory>
```

#### 2. Install PHP Dependencies

```bash
composer install
```

> **Offline/air-gapped?** Gunakan `composer install --no-dev --optimize-autoloader` untuk production.

#### 3. Konfigurasi Environment

```bash
cp .env.example .env
```

Edit `.env` dengan konfigurasi lokal:

```env
APP_NAME="spotevent.id"
APP_URL=http://event.test

# Database - gunakan sqlite untuk dev cepat, atau MySQL untuk parity
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=database_event
DB_USERNAME=root
DB_PASSWORD=root1234
```

Untuk SQLite (dev lokal cepat):

```env
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

#### 4. Generate Application Key

```bash
php artisan key:generate
```

#### 5. Setup Database

**Option A: MySQL (disarankan untuk production parity)**

```bash
mysql -u root -p
CREATE DATABASE database_event CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Option B: SQLite (dev lokal saja)**

```bash
touch database/database.sqlite
chmod 600 database/database.sqlite
```

#### 6. Jalankan Migrasi

```bash
php artisan migrate
```

> Gunakan `--force` di production/CI.

#### 7. Install Node Dependencies

```bash
npm install
```

> Jika menggunakan pnpm (project memiliki `pnpm-workspace.yaml`):
> ```bash
> pnpm install
> ```

#### 8. Build Frontend Assets

**Development (hot reload):**

```bash
npm run dev
```

**Production build:**

```bash
npm run build
```

#### 9. Start Development Server

Project ini menggunakan **Laravel Herd** untuk development lokal. Akses di `http://event.test`.

Atau gunakan built-in server Laravel:

```bash
php artisan serve
```

#### 10. Quick Setup (Satu Perintah)

Project ini sudah menyertakan script `setup` di `composer.json`:

```bash
composer setup
```

Langkah yang dilakukan otomatis:
1. `composer install`
2. Copy `.env.example` ke `.env`
3. Generate application key (`php artisan key:generate`)
4. Jalankan migrasi (`php artisan migrate --force`)
5. `npm install`
6. `npm run build`

Setelah setup, jalankan dev server:

```bash
composer dev
```

### Verification Pasca-Setup

```bash
# 1. Route Laravel terdaftar
php artisan route:list --compact

# 2. Database ter-migrasi
php artisan migrate:status

# 3. App key sudah diset
php artisan config:show app.key

# 4. Frontend build tanpa error
npm run build

# 5. Tests lulus
php artisan test
```

### Troubleshooting

| Error | Solusi |
|-------|--------|
| `APP_KEY is empty` | Jalankan `php artisan key:generate` |
| `Class not found` | Jalankan `composer dump-autoload` |
| `Vite manifest not found` | Jalankan `npm run build` |
| `Database connection refused` | Periksa variabel `DB_*` di `.env` dan pastikan database server berjalan |
| `Permission denied` | Jalankan `chmod -R 775 storage bootstrap/cache` |
| `Passkeys error` | Pastikan `APP_URL` diset ke URL HTTPS atau localhost yang valid |

### Cheatsheet Perintah Harian

| Tugas | Perintah |
|-------|----------|
| Start dev server + Vite | `composer dev` |
| Jalankan semua tests | `php artisan test` |
| CI checks (lint + types + tests) | `composer ci:check` |
| Format PHP code | `composer lint` |
| Typecheck (PHPStan) | `composer types:check` |
| Typecheck (TypeScript) | `npm run types:check` |
| Regenerate Wayfinder routes | `php artisan wayfinder:generate` |
| Clear caches | `php artisan optimize:clear` |

---

## Bagian 2: Skills Reference

Project ini memiliki **10 domain-specific skills** yang tersedia di `.agents/skills/` dan terdaftar di `boost.json`.

### Daftar Skills

| # | Skill | Domain | Kapan Diaktifkan |
|---|-------|--------|-------------------|
| 1 | [fortify-development](#1-fortify-development) | Backend (Auth) | Auth, login, register, 2FA, passkeys |
| 2 | [inertia-react-development](#2-inertia-react-development) | Fullstack (Frontend) | React pages, forms, navigasi dengan Inertia |
| 3 | [infer-conventions](#3-infer-conventions) | Meta / Proses | Deteksi atau standardisasi konvensi project |
| 4 | [laravel-best-practices](#4-laravel-best-practices) | Backend (Laravel) | Review kode PHP Laravel, N+1, caching, security |
| 5 | [laravel-specialist](#5-laravel-specialist) | Backend (Laravel) | Models, API, queues, Livewire, testing |
| 6 | [migrate-radix-to-base](#6-migrate-radix-to-base) | Frontend (UI) | Migrasi dari Radix UI ke Base UI |
| 7 | [shadcn](#7-shadcn) | Frontend (UI) | Komponen shadcn/ui |
| 8 | [tailwindcss-development](#8-tailwindcss-development) | Frontend (CSS) | Tailwind utility classes |
| 9 | [testing-best-practices](#9-testing-best-practices) | Testing | Pest, desain tes, coverage |
| 10 | [wayfinder-development](#10-wayfinder-development) | Fullstack (Frontend) | TypeScript route functions, `@/actions/`, `@/routes/` |

### 1. `fortify-development`

**Lokasi:** `.agents/skills/fortify-development/SKILL.md`  
**Triggers:** authentication, login, register, signup, forgot password, verify email, 2FA, passkeys, WebAuthn, `app/Actions/Fortify/`, `CreateNewUser`, `UpdateUserProfileInformation`, `FortifyServiceProvider`, `config/fortify.php`

**Yang dicakup:**
- Konfigurasi Laravel Fortify (`config/fortify.php`)
- Registrasi route auth dan kustomisasi
- Flow registrasi dengan validation rules kustom
- Password reset flows
- Email verification
- Two-factor authentication (TOTP, QR codes, recovery codes)
- Passkey/WebAuthn registration dan login
- Login response contracts (`LoginResponse`)
- Password confirmation dan throttling

**Catatan khusus project:**
- Fortify dikonfigurasi di `config/fortify.php` dengan registration, reset passwords, email verification, 2FA, dan passkeys aktif.
- Custom `CreateNewUser` di `app/Actions/Fortify/CreateNewUser.php` menambahkan validasi `username` dan `role`.
- `User` model implements `PasskeyUser` dan menggunakan trait `PasskeyAuthenticatable`.
- Rate limiting disesuaikan di `FortifyServiceProvider.php` untuk login, two-factor, dan passkeys.

---

### 2. `inertia-react-development`

**Lokasi:** `.agents/skills/inertia-react-development/SKILL.md`  
**Triggers:** React with Inertia, React pages, React forms, `useForm`, `router`, `useHttp`, deferred props, prefetching, optimistic updates, instant visits, polling

**Yang dicakup:**
- Inertia.js v3 React client-side patterns
- `useForm` hook untuk form handling
- `<Link>` dan `<Form>` components
- Deferred props dan prefetch strategies
- Layout props (`useLayoutProps`)
- Instant visits dan optimistic updates
- SSR via `@inertiajs/vite`
- Event handlers: `httpException` (dulu `invalid`), `networkError` (dulu `exception`)
- `router.cancelAll()` (menggantikan `router.cancel()`)

**Catatan khusus project:**
- Frontend pages di `resources/js/pages/` (bukan `resources/views/`)
- Auth pages di `resources/js/pages/auth/`
- Settings pages di `resources/js/pages/settings/`
- Landing components di `resources/js/components/landing/`
- shadcn/ui components di `resources/js/components/ui/`
- Routes di-generate via Wayfinder di `resources/js/routes/`

---

### 3. `infer-conventions`

**Lokasi:** `.agents/skills/infer-conventions/SKILL.md` + `references/checklist.md`  
**Triggers:** "gimana sih biasanya ngadepin X?", "pakai Form Request atau validasi inline?", "detect conventions", "standardize"

**Yang dicakup:**
- Systematic sweep ~49 dimensi konvensi Laravel
- House-pattern discovery
- Conflict reporting dan resolusi
- Merekam rules via `record-rule` MCP tool

**Kapan digunakan:** Sebelum mulai fitur baru atau refactoring, jalankan skill ini untuk memahami pola yang sudah ada.

---

### 4. `laravel-best-practices`

**Lokasi:** `.agents/skills/laravel-best-practices/SKILL.md` + `rules/`

**Rule files:**

| File | Topik |
|------|-------|
| `rules/advanced-queries.md` | Query optimization, subqueries, windows |
| `rules/architecture.md` | Service layers, domain design, folder structure |
| `rules/blade-views.md` | Blade templates, components, slots |
| `rules/caching.md` | Cache tags, cache keys, invalidation |
| `rules/collections.md` | Collection methods, chunking, lazy collections |
| `rules/config.md` | Configuration patterns, config caching |
| `rules/db-performance.md` | Index strategies, query profiling |
| `rules/eloquent.md` | Relationships, scopes, eager loading |
| `rules/error-handling.md` | Exception handling, error responses |
| `rules/events-notifications.md` | Events, listeners, broadcasting, notifications |
| `rules/http-client.md` | Laravel HTTP client, retries, middleware |
| `rules/mail.md` | Mailables |
| `rules/migrations.md` | Migration patterns, rollbacks, indexes |
| `rules/queue-jobs.md` | Job batching, chaining, rate limiting |
| `rules/routing.md` | Route organization, middleware, named routes |
| `rules/scheduling.md` | Task scheduling, cron |
| `rules/security.md` | SQL injection, XSS, CSRF, auth checks |
| `rules/style.md` | Code style, naming conventions |
| `rules/validation.md` | Form requests, custom rules |

**Triggers:** Laravel PHP code, Eloquent, N+1 issues, caching, security, validation, queue, routing, architecture

---

### 5. `laravel-specialist`

**Lokasi:** `.ai/skills/laravel-specialist/SKILL.md`  
**Triggers:** Laravel, Eloquent, PHP framework, Laravel API, Artisan, Blade, queues, Livewire, testing, Sanctum, Horizon

**Core workflow:** Analyse → Design → Implement → Build → Test (target >85% coverage)

**Validation checkpoints:**

| Tahap | Perintah | Yang Diharapkan |
|-------|---------|-----------------|
| Setelah migrasi | `php artisan migrate:status` | Semua migrasi show `Ran` |
| Setelah routing | `php artisan route:list --path=api` | Route baru muncul dengan verb yang benar |
| Setelah job dispatch | `php artisan queue:work --once` | Job diproses tanpa exception |
| Setelah implementasi | `php artisan test --coverage` | >85% coverage, 0 failure |
| Sebelum PR | `./vendor/bin/pint --test` | PSR-12 linting lulus |

---

### 6. `migrate-radix-to-base`

**Lokasi:** `.agents/skills/migrate-radix-to-base/`  
**Sumber:** `shadcn/ui` (via `skills-lock.json`)  
**Triggers:** migrate from radix, move to base-ui, convert radix primitives, switch shadcn base library

**Yang dicakup:**
- Migrasi komponen dari Radix UI ke Base UI
- Reference files: `class-mapping.md`, `consumer-props.md`, `disclosure.md`, `form-controls.md`, `menus.md`, `overlays.md`, `display-misc.md`, `universal-patterns.md`, `wrapper-shapes.md`

**Catatan:** Project ini saat ini memakai Radix UI (`@radix-ui/react-*`).

---

### 7. `shadcn`

**Lokasi:** `.agents/skills/shadcn/`  
**Sumber:** `shadcn/ui` (via `skills-lock.json`)  
**Triggers:** shadcn/ui, component registries, presets, `--preset` codes

**Yang dicakup:**
- Menambahkan komponen via CLI (`cli.md`)
- Kustomisasi (`customization.md`)
- Registry management (`registry.md`)
- Composition (`composition.md`)
- Forms (`forms.md`)
- Styling (`styling.md`)

**Catatan:** Project menggunakan `components.json` dengan style `new-york`, base color `neutral`, icon library `lucide`.

---

### 8. `tailwindcss-development`

**Lokasi:** `.agents/skills/tailwindcss-development/SKILL.md`  
**Triggers:** tailwind, responsive grid, flex/grid, cards, navbars, forms, dark mode, spacing, typography

**Yang dicakup:**
- Penulisan dan perbaikan Tailwind utility classes
- Responsive grid layouts dan card grids
- Flex/grid page structures
- Component styling (cards, tables, navbars, forms, inputs, badges)
- Dark mode variants
- Spaging dan typography

**Catatan:** Tailwind CSS v4 dikonfigurasi via `@tailwindcss/vite` di `vite.config.ts`. CSS di `resources/css/app.css`.

---

### 9. `testing-best-practices`

**Lokasi:** `.agents/skills/testing-best-practices/SKILL.md` + `rules/`

| File | Topik |
|------|-------|
| `rules/assertions.md` | Assertion patterns |
| `rules/endpoint-tests.md` | HTTP endpoint testing |
| `rules/finding-features.md` | Identifikasi apa yang perlu ditest |
| `rules/isolation.md` | Dependency isolation dan mocking |
| `rules/naming.md` | Konvensi penamaan tes |
| `rules/performance.md` | Optimasi performa tes |
| `rules/review.md` | Code review untuk tes |
| `rules/security.md` | Security testing |
| `rules/test-data.md` | Factory dan test data patterns |

**Triggers:** testing, test design, coverage, naming, structuring tests, assertions, isolation, performance, review

**Catatan:** Project menggunakan Pest 5.x (`tests/Pest.php` dengan `RefreshDatabase`).

---

### 10. `wayfinder-development`

**Lokasi:** `.agents/skills/wayfinder-development/SKILL.md`  
**Triggers:** Connecting frontend ke Laravel routes, `@/actions/`, `@/routes/`, `wayfinder:generate`

**Yang dicakup:**
- Wayfinder vite plugin configuration
- TypeScript functions di `resources/js/actions/` (controllers) dan `resources/js/routes/` (named routes)
- Methods: `.url()`, `.get()`, `.post()`, `.form()`
- Query parameter handling
- Route model binding
- Tree-shaking

**Catatan:** Wayfinder dikonfigurasi di `vite.config.ts` dengan `wayfinder({ formVariants: true })`. Regenerate setelah mengubah route dengan `php artisan wayfinder:generate`.

---

## Registrasi Skills

Skills terdaftar di `boost.json`:

```json
{
  "skills": [
    "infer-conventions",
    "fortify-development",
    "laravel-best-practices",
    "testing-best-practices",
    "wayfinder-development",
    "inertia-react-development",
    "tailwindcss-development",
    "laravel-specialist"
  ]
}
```

Skills tambahan via `skills-lock.json` (dari `shadcn/ui`):
- `migrate-radix-to-base`
- `shadcn`
