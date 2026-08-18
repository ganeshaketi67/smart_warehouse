# Smart Warehouse Operations & Order Fulfillment System

A modern full-stack warehouse operations platform designed to help warehouse teams monitor inventory, prioritize orders, review exceptions, simulate allocation decisions, and analyze fulfillment performance from a single command center.

> **Project:** Smart Warehouse Operations & Order Fulfillment System  
> **Application name:** StockPilot — Smart Warehouse OS  
> **Status:** Hackathon / academic project

---

## 📌 Problem Statement

Warehouses handle many products and orders simultaneously. Poor inventory visibility, incorrect stock allocation, delayed picking, misplaced items, and fulfillment bottlenecks can lead to stockouts, SLA failures, and poor customer experience.

This project provides a centralized operations workspace that helps teams:

- Monitor inventory and low-stock risk
- Prioritize fulfillment decisions
- Review exceptions before taking action
- Simulate inventory allocation scenarios
- Track operational activity
- Analyze warehouse performance
- Use an AI-assisted operations copilot for decision support

---

## 🎯 Objectives

1. Improve warehouse inventory visibility.
2. Reduce fulfillment delays and stock allocation mistakes.
3. Identify priority orders and operational exceptions.
4. Provide transparent recommendations for allocation decisions.
5. Allow operators to test "what-if" scenarios without changing live data.
6. Provide analytics and activity history for operational awareness.
7. Create a scalable foundation for real-world warehouse management.

---

## ✨ Key Features

### 1. Operations Command Center

The main dashboard provides an overview of warehouse health and decision priorities.

- Priority order queue
- Flow-health indicator
- Low-stock risk signals
- Forecast-style inventory coverage
- Open exception indicators
- Warehouse and shift information
- Operational status indicators

### 2. Inventory Management

The inventory workspace is designed to provide visibility into:

- Stock availability
- SKU-level information
- Inventory risk
- Demand/velocity signals
- Low-stock conditions
- Allocation pressure

### 3. Order Fulfillment

The order workflow helps operators understand:

- Order priority
- Demand
- Allocation
- Fulfillment status
- Shortage conditions
- Recommended next actions

### 4. Exception Review

A dedicated exception-review workspace helps operators inspect issues that may require human attention before fulfillment decisions are committed.

### 5. What-If Simulator

The Decision Lab provides a safe sandbox for testing allocation scenarios.

Operators can change:

- Available stock
- Order demand
- Priority scores
- Scenario presets

The simulator then calculates:

- Allocation
- Shortage
- Ranking
- Status
- Decision rationale

**Important:** Simulator changes remain local to the sandbox and do not mutate live inventory.

### 6. Analytics

The analytics workspace provides a foundation for monitoring warehouse performance and operational trends.

### 7. Activity History

Operational activity can be reviewed through an activity-history workspace for improved traceability.

### 8. AI Operations Copilot

StockPilot Copilot provides AI-assisted decision support.

The assistant is designed to return:

1. Situation
2. Recommended next move
3. Why
4. Operator check

The AI is intended as a decision-support tool and should not be treated as an autonomous system that executes inventory or customer-facing actions.

---

## 🏗️ System Architecture

```text
                         ┌─────────────────────────┐
                         │        User / Operator   │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │   React + Vite Frontend  │
                         │        client/            │
                         └────────────┬────────────┘
                                      │
                              tRPC / API layer
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │ Node.js + Express        │
                         │        server/            │
                         └────────────┬────────────┘
                                      │
                         ┌────────────┴────────────┐
                         ▼                         ▼
              ┌─────────────────────┐   ┌─────────────────────┐
              │ Drizzle ORM        │   │ AI / External       │
              │ + MySQL            │   │ service integrations │
              └──────────┬──────────┘   └─────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │      MySQL DB       │
              └─────────────────────┘
```

---

## 🧰 Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- Wouter
- TanStack React Query
- Tailwind CSS
- Radix UI
- Recharts
- Lucide React
- React Hook Form
- Framer Motion

### Backend

- Node.js
- Express
- TypeScript
- tRPC
- Zod
- TSX
- esbuild

### Database

- MySQL
- MySQL2
- Drizzle ORM
- Drizzle Kit

### AI / Integrations

- AI operations copilot
- AWS SDK / S3 integration support
- OAuth/session infrastructure

### Testing & Development

- Vitest
- TypeScript compiler
- Prettier
- pnpm

---

## 📁 Project Structure

