import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Download, TrendingUp, Receipt, Percent, Wallet, Shield } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useVendor } from "@/hooks/use-vendor";
import { getPayroll } from "@/lib/payroll.functions";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/employee-dashboard")({
  head: () => ({
    meta: [
      { title: "Employee Dashboard — MaalsoorHub" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Internal payroll dashboard. Admin access only." },
    ],
  }),
  component: EmployeeDashboard,
});

type ServiceRow = {
  sn: number;
  code: string;
  date: string;
  magacada: string;
  macamil: string;
  price: number;
  discount: number;
};

type EmployeeRow = {
  code: string;
  month: string;
  name: string;
  earn: number;
};

const TAX_RATE = 0.018;
const COMMISSION_RATE = 0.15;

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function EmployeeDashboard() {
  const navigate = useNavigate();
  const { isAdmin, loading, user } = useVendor();
  const fetchPayroll = useServerFn(getPayroll);
  const [selectedCode, setSelectedCode] = useState("20156");
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [employees, setEmployees] = useState<EmployeeRow[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user || !isAdmin) {
      navigate({ to: "/home" });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchPayroll({});
        if (cancelled) return;
        setServices(res.services);
        setEmployees(res.employees);
        setSelectedCode(res.employees[0]?.code ?? "");
      } catch {
        if (!cancelled) navigate({ to: "/home" });
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loading, isAdmin, user?.id]);

  const selected = employees.find((e) => e.code === selectedCode) ?? employees[0];

  const totals = useMemo(() => {
    const totalEarn = employees.reduce((s, e) => s + e.earn, 0);
    const totalComm = employees.reduce((s, e) => s + +(e.earn * COMMISSION_RATE).toFixed(2), 0);
    const totalNet = employees.reduce((s, e) => s + (e.earn - +(e.earn * COMMISSION_RATE).toFixed(2)), 0);
    return { totalEarn, totalComm, totalNet };
  }, [employees]);

  if (loading || dataLoading || !selected) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center">
          <Shield className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Checking access…</p>
        </div>
      </AppShell>
    );
  }

  const earn = selected.earn;
  const tax = +(earn * TAX_RATE).toFixed(2);
  const commission = +(earn * COMMISSION_RATE).toFixed(2);
  const net = +(earn - tax - commission).toFixed(2);

  return (
    <AppShell>
      <header className="grad-hero rounded-b-3xl px-4 pb-6 pt-5 text-white shadow-card">
        <div className="flex items-center justify-between">
          <Link to="/home" aria-label="Back" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-bold">Employee Dashboard</h1>
          <button aria-label="Export" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur">
            <Download className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4">
          <label className="text-xs text-white/80">Employee</label>
          <select
            value={selectedCode}
            onChange={(e) => setSelectedCode(e.target.value)}
            className="mt-1 w-full rounded-xl bg-white px-3 py-2.5 text-sm font-medium text-foreground outline-none shadow-soft"
          >
            {employees.map((e) => (
              <option key={e.code} value={e.code}>
                {e.code} — {e.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Summary */}
      <section className="px-4 pt-5">
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Earn" value={`$${fmt(earn)}`} tone="bg-green-100 text-green-900" />
          <StatCard icon={<Receipt className="h-4 w-4" />} label="Tax" value={`$${fmt(tax)}`} tone="bg-orange-100 text-orange-900" />
          <StatCard icon={<Percent className="h-4 w-4" />} label="Commission" value={`$${fmt(commission)}`} tone="bg-blue-100 text-blue-900" />
          <StatCard icon={<Wallet className="h-4 w-4" />} label="Net Amount" value={`$${fmt(net)}`} tone="bg-emerald-100 text-emerald-900" />
        </div>
      </section>

      {/* Daily services */}
      <section className="px-4 pt-6">
        <h2 className="mb-2 text-sm font-bold text-foreground">Daily Services — {selected.month}</h2>
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
          <table className="w-full text-xs">
            <thead className="bg-secondary text-foreground">
              <tr>
                <Th>#</Th><Th>Date</Th><Th>Customer</Th><Th className="text-right">Price</Th><Th className="text-right">Disc</Th><Th className="text-right">Paid</Th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.sn} className="border-t border-border">
                  <Td>{s.sn}</Td>
                  <Td className="whitespace-nowrap">{s.date}</Td>
                  <Td className="whitespace-nowrap">{s.macamil}</Td>
                  <Td className="text-right">${s.price}</Td>
                  <Td className="text-right">{s.discount}</Td>
                  <Td className="text-right font-semibold">${s.price - s.discount}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* All employees */}
      <section className="px-4 pt-6">
        <h2 className="mb-2 text-sm font-bold text-foreground">All Employees — May-26</h2>
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
          <table className="w-full text-xs">
            <thead className="bg-secondary text-foreground">
              <tr>
                <Th>Code</Th><Th>Name</Th><Th className="text-right">Earn</Th><Th className="text-right">Comm</Th><Th className="text-right">Net</Th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => {
                const comm = +(e.earn * COMMISSION_RATE).toFixed(2);
                const n = +(e.earn - comm).toFixed(2);
                return (
                  <tr
                    key={e.code}
                    onClick={() => setSelectedCode(e.code)}
                    className={`cursor-pointer border-t border-border hover:bg-secondary/50 ${e.code === selectedCode ? "bg-primary/5" : ""}`}
                  >
                    <Td>{e.code}</Td>
                    <Td className="whitespace-nowrap">{e.name}</Td>
                    <Td className="text-right">${fmt(e.earn)}</Td>
                    <Td className="text-right">${fmt(comm)}</Td>
                    <Td className="text-right font-semibold">${fmt(n)}</Td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-border bg-secondary font-bold">
                <Td colSpan={2}>Totals</Td>
                <Td className="text-right">${fmt(totals.totalEarn)}</Td>
                <Td className="text-right">${fmt(totals.totalComm)}</Td>
                <Td className="text-right">${fmt(totals.totalNet)}</Td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}

function StatCard({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-soft">
      <div className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-semibold ${tone}`}>
        {icon}
        {label}
      </div>
      <p className="mt-2 text-lg font-bold text-foreground">{value}</p>
    </div>
  );
}

function Th({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <th className={`px-2 py-2 text-left font-semibold ${className}`}>{children}</th>;
}

function Td({ children, className = "", colSpan }: { children?: React.ReactNode; className?: string; colSpan?: number }) {
  return (
    <td colSpan={colSpan} className={`px-2 py-2 ${className}`}>
      {children}
    </td>
  );
}
