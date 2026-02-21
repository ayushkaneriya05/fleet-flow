<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
</p>

# 🚛 FleetFlow — Logistics Management Engine

**FleetFlow** is a production-ready, full-stack logistics management system that replaces manual fleet logbooks with a centralized digital command center. It provides real-time fleet oversight, rule-driven trip dispatching, expense tracking, and financial analytics — all secured behind a custom-built JWT authentication system with strict Role-Based Access Control (RBAC).

---

## ✨ Key Features

### 🏠 Command Center (Dashboard)
- **KPI Cards** — Total fleet count, utilization rate, maintenance alerts, and pending cargo at a glance
- **Real-time Filters** — Filter dashboard metrics by vehicle type and status
- **Recent Activity Table** — View the 5 most recent trip activities with status badges

### 🗺️ Trip Dispatch & Lifecycle
- **Draft → Dispatch → Complete / Cancel** — Full trip lifecycle with strict state-machine transitions
- **Rule-Driven Validation** — Trips are validated inside database transactions:
  - Vehicle must be `AVAILABLE`
  - Driver must be `ON_DUTY` with a valid (non-expired) license
  - Cargo weight must not exceed vehicle's `maxCapacityKg`
- **Atomic State Updates** — Dispatching a trip marks both the vehicle and driver as `ON_TRIP`; completing or cancelling releases them back

### 🚐 Vehicle Registry
- **Full CRUD** — Create, read, update vehicles (model, license plate, type, capacity, odometer, acquisition cost)
- **Status Lifecycle** — `AVAILABLE` → `ON_TRIP` → `IN_SHOP` → `RETIRED` with dedicated retire/restore actions
- **Vehicle Types** — Truck, Van, Bike

### 👤 Driver Management
- **Driver Roster** — View all drivers with license details, safety scores, and trip counts
- **Status Control** — Toggle drivers between `ON_DUTY`, `OFF_DUTY`, and `SUSPENDED`
- **License Compliance** — Track license numbers, categories, and expiry dates; expired licenses block trip dispatch

### 🔧 Maintenance & Service
- **Maintenance Logging** — Log repairs with descriptions, costs, and dates per vehicle
- **Automatic Status Update** — Creating a maintenance log sets the vehicle to `IN_SHOP`
- **Repair Completion** — Mark vehicles as repaired to restore `AVAILABLE` status
- **Alerts View** — View all vehicles currently in the shop with their latest maintenance record

### ⛽ Fuel & Expenses
- **Fuel Logging** — Record fuel fill-ups (liters, cost) linked to vehicles and optionally to specific trips
- **Expense Overview** — Unified view of maintenance and fuel costs
- **Input Validation** — Negative fuel/cost values are rejected at the server

### 📊 Financial & Performance Analytics
- **Monthly Expense Trends** — Bar/line charts showing fuel vs. maintenance costs over time (Recharts)
- **Per-Vehicle ROI** — Revenue, total costs, net profit, and ROI % calculated against acquisition cost
- **Fuel Efficiency** — km/liter metric per vehicle from completed trip odometer data
- **System-Wide KPIs** — Aggregate revenue, costs, and overall fleet ROI percentage
- **CSV & PDF Export** — One-click export of analytics data

### 🔐 Authentication & Authorization
- **Custom JWT Auth** — Built from scratch using `jsonwebtoken` + `jose` (no third-party auth libraries)
- **Bcrypt Password Hashing** — Secure password storage with `bcrypt` (10 salt rounds)
- **HTTP-Only Session Cookie** — JWT stored in `fleetflow_session` cookie
- **24-Hour Token Expiry** — Automatic session expiration
- **Forgot Password** — Direct password reset flow via email lookup
- **Registration** — Self-service account creation with role selection

### 🛡️ Role-Based Access Control (RBAC)

Access is enforced at the **middleware level** before any page renders:

