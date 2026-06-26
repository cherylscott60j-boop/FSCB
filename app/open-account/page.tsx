"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const FONT = "var(--font-montserrat),'Libre Franklin',sans-serif";
const RED  = "#8C1D25";
const DARK = "#111827";
const GRAY = "#6B7280";

/* ─── US States ─────────────────────────────────────────────────────────── */
const STATES = "Alabama,Alaska,Arizona,Arkansas,California,Colorado,Connecticut,Delaware,Florida,Georgia,Hawaii,Idaho,Illinois,Indiana,Iowa,Kansas,Kentucky,Louisiana,Maine,Maryland,Massachusetts,Michigan,Minnesota,Mississippi,Missouri,Montana,Nebraska,Nevada,New Hampshire,New Jersey,New Mexico,New York,North Carolina,North Dakota,Ohio,Oklahoma,Oregon,Pennsylvania,Rhode Island,South Carolina,South Dakota,Tennessee,Texas,Utah,Vermont,Virginia,Washington,West Virginia,Wisconsin,Wyoming".split(",");

/* ─── Account definitions ────────────────────────────────────────────────── */
type AccountType = "deposit" | "credit";

interface Account {
  id: string;
  name: string;
  tag: string | null;
  fee: string;
  min: string;
  bestFor: string;
  highlights: string[];
  type: AccountType;
  minDeposit?: number;
}

const PERSONAL_ACCOUNTS: Account[] = [
  {
    id: "free-checking",
    name: "Free Checking",
    tag: null,
    fee: "$0 / month",
    min: "No minimum balance",
    bestFor: "Everyday spending & bill pay",
    highlights: ["No monthly fee — ever", "55,000+ surcharge-free ATMs", "Early direct deposit (2 days early)", "Zelle® money transfers included"],
    type: "deposit",
    minDeposit: 0,
  },
  {
    id: "premium-checking",
    name: "Premium Checking",
    tag: "Most Popular",
    fee: "$0 / month*",
    min: "$500 avg. daily balance",
    bestFor: "Direct deposit users who want perks",
    highlights: ["ATM fee rebates nationwide", "Higher debit purchase limits", "Free first order of checks", "Priority customer service line"],
    type: "deposit",
    minDeposit: 25,
  },
  {
    id: "regular-savings",
    name: "Regular Savings",
    tag: null,
    fee: "$0 / month",
    min: "No minimum balance",
    bestFor: "Emergency fund or savings goals",
    highlights: ["Competitive APY, compounded daily", "Automatic round-up deposits", "Goal tracking in mobile app", "FDIC insured to $250,000"],
    type: "deposit",
    minDeposit: 0,
  },
  {
    id: "money-market",
    name: "Money Market",
    tag: "Best Rate",
    fee: "$0 / month*",
    min: "$2,500 minimum balance",
    bestFor: "Larger balances earning maximum yield",
    highlights: ["Highest tiered APY", "Unlimited transfers", "Check-writing privileges", "Same-day link to checking"],
    type: "deposit",
    minDeposit: 2500,
  },
  {
    id: "community-card",
    name: "Community Credit Card",
    tag: null,
    fee: "$0 annual fee",
    min: "Good credit (620+ score)",
    bestFor: "Simple everyday rewards with no complexity",
    highlights: ["1% cashback on all purchases", "0% intro APR for 12 months", "No foreign transaction fees", "Free credit score monitoring"],
    type: "credit",
  },
  {
    id: "rewards-card",
    name: "Rewards Credit Card",
    tag: "Best Value",
    fee: "$0 annual fee",
    min: "Good–Excellent credit (680+)",
    bestFor: "Maximizing rewards on groceries, gas & dining",
    highlights: ["3% cashback on groceries & gas", "2% cashback on dining", "1% on all other purchases", "Rewards never expire"],
    type: "credit",
  },
];

const BUSINESS_ACCOUNTS: Account[] = [
  {
    id: "biz-basic-checking",
    name: "Business Basic Checking",
    tag: null,
    fee: "$0 / month",
    min: "$0 to open",
    bestFor: "New businesses & sole proprietors",
    highlights: ["200 transactions/month included", "Free business online & mobile banking", "Business debit card included", "Dedicated local business banker"],
    type: "deposit",
    minDeposit: 0,
  },
  {
    id: "biz-premium-checking",
    name: "Business Premium Checking",
    tag: "Most Popular",
    fee: "$0 / month*",
    min: "$500 average daily balance",
    bestFor: "Growing businesses with high volume",
    highlights: ["Unlimited transactions", "Same-day ACH payments", "Multi-user roles & permissions", "ACH and wire fee discounts"],
    type: "deposit",
    minDeposit: 100,
  },
  {
    id: "biz-savings",
    name: "Business Savings",
    tag: null,
    fee: "$0 / month",
    min: "$100 to open",
    bestFor: "Tax reserves & operating cash buffer",
    highlights: ["Competitive business APY", "Instant transfers to business checking", "6 withdrawals/month (Reg D)", "FDIC insured to $250,000"],
    type: "deposit",
    minDeposit: 100,
  },
  {
    id: "biz-money-market",
    name: "Business Money Market",
    tag: "Best Rate",
    fee: "$0 / month*",
    min: "$2,500 minimum balance",
    bestFor: "Larger cash reserves earning higher yield",
    highlights: ["Highest tiered business APY", "Unlimited transfers", "Treasury sweep available", "Same-day link to business checking"],
    type: "deposit",
    minDeposit: 2500,
  },
];

