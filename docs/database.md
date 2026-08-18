# StockPilot Data Model

The frontend currently uses mock data so the hackathon flow is immediately demoable. The following tables describe the persistence model for a full-stack implementation.

| Table | Important fields | Purpose |
|---|---|---|
| `products` | `id`, `sku`, `name`, `category`, `reorder_level` | Product catalog and replenishment settings |
| `inventory_balances` | `product_id`, `location_id`, `total_stock`, `reserved_stock`, `damaged_stock` | Current stock state by warehouse location |
| `inventory_transactions` | `product_id`, `type`, `quantity`, `order_id`, `operator_id`, `reason`, `created_at` | Immutable inventory audit trail |
| `orders` | `id`, `customer`, `priority`, `priority_score`, `due_at`, `status` | Fulfillment demand and priority state |
| `order_items` | `order_id`, `product_id`, `requested_qty`, `allocated_qty`, `shortage_qty` | Demand and allocation detail |
| `allocation_decisions` | `order_id`, `reason`, `recommendation`, `approved_by`, `created_at` | Explainable allocation outputs |
| `pick_tasks` | `order_id`, `product_id`, `location_id`, `picker_id`, `status` | Picking work and operator assignment |
| `pack_manifests` | `order_id`, `carton_code`, `bench_id`, `sealed_at` | Packing evidence and carton recommendation |
| `quality_checks` | `order_id`, `checks`, `issue_status`, `resolution_note`, `passed_at` | Release gate and exception resolution |
| `dispatches` | `order_id`, `lane`, `carrier`, `tracking_code`, `status` | Dispatch handoff and shipment tracking |
| `activity_events` | `entity_type`, `entity_id`, `event_type`, `actor_id`, `metadata` | Cross-workflow audit timeline |

## Invariants

Available stock should be derived rather than manually edited:

> `available_stock = total_stock - reserved_stock - damaged_stock`

Allocation must never exceed available stock. A released reservation must create a corresponding inventory transaction. A quality-check pass must have a completed checklist and a resolution note when an exception exists. A dispatched order must have a successful quality-check event.

## Auth and permissions

Supabase Auth can provide operator identity. A role layer should distinguish warehouse operators, supervisors, inventory managers, and administrators. Writes to allocation decisions, inventory transactions, exception resolutions, and dispatch release should always record the authenticated actor.
