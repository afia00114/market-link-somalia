import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Download, TrendingUp, Receipt, Percent, Wallet } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/employee-dashboard")({
  head: () => ({
    meta: [
      { title: "Employee Dashboard — MaalsoorHub" },
      { name: "description", content: "Track employee earnings, tax, commission, and net amount across daily services." },
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

const SERVICES: ServiceRow[] = Array.from({ length: 26 }, (_, i) => ({
  sn: i + 1,
  code: "20156",
  date: `5/${i + 1}/2026`,
  magacada: "Mohamud Ali",
  macamil: [
    "Shankaroon Mohamed Nur Abdi", "Daud Mohamed Abdirahman Alin", "Mohamed Ahmed Garar Abikar",
    "Mohamed Sheikh Idle Nunow", "Abdi Mahdi Abdullahi Jelle", "Aadan Ahmed Garar Abikar",
    "Nunow Adan Ged Mohamed", "Sharmaarke Adan Mohamed Ahmed", "Zakaria Jimale Yarkow Hassan",
    "Safa Mohamed Nuur Ali", "Liban Yahya Mohamed Ibrahim", "Suleqa Hassan Ibrahim Abdirahman",
    "Nadifo Maxamad Nur Ali", "Abdiwadud Ahmed Osman Mohamud", "Zakaria Abass Mohamud Hassan",
    "Jelle Mohamed Osman Ali", "Yusra Ali Adan Hassan", "Ibrahim Yusuf Maxamed Xasan",
    "Yussuf Ahmed Yerrow Abikar", "Siyat Ibrahim Issak Adan", "Mohamed Noor Abukar Hassan",
    "Siyad Abdirahman Mohamud Mohamed", "Abdi Rakau Adan Salat", "Yusuf Mohamed Hassan Abdulle",
    "Abdirisak Aden Ibrahim Hirsi", "Ramla Yusuf Mohamed Hassan",
  ][i],
  price: 10,
  discount: 1,
}));

const EMPLOYEES: EmployeeRow[] = [
  ["Mohamud Ali", 144], ["Ahmed Mohamed Ali Warsame", 144], ["Habiba Ali Abdulle Isaaq", 144],
  ["Muktar Mohamed Kassim Aden", 144], ["Nasteh Burhan Hassan Jamac", 144], ["Mumina Hussein Mohamed Ali", 144],
  ["Ubah Hassan Adan Jibril", 144], ["Kaltuma Dubow Rashid Odowa", 144], ["ISMAIL HAJI MOHAMED ABDILAHI", 144],
  ["Fartun Hassan Ali Yussuf", 144], ["Munino Hassan Mohamuud Aden", 144], ["Fahma Jelle Mohamed Osman", 135],
  ["Borrow Ali Ibrahim Ali", 126], ["Sahra Abdirahman Ismail Hassan", 117], ["Ahmed Mohamed Mohamud Bare", 108],
  ["Sacda Hassan Abayle Ahmed", 99], ["Barwaaqo Mohamed Osmaan Ali", 90], ["Faadimo Adan Mohamed Osmaan", 81],
  ["Abdimalik Yusuf Maxamed Xasan", 72], ["Halima Mayow Isaaq Mursal", 63], ["Mohamed Abdi Degow Hilowle", 54],
  ["Hamdi Jele Mohamed Osman", 45], ["Hussein Ali Abdi Hussein", 36], ["Yakub Hussein Mohamed Ali", 27],
  ["Bishar Dubow Ahmed Yussuf", 18],
].map(([name, earn], i) => ({
  code: String(20156 + i),
  month: "May-26",
  name: name as string,
  earn: earn as number,
}));

const TAX_RATE = 0.018;
const COMMISSION_RATE = 0.15;

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function EmployeeDashboard() {
  const [selectedCode, setSelectedCode] = useState("20156");

  const selected = EMPLOYEES.find((e) => e.code === selectedCode) ?? EMPLOYEES[0];
  const earn = selected.earn;
  const tax = +(earn * TAX_RATE).toFixed(2);
  const commission = +(earn * COMMISSION_RATE).toFixed(2);
  const net = +(earn - tax - commission).toFixed(2);

  const totals = useMemo(() => {
    const totalEarn = EMPLOYEES.reduce((s, e) => s + e.earn, 0);
    const totalTax = EMPLOYEES.reduce((s, e) => s + (e.earn >= 130 ? +(e.earn * TAX_RATE).toFixed(2) : e.earn >= 110 ? 1.02 : 0), 0);
    const totalComm = EMPLOYEES.reduce((s, e) => s + +(e.earn * COMMISSION_RATE).toFixed(2), 0);
    const totalNet = EMPLOYEES.reduce((s, e) => s + (e.earn - +(e.earn * COMMISSION_RATE).toFixed(2)), 0);
    return { totalEarn, totalTax, totalComm, totalNet };
  }, []);

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
            {EMPLOYEES.map((e) => (
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
              {SERVICES.map((s) => (
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
              {EMPLOYEES.map((e) => {
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
    <div className={`rounded-2xl p-3 shadow-soft ${tone}`}>
      <div className="flex items-center gap-1.5 text-xs font-medium opacity-80">
        {icon} {label}
      </div>
      <div className="mt-1 text-lg font-bold">{value}</div>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-2.5 py-2 text-left font-semibold ${className}`}>{children}</th>;
}
function Td({ children, className = "", colSpan }: { children: React.ReactNode; className?: string; colSpan?: number }) {
  return <td colSpan={colSpan} className={`px-2.5 py-2 ${className}`}>{children}</td>;
}
