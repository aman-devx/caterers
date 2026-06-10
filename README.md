# CaterersNearMe

A full-stack catering marketplace that connects event planners with professional caterers across India. The platform supports public discovery, caterer self-service dashboards, and admin onboarding — with structured menus, bookings, analytics, galleries, and event-category browsing.

### Live Deployments

| App | URL | Description |
|-----|-----|-------------|
| **Frontend** | [https://catarers-app.vercel.app](https://catarers-app.vercel.app) | Next.js website (browse, search, dashboards) |
| **Backend API** | [https://caterers-api.vercel.app](https://caterers-api.vercel.app) | Express REST API (`/api/*` routes) |

> **Important:** The frontend and backend are **separate Vercel projects**. Do not point the API client at the frontend URL — `/api/caterers` on the frontend returns 404. Use `caterers-api.vercel.app` for all API calls.

### Quick Start (Local)

```bash
# Terminal 1 — Backend
cd server && npm install && cp .env.example .env && npm run dev

# Terminal 2 — Frontend (optional: use production API without local backend)
cd client && npm install && npm run dev
```

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [API Configuration](#api-configuration)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#system-architecture)
5. [Frontend Documentation](#frontend-documentation)
6. [Backend Documentation](#backend-documentation)
7. [Database Documentation](#database-documentation)
8. [Features Documentation](#features-documentation)
9. [API Documentation](#api-documentation)
10. [Pages Documentation](#pages-documentation)
11. [Setup Guide](#setup-guide)
12. [Deployment Guide](#deployment-guide)
13. [Troubleshooting](#troubleshooting)
14. [Future Enhancements](#future-enhancements)

---

## Project Overview

### Introduction

**CaterersNearMe** is a catering discovery and management platform. Public users browse caterers, filter by location and price, view full profiles with menus and galleries, and submit booking requests. Caterers manage their business through a tabbed dashboard. Admins onboard new caterers and provision login credentials.

### Purpose

- Help customers find caterers for weddings, corporate events, parties, and regional cuisine needs.
- Give caterers a single portal to manage profile, menu, gallery, services, packages, testimonials, ads, bookings, and analytics.
- Provide admins centralized caterer and credential management.

### Key Features

| Area | Capabilities |
|------|--------------|
| **Discovery** | Search with autocomplete, location/category filters, price range, caterer cards |
| **Profiles** | Cover image, logo, gallery, structured menu (Starters → Beverages), veg/non-veg badges, testimonials, booking form |
| **Caterer Portal** | Analytics (charts, period filters, CSV export), profile, menu CRUD, gallery, services, packages, testimonials, ads, booking management |
| **Admin** | Create caterers with login credentials, list/delete caterers |
| **Categories** | Public event-type pages (Wedding, Corporate, etc.) |
| **Analytics** | Profile views, bookings, revenue, conversion rate, popular dishes — backed by MongoDB |

### Roles

| Role | Access |
|------|--------|
| **Public user** | Browse, search, view profiles, submit bookings (no login required) |
| **Caterer** | `/caterer/dashboard` — full business management |
| **Admin** | `/admin` — caterer onboarding and deletion |

> **Note:** There is no separate customer/user registration flow. Public users interact without accounts. Only **Admin** and **Caterer** roles authenticate.

---

## API Configuration

The backend API URL is configured in **one place** on the frontend:

**File:** `client/src/lib/config.ts`

```typescript
const DEFAULT_API_URL = "https://caterers-api.vercel.app";
```

All HTTP requests go through `client/src/lib/api.ts`, which imports `API_BASE_URL` from `config.ts`.

| Environment | API URL used |
|-------------|--------------|
| **Production (default)** | `https://caterers-api.vercel.app` |
| **Local backend** | Set in `client/.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:4000` |
| **Vercel frontend override** | Set `NEXT_PUBLIC_API_URL=https://caterers-api.vercel.app` in Vercel project env vars |

To change the production API URL, edit `DEFAULT_API_URL` in `config.ts` and redeploy the frontend.

---

## Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Recharts |
| **Backend** | Node.js, Express 5, Mongoose |
| **Database** | MongoDB (Atlas or local) |
| **Auth** | JWT (7-day expiry), bcrypt password hashing |
| **Uploads** | Multer memory storage → Cloudinary (Vercel) or local disk (dev) |
| **Images** | Curated Unsplash URLs + local upload fallback |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│   Next.js Frontend — catarers-app.vercel.app (local :3000)      │
│   config.ts → api.ts │ App Router │ AuthContext │ Components    │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP / REST (JSON)
                             │ Authorization: Bearer <JWT>
┌────────────────────────────▼────────────────────────────────────┐
│   Express API — caterers-api.vercel.app (local :4000)           │
│   Routes → Controllers │ Middleware │ Services │ Seed scripts    │
└────────────────────────────┬────────────────────────────────────┘
                             │ Mongoose ODM
┌────────────────────────────▼────────────────────────────────────┐
│                        MongoDB                                   │
│  Caterers │ Users │ MenuItems │ Bookings │ AnalyticsEvents │ …  │
└─────────────────────────────────────────────────────────────────┘
```

**Request flow (authenticated):**

1. Client stores JWT in `localStorage` after login.
2. `api.ts` attaches `Authorization: Bearer <token>` on protected requests.
3. `authenticate` middleware verifies JWT and attaches `req.user`.
4. `requireRole('admin' | 'caterer')` enforces RBAC on route prefixes.

---

## Frontend Documentation

### Folder Structure

```
client/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Landing page
│   │   ├── layout.tsx          # Root layout + providers
│   │   ├── login/page.tsx
│   │   ├── admin/page.tsx
│   │   ├── caterers/page.tsx
│   │   ├── caterers/[id]/page.tsx
│   │   ├── caterer/dashboard/page.tsx
│   │   └── categories/[slug]/page.tsx
│   ├── components/             # Reusable UI
│   │   ├── SearchBar.tsx
│   │   ├── AutocompleteInput.tsx
│   │   ├── CatererGrid.tsx
│   │   ├── CatererProfileView.tsx
│   │   ├── StructuredMenuList.tsx
│   │   ├── AnalyticsDashboard.tsx
│   │   ├── HeroSection.tsx
│   │   ├── SafeImage.tsx
│   │   └── …
│   ├── context/
│   │   └── AuthContext.tsx     # Global auth state
│   ├── lib/
│   │   ├── config.ts           # ★ Single source for API_BASE_URL
│   │   ├── api.ts              # API client (uses config.ts)
│   │   ├── images.ts           # Image URLs & menu category order
│   │   └── demoCredentials.ts
│   └── types/                  # TypeScript interfaces
├── .env.local                  # Optional NEXT_PUBLIC_API_URL override
└── package.json
```

### Page-wise Architecture

| Page | Rendering | Data Source |
|------|-----------|-------------|
| `/` | Static | Local hero/about images |
| `/caterers` | Dynamic (SSR) | `GET /api/caterers`, `GET /api/categories` |
| `/caterers/[id]` | Dynamic | `GET /api/caterers/:id` (full profile) |
| `/categories/[slug]` | Dynamic | `GET /api/categories/:slug` |
| `/login` | Static shell | `POST /api/auth/login` |
| `/admin` | Client | `GET/POST/DELETE /api/admin/caterers` |
| `/caterer/dashboard` | Client | `GET /api/caterer/dashboard` + tab APIs |

### Component Structure

- **Layout:** `Header`, `Providers` (wraps `AuthProvider`)
- **Discovery:** `SearchBar` → `AutocompleteInput`, `CatererGrid` → `CatererCard`
- **Profile:** `CatererProfileView`, `StructuredMenuList`, `ImageGallery`, `StarRating`
- **Dashboard:** Tab panels inline in `caterer/dashboard/page.tsx`; `AnalyticsDashboard` for charts
- **Auth:** `ProtectedRoute`, `PasswordInput`

### State Management Flow

- **Global auth:** `AuthContext` holds `user`, `loading`, `login()`, `logout()`. Token in `localStorage`.
- **Page state:** React `useState` / `useCallback` / `useMemo` per page (filters, forms, tabs).
- **Server data:** Fetched on mount via `api.ts`; no Redux/React Query (intentionally lightweight).

### Routing System

Next.js App Router with file-based routes. Client components use `"use client"` where interactivity is needed. Protected pages wrap content in `<ProtectedRoute role="admin" | "caterer">`.

### Authentication Flow

```
Login form → POST /api/auth/login
           → { token, user } stored in localStorage
           → AuthContext setUser()
           → Redirect: admin → /admin, caterer → /caterer/dashboard

App load → token present → GET /api/auth/me → restore session
         → invalid token → clear localStorage
```

### Protected Routes

`ProtectedRoute` checks `AuthContext.user.role` against required role. Shows loading spinner while restoring session; redirects to `/login` if unauthenticated or wrong role.

### Dashboard Structure (Caterer)

Tabs: **Analytics | Profile | Menu | Gallery | Services | Packages | Testimonials | Ads | Bookings**

Each tab loads data from the initial dashboard payload or calls caterer APIs on CRUD actions.

### Responsive Design Strategy

- Mobile-first Tailwind breakpoints (`sm`, `md`, `lg`)
- Grid layouts collapse: 3-column search → 2 → 1 on mobile
- Horizontal scroll for dashboard tabs on small screens
- Search dropdown: viewport-aware max-height, flip upward when needed, touch-friendly tap targets
- Images: `SafeImage` with `sizes` prop and fallback URLs

---

## Backend Documentation

### Folder Structure

```
server/
├── index.js              # Local dev entry (seeds + listen)
├── app.js                # Express app (exported for Vercel)
├── api/index.js          # Vercel serverless entry point
├── config/
│   └── db.js             # MongoDB connection (cached for serverless)
├── controllers/          # Request handlers (business logic)
│   ├── authController.js
│   ├── adminController.js
│   ├── catererController.js
│   ├── categoryController.js
│   ├── searchController.js
│   ├── catererPortalController.js
│   └── uploadController.js
├── services/
│   └── catererProfileService.js
├── models/               # Mongoose schemas
├── routes/               # Thin route definitions → controllers
│   ├── auth.js
│   ├── caterers.js
│   ├── categories.js
│   ├── search.js
│   ├── admin.js
│   └── catererPortal.js
├── middleware/
│   ├── auth.js           # JWT verify + requireRole
│   ├── upload.js         # Multer config
│   ├── validateMenuItem.js
│   └── validateAdminCaterer.js
├── utils/
│   ├── seed.js, seedAdmin.js, seedCategories.js
│   ├── seedCatererDetails.js, seedAnalytics.js
│   ├── analyticsHelper.js
│   ├── cateringImages.js
│   ├── imageStore.js         # Vercel-safe upload (Cloudinary / data URL / disk)
│   └── imageHelper.js
├── data/
│   └── catererProfiles.js
├── uploads/              # Uploaded images (gitignored)
└── .env
```

### MVC Architecture

| Layer | Responsibility |
|-------|----------------|
| **Models** | Mongoose schemas (`Caterer`, `User`, `MenuItem`, etc.) |
| **Routes** | Thin wiring — map HTTP methods/paths to controller functions |
| **Controllers** | Request handlers — validation, orchestration, JSON responses |
| **Services** | Shared domain logic (e.g. `catererProfileService.getFullProfile`) |
| **Middleware** | Cross-cutting: auth, uploads, validation |

Routes delegate to controllers; controllers call models, services, and `utils/` helpers (e.g. `analyticsHelper.js`, `imageStore.js`).

### Middleware Usage

| Middleware | Purpose |
|------------|---------|
| `express.json()` | Parse JSON bodies |
| CORS headers | Allow frontend origin (`*`) |
| `authenticate` | Verify JWT, set `req.user` |
| `requireRole(...)` | RBAC after authentication |
| `upload.single('image')` | Multer file upload for caterer images |
| `validateMenuItem` / `validateAdminCaterer` | Request body validation |

### Authentication & Authorization Flow

1. Login compares bcrypt hash, signs JWT with `{ userId, email, role, catererId, name }`.
2. Protected routes: `/api/admin/*` requires `admin`; `/api/caterer/*` requires `caterer`.
3. Caterer routes use `req.user.catererId` to scope all data.

### Role-Based Access Control

```javascript
app.use('/api/admin', authenticate, requireRole('admin'), adminRouter);
app.use('/api/caterer', authenticate, requireRole('caterer'), catererPortalRouter);
```

Public routes (`/api/caterers`, `/api/search`, `/api/categories`, `/api/auth/login`) require no token.

### File Upload System

- **Endpoint:** `POST /api/caterer/upload` (caterer token required)
- **Multipart:** `image` field (max 5 MB), or JSON `{ "url": "https://..." }`
- **Storage priority:**
  1. **Cloudinary** — when `CLOUDINARY_CLOUD_NAME` + `CLOUDINARY_UPLOAD_PRESET` are set (recommended for Vercel)
  2. **Local disk** — `server/uploads/` when running a traditional Node server locally
  3. **Base64 data URL** — serverless fallback for images under 800 KB
- **Response:** `{ url: "https://..." }`
- **Local serving:** `app.use('/uploads', express.static(...))` (local dev only)

### API Request Lifecycle

```
Request → CORS preflight (if OPTIONS) → JSON parse → Route match
       → [authenticate + requireRole] (if protected)
       → Handler → Mongoose query → JSON response
       → 404 handler (unknown routes) → { error: 'Route not found' }
```

### Error Handling Strategy

- Handlers use try/catch with generic `500` + `{ error: 'message' }`
- Validation failures return `400` with `details` array
- Auth failures: `401` (missing/invalid token), `403` (wrong role)
- Not found: `404` with descriptive error
- Duplicate email: `409`

---

## Database Documentation

### Architecture

Single MongoDB database (`caterersnearme`) with multiple collections. Caterers use a string `id` field (sequential) as the primary business key; MongoDB `_id` is used for sub-documents (menu items, bookings, etc.).

### Entity Relationship Overview

```
User (admin|caterer) ──catererId──► Caterer
                                        │
        ┌───────────────────────────────┼───────────────────────────────┐
        ▼               ▼               ▼               ▼               ▼
   MenuItem      MenuCategory    PricingPackage    Service      Testimonial
        │                                                               │
        ▼                                                               ▼
   Booking ◄──────────────────────────────────────────────── Advertisement
        │
        ▼
 AnalyticsEvent

Category ◄──categoryIds── Caterer
```

### Collections & Schemas

#### `caterers`

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Unique business ID (e.g. "1", "2") |
| `name` | String | Business name |
| `location` | String | City/region |
| `pricePerPlate` | Number | Starting price per plate (₹) |
| `cuisines` | [String] | Cuisine tags |
| `rating` | Number | Average rating (1–5) |
| `description` | String | About text |
| `userId` | String | Linked User `_id` |
| `categoryIds` | [String] | Event category IDs |
| `coverImage`, `logo` | String | Image URLs |
| `gallery`, `images` | [String] | Photo URLs |
| `phone`, `email`, `website` | String | Contact info |
| `socialMedia` | Object | facebook, instagram, twitter |
| `profileViews` | Number | Total profile views |
| `totalBookings` | Number | Accepted booking count |
| `revenue` | Number | Revenue aggregate |

#### `users`

| Field | Type | Description |
|-------|------|-------------|
| `email` | String | Unique, lowercase |
| `password` | String | bcrypt hash |
| `role` | Enum | `admin` \| `caterer` |
| `name` | String | Display name |
| `catererId` | String | Set for caterer role |

#### `menuitems`

| Field | Type | Description |
|-------|------|-------------|
| `catererId` | String | Parent caterer |
| `name`, `description` | String | Dish info |
| `price` | Number | Price in ₹ |
| `category` | String | Starters, Main Course, etc. |
| `isAvailable` | Boolean | Visibility on public profile |
| `isVeg` | Boolean | Veg/non-veg badge |
| `images` | [String] | Dish photos |
| `details` | String | Extra notes |

#### `bookings`

| Field | Type | Description |
|-------|------|-------------|
| `catererId` | String | Target caterer |
| `customerName`, `email`, `phone` | String | Customer contact |
| `eventDate` | Date | Event date |
| `guests` | Number | Guest count |
| `message` | String | Optional notes |
| `status` | Enum | pending, accepted, rejected, completed |

#### `analyticsevents`

| Field | Type | Description |
|-------|------|-------------|
| `catererId` | String | Tracked caterer |
| `type` | Enum | profile_view, menu_view, booking_created, booking_accepted |
| `menuItemId`, `menuItemName` | String | Optional dish context |
| `label` | String | Human-readable activity label |
| `createdAt` | Date | Auto timestamp |

#### Other collections

- **`categories`** — Public event types (Wedding, Corporate) with slug, images, pricing notes
- **`menucategories`** — Per-caterer menu section ordering
- **`pricingpackages`** — Caterer pricing tiers
- **`services`** — Add-on services (live counters, décor, etc.)
- **`testimonials`** — Customer reviews (also exposed as `reviews` on profile)
- **`advertisements`** — Caterer promo banners with view/click counts

### Indexing Strategy

| Collection | Index |
|------------|-------|
| `caterers` | `id` (unique) |
| `users` | `email` (unique) |
| `menuitems` | `catererId` |
| `bookings` | `catererId` |
| `analyticsevents` | `{ catererId: 1, createdAt: -1 }` |
| `testimonials`, `services`, `advertisements` | `catererId` |

---

## Features Documentation

### Authentication

| | |
|---|---|
| **Purpose** | Secure admin and caterer access via JWT |
| **Frontend** | `/login` → `AuthContext.login()` → redirect by role |
| **Backend** | `POST /api/auth/login`, `GET /api/auth/me` |
| **Database** | `users` collection, bcrypt passwords |

### User Management

| | |
|---|---|
| **Purpose** | Admin creates caterer accounts; no public registration |
| **Frontend** | Admin form on `/admin` |
| **Backend** | User created alongside caterer in `POST /api/admin/caterers` |
| **Database** | `users` + `caterers` linked via `catererId` |

### Caterer Management

| | |
|---|---|
| **Purpose** | CRUD caterers (admin); profile edit (caterer) |
| **Frontend** | `/admin`, `/caterer/dashboard` Profile tab |
| **Backend** | `/api/admin/caterers`, `/api/caterer/profile` |
| **Database** | `caterers` |

### Search & Filtering

| | |
|---|---|
| **Purpose** | Discover caterers by name, cuisine, location, category, price |
| **Frontend** | `SearchBar` + `AutocompleteInput` on `/caterers`; client-side price filter in `CatererGrid` |
| **Backend** | `GET /api/search/suggestions` — debounced, returns caterer thumbnails, cuisines, ratings |
| **Database** | Reads `caterers`, `categories`, `services`, `menuitems` |

### Menu Management

| | |
|---|---|
| **Purpose** | Structured menus with categories, veg badges, images |
| **Frontend** | Dashboard Menu tab; public `StructuredMenuList` on profile |
| **Backend** | `/api/caterer/menu` CRUD; public via `GET /api/caterers/:id` |
| **Database** | `menuitems`, `menucategories` |

### Gallery Management

| | |
|---|---|
| **Purpose** | Showcase event and food photos |
| **Frontend** | Dashboard Gallery tab; `ImageGallery` on profile |
| **Backend** | `POST/DELETE /api/caterer/gallery`, `POST /api/caterer/upload` |
| **Database** | `caterers.gallery` array |

### Booking Management

| | |
|---|---|
| **Purpose** | Customers request events; caterers accept/reject |
| **Frontend** | Booking form on caterer profile; Bookings tab in dashboard |
| **Backend** | `POST /api/caterers/:id/bookings`, `PUT /api/caterer/bookings/:id` |
| **Database** | `bookings`; increments `totalBookings` on accept |

### Testimonials & Reviews

| | |
|---|---|
| **Purpose** | Social proof on caterer profiles |
| **Frontend** | Displayed in `CatererProfileView`; managed in Testimonials tab |
| **Backend** | `/api/caterer/testimonials` CRUD |
| **Database** | `testimonials` (mapped to `reviews` on public profile) |

### Analytics Dashboard

| | |
|---|---|
| **Purpose** | Business insights from real DB events |
| **Frontend** | `AnalyticsDashboard` — Recharts, period filters, CSV export |
| **Backend** | `GET /api/caterer/analytics?period=daily\|weekly\|monthly\|yearly` |
| **Database** | `analyticsevents`, `bookings`, `testimonials`, `caterers.profileViews` |

### Advertisement System

| | |
|---|---|
| **Purpose** | Caterers promote offers on their profile |
| **Frontend** | Ads tab in dashboard; shown on public profile |
| **Backend** | `/api/caterer/advertisements` CRUD |
| **Database** | `advertisements` with views/clicks fields |

---

## API Documentation

| Environment | Base URL |
|-------------|----------|
| **Production** | `https://caterers-api.vercel.app` |
| **Local dev** | `http://localhost:4000` |

Health check: `GET /` → `{ "message": "Caterers Near Me API", "version": "4.1.0" }`

### Auth

#### `POST /api/auth/login`

| | |
|---|---|
| **Description** | Authenticate admin or caterer |
| **Auth** | None |
| **Body** | `{ "email": "string", "password": "string" }` |
| **Response 200** | `{ "token": "jwt", "user": { "id", "email", "role", "name", "catererId" } }` |
| **Errors** | `400` missing fields, `401` invalid credentials, `500` server error |

#### `GET /api/auth/me`

| | |
|---|---|
| **Description** | Current user profile |
| **Auth** | Bearer token |
| **Response 200** | User object; includes `caterer` for caterer role |
| **Errors** | `401`, `404`, `500` |

---

### Public — Caterers

#### `GET /api/caterers`

List all caterers (summary fields).

#### `GET /api/caterers/:id`

Full caterer profile (menu, packages, services, testimonials, ads). Increments `profileViews` and logs analytics event.

#### `GET /api/caterers/:id/full`

Same as `/:id` (alias).

#### `GET /api/caterers/:id/menu`

Menu items only (`isAvailable: true`).

#### `POST /api/caterers/:id/bookings`

| **Body** | `{ customerName, email, phone?, eventDate, guests, message? }` |
| **Response 201** | `{ id, message }` |
| **Errors** | `400` validation, `404` caterer not found |

---

### Public — Categories

#### `GET /api/categories`

Active event categories list.

#### `GET /api/categories/:slug`

Category detail with caterers, menus, pricing range.

---

### Public — Search

#### `GET /api/search/suggestions`

| **Query** | `q`, `location`, `category` (all optional) |
| **Response** | `{ nameSuggestions, locationSuggestions, categorySuggestions, cuisineSuggestions, serviceSuggestions, menuSuggestions, catererResults[], results[] }` |

`catererResults` includes: `id`, `name`, `location`, `rating`, `pricePerPlate`, `cuisines`, `coverImage`, `logo`.

---

### Admin (`Authorization: Bearer <admin-token>`)

#### `GET /api/admin/caterers`

List caterers with `loginEmail` and `hasLogin`.

#### `POST /api/admin/caterers`

| **Body** | `{ name, location, pricePerPlate, cuisines[], rating, description?, email, password }` |
| **Response 201** | `{ caterer, credentials: { email, role } }` |
| **Errors** | `400` validation, `409` duplicate email |

#### `DELETE /api/admin/caterers/:id`

Deletes caterer, associated user, and menu items.

---

### Caterer Portal (`Authorization: Bearer <caterer-token>`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/caterer/dashboard?period=` | Full dashboard payload |
| GET | `/api/caterer/analytics?period=` | Analytics only |
| GET/PUT | `/api/caterer/profile` | Read/update profile |
| GET/POST | `/api/caterer/menu` | List/create menu items |
| PUT/DELETE | `/api/caterer/menu/:menuId` | Update/delete item |
| GET/POST/DELETE | `/api/caterer/menu-categories` | Menu section management |
| POST/DELETE | `/api/caterer/gallery` | Add/remove gallery URL |
| POST/PUT/DELETE | `/api/caterer/services/:id?` | Services CRUD |
| POST/PUT/DELETE | `/api/caterer/packages/:id?` | Pricing packages CRUD |
| POST/PUT/DELETE | `/api/caterer/testimonials/:id?` | Testimonials CRUD |
| POST/PUT/DELETE | `/api/caterer/advertisements/:id?` | Ads CRUD |
| PUT | `/api/caterer/bookings/:id` | Update booking status |
| POST | `/api/caterer/upload` | Multipart image upload |

**Menu item body (POST):**

```json
{
  "name": "Paneer Tikka",
  "description": "Grilled cottage cheese",
  "price": 180,
  "category": "Starters",
  "isAvailable": true,
  "isVeg": true,
  "images": ["https://..."],
  "details": ""
}
```

---

## Pages Documentation

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Landing page with hero, about, CTA to browse caterers | Public |
| `/caterers` | Search, filters, caterer grid | Public |
| `/caterers/[id]` | Full profile: menu, gallery, booking, reviews | Public |
| `/categories/[slug]` | Event-type landing (e.g. Wedding) with caterers | Public |
| `/login` | Admin & caterer login with demo credentials | Public |
| `/admin` | Create/delete caterers, provision logins | Admin only |
| `/caterer/dashboard` | Tabbed portal (analytics, menu, bookings, etc.) | Caterer only |

### Pages not implemented (future)

| Route | Status |
|-------|--------|
| `/register` | Not built — caterers are created by admin |
| `/user/dashboard` | Not built — public users need no account |
| `/analytics` (standalone) | Analytics lives inside caterer dashboard tab |
| `/profile` (user) | Caterer profile editing is in dashboard Profile tab |
| Dedicated booking pages | Booking is inline on caterer detail + dashboard tab |

---

## Setup Guide

### Prerequisites

- Node.js 18+
- MongoDB Atlas cluster or local MongoDB instance

### Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env — set MONGODB_URI and JWT_SECRET
npm run dev
```

Server runs at **http://localhost:4000**

On first start, seed scripts automatically populate:

- Sample caterers
- Event categories
- Admin user
- Demo caterer user + rich profiles (menus, galleries, testimonials)
- Historical analytics events

### Frontend Setup

```bash
cd client
npm install
cp .env.local.example .env.local
npm run dev
```

Client runs at **http://localhost:3000**

By default the frontend uses the **production API** (`https://caterers-api.vercel.app`) — no local backend required for basic browsing. To use a local API, uncomment in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Environment Variables

#### Server (`server/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret for signing JWTs |
| `ADMIN_EMAIL` | No | Default admin email (seeded once) |
| `ADMIN_PASSWORD` | No | Default admin password |
| `DEMO_CATERER_EMAIL` | No | Demo caterer login email |
| `DEMO_CATERER_PASSWORD` | No | Demo caterer password |
| `PORT` | No | API port (default `4000`) |
| `CLOUDINARY_CLOUD_NAME` | Yes on Vercel | Cloudinary cloud name for image uploads |
| `CLOUDINARY_UPLOAD_PRESET` | Yes on Vercel | Unsigned upload preset name |
| `API_BASE_URL` | No | Public API URL for local upload links |

#### Client (`client/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | No | Override API URL. Default is `https://caterers-api.vercel.app` (see `src/lib/config.ts`) |

### Database Setup

1. Create a MongoDB Atlas cluster (or run MongoDB locally).
2. Add your connection string to `MONGODB_URI`.
3. Start the server — collections and seed data are created automatically.
4. To force menu reseed (after schema changes): delete `menuitems` collection and restart.

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@caterersnearme.com` | `admin123` |
| Caterer | `caterer@caterersnearme.com` | `caterer123` |

---

## Deployment Guide

The project is deployed as **two separate Vercel projects**:

| Project | Root folder | Live URL |
|---------|-------------|----------|
| Frontend | `client/` | https://catarers-app.vercel.app |
| Backend API | `server/` | https://caterers-api.vercel.app |

### Frontend Deployment (Vercel)

1. Import the `client/` folder as a Vercel project (framework: Next.js).
2. **Optional** env var (only if overriding the default in `config.ts`):
   ```
   NEXT_PUBLIC_API_URL=https://caterers-api.vercel.app
   ```
3. Deploy. Vercel auto-detects Next.js and runs `npm run build`.

```bash
cd client
npm run build
npm start   # local production preview
```

### Backend Deployment (Vercel serverless)

1. Import the `server/` folder as a **separate** Vercel project.
2. Required environment variables:

   | Variable | Description |
   |----------|-------------|
   | `MONGODB_URI` | MongoDB Atlas connection string |
   | `JWT_SECRET` | Strong random secret for JWT signing |
   | `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (for image uploads) |
   | `CLOUDINARY_UPLOAD_PRESET` | Unsigned upload preset name |

3. Entry point: `api/index.js` (configured in `server/vercel.json`).
4. Run seeds once locally against Atlas: `cd server && npm run dev`.
5. Verify: open `https://caterers-api.vercel.app/api/caterers` — should return JSON.

> Vercel has **no persistent disk**. Uploads use Cloudinary (recommended), or base64 data URLs for small images. Do not use `mkdir` for `/uploads` on serverless.

**Cloudinary setup:** [cloudinary.com](https://cloudinary.com) → Settings → Upload → Add preset → enable **Unsigned**.

### Backend Deployment (Railway / Render / VPS)

```bash
cd server
npm install --production
node index.js
```

- Set all `server/.env` variables in the hosting dashboard.
- Local disk uploads work automatically; Cloudinary is optional.
- Use a strong `JWT_SECRET`.
- Set `API_BASE_URL` to your public API URL for upload link generation.

### Production Build Process

| App | Command | Output |
|-----|---------|--------|
| Client | `npm run build` | `.next/` optimized bundle |
| Server | No build step | `api/index.js` on Vercel, or `node index.js` locally |

---

## Troubleshooting

### "Unable to connect to the API" on `/caterers`

**Cause:** Frontend is calling the wrong URL (often the frontend site instead of the API).

| URL | `/api/caterers` result |
|-----|------------------------|
| `catarers-app.vercel.app` | ❌ 404 (this is the Next.js frontend) |
| `caterers-api.vercel.app` | ✅ Returns caterer JSON |

**Fix:** Ensure `client/src/lib/config.ts` has `DEFAULT_API_URL = "https://caterers-api.vercel.app"`. On Vercel frontend project, remove or correct any `NEXT_PUBLIC_API_URL` env var, then redeploy.

### `ENOENT: mkdir '/var/task/uploads'` on Vercel

**Cause:** Old code tried to create a disk upload folder on serverless.

**Fix:** Use the current `middleware/upload.js` (memory storage only) and set Cloudinary env vars. Redeploy the backend.

### Image uploads fail on production

Set `CLOUDINARY_CLOUD_NAME` and `CLOUDINARY_UPLOAD_PRESET` on the **backend** Vercel project. Alternatively, paste image URLs directly in the caterer dashboard.

### Login works locally but not in production

- Confirm `JWT_SECRET` is set on the backend Vercel project.
- Confirm frontend `NEXT_PUBLIC_API_URL` (or `config.ts` default) points to `caterers-api.vercel.app`.
- Check browser DevTools → Network for failed requests to the API.

### CORS errors

The API allows all origins (`*`) by default. For production hardening, restrict `Access-Control-Allow-Origin` in `server/app.js` to your frontend domain.

---

## Future Enhancements

### Upcoming Features

- Customer registration and booking history
- Payment integration (deposits, invoicing)
- Real-time notifications (email/SMS on new bookings)
- Caterer availability calendar
- Advanced search (geo-radius, date availability)
- Review submission by verified customers

### Scalability Improvements

- Redis caching for caterer listings and search suggestions
- CDN for images (replace hotlinked Unsplash in production)
- Separate read replicas for analytics queries
- Message queue for analytics event ingestion

### Performance Optimizations

- React Query / SWR for client-side caching and deduplication
- MongoDB aggregation pipelines for search instead of in-memory filtering
- Image optimization pipeline (WebP, responsive srcset)
- API pagination on caterer list and search results
- Server-side search filtering to reduce payload size

---

## License

MIT (or your chosen license)
