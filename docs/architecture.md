# StockPilot Architecture

## Product position

StockPilot is a smart warehouse operations and order fulfillment platform. Its primary job is to help warehouse teams decide what to do next when demand, inventory, time, and exceptions are in tension.

The core operational loop is:

> Order created → priority determined → inventory checked → inventory allocated → picking → packing → quality check → dispatch → inventory updated.

The product is designed around the rule **Exception → Decision → Resolution**. The interface should never silently change inventory or hide why a decision was made.

## Current hackathon implementation

The current project is a static React, TypeScript, Vite, and Tailwind frontend using mock warehouse data. It includes the command center, priority-order decision drawer, inventory pressure panel, trend-based inventory forecast, and dedicated Picking, Packing, and Quality Check workspaces. The UI is intentionally demo-ready and can be used without real warehouse APIs.

The current static boundary is deliberate: there is no live database, authentication, server-side AI provider, or external warehouse integration in this checkpoint. Forecast and decision language is labeled as **AI-assisted** or **simulated** where appropriate, and the underlying formulas remain inspectable in the frontend so a hackathon evaluator can follow the logic.

## Intended full-stack evolution

| Layer | Responsibility | Recommended implementation |
|---|---|---|
| Presentation | Responsive operations console, workflow pages, decision explanations | React + TypeScript + Tailwind + Lucide |
| Application services | Inventory, orders, allocation, picking, fulfillment, exceptions, analytics | Modular service layer with typed interfaces |
| Decision logic | Priority scoring, allocation, picking path, reorder forecast, exception resolution | Pure deterministic TypeScript functions with unit tests |
| Persistence | Products, inventory, orders, reservations, tasks, transactions, audit log | Supabase PostgreSQL |
| Authentication | Operator identity and role-based access | Supabase Auth |
| AI boundary | Explanations, scenario summaries, forecast narratives | Server-side function with provider abstraction; never expose keys in browser |
| Analytics | Fulfillment rate, bottlenecks, stockout risk, activity history | Recharts over typed query results |

## Frontend vocabulary

The interface uses a shared operational vocabulary: `order`, `inventory item`, `allocation`, `pick task`, `pack manifest`, `quality check`, `dispatch handoff`, `exception`, `decision`, `resolution`, and `inventory transaction`. Keeping these nouns stable makes it easier to connect the current mock experience to a database later.

## Security boundary

Secrets must remain in environment variables or server-side functions. Any future AI integration must be routed through a backend boundary and must return structured, reviewable output. The browser should receive only the minimum data required to render a decision or explanation.
