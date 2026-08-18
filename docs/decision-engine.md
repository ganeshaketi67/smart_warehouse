# StockPilot Decision Engine

## Design rule

StockPilot separates **decision logic** from presentation. A decision must produce both an outcome and an explanation that an operator can inspect.

## Priority scoring

The intended priority score is deterministic and configurable. A baseline score can combine urgency at 40%, customer importance at 20%, order age at 20%, and stock availability at 20%.

| Score | Level | Operational meaning |
|---:|---|---|
| 90–100 | Critical | Protect the promise immediately; escalate shortages |
| 70–89 | High | Prioritize in the current wave |
| 40–69 | Medium | Process within the normal queue |
| 0–39 | Low | Defer when higher-impact work is blocked |

The score should be accompanied by reasons such as due-time pressure, customer importance, order age, and available-to-promise stock. The score is not an AI-generated opinion.

## Smart allocation

For each order, allocation should calculate the requested quantity, allocated quantity, remaining demand, shortage, reason, and recommended next action. When supply is insufficient, available stock goes to the highest-priority demand first; lower-priority orders are recalculated instead of being silently changed.

Example:

| Demand | Required | Allocated | Shortage | Result |
|---|---:|---:|---:|---|
| Critical order A | 10 | 7 | 3 | Partially allocated; replenish and keep shortage reserved |
| Lower-priority order B | 5 | 0 | 5 | Held for replenishment; impacted by the critical allocation |

Every inventory mutation should create a transaction such as `IN`, `OUT`, `RESERVED`, `RELEASED`, `DAMAGED`, `RETURNED`, or `ADJUSTMENT`.

## Inventory forecast

The current command-center widget is a transparent trend-based forecast. It estimates days of cover using available stock and recent order velocity, then labels the result as Critical or Watch with a confidence indicator. The widget is explicitly marked **AI-assisted** rather than claiming a live model connection.

A production implementation can replace the heuristic with a server-side forecasting provider while keeping the same typed result shape:

```ts
{
  sku: string;
  daysOfCover: number;
  risk: "CRITICAL" | "WATCH" | "HEALTHY";
  confidence: number;
  recommendedAction: string;
  explanation: string[];
}
```

## Exception handling

Exceptions should follow a visible lifecycle:

> Exception detected → recommended decision → operator confirmation → resolution note → audit event.

The current UI demonstrates this with partial allocation, missing inventory pressure, and a quality-check resolution note. A full implementation should persist the operator, timestamp, reason, and downstream impact for each decision.
