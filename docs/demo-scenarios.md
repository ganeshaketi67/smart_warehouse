# StockPilot Demo Scenarios

## Scenario 1: Critical shortage allocation

Open the command center and select the urgent order `ORD-10482`. The order requests 10 units of `SKU-AX14`, while only 7 units are available. StockPilot recommends allocating the 7 available units to the critical order, holding the remaining 3 units in exception review, and protecting the lower-priority order from over-allocation.

The evaluator should see the requested quantity, available quantity, allocation, shortage, decision reason, and recommended next action before confirming the decision.

## Scenario 2: Picking handoff

Open the Picking workspace from the command center. Wave 07 contains three locations and seven units. Select each location, confirm the scan, and observe the progress bar move from 0% to 100%. Once complete, hand off the wave to Packing.

The key product behavior is that picking is not just a list: the wave is sequenced, each location carries a tote and zone context, and downstream work is unlocked only after the wave is complete.

## Scenario 3: Pack-bench recommendation

Open Packing from the stage navigation. StockPilot recommends carton C2 and explains why it balances protection and dimensional weight. Review the manifest, confirm the checklist, seal the carton, and hand off to Quality Check.

## Scenario 4: Quality-check exception resolution

Open Quality Check. The order has a partial-allocation exception: three units remain unallocated. Attach the resolution note, complete the four inspection checks, and pass the quality gate. The UI should keep the release action unavailable until the checklist and exception resolution are complete.

## Scenario 5: Forecasted low stock

Return to the command center and inspect the `04 / forecast signal` widget. Toggle between the next 7 days and next 14 days, compare days of cover and confidence, expand the signals, and stage a reorder recommendation. The widget is explicitly labeled AI-assisted and describes its inputs so the demo does not present simulated output as a live model claim.

## Evaluation checklist

| Capability | Visible proof |
|---|---|
| Decision support | Allocation drawer and forecast signal explain why |
| Edge-case handling | Partial allocation and QC exception are explicit |
| Workflow completeness | Picking → Packing → Quality Check handoffs work |
| Operational clarity | Location codes, tote, bench, carton, promise time |
| Auditability direction | Resolution note and transaction model are documented |
| Product polish | Responsive command center and workflow pages |