/* ─── Form state ─────────────────────────────────────────────────────────── */
interface FormData {
  firstName: string; lastName: string; dob: string; ssn: string;
  email: string; phone: string; usCitizen: string;
  businessName: string; businessType: string; ein: string;
  established: string; businessPhone: string; industry: string;
  street: string; city: string; state: string; zip: string;
  sameMailing: string; mailingStreet: string; mailingCity: string;
  mailingState: string; mailingZip: string; timeAtAddress: string;
  existingAccount: string;
  fundingMethod: string; routingNumber: string; bankAccountNumber: string;
  discFDIC: boolean; discPrivacy: boolean; discTerms: boolean;
  discEStatements: boolean; discCertify: boolean;
}

const EMPTY: FormData = {
  firstName: "", lastName: "", dob: "", ssn: "",
  email: "", phone: "", usCitizen: "",
  businessName: "", businessType: "", ein: "",
  established: "", businessPhone: "", industry: "",
  street: "", city: "", state: "", zip: "",
  sameMailing: "yes", mailingStreet: "", mailingCity: "",
  mailingState: "", mailingZip: "", timeAtAddress: "",
  existingAccount: "",
  fundingMethod: "", routingNumber: "", bankAccountNumber: "",
  discFDIC: false, discPrivacy: false, discTerms: false,
  discEStatements: false, discCertify: false,
};

/* ─── Reusable field components ──────────────────────────────────────────── */
function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: DARK, marginBottom: 7 }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: 12, color: GRAY, marginTop: 5, lineHeight: 1.45 }}>{hint}</p>}
    </div>
  );
}

const iStyle: React.CSSProperties = {
  width: "100%", padding: "12px 16px", fontSize: 15, borderRadius: 10,
  border: "1.5px solid rgba(17,24,39,.15)", outline: "none",
  boxSizing: "border-box", background: "#fff", color: DARK, fontFamily: "inherit",
};

function TextInput({ value, onChange, placeholder, type = "text", autoComplete }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; autoComplete?: string;
}) {
  return (
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder} autoComplete={autoComplete} style={iStyle} />
  );
}

function Select({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      style={{ ...iStyle, appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 40, cursor: "pointer" }}>
      {children}
    </select>
  );
}

