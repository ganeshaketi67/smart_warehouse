export type ActivityKind = "receive" | "order" | "pick" | "pack" | "quality" | "exception" | "manifest" | "dispatch";

export type ActivityEvent = {
  id: string;
  kind: ActivityKind;
  title: string;
  detail: string;
  actor: string;
  context: string;
  route: string;
  createdAt: string;
};

const STORAGE_KEY = "stockpilot.activity.v1";
const ACTIVITY_EVENT = "stockpilot:activity";

const seedEvents: ActivityEvent[] = [
  { id: "seed-1", kind: "dispatch", title: "Released ORD-10470 to carrier", detail: "DHL Express · staging lane D-02", actor: "Ravi Kumar", context: "ORD-10470", route: "/dispatch", createdAt: "2026-08-18T08:35:00.000Z" },
  { id: "seed-2", kind: "quality", title: "Quality check passed", detail: "Inspection completed with exception note attached", actor: "Asha Singh", context: "ORD-10482", route: "/workflow/quality-check", createdAt: "2026-08-18T08:22:00.000Z" },
  { id: "seed-3", kind: "pick", title: "Pick wave completed", detail: "42 waves · 186 units confirmed", actor: "Meera Shah", context: "WAVE-042", route: "/workflow/picking", createdAt: "2026-08-18T08:10:00.000Z" },
  { id: "seed-4", kind: "receive", title: "Stock received", detail: "48 units added to bin B-14", actor: "Asha Singh", context: "SKU-NX04", route: "/inventory", createdAt: "2026-08-18T07:58:00.000Z" },
];

function readEvents(): ActivityEvent[] {
  if (typeof window === "undefined") return seedEvents;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : seedEvents;
  } catch {
    return seedEvents;
  }
}

export function getActivityEvents(): ActivityEvent[] { return readEvents(); }

export function recordActivity(event: Omit<ActivityEvent, "id" | "createdAt">) {
  if (typeof window === "undefined") return;
  const next: ActivityEvent = { ...event, id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, createdAt: new Date().toISOString() };
  const events = [next, ...readEvents()].slice(0, 100);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  window.dispatchEvent(new CustomEvent(ACTIVITY_EVENT, { detail: next }));
  return next;
}

export function subscribeToActivity(listener: () => void) {
  window.addEventListener(ACTIVITY_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => { window.removeEventListener(ACTIVITY_EVENT, listener); window.removeEventListener("storage", listener); };
}

export function clearActivityEvents() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  window.dispatchEvent(new CustomEvent(ACTIVITY_EVENT));
}