| Role | Dashboard | Trips | Vehicles | Drivers | Maintenance | Expenses | Analytics |
|------|:---------:|:-----:|:--------:|:-------:|:-----------:|:--------:|:---------:|
| **Fleet Manager** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Dispatcher** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| **Safety Officer** | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Finance Analyst** | ✅ | ✅ (read) | ❌ | ✅ | ✅ | ✅ | ✅ |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Components, Server Actions) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Component Library** | [shadcn/ui](https://ui.shadcn.com/) (Card, Button, Badge, Table, Form, Input, Label) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **ORM** | [Prisma 6](https://www.prisma.io/) |
| **Authentication** | Custom JWT (`jsonwebtoken` + `jose` for Edge, `bcrypt` for hashing) |
| **Form Handling** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation |
| **Charts** | [Recharts](https://recharts.org/) |
| **Data Tables** | [TanStack Table v8](https://tanstack.com/table) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Export** | CSV generation + PDF via [jsPDF](https://github.com/parallax/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/) |

---

## 📁 Project Structure

```
fleet-flow/
├── app/
│   ├── (dashboard)/              # Protected dashboard layout
│   │   ├── page.tsx              # Command Center (KPI cards + recent trips)
│   │   ├── DashboardFilters.tsx  # Vehicle type/status filter controls
│   │   ├── layout.tsx            # Sidebar + Header shell
│   │   ├── analytics/            # ROI charts, expense trends, CSV/PDF export
│   │   ├── drivers/              # Driver roster, status toggles, add driver form
│   │   ├── expenses/             # Fuel & expense log with forms
│   │   ├── maintenance/          # Maintenance logs, repair actions, alerts
│   │   ├── trips/                # Trip list, dispatch/complete/cancel actions, new trip form
│   │   └── vehicles/             # Vehicle registry with CRUD and data table
│   ├── api/auth/                 # REST API routes
│   │   ├── login/                # POST — authenticate & issue JWT
│   │   ├── register/             # POST — create user account
│   │   ├── logout/               # POST — clear session cookie
│   │   └── forgot-password/      # POST — reset password
│   ├── login/                    # Login page (client component)
│   ├── register/                 # Registration page (client component)
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles + Tailwind imports
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx           # Navigation sidebar with active-link highlighting
│   │   └── Header.tsx            # Top header bar with user info
│   └── ui/                       # shadcn/ui primitives (badge, button, card, form, input, label, table)
├── lib/
│   ├── actions/                  # Next.js Server Actions
│   │   ├── trip.actions.ts       # createDraft, dispatch, complete, cancel (transactional)
│   │   ├── vehicle.actions.ts    # CRUD + retire/restore
│   │   ├── driver.actions.ts     # CRUD + status toggle + eligibility check
│   │   ├── maintenance.actions.ts# Log creation, alerts, mark-repaired
│   │   └── fuel.actions.ts       # Fuel log creation with validation
│   ├── auth.ts                   # JWT sign/verify helpers
│   ├── prisma.ts                 # Prisma client singleton
│   ├── export.ts                 # CSV & PDF export utilities
│   └── utils.ts                  # General utilities (cn helper)
├── prisma/
│   ├── schema.prisma             # Database schema (6 models, 4 enums)
│   ├── seed.ts                   # Demo data seeder (users, vehicles, drivers, trips, logs)
│   └── migrations/               # Prisma migration history
├── middleware.ts                  # JWT verification + RBAC enforcement
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (or pnpm / yarn)
- **PostgreSQL** database (local or cloud, e.g., [Neon](https://neon.tech/), [Supabase](https://supabase.com/))

### 1. Clone the Repository

```bash
git clone https://github.com/ayushkaneriya05/fleet-flow.git
cd fleet-flow
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_SECRET="your-super-secret-key-change-in-production"
```

> **Note:** Also create a `prisma/.env` file with the same `DATABASE_URL` if your Prisma commands require it.

### 4. Set Up the Database

```bash
# Generate the Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed demo data
npx prisma db seed
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Credentials

After seeding, the following accounts are available (all passwords: `password123`):

| Email | Role | Access Level |
|-------|------|-------------|
| `admin@fleetflow.test` | Fleet Manager | Full access to all modules |
| `dispatcher@fleetflow.test` | Dispatcher | No access to Analytics & Drivers |
| `safety@fleetflow.test` | Safety Officer | No access to Trips & Analytics |
| `finance@fleetflow.test` | Finance Analyst | No access to Vehicles; read-only Trips |

---

## 📊 Database Schema

```mermaid
erDiagram
    User {
        String id PK
        String name
        String email UK
        String password
        Role role
        DateTime createdAt
    }

    Vehicle {
        String id PK
        String modelName
        String licensePlate UK
        VehicleType type
        Float maxCapacityKg
        Float odometer
        Float acquisitionCost
        VehicleStatus status
        DateTime createdAt
    }

    Driver {
        String id PK
        String name
        String licenseNumber UK
        String licenseCategory
        DateTime licenseExpiryDate
        Int safetyScore
        DriverStatus status
        DateTime createdAt
    }

    Trip {
        String id PK
        String vehicleId FK
        String driverId FK
        Float cargoWeight
        String origin
        String destination
        Float revenue
        Float startOdometer
        Float endOdometer
        TripStatus status
        DateTime createdAt
    }

    MaintenanceLog {
        String id PK
        String vehicleId FK
        String description
        Float cost
        DateTime date
    }

    FuelLog {
        String id PK
        String vehicleId FK
        String tripId FK
        Float liters
        Float cost
        DateTime date
    }

    Vehicle ||--o{ Trip : "has"
    Vehicle ||--o{ MaintenanceLog : "has"
    Vehicle ||--o{ FuelLog : "has"
    Driver ||--o{ Trip : "has"
    Trip ||--o{ FuelLog : "has"
```

---

## 🔄 Trip State Machine

```mermaid
stateDiagram-v2
    [*] --> DRAFT : Create Draft Trip
    DRAFT --> DISPATCHED : Dispatch (validate vehicle + driver)
    DRAFT --> CANCELLED : Cancel
    DISPATCHED --> COMPLETED : Complete (record end odometer)
    DISPATCHED --> CANCELLED : Cancel (release vehicle + driver)
    COMPLETED --> [*]
    CANCELLED --> [*]
```

**Dispatch Rules (enforced in transaction):**
1. Vehicle status must be `AVAILABLE`
2. Driver status must be `ON_DUTY`
3. Driver's license must not be expired
4. Cargo weight must not exceed vehicle capacity

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma Studio (visual DB editor) |
| `npx prisma migrate dev` | Create and run migrations |
| `npx prisma db seed` | Seed database with demo data |
| `npx prisma generate` | Regenerate Prisma Client |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ using Next.js, Prisma, and TypeScript
</p>
