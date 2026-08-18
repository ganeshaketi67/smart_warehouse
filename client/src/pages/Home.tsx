/* StockPilot Command: editorial warehouse console, warm paper surfaces, ink rail, orange decisions. */
import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  Check,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Command,
  Filter,
  Forklift,
  Gauge,
  HelpCircle,
  Inbox,
  Layers3,
  Menu,
  PackageCheck,
  PanelLeftClose,
  PackageSearch,
  RefreshCw,
  ScanLine,
  Search,
  Settings2,
  ShieldAlert,
  Sparkles,
  Truck,
  Warehouse,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

const orders = [
  { id: "ORD-10482", customer: "Northstar Retail", items: "10 × SKU-AX14", promise: "Today · 14:00", status: "At risk", priority: "P1", available: "7 / 10", note: "Partial allocation recommended" },
  { id: "ORD-10479", customer: "Cedar & Co.", items: "5 × SKU-AX14", promise: "Today · 16:30", status: "Waiting", priority: "P2", available: "5 / 5", note: "Can release after P1 decision" },
  { id: "ORD-10475", customer: "Morrow Supply", items: "18 lines", promise: "Tomorrow · 09:00", status: "Picking", priority: "P2", available: "Ready", note: "Wave 07 · aisle A3" },
  { id: "ORD-10470", customer: "Bluebird Home", items: "3 lines", promise: "Tomorrow · 11:30", status: "Packed", priority: "P3", available: "Ready", note: "QC pending" },
];

const inventory = [
  { sku: "SKU-AX14", name: "AeroFlex Runner", location: "A3 · B-17", onHand: 7, reserved: 12, reorder: 20, delta: -8, tone: "critical" },
  { sku: "SKU-KP09", name: "Kraft Mailer · L", location: "B1 · C-04", onHand: 186, reserved: 48, reorder: 120, delta: 18, tone: "healthy" },
  { sku: "SKU-QZ22", name: "QuietPack Insert", location: "C2 · A-09", onHand: 34, reserved: 29, reorder: 45, delta: -4, tone: "watch" },
  { sku: "SKU-RM31", name: "Return Label Roll", location: "D4 · D-11", onHand: 9, reserved: 0, reorder: 15, delta: -2, tone: "critical" },
];

const forecastData = [
  { sku: "SKU-AX14", name: "AeroFlex Runner", location: "A3 · B-17", available: 7, velocity: 6.2, days: 1.1, risk: "Critical", confidence: 94, trend: [34, 42, 48, 57, 63, 76, 88], action: "Reorder 20 units" },
  { sku: "SKU-QZ22", name: "QuietPack Insert", location: "C2 · A-09", available: 34, velocity: 4.8, days: 7.1, risk: "Watch", confidence: 87, trend: [31, 38, 35, 44, 51, 57, 65], action: "Review in 3 days" },
  { sku: "SKU-RM31", name: "Return Label Roll", location: "D4 · D-11", available: 9, velocity: 1.8, days: 5, risk: "Watch", confidence: 81, trend: [26, 29, 33, 31, 38, 42, 48], action: "Reorder 15 units" },
];

const navItems = [
  { label: "Command center", icon: Command },
  { label: "Orders", icon: Inbox, count: "24" },
  { label: "Inventory", icon: Boxes, count: "06" },
  { label: "Pick & pack", icon: ClipboardCheck },
  { label: "Dispatch", icon: Truck },
  { label: "Analytics", icon: Gauge },
  { label: "What-if Simulator", icon: Sparkles },
  { label: "Activity history", icon: Activity },
];