```text
smart-warehouse-ops/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── hooks/
│       ├── lib/
│       └── pages/
│           ├── Activity.tsx
│           ├── Analytics.tsx
│           ├── Dispatch.tsx
│           ├── ExceptionReview.tsx
│           ├── Home.tsx
│           ├── Inventory.tsx
│           ├── Orders.tsx
│           ├── Simulator.tsx
│           ├── Workflow.tsx
│           └── NotFound.tsx
│
├── server/
│   ├── _core/
│   │   ├── context.ts
│   │   ├── cookies.ts
│   │   ├── env.ts
│   │   ├── index.ts
│   │   ├── llm.ts
│   │   ├── map.ts
│   │   ├── oauth.ts
│   │   ├── storageProxy.ts
│   │   └── trpc.ts
│   ├── db.ts
│   ├── index.ts
│   ├── routers.ts
│   └── storage.ts
│
├── drizzle/
│   ├── migrations/
│   ├── relations.ts
│   └── schema.ts
│
├── shared/
│
├── patches/
│
├── docs/
│
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
├── drizzle.config.ts
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

Install the following before running the project:

- Node.js 20+ recommended
- pnpm 10+
- MySQL 8+ for database-backed features
- Git

Check your installations:

```bash
node --version
pnpm --version
git --version
```

---

## 📥 Installation

Clone the repository:

```bash
git clone https://github.com/ganeshaketi67/smart_warehouse.git
```

Move into the project:

```bash
cd smart_warehouse
```

Install dependencies:

```bash
pnpm install
```

---

## 🔐 Environment Variables

Create a local `.env` file in the project root.

Example:

```env
DATABASE_URL=mysql://USERNAME:PASSWORD@HOST:3306/DATABASE_NAME

VITE_APP_ID=your_app_id
JWT_SECRET=your_secure_secret
OAUTH_SERVER_URL=your_oauth_server_url
OWNER_OPEN_ID=your_owner_open_id

BUILT_IN_FORGE_API_URL=your_api_url
BUILT_IN_FORGE_API_KEY=your_api_key
```

### Security

**Never commit `.env` to GitHub.**

The repository's `.gitignore` is configured to ignore common environment files.

For production deployment, configure these values through your hosting provider's environment-variable settings.

---

## 🗄️ Database Setup

The application uses Drizzle ORM with MySQL.

The database configuration reads:

```env
DATABASE_URL
```

After configuring the database, generate and apply migrations with:

```bash
pnpm db:push
```

> The current schema contains the core `users` table and is designed to be extended as warehouse-specific persistence grows.

---

## ▶️ Run in Development

Start the development server:

```bash
pnpm dev
```

The development command starts the Node/Express server with the Vite development environment.

Open the URL shown in your terminal.

---

## 🧪 Type Checking

Run TypeScript validation:

```bash
pnpm check
```

---

## 🏗️ Production Build

Create the production build:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

### Deploying to Vercel

This project is a Vite frontend plus a Node/Express backend. For Vercel deployments, configure the project to serve the static frontend from `dist/public` and keep a SPA fallback route so `/dashboard`, `/inventory`, etc. do not 404.

The repository includes a `vercel.json` with the required fallback:

```json
{
  "version": 2,
  "buildCommand": "pnpm build",
  "outputDirectory": "dist/public",
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

In the Vercel dashboard, set the project output directory to `dist/public`.

> Note: the Express API is not deployed by Vercel’s static hosting alone. For the backend routes (`/api`, OAuth, etc.), host them on a Node-compatible platform such as Render, Railway, or convert them into serverless functions.

---

## 🧪 Tests

Run the test suite:

```bash
pnpm test
```

---

## 🎨 Code Formatting

Format the project with:

```bash
pnpm format
```

---

## 🔄 Git Workflow

After making changes:

```bash
git add .
git commit -m "Describe your changes"
git push
```

The main GitHub repository is:

**https://github.com/ganeshaketi67/smart_warehouse**

---

## 🛡️ Safety & Operational Design

The application follows a human-in-the-loop approach for operational decisions.

The AI copilot and simulator provide recommendations and analysis, while real operational actions should remain subject to operator approval and appropriate system controls.

The What-If Simulator explicitly operates in sandbox mode and does not modify live inventory.

---

## 🔮 Future Enhancements

Potential production improvements include:

- Real-time inventory synchronization
- Barcode/QR scanning
- Warehouse location/bin management
- Automated stock replenishment
- Purchase order management
- Supplier management
- Role-based access control
- Real-time order tracking
- Pick-path optimization
- Warehouse heat maps
- Advanced demand forecasting
- Notifications and alerts
- Audit logs
- Multi-warehouse support
- Redis/event-driven processing
- Mobile warehouse operator application
- Integration with ERP/WMS/e-commerce systems
- Production-grade AI guardrails and approval workflows

---

## 📊 Example Operational Flow

```text
Incoming Orders
      │
      ▼
Priority Analysis
      │
      ├──────────────► Sufficient Stock
      │                       │
      │                       ▼
      │                 Allocate Order
      │                       │
      │                       ▼
      │                  Fulfillment
      │
      └──────────────► Stock Shortage
                              │
                              ▼
                       Exception Review
                              │
                              ▼
                     Recommended Action
                              │
                              ▼
                       Operator Approval
```

---

## 👥 Intended Users

- Warehouse managers
- Operations managers
- Inventory managers
- Fulfillment operators
- Dispatch teams
- Supply-chain teams
- Logistics teams
- Warehouse analysts

---

## 🎓 Hackathon Value

This project demonstrates how software, analytics, simulation, and AI-assisted decision support can be combined to address real-world warehouse fulfillment problems.

The platform focuses on:

- Inventory visibility
- Order prioritization
- Exception handling
- Decision transparency
- Safe scenario simulation
- Operational analytics
- Human-approved AI assistance

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Ganesh Aketi**

GitHub:  
https://github.com/ganeshaketi67

Project Repository:  
https://github.com/ganeshaketi67/smart_warehouse
