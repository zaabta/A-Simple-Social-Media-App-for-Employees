# A Simple Social Media App for Employees

A Next.js App Router application with Redux + Redux Saga, featuring user listing, authentication, and user detail pages.

## Tech Stack

- **Next.js 16** (App Router, SSR)
- **Redux Toolkit + Redux Saga** (state management)
- **TypeScript**
- **Tailwind CSS**
- **Jest + Testing Library**
- **Docker**

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm (`npm install -g pnpm`)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/zaabta/A-Simple-Social-Media-App-for-Employees.git
cd A-Simple-Social-Media-App-for-Employees

# 2. Copy environment variables
cp .env.example .env.local

# 3. Install dependencies
pnpm install

# 4. Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/users`.

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | DummyJSON API base URL | `https://dummyjson.com` |

See `.env.example` for reference.

## Running with Docker

```bash
# Build and start
docker-compose up --build

# Stop
docker-compose down
```

App will be available at [http://localhost:3000](http://localhost:3000).

## Running Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test --watch

# Coverage report
pnpm test --coverage
```

## Features

- **Guest users** — see limited user info (name, age, gender), pagination only
- **Authenticated users** — full user info, search, sort, filter
- **Login** — via DummyJSON API (`emilys` / `emilyspass`)
- **User detail page** — posts with server-side pagination, protected by middleware
- **SSR** — all data fetched server-side, cookies readable in SSR context
- **Loading skeletons** and **error boundaries** on all routes

## Project Structure

```
app/
  users/          # Main listing page (SSR)
  users/[id]/     # User detail page (SSR, auth-protected)
  login/          # Login form
  logout/         # Logout route handler
middleware.ts     # Auth guard for /users/[id]
src/
  components/     # Shared UI components
  redux/          # Store, slices, sagas, services
  hooks/          # useBuildUrl, useDebouncedRouter
  utils/          # helpers, cookies
  constants/      # Enums and config
```