function StatusPill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "critical" | "healthy" | "watch" | "ink" }) {
  const styles = {
    neutral: "bg-[#f2efe8] text-[#5c615f]",
    critical: "bg-[#fff0e9] text-[#cf542b]",
    healthy: "bg-[#e8f3ea] text-[#2f7650]",
    watch: "bg-[#f7f1df] text-[#9a7625]",
    ink: "bg-white/10 text-[#d5d9d4]",
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${styles[tone]}`}>{children}</span>;
}

function Metric({ label, value, foot, trend, tone = "ink" }: { label: string; value: string; foot: string; trend?: "up" | "down"; tone?: "ink" | "paper" }) {
  return (
    <div className={`relative overflow-hidden rounded-[18px] p-5 ${tone === "ink" ? "bg-[#171a19] text-white" : "bg-[#fffdf8] text-[#161917] ring-1 ring-[#e7e2d8]"}`}>
      <div className="mb-6 flex items-center justify-between"><span className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${tone === "ink" ? "text-[#9ea79f]" : "text-[#777b75]"}`}>{label}</span>{trend && <span className={`flex items-center text-xs ${trend === "up" ? "text-[#8dc99e]" : "text-[#f29a76]"}`}>{trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{trend === "up" ? "4.8%" : "2.1%"}</span>}</div>
      <div className="font-serif text-[34px] leading-none tracking-[-0.04em]">{value}</div>
      <div className={`mt-3 text-xs ${tone === "ink" ? "text-[#aeb6af]" : "text-[#777b75]"}`}>{foot}</div>
      {tone === "ink" && <div className="absolute -bottom-5 -right-5 h-24 w-24 rounded-full border border-white/10" />}
    </div>
  );
}