function RadioGroup({ name, value, onChange, options }: { name: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
      {options.map((opt) => (
        <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "10px 18px", border: `1.5px solid ${value === opt.value ? RED : "rgba(17,24,39,.15)"}`, borderRadius: 10, background: value === opt.value ? "rgba(140,29,37,.04)" : "#fff", flex: "1 1 120px" }}>
          <input type="radio" name={name} value={opt.value} checked={value === opt.value} onChange={() => onChange(opt.value)}
            style={{ accentColor: RED, width: 16, height: 16 }} />
          <span style={{ fontSize: 14.5, fontWeight: 600, color: DARK }}>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

function DiscCheck({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", gap: 12, cursor: "pointer", alignItems: "flex-start" }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
        style={{ accentColor: RED, width: 17, height: 17, marginTop: 1, flexShrink: 0, cursor: "pointer" }} />
      <span style={{ fontSize: 14, color: DARK, lineHeight: 1.55 }}>{children}</span>
    </label>
  );
}

/* ─── Deep-link handler ──────────────────────────────────────────────────── */
function DeepLinkHandler({ onDeepLink }: {
  onDeepLink: (category: "personal" | "business", account: Account) => void;
}) {
  const params = useSearchParams();
  useEffect(() => {
    const id = params.get("account");
    if (!id) return;
    const personal = PERSONAL_ACCOUNTS.find((a) => a.id === id);
    if (personal) { onDeepLink("personal", personal); return; }
    const biz = BUSINESS_ACCOUNTS.find((a) => a.id === id);
    if (biz) onDeepLink("business", biz);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

/* ─── Step labels ────────────────────────────────────────────────────────── */
const STEP_LABELS = ["Account Type", "Choose Account", "Your Information", "Your Address", "Review & Submit"];

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function OpenAccountPage() {
  const [step, setStep]                     = useState(1);
  const [category, setCategory]             = useState<"personal" | "business" | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [form, setForm]                     = useState<FormData>(EMPTY);

  const update = (field: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleDeepLink = (cat: "personal" | "business", account: Account) => {
    setCategory(cat);
    setSelectedAccount(account);
    setStep(3);
  };

  const accounts = category === "personal" ? PERSONAL_ACCOUNTS : BUSINESS_ACCOUNTS;
  const isBusiness = category === "business";
  const isCredit = selectedAccount?.type === "credit";
  const allDiscs = form.discFDIC && form.discPrivacy && form.discTerms && form.discEStatements && form.discCertify;
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmitApplication() {
    if (!allDiscs || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account:     selectedAccount?.id,
          accountName: selectedAccount?.name,
          category,
          firstName:   form.firstName,
          lastName:    form.lastName,
          email:       form.email,
          phone:       form.phone,
          dob:         form.dob,
        }),
      });
      const data = await res.json();
      if (data.success) setStep(6);
    } catch {
      // surface error to user in a future iteration
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Header ─────────────────────────────────────────────────── */
  return (
    <div style={{ minHeight: "100vh", background: "#F4F4F6", fontFamily: FONT }}>
      <Suspense fallback={null}>
        <DeepLinkHandler onDeepLink={handleDeepLink} />
      </Suspense>

      {/* Top header */}
      <div style={{ background: "#fff", borderBottom: "1px solid rgba(17,24,39,.08)", padding: "0 32px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(145deg,#8C1D25,#6B151C)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                <path d="M4 19V8.5L12 4l8 4.5V19" stroke="#D4AF37" strokeWidth="2" strokeLinejoin="round" />
                <path d="M9 19v-5h6v5" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 16, color: DARK, display: "block", lineHeight: 1 }}>FSCB</span>
              <span style={{ fontSize: 8.5, letterSpacing: ".28em", color: GRAY, display: "block", marginTop: 2 }}>COMMUNITY BANK</span>
            </div>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: GRAY }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            Secure application · 256-bit SSL
          </div>
        </div>
      </div>

      {/* ── Progress bar (hidden on confirmation) ─────────────── */}
      {step < 6 && (
        <div style={{ background: "#fff", borderBottom: "1px solid rgba(17,24,39,.07)", padding: "18px 32px" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 13, color: GRAY }}>Step {step} of {STEP_LABELS.length}</span>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: DARK }}>{STEP_LABELS[step - 1]}</span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {STEP_LABELS.map((_, i) => (
                <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i < step ? RED : "rgba(17,24,39,.1)", transition: "background .25s" }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Step content ──────────────────────────────────────── */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "44px 32px" }}>

        {/* ═══ STEP 1 — Category ════════════════════════════════ */}
        {step === 1 && (
          <div>
            <h1 style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: DARK, margin: "0 0 10px", letterSpacing: "-.02em" }}>Open an Account</h1>
            <p style={{ fontSize: 16, color: GRAY, margin: "0 0 40px", lineHeight: 1.6 }}>
              Are you opening an account for personal use or for your business?
            </p>
            <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 40 }}>
              {([
                {
                  key: "personal" as const,
                  title: "Personal Banking",
                  sub: "Checking, savings, and credit cards for individuals and families.",
                  icon: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z",
                  items: ["Free & Premium Checking", "Regular Savings & Money Market", "Community & Rewards Credit Cards"],
                },
                {
                  key: "business" as const,
                  title: "Business Banking",
                  sub: "Accounts for LLCs, corporations, sole proprietors, and nonprofits.",
                  icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 0-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4",
                  items: ["Business Basic & Premium Checking", "Business Savings & Money Market", "In-branch verification required"],
                },
              ] as const).map((cat) => {
                const selected = category === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setCategory(cat.key)}
                    style={{
                      background: selected ? "rgba(140,29,37,.04)" : "#fff",
                      border: `2px solid ${selected ? RED : "rgba(17,24,39,.1)"}`,
                      borderRadius: 20, padding: "32px 30px", cursor: "pointer",
                      textAlign: "left", fontFamily: FONT, position: "relative",
                      transition: "border-color .15s, background .15s",
                    }}
                  >
                    {selected && (
                      <div style={{ position: "absolute", top: 16, right: 16, width: 24, height: 24, borderRadius: "50%", background: RED, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M5 12l5 5L20 7" /></svg>
                      </div>
                    )}
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: selected ? "rgba(140,29,37,.12)" : "rgba(17,24,39,.05)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={selected ? RED : GRAY} strokeWidth="1.8"><path d={cat.icon} /></svg>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 20, color: DARK, marginBottom: 8 }}>{cat.title}</div>
                    <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.55, marginBottom: 18 }}>{cat.sub}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                      {cat.items.map((item) => (
                        <div key={item} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13.5 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5"><path d="M5 12l5 5L20 7" /></svg>
                          <span style={{ color: DARK }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => { if (category) setStep(2); }}
                disabled={!category}
                style={{ background: category ? RED : "rgba(17,24,39,.15)", color: category ? "#fff" : GRAY, border: "none", fontFamily: FONT, fontSize: 15, fontWeight: 700, padding: "14px 36px", borderRadius: 12, cursor: category ? "pointer" : "not-allowed", transition: "background .15s" }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ═══ STEP 2 — Choose Account ══════════════════════════ */}
        {step === 2 && (
          <div>
            <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: GRAY, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 6, marginBottom: 24, fontFamily: "inherit", padding: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
              Back
            </button>
            <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, color: DARK, margin: "0 0 8px", letterSpacing: "-.02em" }}>Choose Your Account</h2>
            <p style={{ fontSize: 15.5, color: GRAY, margin: "0 0 36px" }}>Select the account that best fits your needs. You can always open additional accounts later.</p>
            <div className="mob-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 36 }}>
              {accounts.map((acc) => {
                const sel = selectedAccount?.id === acc.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => setSelectedAccount(acc)}
                    style={{
                      background: sel ? "rgba(140,29,37,.04)" : "#fff",
                      border: `2px solid ${sel ? RED : "rgba(17,24,39,.09)"}`,
                      borderRadius: 18, padding: "24px 24px 22px", cursor: "pointer",
                      textAlign: "left", fontFamily: FONT, position: "relative",
                      transition: "border-color .15s, background .15s",
                    }}
                  >
                    {acc.tag && (
                      <div style={{ position: "absolute", top: -11, left: 20, background: RED, color: "#fff", fontSize: 10.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", padding: "3px 12px", borderRadius: 999 }}>{acc.tag}</div>
                    )}
                    {sel && (
                      <div style={{ position: "absolute", top: 14, right: 14, width: 22, height: 22, borderRadius: "50%", background: RED, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M5 12l5 5L20 7" /></svg>
                      </div>
                    )}
                    <div style={{ fontWeight: 800, fontSize: 17, color: DARK, marginBottom: 6 }}>{acc.name}</div>
                    <div style={{ fontSize: 12.5, color: GRAY, marginBottom: 14, lineHeight: 1.45 }}>{acc.bestFor}</div>
                    <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                      <span style={{ background: "rgba(17,24,39,.05)", color: DARK, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 999 }}>{acc.fee}</span>
                      <span style={{ background: "rgba(17,24,39,.05)", color: DARK, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 999 }}>{acc.min}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {acc.highlights.map((h) => (
                        <div key={h} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13 }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 1 }}><path d="M5 12l5 5L20 7" /></svg>
                          <span style={{ color: DARK, lineHeight: 1.4 }}>{h}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
            {isBusiness && (
              <div style={{ background: "rgba(212,175,55,.08)", border: "1px solid rgba(212,175,55,.3)", borderRadius: 12, padding: "14px 18px", marginBottom: 24, fontSize: 13.5, color: "#6B4F00", lineHeight: 1.55 }}>
                <strong>Note for business accounts:</strong> After you submit your application, an FSCB business banker will contact you within 1 business day to complete in-branch document verification (EIN, formation documents, owner IDs).
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setStep(1)} style={{ background: "none", border: "1.5px solid rgba(17,24,39,.15)", color: DARK, fontFamily: FONT, fontSize: 14.5, fontWeight: 600, padding: "13px 28px", borderRadius: 12, cursor: "pointer" }}>← Back</button>
              <button
                onClick={() => { if (selectedAccount) setStep(3); }}
                disabled={!selectedAccount}
                style={{ background: selectedAccount ? RED : "rgba(17,24,39,.15)", color: selectedAccount ? "#fff" : GRAY, border: "none", fontFamily: FONT, fontSize: 15, fontWeight: 700, padding: "14px 36px", borderRadius: 12, cursor: selectedAccount ? "pointer" : "not-allowed" }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ═══ STEP 3 — About You ═══════════════════════════════ */}
        {step === 3 && (
          <div>
            <button onClick={() => setStep(2)} style={{ background: "none", border: "none", color: GRAY, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 6, marginBottom: 24, fontFamily: "inherit", padding: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
              Back
            </button>
            <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, color: DARK, margin: "0 0 6px", letterSpacing: "-.02em" }}>Tell Us About You</h2>
            <p style={{ fontSize: 15, color: GRAY, margin: "0 0 36px" }}>All information is encrypted and used solely to verify your identity and open your account.</p>

            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.08)", borderRadius: 20, padding: "36px 36px 32px", marginBottom: 24 }}>
              <div style={{ fontWeight: 800, fontSize: 17, color: DARK, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid rgba(17,24,39,.07)" }}>Personal Information</div>
              <div className="mob-form-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <Field label="Legal First Name">
                  <TextInput value={form.firstName} onChange={(v) => update("firstName", v)} placeholder="First name" autoComplete="given-name" />
                </Field>
                <Field label="Legal Last Name">
                  <TextInput value={form.lastName} onChange={(v) => update("lastName", v)} placeholder="Last name" autoComplete="family-name" />
                </Field>
                <Field label="Date of Birth" hint="You must be 18 years or older to open an account.">
                  <TextInput type="date" value={form.dob} onChange={(v) => update("dob", v)} autoComplete="bday" />
                </Field>
                <Field label="Social Security Number" hint="Required by the USA PATRIOT Act to verify your identity.">
                  <TextInput type="password" value={form.ssn} onChange={(v) => update("ssn", v)} placeholder="•••-••-••••" autoComplete="off" />
                </Field>
                <Field label="Email Address">
                  <TextInput type="email" value={form.email} onChange={(v) => update("email", v)} placeholder="you@example.com" autoComplete="email" />
                </Field>
                <Field label="Mobile Phone Number">
                  <TextInput type="tel" value={form.phone} onChange={(v) => update("phone", v)} placeholder="(555) 000-0000" autoComplete="tel" />
                </Field>
              </div>
              <div style={{ marginTop: 20 }}>
                <Field label="Are you a U.S. Citizen or Permanent Resident?" hint="Non-residents must visit a branch to open an account.">
                  <RadioGroup name="usCitizen" value={form.usCitizen} onChange={(v) => update("usCitizen", v)}
                    options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No — I'll visit a branch" }]} />
                </Field>
              </div>
            </div>

            {isBusiness && (
              <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.08)", borderRadius: 20, padding: "36px 36px 32px", marginBottom: 24 }}>
                <div style={{ fontWeight: 800, fontSize: 17, color: DARK, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid rgba(17,24,39,.07)" }}>Business Information</div>
                <div className="mob-form-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <Field label="Legal Business Name">
                      <TextInput value={form.businessName} onChange={(v) => update("businessName", v)} placeholder="Full legal business name" autoComplete="organization" />
                    </Field>
                  </div>
                  <Field label="Business Type">
                    <Select value={form.businessType} onChange={(v) => update("businessType", v)}>
                      <option value="">Select business type</option>
                      {["Sole Proprietorship", "Single-Member LLC", "Multi-Member LLC", "S Corporation", "C Corporation", "General Partnership", "Nonprofit Organization", "Other"].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="EIN / Tax ID" hint="Sole proprietors may use their SSN.">
                    <TextInput value={form.ein} onChange={(v) => update("ein", v)} placeholder="XX-XXXXXXX" autoComplete="off" />
                  </Field>
                  <Field label="Date Business Established">
                    <TextInput type="date" value={form.established} onChange={(v) => update("established", v)} />
                  </Field>
                  <Field label="Business Phone">
                    <TextInput type="tel" value={form.businessPhone} onChange={(v) => update("businessPhone", v)} placeholder="(555) 000-0000" autoComplete="tel" />
                  </Field>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <Field label="Nature of Business / Industry">
                      <Select value={form.industry} onChange={(v) => update("industry", v)}>
                        <option value="">Select industry</option>
                        {["Retail Trade","Food & Beverage","Healthcare","Construction","Professional Services","Technology","Real Estate","Transportation","Non-profit","Agriculture","Manufacturing","Education","Other"].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </Select>
                    </Field>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setStep(2)} style={{ background: "none", border: "1.5px solid rgba(17,24,39,.15)", color: DARK, fontFamily: FONT, fontSize: 14.5, fontWeight: 600, padding: "13px 28px", borderRadius: 12, cursor: "pointer" }}>← Back</button>
              <button onClick={() => setStep(4)} style={{ background: RED, color: "#fff", border: "none", fontFamily: FONT, fontSize: 15, fontWeight: 700, padding: "14px 36px", borderRadius: 12, cursor: "pointer" }}>Continue →</button>
            </div>
          </div>
        )}

        {/* ═══ STEP 4 — Address ═════════════════════════════════ */}
        {step === 4 && (
          <div>
            <button onClick={() => setStep(3)} style={{ background: "none", border: "none", color: GRAY, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 6, marginBottom: 24, fontFamily: "inherit", padding: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
              Back
            </button>
            <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, color: DARK, margin: "0 0 6px", letterSpacing: "-.02em" }}>Your Address</h2>
            <p style={{ fontSize: 15, color: GRAY, margin: "0 0 36px" }}>We need your residential address to verify your identity and mail your account materials.</p>

            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.08)", borderRadius: 20, padding: "36px 36px 32px", marginBottom: 24 }}>
              <div style={{ fontWeight: 800, fontSize: 17, color: DARK, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid rgba(17,24,39,.07)" }}>Home / Primary Address</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <Field label="Street Address">
                  <TextInput value={form.street} onChange={(v) => update("street", v)} placeholder="123 Main Street" autoComplete="street-address" />
                </Field>
                <div className="mob-form-2" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 16 }}>
                  <Field label="City">
                    <TextInput value={form.city} onChange={(v) => update("city", v)} placeholder="City" autoComplete="address-level2" />
                  </Field>
                  <Field label="State">
                    <Select value={form.state} onChange={(v) => update("state", v)}>
                      <option value="">State</option>
                      {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </Select>
                  </Field>
                  <Field label="ZIP Code">
                    <TextInput value={form.zip} onChange={(v) => update("zip", v)} placeholder="00000" autoComplete="postal-code" />
                  </Field>
                </div>
                <Field label="How long have you lived at this address?">
                  <Select value={form.timeAtAddress} onChange={(v) => update("timeAtAddress", v)}>
                    <option value="">Select</option>
                    {["Less than 1 year", "1–2 years", "2–5 years", "5–10 years", "10+ years"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Is your mailing address the same?">
                  <RadioGroup name="sameMailing" value={form.sameMailing} onChange={(v) => update("sameMailing", v)}
                    options={[{ value: "yes", label: "Yes, same address" }, { value: "no", label: "No, use a different address" }]} />
                </Field>
                {form.sameMailing === "no" && (
                  <div style={{ padding: "22px 24px", background: "rgba(17,24,39,.02)", border: "1px solid rgba(17,24,39,.08)", borderRadius: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: 14.5, color: DARK, marginBottom: 16 }}>Mailing Address</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <Field label="Street Address">
                        <TextInput value={form.mailingStreet} onChange={(v) => update("mailingStreet", v)} placeholder="PO Box or street address" />
                      </Field>
                      <div className="mob-form-2" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 16 }}>
                        <Field label="City"><TextInput value={form.mailingCity} onChange={(v) => update("mailingCity", v)} placeholder="City" /></Field>
                        <Field label="State">
                          <Select value={form.mailingState} onChange={(v) => update("mailingState", v)}>
                            <option value="">State</option>
                            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </Select>
                        </Field>
                        <Field label="ZIP"><TextInput value={form.mailingZip} onChange={(v) => update("mailingZip", v)} placeholder="00000" /></Field>
                      </div>
                    </div>
                  </div>
                )}
                <Field label="Do you already have an account with FSCB?">
                  <RadioGroup name="existingAccount" value={form.existingAccount} onChange={(v) => update("existingAccount", v)}
                    options={[{ value: "yes", label: "Yes, I'm an existing customer" }, { value: "no", label: "No, this is my first account" }]} />
                </Field>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setStep(3)} style={{ background: "none", border: "1.5px solid rgba(17,24,39,.15)", color: DARK, fontFamily: FONT, fontSize: 14.5, fontWeight: 600, padding: "13px 28px", borderRadius: 12, cursor: "pointer" }}>← Back</button>
              <button onClick={() => setStep(5)} style={{ background: RED, color: "#fff", border: "none", fontFamily: FONT, fontSize: 15, fontWeight: 700, padding: "14px 36px", borderRadius: 12, cursor: "pointer" }}>Continue →</button>
            </div>
          </div>
        )}

        {/* ═══ STEP 5 — Fund & Review ═══════════════════════════ */}
        {step === 5 && (
          <div>
            <button onClick={() => setStep(4)} style={{ background: "none", border: "none", color: GRAY, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 6, marginBottom: 24, fontFamily: "inherit", padding: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
              Back
            </button>
            <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, color: DARK, margin: "0 0 6px", letterSpacing: "-.02em" }}>Review &amp; Submit</h2>
            <p style={{ fontSize: 15, color: GRAY, margin: "0 0 36px" }}>Review your selections, then read and accept the required disclosures.</p>

            {/* Summary card */}
            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.08)", borderRadius: 20, padding: "28px 30px", marginBottom: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: DARK, marginBottom: 18 }}>Application Summary</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "Account", value: selectedAccount?.name ?? "" },
                  { label: "Type", value: category === "personal" ? "Personal Banking" : "Business Banking" },
                  { label: "Name", value: `${form.firstName} ${form.lastName}`.trim() || "—" },
                  { label: "Email", value: form.email || "—" },
                  { label: "Phone", value: form.phone || "—" },
                  { label: "Address", value: form.street ? `${form.street}, ${form.city}, ${form.state} ${form.zip}` : "—" },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 14.5, paddingBottom: 10, borderBottom: "1px solid rgba(17,24,39,.05)" }}>
                    <span style={{ color: GRAY }}>{label}</span>
                    <span style={{ fontWeight: 600, color: DARK, maxWidth: "60%", textAlign: "right" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Initial deposit (deposit accounts only) */}
            {!isCredit && (
              <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.08)", borderRadius: 20, padding: "28px 30px", marginBottom: 20 }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: DARK, marginBottom: 6 }}>Initial Deposit</div>
                {(selectedAccount?.minDeposit ?? 0) > 0 && (
                  <div style={{ background: "rgba(212,175,55,.08)", border: "1px solid rgba(212,175,55,.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 18, fontSize: 13.5, color: "#6B4F00" }}>
                    This account requires a minimum opening deposit of <strong>${selectedAccount?.minDeposit?.toLocaleString()}</strong>.
                  </div>
                )}
                <p style={{ fontSize: 14, color: GRAY, margin: "0 0 20px" }}>How would you like to fund your new account?</p>
                <RadioGroup name="fundingMethod" value={form.fundingMethod} onChange={(v) => update("fundingMethod", v)}
                  options={[
                    { value: "transfer", label: "Transfer from another bank" },
                    { value: "check", label: "Mail a check" },
                    { value: "branch", label: "Deposit at a branch" },
                  ]}
                />
                {form.fundingMethod === "transfer" && (
                  <div className="mob-form-2" style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                    <Field label="Bank Routing Number (ABA)">
                      <TextInput value={form.routingNumber} onChange={(v) => update("routingNumber", v)} placeholder="9-digit routing number" />
                    </Field>
                    <Field label="Account Number">
                      <TextInput value={form.bankAccountNumber} onChange={(v) => update("bankAccountNumber", v)} placeholder="Your account number" />
                    </Field>
                  </div>
                )}
                {form.fundingMethod === "check" && (
                  <div style={{ marginTop: 16, padding: "16px 20px", background: "rgba(17,24,39,.03)", borderRadius: 12, fontSize: 14, color: DARK, lineHeight: 1.6 }}>
                    Make your check payable to <strong>First State Community Bank</strong> and mail to:<br />
                    <span style={{ color: GRAY }}>Attn: New Accounts Department · 102 Main Street · Hometown, ST 00000</span>
                  </div>
                )}
              </div>
            )}

            {/* Disclosures */}
            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.08)", borderRadius: 20, padding: "28px 30px", marginBottom: 28 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: DARK, marginBottom: 6 }}>Required Disclosures</div>
              <p style={{ fontSize: 13.5, color: GRAY, margin: "0 0 22px", lineHeight: 1.55 }}>Please read and acknowledge each of the following before submitting your application.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <DiscCheck checked={form.discFDIC} onChange={(v) => update("discFDIC", v)}>
                  I have received and read the <strong>FDIC Deposit Insurance</strong> notice. I understand deposits are insured up to $250,000 per depositor per ownership category. <Link href="/disclosures#fdic" style={{ color: RED }}>View notice →</Link>
                </DiscCheck>
                <DiscCheck checked={form.discPrivacy} onChange={(v) => update("discPrivacy", v)}>
                  I have received and read First State Community Bank's <strong>Privacy Notice</strong> (Gramm-Leach-Bliley Act annual notice). <Link href="/privacy" style={{ color: RED }}>View notice →</Link>
                </DiscCheck>
                <DiscCheck checked={form.discTerms} onChange={(v) => update("discTerms", v)}>
                  I agree to the <strong>Account Terms &amp; Conditions</strong> and <strong>Terms of Use</strong> governing my account and use of FSCB's digital services. <Link href="/terms" style={{ color: RED }}>View terms →</Link>
                </DiscCheck>
                <DiscCheck checked={form.discEStatements} onChange={(v) => update("discEStatements", v)}>
                  I consent to receive <strong>electronic statements and disclosures</strong> via email instead of paper mail. I understand I may opt out at any time by contacting FSCB.
                </DiscCheck>
                <DiscCheck checked={form.discCertify} onChange={(v) => update("discCertify", v)}>
                  <strong>I certify</strong> under penalty of perjury that all information provided in this application is true, accurate, and complete. I authorize FSCB to verify this information and to perform a credit or identity inquiry as needed.
                </DiscCheck>
              </div>
            </div>

            {isBusiness && (
              <div style={{ background: "rgba(212,175,55,.06)", border: "1px solid rgba(212,175,55,.25)", borderRadius: 12, padding: "14px 18px", marginBottom: 24, fontSize: 13.5, color: "#6B4F00", lineHeight: 1.55 }}>
                <strong>Business accounts:</strong> After submission, a banker will contact you within 1 business day to schedule your in-branch document verification appointment.
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={() => setStep(4)} style={{ background: "none", border: "1.5px solid rgba(17,24,39,.15)", color: DARK, fontFamily: FONT, fontSize: 14.5, fontWeight: 600, padding: "13px 28px", borderRadius: 12, cursor: "pointer" }}>← Back</button>
              <button
                onClick={handleSubmitApplication}
                disabled={!allDiscs || submitting}
                style={{ background: allDiscs && !submitting ? RED : "rgba(17,24,39,.15)", color: allDiscs && !submitting ? "#fff" : GRAY, border: "none", fontFamily: FONT, fontSize: 15, fontWeight: 700, padding: "14px 36px", borderRadius: 12, cursor: allDiscs && !submitting ? "pointer" : "not-allowed", boxShadow: allDiscs && !submitting ? "0 6px 20px -4px rgba(140,29,37,.4)" : "none", display: "inline-flex", alignItems: "center", gap: 10 }}
              >
                {submitting ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                      style={{ animation: "spin 0.75s linear infinite" }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Submitting…
                  </>
                ) : "Submit Application"}
              </button>
            </div>
          </div>
        )}

        {/* ═══ STEP 6 — Confirmation ════════════════════════════ */}
        {step === 6 && (
          <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", paddingTop: 20 }}>
            {/* Checkmark */}
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(16,185,129,.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12l5 5L20 7" />
              </svg>
            </div>
            <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: DARK, margin: "0 0 12px", letterSpacing: "-.02em" }}>Application Received!</h2>
            <p style={{ fontSize: 16, color: GRAY, margin: "0 0 36px", lineHeight: 1.65 }}>
              Thank you, <strong style={{ color: DARK }}>{form.firstName || "valued customer"}</strong>. Your application for a <strong style={{ color: DARK }}>{selectedAccount?.name}</strong> has been submitted successfully.
            </p>

            {/* What's next */}
            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.08)", borderRadius: 20, padding: "28px 30px", textAlign: "left", marginBottom: 28 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: DARK, marginBottom: 20 }}>What happens next</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  { n: "1", title: "Application review", body: isBusiness ? "A business banker will call you within 1 business day to schedule your in-branch document verification." : "Most applications are approved instantly. If we need to verify anything, you'll hear from us within 1 business day." },
                  { n: "2", title: "Email confirmation", body: `A confirmation has been sent to ${form.email || "the email address you provided"}. It includes your application reference number.` },
                  { n: "3", title: isCredit ? "Card delivery" : "Account activation", body: isCredit ? "If approved, your card will arrive by mail within 7–10 business days. You can activate it in the FSCB mobile app." : "Once approved, your account number will be emailed to you. Enroll in online banking and you're ready to go." },
                ].map((item) => (
                  <div key={item.n} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ flex: "none", width: 32, height: 32, borderRadius: "50%", background: RED, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 14 }}>{item.n}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: DARK, marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.55 }}>{item.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/login" style={{ background: RED, color: "#fff", textDecoration: "none", fontFamily: FONT, fontSize: 15, fontWeight: 700, padding: "14px 30px", borderRadius: 12, display: "inline-block" }}>
                Enroll in Online Banking
              </Link>
              <Link href="/" style={{ background: "#fff", color: DARK, textDecoration: "none", fontFamily: FONT, fontSize: 15, fontWeight: 600, padding: "14px 30px", borderRadius: 12, border: "1.5px solid rgba(17,24,39,.15)", display: "inline-block" }}>
                Return to Home
              </Link>
            </div>

            <p style={{ marginTop: 28, fontSize: 13, color: GRAY }}>
              Questions? Call us at{" "}
              <a href="tel:18002372669" style={{ color: RED, fontWeight: 600, textDecoration: "none" }}>1-800-FSCB-NOW</a>
              {" "}or{" "}
              <Link href="/about/contact" style={{ color: RED, fontWeight: 600, textDecoration: "none" }}>visit a branch</Link>.
            </p>
          </div>
        )}

      </div>

      {/* Footer strip */}
      <div style={{ borderTop: "1px solid rgba(17,24,39,.08)", background: "#fff", padding: "14px 32px", display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
        {[
          { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", label: "256-bit SSL" },
          { icon: "M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z", label: "Member FDIC" },
          { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "PATRIOT Act Compliant" },
        ].map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: GRAY }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={item.icon} /></svg>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
