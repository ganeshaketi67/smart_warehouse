# Smart Warehouse Ops — Design Direction

## Three stylistic approaches

### Theme Name: StockPilot Command
Very Brief Intro: An editorial operations console inspired by early-morning warehouse light, dock markings, and dispatch boards. It makes decisions feel calm, visible, and actionable rather than noisy.
Probability: 0.04

### Theme Name: Carbon Circuit
Very Brief Intro: A dark, high-contrast control room with sharp signal colors and technical motion. It emphasizes urgency and live system state.
Probability: 0.02

### Theme Name: Paper Trail Logistics
Very Brief Intro: A tactile, warm system that borrows from shipping manifests, stamped labels, and warehouse clipboards. It makes complex work feel approachable and human.
Probability: 0.06

## Selected approach: StockPilot Command

### Design Movement
Contemporary editorial dashboard design with industrial wayfinding references: oversized numeric hierarchy, hairline dividers, punched label shapes, and measured utility spacing.

### Core Principles
1. Make the next decision obvious: every alert includes context, impact, and a recommended action.
2. Use contrast as information architecture: deep ink surfaces for operations, pale stock paper surfaces for evidence, and a single high-vis signal color for attention.
3. Prefer asymmetric compositions over centered card grids: a narrow command rail, broad working canvas, and offset insight panels.
4. Treat motion as operational feedback: short, deliberate transitions that confirm state changes without theatricality.

### Color Philosophy
The system uses near-black ink, warm paper, and safety orange. Ink conveys focus and authority, paper provides visual rest for records and tables, and orange is reserved for decisions that deserve attention. Supporting tones are moss green for healthy flow and muted steel blue for secondary metadata.

### Layout Paradigm
Persistent left command rail with a wide operational canvas. The dashboard opens with a split “situation room” header, then moves into a staggered evidence layout: action queue, live flow, and inventory pressure. Detail drawers and modal sheets keep decisions in context instead of taking users away from the board.

### Signature Elements
- A “decision rail” with short numbered recommendations and explicit impact language.
- Monospaced metadata and location codes paired with editorial serif headlines.
- Small orange route marks and bracketed labels that echo dock signage and pick-path annotations.

### Interaction Philosophy
Every meaningful action should explain what changed. Buttons use direct verbs, risky actions surface the tradeoff, and the order allocation flow always shows the recommended resolution before the operator confirms it.

### Animation
Use 160–220ms ease-out transitions for hover, selection, and drawer entry. Stagger dashboard blocks by 45ms on first load. Animate progress bars and state chips with opacity/transform only. Avoid decorative loops; motion should feel like a status board refreshing. Respect prefers-reduced-motion.

### Typography System
Use DM Serif Display for high-level page titles and key decision headlines. Use IBM Plex Sans for operational labels and body copy. Use IBM Plex Mono for order IDs, SKUs, aisle/bin locations, timestamps, and numeric metrics. Headlines are tight and expressive; body copy is compact and readable; metadata is always visibly distinct.

### Brand Essence
A decision-support operating system for warehouse teams who need to protect service levels while stock and time are under pressure. Personality: observant, decisive, grounded.

### Brand Voice
Headlines are concise and situational. CTAs are direct, specific, and operational. Microcopy names the consequence rather than adding generic encouragement.

Example lines:
- “Protect the promise: allocate 7 of 10 now, release the remainder to tomorrow’s wave.”
- “Three exceptions are blocking dispatch. Resolve the oldest first.”

### Wordmark & Logo
A compact “dock bracket” mark: two offset vertical bars framing a small orange square, suggesting a bay door, a package, and a decision point. Pair it with the wordmark “StockPilot” in a custom condensed treatment rather than a default text lockup.

### Signature Brand Color
Dock Orange — #F26B38. It is intentionally closer to a safety vest under warm light than a generic startup orange, giving decisions a recognisable operational signal.

## Style Decisions
- Keep the dashboard light overall with an ink command rail and paper-white working surfaces.
- Do not use purple gradients, glassmorphism, or oversized hero photography; the product should feel like a working control room.
- Generated visuals, if used, should be restrained supporting assets: a subtle warehouse aisle texture and a transparent dock bracket mark, never decorative clutter.