function ForecastWidget() {
  const [horizon, setHorizon] = useState<"7d" | "14d">("7d");
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? forecastData : forecastData.slice(0, 2);
  return <section className="mb-8 rounded-[18px] bg-[#fffdf8] ring-1 ring-[#e7e2d8]"><div className="flex flex-col gap-4 border-b border-[#ebe6dd] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><div className="flex items-center gap-2"><span className="bracket-tag">04 / forecast signal</span><StatusPill tone="healthy"><Sparkles size={12} /> AI-assisted</StatusPill></div><h3 className="mt-2 font-serif text-[26px] tracking-[-0.04em]">Low-stock risk, before it becomes a stop.</h3><p className="mt-1 max-w-[610px] text-xs leading-5 text-[#83877f]">A transparent forecast from the last 7 order cycles, current available-to-promise stock, and reservation pressure.</p></div><div className="flex items-center gap-1 rounded-[10px] bg-[#f5f2eb] p-1"><button onClick={() => setHorizon("7d")} className={`rounded-[8px] px-3 py-1.5 text-[11px] font-semibold ${horizon === "7d" ? "bg-[#171a19] text-white" : "text-[#777b75]"}`}>Next 7d</button><button onClick={() => setHorizon("14d")} className={`rounded-[8px] px-3 py-1.5 text-[11px] font-semibold ${horizon === "14d" ? "bg-[#171a19] text-white" : "text-[#777b75]"}`}>Next 14d</button></div></div><div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">{visible.map((item) => { const critical = item.risk === "Critical"; const forecastDays = horizon === "7d" ? item.days : item.days * 1.85; return <div key={item.sku} className={`rounded-[14px] border p-4 ${critical ? "border-[#f1c4b3] bg-[#fff5ef]" : "border-[#ebe6dd] bg-[#fffaf3]"}`}><div className="flex items-start justify-between gap-3"><div><div className="font-mono text-[11px] font-bold text-[#303630]">{item.sku}</div><div className="mt-1 text-xs text-[#777b75]">{item.name}</div></div><StatusPill tone={critical ? "critical" : "watch"}>{item.risk}</StatusPill></div><div className="mt-4 flex items-end justify-between"><div><div className="font-serif text-[28px] leading-none tracking-[-0.04em]">{forecastDays.toFixed(1)} <span className="font-sans text-[11px] font-semibold tracking-normal text-[#858980]">days cover</span></div><div className="mt-2 text-[11px] text-[#8b8e86]">{item.available} available · {item.velocity}/day velocity</div></div><div className="flex h-8 items-end gap-1">{item.trend.map((height, index) => <span key={index} className={`w-2 rounded-t-sm ${critical ? "bg-[#f26b38]" : "bg-[#d8ad57]"}`} style={{ height: `${height / 3}px` }} />)}</div></div><div className="mt-4 flex items-center justify-between border-t border-black/5 pt-3"><span className="font-mono text-[10px] text-[#8b8e86]">confidence {item.confidence}%</span><button onClick={() => toast(`Forecast action staged: ${item.action} for ${item.sku}.`)} className="text-[11px] font-bold text-[#cf542b] hover:text-[#a94626]">{item.action} <ArrowUpRight size={13} className="inline" /></button></div></div>; })}</div><div className="flex items-center justify-between border-t border-[#ebe6dd] px-5 py-3 sm:px-6"><span className="flex items-center gap-2 text-[10px] text-[#9a9d95]"><Sparkles size={12} className="text-[#f26b38]" /> Forecast refresh: 08:40 · model uses recent order velocity</span><button onClick={() => setExpanded(!expanded)} className="text-xs font-bold text-[#d95e31]">{expanded ? "Show top risks" : "View all signals"} <ChevronRight size={13} className="inline" /></button></div></section>;
}

export default function Home() {
  const [activeNav, setActiveNav] = useState("Command center");
  const [, setLocation] = useLocation();
  const [mobileNav, setMobileNav] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(orders[0]);
  const [search, setSearch] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);
  const [allocated, setAllocated] = useState(false);

  const filteredOrders = useMemo(() => orders.filter((order) => `${order.id} ${order.customer} ${order.items}`.toLowerCase().includes(search.toLowerCase())), [search]);

  function chooseNav(label: string) {
    setActiveNav(label);
    const routes: Record<string, string> = { "Orders": "/orders", "Inventory": "/inventory", "Pick & pack": "/workflow/picking", "Packing": "/workflow/packing", "Quality check": "/workflow/quality-check", "What-if Simulator": "/simulator", "Analytics": "/analytics", "Dispatch": "/dispatch", "Exception review": "/exceptions", "Activity history": "/activity" };
    if (routes[label]) { setLocation(routes[label]); setMobileNav(false); return; }
    if (label !== "Command center") toast(`${label} view is staged for the next workflow pass.`);
    setMobileNav(false);
  }

  function allocateOrder() {
    setAllocated(true);
    toast.success("Partial allocation staged", { description: "7 units reserved for ORD-10482. 3 units moved to exception review." });
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#161917]">
      <div className="flex min-h-screen">
        <aside className={`${mobileNav ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col bg-[#171a19] px-5 py-6 text-white transition-transform duration-200 ease-out lg:sticky lg:top-0 lg:h-screen`}>
          <div className="mb-10 flex items-center justify-between px-2">
            <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#f26b38] p-2"><img src="/manus-storage/docklight-mark_b9a82781.png" alt="StockPilot mark" className="h-full w-full object-contain" /></div><div><div className="font-serif text-[22px] leading-none tracking-[-0.04em]">StockPilot</div><div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#8e9890]">Smart Warehouse OS</div></div></div>
            <button className="rounded-lg p-1 text-[#89938a] hover:bg-white/10 lg:hidden" onClick={() => setMobileNav(false)}><X size={18} /></button>
          </div>
          <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#707a71]">Operations</div>
          <nav className="space-y-1">
            {navItems.map(({ label, icon: Icon, count }) => <button key={label} onClick={() => chooseNav(label)} className={`group flex w-full items-center justify-between rounded-[10px] px-3 py-3 text-left text-[13px] transition-colors ${activeNav === label ? "bg-[#f26b38] text-white" : "text-[#b2bab3] hover:bg-white/[0.07] hover:text-white"}`}><span className="flex items-center gap-3"><Icon size={17} strokeWidth={1.8} /><span>{label}</span></span>{count && <span className={`font-mono text-[10px] ${activeNav === label ? "text-white/80" : "text-[#788279]"}`}>{count}</span>}</button>)}
          </nav>
          <div className="my-8 h-px bg-white/10" />
          <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#707a71]">Workspace</div>
          <button onClick={() => chooseNav("Exception review")} className="flex w-full items-center gap-3 rounded-[10px] px-3 py-3 text-left text-[13px] text-[#b2bab3] hover:bg-white/[0.07] hover:text-white"><ShieldAlert size={17} strokeWidth={1.8} /><span>Exception review</span><span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f26b38] px-1.5 text-[10px] font-bold text-white">3</span></button>
          <button onClick={() => chooseNav("Activity history")} className="flex w-full items-center gap-3 rounded-[10px] px-3 py-3 text-left text-[13px] text-[#b2bab3] hover:bg-white/[0.07] hover:text-white"><Activity size={17} strokeWidth={1.8} /><span>Activity history</span></button>
          <button onClick={() => toast("Settings are available from the workspace menu.")} className="flex w-full items-center gap-3 rounded-[10px] px-3 py-3 text-left text-[13px] text-[#b2bab3] hover:bg-white/[0.07] hover:text-white"><Settings2 size={17} strokeWidth={1.8} /><span>Settings</span></button>
          <div className="mt-auto rounded-[14px] border border-white/10 bg-white/[0.04] p-4"><div className="flex items-center gap-2 text-[11px] font-semibold text-[#d8ddd8]"><span className="h-2 w-2 rounded-full bg-[#82c68f] shadow-[0_0_0_4px_rgba(130,198,143,0.12)]" /> Live sync active</div><div className="mt-2 text-[11px] leading-relaxed text-[#7d887f]">Last refresh <span className="font-mono text-[#aeb6af]">08:42:16</span></div></div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#e4dfd6] bg-[#f4f1ea]/95 px-5 backdrop-blur-md sm:px-8 lg:px-10">
            <div className="flex items-center gap-4"><button className="rounded-lg p-2 text-[#545a56] hover:bg-white lg:hidden" onClick={() => setMobileNav(true)}><Menu size={20} /></button><div><div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b8d85]"><span>Wednesday, 16 Aug</span><span className="h-1 w-1 rounded-full bg-[#c2bbb0]" /><span>Shift A · 08:42</span></div><h1 className="mt-1 font-serif text-[26px] tracking-[-0.04em] sm:text-[30px]">Ganesh aketi</h1></div></div>
            <div className="flex items-center gap-2 sm:gap-3"><div className="hidden items-center gap-2 rounded-full bg-white px-3 py-2 text-xs text-[#6e736d] ring-1 ring-[#e7e2d8] sm:flex"><Warehouse size={14} className="text-[#f26b38]" /> Bengaluru · WH-01</div><button onClick={() => toast("No new notifications. Operations are within SLA.")} className="relative rounded-full bg-white p-2.5 text-[#5a615b] ring-1 ring-[#e7e2d8] hover:bg-[#fffaf3]"><Inbox size={17} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#f26b38]" /></button><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c9d9cc] text-xs font-bold text-[#2f5b3b]">AS</div></div>
          </header>

          <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
            <section className="mb-8 grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
              <div className="relative overflow-hidden rounded-[18px] bg-[#232725] p-6 text-white sm:p-8"><div className="absolute inset-y-0 right-0 w-1/2 bg-[url('/manus-storage/warehouse-aisle-paper_73439a6f.jpg')] bg-cover bg-center opacity-25 mix-blend-screen" /><div className="relative max-w-[580px]"><div className="mb-7 flex items-center gap-2"><Sparkles size={15} className="text-[#f26b38]" /><span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a8b0a9]">Decision queue · 03 open</span></div><h2 className="max-w-[520px] font-serif text-[36px] leading-[1.02] tracking-[-0.05em] sm:text-[46px]">Protect today’s promise before the next wave lands.</h2><p className="mt-5 max-w-[470px] text-[13px] leading-6 text-[#b5bcb5]">One urgent order is short on stock. The system has a recommendation ready, with the service-level impact made explicit.</p><button onClick={() => setShowDrawer(true)} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#f26b38] px-4 py-2.5 text-[12px] font-bold text-white transition-transform hover:bg-[#ff7844] active:scale-[0.97]">Review decision <ChevronRight size={15} /></button></div><div className="absolute bottom-6 right-7 hidden font-mono text-[10px] uppercase tracking-[0.18em] text-[#748078] sm:block">DL / OPS-01</div></div>
              <div className="rounded-[18px] bg-[#fffdf8] p-6 ring-1 ring-[#e7e2d8] sm:p-8"><div className="flex items-center justify-between"><span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8b8d85]">Flow health</span><StatusPill tone="healthy"><span className="h-1.5 w-1.5 rounded-full bg-current" /> On track</StatusPill></div><div className="mt-7 flex items-end justify-between"><div><div className="font-serif text-[50px] leading-none tracking-[-0.06em]">92<span className="text-[25px]">%</span></div><div className="mt-3 text-xs text-[#777b75]">orders within promise</div></div><div className="text-right"><div className="font-mono text-[12px] font-semibold text-[#2f7650]">+4.8%</div><div className="mt-1 text-[11px] text-[#8b8d85]">vs. last shift</div></div></div><div className="mt-8 flex h-16 items-end gap-1.5">{[38, 45, 42, 58, 54, 68, 72, 66, 79, 76, 86, 92].map((h, i) => <div key={i} className={`flex-1 rounded-t-sm ${i === 11 ? "bg-[#f26b38]" : "bg-[#d9e8db]"}`} style={{ height: `${h}%` }} />)}</div><div className="mt-3 flex justify-between font-mono text-[9px] uppercase tracking-[0.12em] text-[#9a9d95]"><span>06:00</span><span>Now</span></div></div>
            </section>

            <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Orders in flight" value="128" foot="24 need a decision" trend="up" /><Metric label="Units available" value="8,642" foot="97.2% inventory accuracy" trend="up" /><Metric label="Pick cycle time" value="18m" foot="Target is under 22m" trend="down" /><Metric label="Dispatch readiness" value="76%" foot="14 parcels in QC" tone="paper" /></section>

            <ForecastWidget />

            <section className="grid items-start gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[18px] bg-[#fffdf8] ring-1 ring-[#e7e2d8]"><div className="flex flex-col gap-4 border-b border-[#ebe6dd] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><div className="flex items-center gap-2"><span className="bracket-tag">01 / queue</span><h3 className="font-serif text-[24px] tracking-[-0.035em]">Priority orders</h3><StatusPill tone="critical">3 action needed</StatusPill></div><p className="mt-1 text-xs text-[#83877f]">The queue is ranked by promise risk, stock pressure, and customer tier.</p></div><div className="flex items-center gap-2"><div className="flex items-center gap-2 rounded-lg bg-[#f5f2eb] px-3 py-2 text-xs text-[#777b75]"><Search size={14} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search order" className="w-24 bg-transparent outline-none placeholder:text-[#9a9d95] sm:w-32" /></div><button onClick={() => toast("Filters: promise risk, priority, allocation state")} className="rounded-lg bg-[#f5f2eb] p-2 text-[#686e68] hover:bg-[#ede9e0]"><Filter size={15} /></button></div></div><div className="divide-y divide-[#eee9e0]">{filteredOrders.map((order) => <button key={order.id} onClick={() => { setSelectedOrder(order); setShowDrawer(true); }} className="group grid w-full grid-cols-[1fr_auto] gap-4 px-5 py-4 text-left transition-colors hover:bg-[#fffaf3] sm:grid-cols-[1.15fr_0.8fr_0.8fr_auto] sm:px-6"><div className="min-w-0"><div className="flex items-center gap-2"><span className="font-mono text-[12px] font-bold text-[#1e2420]">{order.id}</span><StatusPill tone={order.status === "At risk" ? "critical" : order.status === "Picking" ? "healthy" : "neutral"}>{order.priority}</StatusPill></div><div className="mt-1 truncate text-xs text-[#777b75]">{order.customer} · {order.items}</div></div><div className="hidden sm:block"><div className="text-xs font-semibold text-[#343a35]">{order.promise}</div><div className="mt-1 text-[11px] text-[#93968f]">Promise window</div></div><div className="hidden sm:block"><div className={`text-xs font-semibold ${order.status === "At risk" ? "text-[#cf542b]" : "text-[#343a35]"}`}>{order.available}</div><div className="mt-1 text-[11px] text-[#93968f]">Availability</div></div><div className="flex items-center gap-2"><StatusPill tone={order.status === "At risk" ? "critical" : order.status === "Picking" ? "healthy" : "neutral"}>{order.status}</StatusPill><ChevronRight size={16} className="text-[#b0b3ac] transition-transform group-hover:translate-x-0.5" /></div></button>)}{filteredOrders.length === 0 && <div className="px-6 py-10 text-center text-sm text-[#888b84]">No orders match this search.</div>}</div><div className="flex items-center justify-between border-t border-[#ebe6dd] px-5 py-4 sm:px-6"><span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#9a9d95]">Showing {filteredOrders.length} of 24 active orders</span><button onClick={() => toast("Order workspace opened.")} className="flex items-center gap-1 text-xs font-bold text-[#d95e31] hover:text-[#b64b25]">View queue <ArrowUpRight size={14} /></button></div></div>

              <div className="space-y-6"><div className="rounded-[18px] bg-[#171a19] p-5 text-white sm:p-6"><div className="flex items-center justify-between"><div><div className="bracket-tag mb-2">02 / evidence</div><h3 className="font-serif text-[23px] tracking-[-0.035em]">Inventory pressure</h3><p className="mt-1 text-xs text-[#89938a]">Stock signals that can change today’s plan.</p></div><button onClick={() => toast("Inventory refreshed from the latest warehouse scan.")} className="rounded-lg p-2 text-[#89938a] hover:bg-white/10"><RefreshCw size={15} /></button></div><div className="mt-5 space-y-3">{inventory.map((item) => <div key={item.sku} className="rounded-[14px] border border-white/10 bg-white/[0.03] p-3.5"><div className="flex items-start justify-between gap-3"><div><div className="font-mono text-[11px] font-semibold text-[#d9ddd8]">{item.sku}</div><div className="mt-1 text-xs text-[#89938a]">{item.name}</div></div><StatusPill tone={item.tone as "critical" | "healthy" | "watch"}>{item.tone === "critical" ? "Reorder" : item.tone === "watch" ? "Watch" : "Healthy"}</StatusPill></div><div className="mt-3 flex items-center gap-3"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"><div className={`h-full rounded-full ${item.tone === "critical" ? "bg-[#f26b38]" : item.tone === "watch" ? "bg-[#d8ad57]" : "bg-[#72b781]"}`} style={{ width: `${Math.min(100, (item.onHand / item.reorder) * 100)}%` }} /></div><span className="font-mono text-[11px] text-[#c3cbc4]">{item.onHand} / {item.reorder}</span></div><div className="mt-2 flex justify-between font-mono text-[10px] text-[#707a71]"><span>{item.location}</span><span className={item.delta < 0 ? "text-[#ed8a68]" : "text-[#7fc08b]"}>{item.delta > 0 ? "+" : ""}{item.delta} today</span></div></div>)}</div><button onClick={() => chooseNav("Inventory")} className="mt-5 flex items-center gap-1 text-xs font-bold text-[#f18a61] hover:text-[#ffa17d]">Open inventory workspace <ChevronRight size={14} /></button></div>

                <div className="rounded-[18px] bg-[#fffdf8] p-5 ring-1 ring-[#e7e2d8] sm:p-6"><div className="flex items-center justify-between"><div><div className="bracket-tag mb-2">03 / throughput</div><h3 className="font-serif text-[23px] tracking-[-0.035em]">Today’s flow</h3><p className="mt-1 text-xs text-[#83877f]">128 orders · 418 units</p></div><Forklift size={20} className="text-[#f26b38]" /></div><div className="mt-6 space-y-4">{[["Created", "128", "100%", "bg-[#d8e9db]"], ["Allocated", "106", "83%", "bg-[#b8d9bd]"], ["Picking", "74", "58%", "bg-[#94c89e]"], ["Packing", "43", "34%", "bg-[#f5b09a]"], ["Dispatch", "21", "16%", "bg-[#f26b38]"]].map(([label, value, pct, color]) => <div key={label} className="grid grid-cols-[70px_1fr_40px] items-center gap-3"><span className="text-[11px] font-semibold text-[#777b75]">{label}</span><div className="h-2 overflow-hidden rounded-full bg-[#f0ece4]"><div className={`h-full rounded-full ${color}`} style={{ width: pct }} /></div><span className="font-mono text-[11px] text-[#6d736b]">{value}</span></div>)}</div><div className="mt-6 flex items-center gap-2 border-t border-[#ebe6dd] pt-4 text-[11px] text-[#83877f]"><Clock3 size={14} className="text-[#f26b38]" /> Median order age <span className="font-mono font-semibold text-[#3a403b]">42 min</span></div></div></div>
            </section>
          </div>
        </main>
      </div>

      {showDrawer && <div className="fixed inset-0 z-50 flex justify-end bg-[#101311]/35" onClick={() => setShowDrawer(false)}><section className="h-full w-full max-w-[470px] overflow-y-auto bg-[#fffdf8] p-6 shadow-2xl sm:p-8" onClick={(e) => e.stopPropagation()}><div className="flex items-start justify-between"><div><div className="flex items-center gap-2"><StatusPill tone="critical">Decision required</StatusPill><span className="font-mono text-[11px] text-[#92958e]">P1 / {selectedOrder.id}</span></div><h2 className="mt-4 font-serif text-[34px] leading-none tracking-[-0.05em]">Protect the promise.</h2><p className="mt-3 text-sm leading-6 text-[#6f746d]">The requested quantity exceeds available stock. StockPilot recommends a partial allocation to keep the highest-value order moving.</p></div><button onClick={() => setShowDrawer(false)} className="rounded-lg p-2 text-[#777b75] hover:bg-[#f3efe7]"><X size={18} /></button></div><div className="mt-8 rounded-[18px] bg-[#f5f1e9] p-5"><div className="flex items-center justify-between text-xs"><span className="text-[#777b75]">Requested</span><span className="font-mono font-bold text-[#1f2621]">10 units</span></div><div className="my-4 h-px bg-[#dfd9cd]" /><div className="flex items-center justify-between text-xs"><span className="text-[#777b75]">Available now</span><span className="font-mono font-bold text-[#cf542b]">7 units</span></div><div className="mt-4 flex items-center gap-2 text-[11px] text-[#8b8e86]"><PackageSearch size={14} className="text-[#f26b38]" /> {selectedOrder.items} · {selectedOrder.customer}</div></div><div className="mt-7"><div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8d9089]"><ScanLine size={14} className="text-[#f26b38]" /> Recommended resolution</div><div className="rounded-[18px] border border-[#f1c4b3] bg-[#fff5ef] p-5"><div className="flex gap-3"><div className="mt-0.5 rounded-full bg-[#f26b38] p-1.5 text-white"><Check size={14} /></div><div><div className="text-sm font-bold text-[#3a2922]">Allocate 7 now · hold 3 in exception review</div><p className="mt-2 text-xs leading-5 text-[#7d675e]">This protects the highest-priority promise while preventing lower-priority order ORD-10479 from being over-allocated.</p></div></div></div></div><div className="mt-7 space-y-2"><button onClick={allocateOrder} disabled={allocated} className="flex w-full items-center justify-center gap-2 rounded-[11px] bg-[#f26b38] px-4 py-3 text-xs font-bold text-white transition-transform hover:bg-[#df5b2e] active:scale-[0.98] disabled:cursor-default disabled:bg-[#7caf7d]">{allocated ? <><Check size={15} /> Allocation staged</> : <>Confirm recommendation <ChevronRight size={15} /></>}</button><button onClick={() => { setShowDrawer(false); toast("Order deferred. The queue has been re-ranked."); }} className="w-full rounded-[11px] px-4 py-3 text-xs font-bold text-[#6e746d] hover:bg-[#f4f0e8]">Defer and re-rank queue</button></div><div className="mt-8 border-t border-[#ebe6dd] pt-5"><div className="flex items-start gap-3 text-xs text-[#888c84]"><HelpCircle size={15} className="mt-0.5 text-[#9b9d96]" /><span>Decision logic considers promise window, customer priority, available-to-promise stock, and downstream pick efficiency.</span></div></div></section></div>}
    </div>
  );
}
