"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const fmtShort = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

type Tx = {
  id: string; merchant: string; category: string;
  amount: number; transaction_type: string;
  posted_at: string; balance: number;
};

type StatementData = {
  account: {
    id: string; type: string; name: string; last4: string;
    creditLimit: number | null; interestRate: number | null; openedAt: string;
  };
  profile: {
    first_name?: string; last_name?: string; email?: string; phone?: string;
    address_line1?: string; address_line2?: string; city?: string; state?: string; zip?: string;
  };
  period: { start: string; end: string };
  summary: {
    openingBalance: number; closingBalance: number;
    totalCredits: number; totalDebits: number; transactionCount: number;
  };
  transactions: Tx[];
};

export default function StatementPage() {
  return <Suspense fallback={<div style={{fontFamily:"sans-serif",padding:40,color:"#6B7280"}}>Loading…</div>}><StatementInner/></Suspense>;
}

function StatementInner() {
  const params      = useSearchParams();
  const [data, setData] = useState<StatementData | null>(null);
  const [error, setError] = useState("");
  const printed = useRef(false);

  useEffect(() => {
    const accountId = params.get("accountId");
    const start     = params.get("start");
    const end       = params.get("end");
    if (!accountId || !start || !end) { setError("Missing parameters."); return; }

    fetch(`/api/cpanel/statements?accountId=${accountId}&start=${start}&end=${end}`)
      .then(r => r.json())
      .then((json: StatementData & { error?: string }) => {
        if (json.error) { setError(json.error); return; }
        setData(json);
      })
      .catch(() => setError("Failed to load statement."));
  }, [params]);

  useEffect(() => {
    if (data && !printed.current) {
      printed.current = true;
      if (params.get("print") === "1") setTimeout(() => window.print(), 600);
    }
  }, [data, params]);

  if (error) return (
    <div style={{ fontFamily: "sans-serif", padding: 40, color: "#DC2626" }}>
      Error: {error}
    </div>
  );

  if (!data) return (
    <div style={{ fontFamily: "sans-serif", padding: 40, color: "#6B7280" }}>
      Loading statement…
    </div>
  );

  const { account, profile, period, summary, transactions } = data;
  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Account Holder";
  const address  = [profile.address_line1, profile.address_line2, profile.city && profile.state ? `${profile.city}, ${profile.state} ${profile.zip ?? ""}` : ""].filter(Boolean).join("\n");
  const typeLabel = account.type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const isCredit  = account.type === "credit_card";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Inter, sans-serif; background: #fff; color: #111827; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; }
          .page { margin: 0; padding: 28px 36px; box-shadow: none; }
        }
        @page { margin: 0.6in 0.5in; size: letter; }
      `}</style>

      {/* Print button — hidden on print */}
      <div className="no-print" style={{ background: "#111827", padding: "12px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>
          FSCB Account Statement — {fmtDate(period.start + "T12:00:00")} to {fmtDate(period.end + "T12:00:00")}
        </span>
        <button onClick={() => window.print()} style={{ marginLeft: "auto", background: "#8C1D25", border: "none", borderRadius: 8, padding: "8px 20px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          Print / Save as PDF
        </button>
      </div>

      <div className="page" style={{ maxWidth: 760, margin: "0 auto", padding: "40px 48px" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, paddingBottom: 20, borderBottom: "2px solid #8C1D25" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#8C1D25", letterSpacing: "-.01em", marginBottom: 2 }}>FSCB</div>
            <div style={{ fontSize: 10.5, color: "#6B7280", letterSpacing: ".12em", textTransform: "uppercase" }}>First State Community Bank</div>
            <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 6, lineHeight: 1.5 }}>
              Member FDIC · Equal Housing Lender
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Account Statement</div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>
              {fmtDate(period.start + "T12:00:00")} – {fmtDate(period.end + "T12:00:00")}
            </div>
            <div style={{ fontSize: 10.5, color: "#9CA3AF", marginTop: 3 }}>
              Generated {fmtDate(new Date().toISOString())}
            </div>
          </div>
        </div>

        {/* ── Account + Customer info ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: ".1em", color: "#9CA3AF", textTransform: "uppercase", marginBottom: 8 }}>Account Holder</div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111827", marginBottom: 3 }}>{fullName}</div>
            {profile.email && <div style={{ fontSize: 11.5, color: "#6B7280" }}>{profile.email}</div>}
            {profile.phone && <div style={{ fontSize: 11.5, color: "#6B7280" }}>{profile.phone}</div>}
            {address && <div style={{ fontSize: 11.5, color: "#6B7280", marginTop: 4, whiteSpace: "pre-line" }}>{address}</div>}
          </div>
          <div>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: ".1em", color: "#9CA3AF", textTransform: "uppercase", marginBottom: 8 }}>Account Details</div>
            <table style={{ fontSize: 12, borderCollapse: "collapse", width: "100%" }}>
              <tbody>
                {[
                  ["Account Name",   account.name],
                  ["Account Type",   typeLabel],
                  ["Account Number", `••••••••${account.last4}`],
                  ["Opened",         fmtDate(account.openedAt)],
                  ...(account.interestRate ? [["Interest Rate", `${(Number(account.interestRate) * 100).toFixed(2)}% APY`]] : []),
                  ...(isCredit && account.creditLimit ? [["Credit Limit", usd(Number(account.creditLimit))]] : []),
                ].map(([label, val]) => (
                  <tr key={label}>
                    <td style={{ padding: "2px 0", color: "#6B7280", paddingRight: 12, verticalAlign: "top" }}>{label}</td>
                    <td style={{ padding: "2px 0", fontWeight: 500, color: "#111827" }}>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Summary box ── */}
        <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10, padding: "18px 22px", marginBottom: 28 }}>
          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: ".1em", color: "#9CA3AF", textTransform: "uppercase", marginBottom: 14 }}>Statement Summary</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {[
              { label: isCredit ? "Beginning Balance Owed" : "Opening Balance",  value: usd(Math.abs(summary.openingBalance)), color: "#111827" },
              { label: "Total Credits",   value: `+${usd(summary.totalCredits)}`, color: "#16A34A" },
              { label: "Total Debits",    value: `-${usd(Math.abs(summary.totalDebits))}`, color: "#DC2626" },
              { label: isCredit ? "Ending Balance Owed" : "Closing Balance",     value: usd(Math.abs(summary.closingBalance)),  color: "#111827" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Transaction detail ── */}
        <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: ".1em", color: "#9CA3AF", textTransform: "uppercase", marginBottom: 10 }}>
          Transaction Detail — {summary.transactionCount} transaction{summary.transactionCount !== 1 ? "s" : ""}
        </div>

        {transactions.length === 0 ? (
          <div style={{ fontSize: 13, color: "#9CA3AF", padding: "20px 0" }}>No transactions in this period.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid #E5E7EB" }}>
                {["Date", "Description", "Category", "Amount", "Balance"].map((h, i) => (
                  <th key={h} style={{ textAlign: i >= 3 ? "right" : "left", padding: "6px 8px", fontSize: 9.5, fontWeight: 700, letterSpacing: ".06em", color: "#9CA3AF", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr key={tx.id} style={{ borderBottom: i < transactions.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                  <td style={{ padding: "7px 8px", color: "#6B7280", whiteSpace: "nowrap" }}>{fmtShort(tx.posted_at)}</td>
                  <td style={{ padding: "7px 8px", color: "#111827", fontWeight: 500, maxWidth: 200 }}>{tx.merchant}</td>
                  <td style={{ padding: "7px 8px", color: "#9CA3AF" }}>{tx.category}</td>
                  <td style={{ padding: "7px 8px", textAlign: "right", fontWeight: 600, color: tx.amount > 0 ? "#16A34A" : "#DC2626", whiteSpace: "nowrap" }}>
                    {tx.amount > 0 ? "+" : ""}{usd(tx.amount)}
                  </td>
                  <td style={{ padding: "7px 8px", textAlign: "right", color: "#374151", whiteSpace: "nowrap" }}>{usd(tx.balance)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: "1.5px solid #E5E7EB" }}>
                <td colSpan={3} style={{ padding: "8px 8px", fontSize: 11, fontWeight: 700, color: "#374151" }}>Closing Balance</td>
                <td />
                <td style={{ padding: "8px 8px", textAlign: "right", fontWeight: 700, fontSize: 13, color: "#111827" }}>{usd(summary.closingBalance)}</td>
              </tr>
            </tfoot>
          </table>
        )}

        {/* ── Footer ── */}
        <div style={{ marginTop: 40, paddingTop: 16, borderTop: "1px solid #E5E7EB", fontSize: 9.5, color: "#9CA3AF", lineHeight: 1.6 }}>
          <strong style={{ color: "#6B7280" }}>FSCB — First State Community Bank</strong> · Member FDIC · Equal Housing Lender<br />
          Questions? Visit fscb.bank or call 1-800-FSCB-BANK · Deposits insured up to $250,000 per depositor<br />
          This statement is for informational purposes. Please report any discrepancies within 60 days.
        </div>

      </div>
    </>
  );
}
