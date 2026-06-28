"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

/* ── Design tokens (mirrors dashboard) ───────────────── */
const FONT = "var(--font-montserrat),'Libre Franklin',sans-serif";
const RED  = "#8C1D25";
const GOLD = "#D4AF37";
const DARK = "#111827";
const MID  = "#374151";
const GRAY = "#6B7280";
const BG   = "#EEF0F4";
const CARD = { background:"#fff", borderRadius:12, border:"1px solid rgba(17,24,39,.08)", boxShadow:"0 1px 4px rgba(17,24,39,.06)" } as const;
const LBL:React.CSSProperties  = {display:"block",fontSize:12.5,fontWeight:600,color:MID,marginBottom:5,letterSpacing:".01em"};
const INP:React.CSSProperties  = {width:"100%",padding:"9px 12px",border:"1px solid rgba(17,24,39,.15)",borderRadius:8,fontSize:13.5,fontFamily:"inherit",color:DARK,outline:"none",boxSizing:"border-box"};
const SEL:React.CSSProperties  = {...INP,cursor:"pointer",appearance:"auto"};

/* ── Helpers ─────────────────────────────────────────── */
const usd = (n:number) => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(Math.abs(n));
function relTime(iso:string){
  const d=Math.floor((Date.now()-new Date(iso).getTime())/86400000);
  if(d===0)return "Today"; if(d===1)return "Yesterday";
  if(d<7)return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-US",{month:"short",day:"numeric"});
}
function fmtDate(iso:string){ return iso?new Date(iso).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):"—"; }

/* ── Types ───────────────────────────────────────────── */
type UserRow = {
  id:string; email:string; firstName:string; lastName:string;
  phone:string; memberSince:string; role:string; kycStatus:string;
  accountCount:number; totalBalance:number;
};
type AppRow = {
  id:string; referenceId:string; firstName:string; lastName:string;
  email:string; phone:string; accountType:string; accountName:string;
  category:string; status:string; submittedAt:string; userId:string;
};

const ACCT_TYPE_MAP:Record<string,string>={
  "free-checking":"checking","premium-checking":"checking",
  "regular-savings":"savings","high-yield-savings":"savings",
  "money-market":"money_market","cd-6":"cd","cd-12":"cd","cd-24":"cd",
  "rewards-card":"credit_card","cash-back-card":"credit_card","secured-card":"credit_card",
  "community-card":"credit_card",
  "business-checking":"business_checking","business-savings":"business_savings",
  "biz-basic-checking":"business_checking","biz-premium-checking":"business_checking",
  "biz-savings":"business_savings","biz-money-market":"money_market",
};
type AcctRow = {
  id:string; userId:string; accountType:string; accountName:string;
  last4:string; balance:number; status:string; creditLimit:number;
};
type TxRow = {
  id:string; merchant:string; category:string; amount:number;
  date:string; userId:string; accountId:string;
};
type ExtDetails = {bankName:string;routingNumber:string;accountNumber:string;accountType:string;holderName:string;note:string;};
type FraudAlert = {
  id:string; accountId:string; userId:string;
  transactionId:string|null;
  rule:string; severity:string;
  details:Record<string,unknown>;
  status:string; createdAt:string;
};
type AuditLog = {
  id:string; adminId:string; adminEmail:string;
  action:string; entityType:string; entityId:string|null;
  details:Record<string,unknown>; createdAt:string;
};
type DisputeRow = {
  id:string; userId:string; accountId:string;
  transactionId:string|null; referenceId:string;
  disputeType:string; amount:number; merchant:string;
  description:string; status:string; adminNotes:string;
  creditTxId:string|null; openedAt:string; resolvedAt:string|null;
};
type ComplianceReport = {
  id:string; reportType:string; referenceId:string;
  userId:string|null; accountId:string|null; transactionId:string|null;
  subjectName:string; amount:number|null; description:string;
  status:string; filedAt:string|null; filedBy:string|null; createdAt:string;
};
type OfacScreening = {
  id:string; userId:string|null; screenedName:string;
  matchScore:number; matchedEntry:string|null; status:string;
  reviewedBy:string|null; reviewedAt:string|null; createdAt:string;
};
type RateConfig = {
  key:string; label:string; productType:string; rateType:string;
  value:number; updatedAt:string; updatedBy:string|null;
};
type FeeSchedule = {
  key:string; label:string; description:string; amount:number;
  waivable:boolean; active:boolean; updatedAt:string; updatedBy:string|null;
};
type PendingTx = {
  id:string; userId:string; userName:string;
  accountId:string; accountName:string; accountLast4:string;
  merchant:string; category:string; amount:number;
  transactionType:string; memo:string;
  submittedAt:string; postedAt:string;
  extDetails?:ExtDetails;
};

/* ── Status badge ────────────────────────────────────── */
const STATUS_COLOR:Record<string,{bg:string;text:string}> = {
  active:   {bg:"rgba(22,163,74,.1)",    text:"#16A34A"},
  frozen:   {bg:"rgba(220,38,38,.1)",    text:"#DC2626"},
  pending:  {bg:"rgba(234,179,8,.12)",   text:"#854D0E"},
  approved: {bg:"rgba(22,163,74,.1)",    text:"#16A34A"},
  rejected: {bg:"rgba(220,38,38,.1)",    text:"#DC2626"},
  admin:    {bg:"rgba(140,29,37,.1)",    text:RED},
  user:     {bg:"rgba(107,114,128,.1)",  text:GRAY},
};
function Badge({status}:{status:string}){
  const c=STATUS_COLOR[status]??{bg:"rgba(107,114,128,.1)",text:GRAY};
  return <span style={{fontSize:11.5,fontWeight:700,padding:"2px 8px",borderRadius:99,background:c.bg,color:c.text,letterSpacing:".04em",textTransform:"capitalize"}}>{status}</span>;
}

/* ── Loading skeleton ────────────────────────────────── */
function LoadingSpinner(){
  return(
    <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center",fontFamily:FONT}}>
        <div style={{width:48,height:48,borderRadius:12,background:`linear-gradient(145deg,${RED},#5a1018)`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px"}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 19V8.5L12 4l8 4.5V19" stroke={GOLD} strokeWidth="2" strokeLinejoin="round"/><path d="M9 19v-5h6v5" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/></svg>
        </div>
        <div style={{fontWeight:700,fontSize:16,color:DARK,marginBottom:12}}>Loading control panel…</div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5" style={{animation:"spin .75s linear infinite"}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      </div>
    </div>
  );
}

/* ── Access Denied ───────────────────────────────────── */
function AccessDenied(){
  return(
    <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONT}}>
      <div style={{...CARD,padding:"48px 40px",textAlign:"center",maxWidth:440}}>
        <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(220,38,38,.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",color:"#DC2626"}}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div style={{fontWeight:800,fontSize:20,color:DARK,marginBottom:10}}>Access Denied</div>
        <p style={{fontSize:14,color:GRAY,lineHeight:1.6,marginBottom:24}}>
          This area requires admin privileges. Your account does not have the <strong>admin</strong> role.
          <br/><br/>
          To grant access, run the following in the Supabase SQL editor:
        </p>
        <pre style={{background:"#F1F3F5",borderRadius:8,padding:"12px 16px",fontSize:12,textAlign:"left",overflowX:"auto",marginBottom:24,color:DARK}}>
{`UPDATE profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';`}
        </pre>
        <Link href="/dashboard" style={{display:"inline-block",background:RED,color:"#fff",borderRadius:9,padding:"10px 24px",fontSize:14,fontWeight:600,textDecoration:"none"}}>← Back to Dashboard</Link>
      </div>
    </div>
  );
}

/* ── Stat card ───────────────────────────────────────── */
function StatCard({label,value,sub,color,icon}:{label:string;value:string;sub?:string;color?:string;icon:string}){
  const c=color??RED;
  return(
    <div style={{...CARD,padding:"18px 20px",display:"flex",alignItems:"flex-start",gap:14,overflow:"hidden"}}>
      <div style={{width:40,height:40,borderRadius:10,background:c+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:c}}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={icon}/></svg>
      </div>
      <div style={{minWidth:0,flex:1}}>
        <div style={{fontSize:11,fontWeight:600,color:GRAY,letterSpacing:".06em",textTransform:"uppercase",marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{label}</div>
        <div style={{fontFamily:FONT,fontWeight:800,fontSize:21,color:DARK,letterSpacing:"-.02em",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{value}</div>
        {sub&&<div style={{fontSize:11.5,color:GRAY,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sub}</div>}
      </div>
    </div>
  );
}

/* ── Section header ──────────────────────────────────── */
function SectionHead({title,sub}:{title:string;sub?:string}){
  return(
    <div style={{marginBottom:20}}>
      <h2 style={{margin:"0 0 4px",fontFamily:FONT,fontWeight:800,fontSize:20,color:DARK}}>{title}</h2>
      {sub&&<p style={{margin:0,fontSize:13,color:GRAY}}>{sub}</p>}
    </div>
  );
}

/* ── Empty state ─────────────────────────────────────── */
function Empty({msg}:{msg:string}){
  return <div style={{padding:"40px 24px",textAlign:"center",color:GRAY,fontSize:13.5}}>{msg}</div>;
}

/* ═══════════════════════════════════════════════════════
   TAB: OVERVIEW
═══════════════════════════════════════════════════════ */
function OverviewTab({
  users, accounts, txs, apps,
}:{
  users:UserRow[]; accounts:AcctRow[]; txs:TxRow[]; apps:AppRow[];
}){
  const totalDeposits = accounts.filter(a=>a.accountType!=="credit_card").reduce((s,a)=>s+a.balance,0);
  const pending       = apps.filter(a=>a.status==="pending").length;
  const frozen        = accounts.filter(a=>a.status==="frozen").length;
  const recentTxs     = txs.slice(0,8);

  return(
    <div>
      <SectionHead title="Control Panel Overview" sub="Live snapshot of all accounts and activity"/>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14,marginBottom:24}}>
        <StatCard label="Total Users"       value={String(users.length)}    sub="registered accounts"                color="#2563EB" icon="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
        <StatCard label="Total Accounts"    value={String(accounts.length)} sub={`${frozen} frozen`}                 color="#7C3AED" icon="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z"/>
        <StatCard label="Total Deposits"    value={usd(totalDeposits)}      sub="across all accounts"                color="#059669" icon="M2 20h20M4 20V10M20 20V10M10 20V14h4v6M1 10l11-7 11 7"/>
        <StatCard label="Pending Apps"      value={String(pending)}          sub={`${apps.length} total submitted`}  color={pending>0?"#D97706":GRAY} icon="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8"/>
      </div>

      {/* Recent Transactions */}
      <div style={{...CARD,overflow:"hidden",marginBottom:20}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(17,24,39,.07)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontFamily:FONT,fontWeight:700,fontSize:15,color:DARK}}>Recent Transactions</div>
          <span style={{fontSize:12,color:GRAY}}>all users</span>
        </div>
        {recentTxs.length===0
          ? <Empty msg="No transactions yet."/>
          : <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                <thead>
                  <tr style={{borderBottom:"1px solid rgba(17,24,39,.07)"}}>
                    {["Merchant","Category","Amount","Date"].map(h=>(
                      <th key={h} style={{textAlign:"left",padding:"10px 20px",fontWeight:600,fontSize:12,color:GRAY,letterSpacing:".04em",whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentTxs.map((tx,i)=>(
                    <tr key={tx.id} style={{borderBottom:i<recentTxs.length-1?"1px solid rgba(17,24,39,.05)":"none"}}>
                      <td style={{padding:"11px 20px",color:DARK,fontWeight:500}}>{tx.merchant}</td>
                      <td style={{padding:"11px 20px",color:GRAY}}>{tx.category}</td>
                      <td style={{padding:"11px 20px",fontFamily:FONT,fontWeight:700,color:tx.amount>0?"#16A34A":"#DC2626"}}>
                        {tx.amount>0?"+":"-"}{usd(tx.amount)}
                      </td>
                      <td style={{padding:"11px 20px",color:GRAY,whiteSpace:"nowrap"}}>{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        }
      </div>

      {/* Quick links */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
        {[
          {label:"Manage Users",       desc:"View profiles & accounts",    tab:"Users"},
          {label:"Review Applications",desc:`${pending} waiting for review`, tab:"Applications"},
          {label:"Send Notification",  desc:"Push alerts to any user",     tab:"Notifications"},
        ].map(q=>(
          <div key={q.tab} style={{...CARD,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"default"}}>
            <div>
              <div style={{fontWeight:600,fontSize:13.5,color:DARK,marginBottom:3}}>{q.label}</div>
              <div style={{fontSize:12,color:GRAY}}>{q.desc}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: USERS
═══════════════════════════════════════════════════════ */
function UsersTab({
  users, accounts, onFreezeToggle, onCreditLimitUpdate,
}:{
  users:UserRow[]; accounts:AcctRow[];
  onFreezeToggle:(acctId:string, nowFrozen:boolean, userId:string)=>Promise<void>;
  onCreditLimitUpdate:(acctId:string, limit:number)=>Promise<string|null>;
}){
  const [search, setSearch]           = useState("");
  const [expanded, setExpanded]       = useState<string|null>(null);
  const [busy, setBusy]               = useState<string|null>(null);
  const [editingLimit, setEditingLimit] = useState<string|null>(null);
  const [limitInput, setLimitInput]   = useState("");
  const [limitErr, setLimitErr]       = useState("");
  const [limitBusy, setLimitBusy]     = useState(false);

  const filtered = users.filter(u=>{
    const q=search.toLowerCase();
    return u.firstName.toLowerCase().includes(q)||u.lastName.toLowerCase().includes(q)||u.email.toLowerCase().includes(q);
  });

  async function toggle(acct:AcctRow){
    setBusy(acct.id);
    await onFreezeToggle(acct.id, acct.status!=="frozen", acct.userId);
    setBusy(null);
  }

  async function adjustCreditLimit(acct:AcctRow, mode:"credit"|"debit"){
    const val=parseFloat(limitInput);
    if(isNaN(val)||val<=0){setLimitErr("Enter a valid positive amount.");return;}
    const current=acct.creditLimit??0;
    const newLimit=mode==="credit"?current+val:current-val;
    if(newLimit<0){setLimitErr("Cannot reduce limit below $0.");return;}
    if(newLimit>50000){setLimitErr("Maximum limit is $50,000.");return;}
    setLimitBusy(true);setLimitErr("");
    const err=await onCreditLimitUpdate(acct.id,newLimit);
    setLimitBusy(false);
    if(err){setLimitErr(err);return;}
    setEditingLimit(null);
  }

  return(
    <div>
      <SectionHead title="User Management" sub={`${users.length} registered user${users.length!==1?"s":""}`}/>

      {/* Search */}
      <div style={{marginBottom:16,position:"relative"}}>
        <svg style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="2"><path d="M21 21l-6-6M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"/></svg>
        <input type="text" placeholder="Search by name or email…" value={search} onChange={e=>setSearch(e.target.value)} style={{...INP,paddingLeft:36}}/>
      </div>

      {/* Table */}
      <div style={{...CARD,overflow:"hidden"}}>
        {filtered.length===0
          ? <Empty msg="No users match your search."/>
          : filtered.map((u,i)=>{
              const isOpen=expanded===u.id;
              const userAccts=accounts.filter(a=>a.userId===u.id);
              return(
                <div key={u.id} style={{borderBottom:i<filtered.length-1?"1px solid rgba(17,24,39,.06)":"none"}}>
                  {/* Row */}
                  <button onClick={()=>setExpanded(isOpen?null:u.id)} style={{width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr auto auto",alignItems:"center",gap:16,padding:"14px 20px",background:isOpen?"rgba(17,24,39,.02)":"transparent",border:"none",cursor:"pointer",fontFamily:"inherit",textAlign:"left",transition:"background .12s"}}>
                    {/* Name + email */}
                    <div style={{display:"flex",alignItems:"center",gap:12,minWidth:0}}>
                      <div style={{width:36,height:36,borderRadius:"50%",background:RED,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONT,fontWeight:700,fontSize:12,color:"#fff",flexShrink:0}}>
                        {(u.firstName[0]||"?")+""+(u.lastName[0]||"?")}
                      </div>
                      <div style={{minWidth:0}}>
                        <div style={{fontWeight:600,fontSize:13.5,color:DARK}}>{u.firstName} {u.lastName}</div>
                        <div style={{fontSize:12,color:GRAY,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.email}</div>
                      </div>
                    </div>
                    {/* Member since + accounts */}
                    <div>
                      <div style={{fontSize:12.5,color:MID}}>Member since <strong>{u.memberSince||"—"}</strong></div>
                      <div style={{fontSize:12,color:GRAY,marginTop:2}}>{userAccts.length} account{userAccts.length!==1?"s":""} · {usd(u.totalBalance)} total</div>
                    </div>
                    {/* Role badge */}
                    <Badge status={u.role||"user"}/>
                    {/* Chevron */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="2" style={{transform:isOpen?"rotate(90deg)":"rotate(0deg)",transition:"transform .2s",flexShrink:0}}><path d="M9 18l6-6-6-6"/></svg>
                  </button>

                  {/* Expanded accounts */}
                  {isOpen&&(
                    <div style={{background:"rgba(238,240,244,.7)",padding:"12px 20px 16px",borderTop:"1px solid rgba(17,24,39,.05)"}}>
                      <div style={{fontSize:11.5,fontWeight:700,letterSpacing:".08em",color:GRAY,textTransform:"uppercase",marginBottom:10}}>Accounts</div>
                      {userAccts.length===0
                        ? <div style={{fontSize:13,color:GRAY}}>No accounts linked.</div>
                        : userAccts.map(a=>{
                            const frozen=a.status==="frozen";
                            const isCreditCard=a.accountType==="credit_card";
                            const isEditingThis=editingLimit===a.id;
                            return(
                              <div key={a.id} style={{...CARD,padding:"12px 16px",marginBottom:8}}>
                                {/* Main row */}
                                <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                                  <div style={{flex:1,minWidth:160}}>
                                    <div style={{fontWeight:600,fontSize:13,color:DARK}}>{a.accountName}</div>
                                    <div style={{fontSize:12,color:GRAY,marginTop:2}}>
                                      <span style={{fontFamily:"monospace",letterSpacing:".08em"}}>••••{a.last4}</span>
                                      <span style={{margin:"0 6px"}}>·</span>
                                      <span style={{textTransform:"capitalize"}}>{a.accountType.replace(/_/g," ")}</span>
                                    </div>
                                  </div>
                                  <div style={{textAlign:"right"}}>
                                    <div style={{fontFamily:FONT,fontWeight:700,fontSize:15,color:isCreditCard?(a.balance<0?"#DC2626":"#16A34A"):(a.balance<0?"#DC2626":DARK)}}>
                                      {isCreditCard?`${usd(a.balance)} owed`:usd(a.balance)}
                                    </div>
                                    {isCreditCard&&<div style={{fontSize:11.5,color:GRAY,marginTop:1}}>{usd(a.creditLimit+a.balance)} available</div>}
                                  </div>
                                  <Badge status={a.status}/>
                                  <button disabled={busy===a.id} onClick={()=>toggle(a)} style={{display:"flex",alignItems:"center",gap:6,background:frozen?"rgba(22,163,74,.07)":"rgba(220,38,38,.07)",border:`1px solid ${frozen?"rgba(22,163,74,.2)":"rgba(220,38,38,.2)"}`,borderRadius:8,padding:"6px 12px",fontSize:12.5,fontWeight:600,color:frozen?"#16A34A":"#DC2626",cursor:busy===a.id?"not-allowed":"pointer",fontFamily:"inherit",opacity:busy===a.id?.5:1,transition:"all .15s"}}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                    {busy===a.id?"…":frozen?"Unfreeze":"Freeze"}
                                  </button>
                                </div>
                                {/* Credit limit row */}
                                {isCreditCard&&(
                                  <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(17,24,39,.06)",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" style={{flexShrink:0}}><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z"/></svg>
                                    <span style={{fontSize:12,fontWeight:600,color:GRAY}}>Credit Limit:</span>
                                    {isEditingThis?(
                                      <>
                                        <div style={{position:"relative",display:"flex",alignItems:"center"}}>
                                          <span style={{position:"absolute",left:9,fontSize:13,color:GRAY,pointerEvents:"none"}}>$</span>
                                          <input
                                            type="number" min="0.01" step="100"
                                            placeholder="Amount"
                                            value={limitInput}
                                            onChange={e=>setLimitInput(e.target.value)}
                                            onKeyDown={e=>{if(e.key==="Escape")setEditingLimit(null);}}
                                            autoFocus
                                            style={{...INP,width:130,paddingLeft:22,fontSize:13,height:32,padding:"4px 8px 4px 22px"}}
                                          />
                                        </div>
                                        <button disabled={limitBusy} onClick={()=>adjustCreditLimit(a,"credit")} style={{display:"flex",alignItems:"center",gap:4,background:"rgba(22,163,74,.09)",border:"1px solid rgba(22,163,74,.25)",borderRadius:7,padding:"4px 12px",fontSize:12,fontWeight:600,color:"#16A34A",cursor:limitBusy?"not-allowed":"pointer",fontFamily:"inherit",opacity:limitBusy?.5:1}}>
                                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                                          {limitBusy?"…":"Credit"}
                                        </button>
                                        <button disabled={limitBusy} onClick={()=>adjustCreditLimit(a,"debit")} style={{display:"flex",alignItems:"center",gap:4,background:"rgba(220,38,38,.07)",border:"1px solid rgba(220,38,38,.2)",borderRadius:7,padding:"4px 12px",fontSize:12,fontWeight:600,color:"#DC2626",cursor:limitBusy?"not-allowed":"pointer",fontFamily:"inherit",opacity:limitBusy?.5:1}}>
                                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/></svg>
                                          {limitBusy?"…":"Debit"}
                                        </button>
                                        <button onClick={()=>{setEditingLimit(null);setLimitErr("");}} style={{background:"rgba(17,24,39,.05)",border:"1px solid rgba(17,24,39,.12)",borderRadius:7,padding:"4px 10px",fontSize:12,fontWeight:600,color:GRAY,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
                                        {limitErr&&<span style={{fontSize:12,color:"#DC2626"}}>{limitErr}</span>}
                                      </>
                                    ):(
                                      <>
                                        <span style={{fontSize:13,fontWeight:700,color:DARK}}>{a.creditLimit>0?usd(a.creditLimit):"Not set"}</span>
                                        <button onClick={()=>{setEditingLimit(a.id);setLimitInput("");setLimitErr("");}} style={{display:"flex",alignItems:"center",gap:5,background:"rgba(212,175,55,.08)",border:"1px solid rgba(212,175,55,.3)",borderRadius:7,padding:"4px 10px",fontSize:12,fontWeight:600,color:"#92701A",cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>
                                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                          Adjust Limit
                                        </button>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })
                      }
                    </div>
                  )}
                </div>
              );
            })
        }
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: APPLICATIONS
═══════════════════════════════════════════════════════ */
function ApplicationsTab({apps, onUpdateStatus}:{apps:AppRow[]; onUpdateStatus:(id:string,status:"approved"|"rejected")=>Promise<void>}){
  const [filter, setFilter] = useState<"all"|"pending"|"approved"|"rejected">("pending");
  const [busy, setBusy]     = useState<string|null>(null);

  const shown = filter==="all" ? apps : apps.filter(a=>a.status===filter);

  async function act(app:AppRow, status:"approved"|"rejected"){
    setBusy(app.id);
    await onUpdateStatus(app.id, status);
    setBusy(null);
  }

  const FILTERS:Array<"all"|"pending"|"approved"|"rejected"> = ["pending","all","approved","rejected"];

  return(
    <div>
      <SectionHead title="Account Applications" sub={`${apps.filter(a=>a.status==="pending").length} pending review`}/>

      {/* Filter pills */}
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {FILTERS.map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{background:filter===f?"rgba(140,29,37,.09)":"rgba(17,24,39,.04)",color:filter===f?RED:GRAY,border:`1px solid ${filter===f?"rgba(140,29,37,.25)":"rgba(17,24,39,.1)"}`,borderRadius:7,padding:"5px 14px",fontSize:12.5,fontWeight:filter===f?700:400,cursor:"pointer",fontFamily:"inherit",textTransform:"capitalize",transition:"all .15s"}}>
            {f} {f==="all"?`(${apps.length})`:f==="pending"?`(${apps.filter(a=>a.status==="pending").length})`:f==="approved"?`(${apps.filter(a=>a.status==="approved").length})`:`(${apps.filter(a=>a.status==="rejected").length})`}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{...CARD,overflow:"hidden"}}>
        {shown.length===0
          ? <Empty msg={`No ${filter==="all"?"":filter} applications.`}/>
          : shown.map((app,i)=>(
              <div key={app.id} style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:12,padding:"16px 20px",borderBottom:i<shown.length-1?"1px solid rgba(17,24,39,.06)":"none"}}>
                {/* Reference */}
                <div style={{width:36,height:36,borderRadius:9,background:"rgba(140,29,37,.07)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:RED}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6"/></svg>
                </div>
                {/* Info */}
                <div style={{flex:1,minWidth:180}}>
                  <div style={{fontWeight:600,fontSize:13.5,color:DARK}}>{app.firstName} {app.lastName}</div>
                  <div style={{fontSize:12,color:GRAY,marginTop:2}}>{app.email} {app.phone&&`· ${app.phone}`}</div>
                  <div style={{fontSize:12,color:MID,marginTop:3}}>
                    <span style={{background:"rgba(17,24,39,.06)",borderRadius:5,padding:"1px 7px",textTransform:"capitalize"}}>{app.accountType.replace(/_/g," ")} — {app.category}</span>
                    <span style={{marginLeft:8,color:GRAY}}>{app.referenceId}</span>
                  </div>
                </div>
                {/* Date */}
                <div style={{fontSize:12,color:GRAY,whiteSpace:"nowrap"}}>{fmtDate(app.submittedAt)}</div>
                {/* Status */}
                <Badge status={app.status}/>
                {/* Actions */}
                {app.status==="pending"&&(
                  <div style={{display:"flex",gap:6}}>
                    <button disabled={busy===app.id} onClick={()=>act(app,"approved")} style={{background:"rgba(22,163,74,.09)",border:"1px solid rgba(22,163,74,.25)",borderRadius:8,padding:"6px 14px",fontSize:12.5,fontWeight:600,color:"#16A34A",cursor:busy===app.id?"not-allowed":"pointer",fontFamily:"inherit",opacity:busy===app.id?.5:1,transition:"all .15s"}}>
                      {busy===app.id?"…":"Approve"}
                    </button>
                    <button disabled={busy===app.id} onClick={()=>act(app,"rejected")} style={{background:"rgba(220,38,38,.07)",border:"1px solid rgba(220,38,38,.2)",borderRadius:8,padding:"6px 14px",fontSize:12.5,fontWeight:600,color:"#DC2626",cursor:busy===app.id?"not-allowed":"pointer",fontFamily:"inherit",opacity:busy===app.id?.5:1,transition:"all .15s"}}>
                      {busy===app.id?"…":"Reject"}
                    </button>
                  </div>
                )}
              </div>
            ))
        }
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: NOTIFICATIONS
═══════════════════════════════════════════════════════ */
function NotificationsTab({users}:{users:UserRow[]}){
  const [target,  setTarget]  = useState("all");
  const [type,    setType]    = useState("info");
  const [title,   setTitle]   = useState("");
  const [message, setMessage] = useState("");
  const [err,     setErr]     = useState("");
  const [sent,    setSent]    = useState(false);
  const [sending, setSending] = useState(false);

  const TYPE_OPTS=[{v:"info",l:"Info"},   {v:"success",l:"Success"},
                   {v:"warning",l:"Warning"},{v:"error",l:"Error"}];

  async function send(){
    if(!message.trim()){setErr("Message is required.");return;}
    setErr(""); setSending(true);
    const sb=createClient();
    const recipients = target==="all" ? users : users.filter(u=>u.id===target);
    const rows=recipients.map(u=>({user_id:u.id, type, title:title.trim()||null, message:message.trim(), read:false}));
    const {error}=await sb.from("notifications").insert(rows);
    setSending(false);
    if(error){setErr(error.message);return;}
    setSent(true);
    setTimeout(()=>{setSent(false);setTitle("");setMessage("");},4000);
  }

  const PREVIEW_COLORS:Record<string,string>={info:"#2563EB",success:"#16A34A",warning:"#D97706",error:"#DC2626"};
  const pc=PREVIEW_COLORS[type];

  return(
    <div>
      <SectionHead title="Send Notification" sub="Push an alert to any user — it will appear in their dashboard bell instantly"/>

      <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:20,alignItems:"flex-start"}}>

        {/* Form */}
        <div style={{...CARD,overflow:"hidden"}}>
          <div style={{padding:"18px 24px",borderBottom:"1px solid rgba(17,24,39,.07)"}}>
            <div style={{fontFamily:FONT,fontWeight:700,fontSize:15,color:DARK}}>Compose Notification</div>
          </div>
          {sent?(
            <div style={{padding:"48px 24px",textAlign:"center"}}>
              <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(22,163,74,.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",color:"#16A34A"}}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <div style={{fontFamily:FONT,fontWeight:700,fontSize:17,color:DARK,marginBottom:8}}>Notification sent!</div>
              <div style={{fontSize:14,color:GRAY}}>It will appear in the recipient&apos;s dashboard notification bell.</div>
            </div>
          ):(
            <div style={{padding:"24px"}}>
              <div style={{marginBottom:16}}>
                <label style={LBL}>Recipient</label>
                <select value={target} onChange={e=>setTarget(e.target.value)} style={SEL}>
                  <option value="all">All users ({users.length})</option>
                  {users.map(u=><option key={u.id} value={u.id}>{u.firstName} {u.lastName} — {u.email}</option>)}
                </select>
              </div>
              <div style={{marginBottom:16}}>
                <label style={LBL}>Type</label>
                <div style={{display:"flex",gap:8}}>
                  {TYPE_OPTS.map(o=>(
                    <button key={o.v} onClick={()=>setType(o.v)} style={{flex:1,padding:"8px 0",borderRadius:8,border:`1px solid ${type===o.v?PREVIEW_COLORS[o.v]+"55":"rgba(17,24,39,.12)"}`,background:type===o.v?PREVIEW_COLORS[o.v]+"10":"transparent",fontSize:12.5,fontWeight:type===o.v?700:400,color:type===o.v?PREVIEW_COLORS[o.v]:GRAY,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:16}}>
                <label style={LBL}>Title <span style={{fontWeight:400,color:GRAY}}>(optional)</span></label>
                <input type="text" placeholder="e.g. Important account update" value={title} onChange={e=>setTitle(e.target.value)} style={INP}/>
              </div>
              <div style={{marginBottom:20}}>
                <label style={LBL}>Message</label>
                <textarea rows={3} placeholder="Type your notification message…" value={message} onChange={e=>setMessage(e.target.value)} style={{...INP,resize:"vertical",height:"auto"}}/>
              </div>
              {err&&<div style={{fontSize:13,color:"#DC2626",marginBottom:12,padding:"8px 12px",background:"rgba(220,38,38,.06)",borderRadius:7}}>{err}</div>}
              <button disabled={sending} onClick={send} style={{width:"100%",background:RED,border:"none",borderRadius:10,padding:"12px 0",fontSize:14,fontWeight:700,color:"#fff",cursor:sending?"not-allowed":"pointer",fontFamily:FONT,opacity:sending?.7:1}}>
                {sending?"Sending…":target==="all"?`Broadcast to all ${users.length} users`:"Send Notification"}
              </button>
            </div>
          )}
        </div>

        {/* Preview */}
        <div>
          <div style={{...CARD,overflow:"hidden"}}>
            <div style={{padding:"14px 16px",borderBottom:"1px solid rgba(17,24,39,.07)"}}>
              <div style={{fontFamily:FONT,fontWeight:700,fontSize:13.5,color:DARK}}>Preview</div>
              <div style={{fontSize:12,color:GRAY,marginTop:2}}>How it appears in the dashboard</div>
            </div>
            <div style={{padding:"16px"}}>
              {/* Bell mockup */}
              <div style={{border:"1px solid rgba(17,24,39,.1)",borderRadius:10,overflow:"hidden",boxShadow:"0 4px 16px rgba(17,24,39,.08)"}}>
                <div style={{background:"#fff",padding:"10px 14px",borderBottom:"1px solid rgba(17,24,39,.07)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontFamily:FONT,fontWeight:700,fontSize:12.5,color:DARK}}>Notifications</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                </div>
                <div style={{display:"flex",gap:10,padding:"12px 14px",background:"#fff",alignItems:"flex-start"}}>
                  <div style={{width:28,height:28,borderRadius:7,background:pc+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:pc}}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 8v4M12 16h.01"/></svg>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    {(title||"Notification title")&&<div style={{fontSize:12,fontWeight:600,color:DARK,marginBottom:2}}>{title||"Notification title"}</div>}
                    <div style={{fontSize:12,color:MID,lineHeight:1.45}}>{message||"Your notification message will appear here."}</div>
                    <div style={{fontSize:11,color:GRAY,marginTop:3}}>Just now</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tip */}
          <div style={{...CARD,padding:"14px 16px",marginTop:12,display:"flex",gap:10,alignItems:"flex-start"}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" style={{flexShrink:0,marginTop:1}}><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 8v4M12 16h.01"/></svg>
            <p style={{margin:0,fontSize:12,color:MID,lineHeight:1.5}}>Notifications appear immediately in the user&apos;s dashboard bell. They can dismiss individual alerts or mark all as read.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: AUDIT LOG
═══════════════════════════════════════════════════════ */
const ACTION_META:Record<string,{label:string;color:string;bg:string;category:string}>={
  "account.freeze":           {label:"Account Frozen",    color:"#DC2626", bg:"rgba(220,38,38,.1)",   category:"Account"},
  "account.unfreeze":         {label:"Account Unfrozen",  color:"#16A34A", bg:"rgba(22,163,74,.1)",   category:"Account"},
  "account.credit_limit_set": {label:"Credit Limit Set",  color:"#D97706", bg:"rgba(217,119,6,.1)",   category:"Account"},
  "transaction.approve":      {label:"Tx Approved",       color:"#16A34A", bg:"rgba(22,163,74,.1)",   category:"Transaction"},
  "transaction.reject":       {label:"Tx Rejected",       color:"#DC2626", bg:"rgba(220,38,38,.1)",   category:"Transaction"},
  "transaction.manual_post":  {label:"Manual Post",       color:"#2563EB", bg:"rgba(37,99,235,.1)",   category:"Transaction"},
  "application.approve":      {label:"App Approved",      color:"#16A34A", bg:"rgba(22,163,74,.1)",   category:"Application"},
  "application.reject":       {label:"App Rejected",      color:"#DC2626", bg:"rgba(220,38,38,.1)",   category:"Application"},
  "kyc.update":               {label:"KYC Updated",       color:"#7C3AED", bg:"rgba(124,58,237,.1)",  category:"KYC"},
  "fraud.alert_dismiss":      {label:"Alert Dismissed",   color:GRAY,      bg:"rgba(107,114,128,.1)", category:"Fraud"},
  "fraud.account_freeze":     {label:"Fraud Freeze",      color:"#DC2626", bg:"rgba(220,38,38,.1)",   category:"Fraud"},
  "dispute.open":             {label:"Dispute Opened",    color:"#2563EB", bg:"rgba(37,99,235,.1)",   category:"Dispute"},
  "dispute.approve":          {label:"Dispute Approved",  color:"#16A34A", bg:"rgba(22,163,74,.1)",   category:"Dispute"},
  "dispute.deny":             {label:"Dispute Denied",    color:"#DC2626", bg:"rgba(220,38,38,.1)",   category:"Dispute"},
  "dispute.request_info":     {label:"Info Requested",    color:"#7C3AED", bg:"rgba(124,58,237,.1)",  category:"Dispute"},
  "dispute.mark_review":      {label:"Under Review",      color:"#D97706", bg:"rgba(217,119,6,.1)",   category:"Dispute"},
  "rate.update":              {label:"Rate Updated",       color:"#0891B2", bg:"rgba(8,145,178,.1)",   category:"Rates"},
  "fee.update":               {label:"Fee Updated",        color:"#7C3AED", bg:"rgba(124,58,237,.1)",  category:"Rates"},
  "fee.apply":                {label:"Fee Applied",        color:"#DC2626", bg:"rgba(220,38,38,.1)",   category:"Rates"},
  "interest.apply":           {label:"Interest Applied",   color:"#16A34A", bg:"rgba(22,163,74,.1)",   category:"Rates"},
  "compliance.sar_file":      {label:"SAR Filed",           color:"#DC2626", bg:"rgba(220,38,38,.1)",   category:"Compliance"},
  "compliance.ctr_file":      {label:"CTR Filed",           color:"#D97706", bg:"rgba(217,119,6,.1)",   category:"Compliance"},
  "compliance.status_update": {label:"Report Updated",      color:"#2563EB", bg:"rgba(37,99,235,.1)",   category:"Compliance"},
  "compliance.ofac_review":   {label:"OFAC Reviewed",       color:"#7C3AED", bg:"rgba(124,58,237,.1)",  category:"Compliance"},
};

const AUDIT_CATEGORIES=["All","Account","Transaction","Application","KYC","Fraud","Dispute","Rates","Compliance"] as const;

function AuditTab({logs}:{logs:AuditLog[]}){
  const [search,  setSearch]  = useState("");
  const [cat,     setCat]     = useState<typeof AUDIT_CATEGORIES[number]>("All");
  const [expanded,setExpanded]= useState<string|null>(null);

  const filtered = logs.filter(l=>{
    const meta = ACTION_META[l.action];
    const matchCat = cat==="All" || meta?.category===cat;
    const q = search.toLowerCase();
    const matchQ = !q || l.adminEmail.toLowerCase().includes(q) || l.action.includes(q) || (l.entityId||"").toLowerCase().includes(q) || JSON.stringify(l.details).toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  function detailSummary(log:AuditLog):string{
    const d=log.details;
    if(!d||Object.keys(d).length===0) return "";
    const pairs=Object.entries(d).filter(([,v])=>v!==null&&v!==undefined&&v!=="").slice(0,4);
    return pairs.map(([k,v])=>`${k}: ${typeof v==="object"?JSON.stringify(v):String(v)}`).join(" · ");
  }

  return(
    <div>
      <SectionHead title="Audit Log" sub={`${logs.length} actions recorded — every admin action is logged automatically`}/>

      {/* Controls */}
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{position:"relative",flex:1,minWidth:220}}>
          <svg style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="2"><path d="M21 21l-6-6M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"/></svg>
          <input type="text" placeholder="Search by admin, action, entity ID…" value={search} onChange={e=>setSearch(e.target.value)} style={{...INP,paddingLeft:34}}/>
        </div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          {AUDIT_CATEGORIES.map(c=>(
            <button key={c} onClick={()=>setCat(c)} style={{background:cat===c?"rgba(140,29,37,.09)":"rgba(17,24,39,.04)",color:cat===c?RED:GRAY,border:`1px solid ${cat===c?"rgba(140,29,37,.25)":"rgba(17,24,39,.1)"}`,borderRadius:7,padding:"5px 12px",fontSize:12.5,fontWeight:cat===c?700:400,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div style={{fontSize:12,color:GRAY,marginBottom:12}}>{filtered.length} record{filtered.length!==1?"s":""} {cat!=="All"?`in ${cat}`:"total"}</div>

      {/* Log table */}
      <div style={{...CARD,overflow:"hidden"}}>
        {filtered.length===0
          ?<Empty msg="No audit log entries yet. Actions will appear here once you start using the panel."/>
          :filtered.map((log,i)=>{
            const meta=ACTION_META[log.action]??{label:log.action,color:GRAY,bg:"rgba(107,114,128,.1)",category:"Other"};
            const isOpen=expanded===log.id;
            const summary=detailSummary(log);
            return(
              <div key={log.id} style={{borderBottom:i<filtered.length-1?"1px solid rgba(17,24,39,.05)":"none"}}>
                <button onClick={()=>setExpanded(isOpen?null:log.id)} style={{width:"100%",display:"grid",gridTemplateColumns:"140px 1fr auto auto",alignItems:"center",gap:14,padding:"12px 20px",background:isOpen?"rgba(17,24,39,.02)":"transparent",border:"none",cursor:"pointer",fontFamily:"inherit",textAlign:"left",transition:"background .12s"}}>
                  {/* Timestamp */}
                  <div>
                    <div style={{fontSize:12,fontWeight:600,color:DARK}}>{new Date(log.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div>
                    <div style={{fontSize:11,color:GRAY}}>{new Date(log.createdAt).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}</div>
                  </div>
                  {/* Action + detail */}
                  <div style={{minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                      <span style={{fontSize:11.5,fontWeight:700,padding:"2px 8px",borderRadius:99,background:meta.bg,color:meta.color,letterSpacing:".04em",flexShrink:0}}>{meta.label}</span>
                      <span style={{fontSize:12,color:GRAY,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{log.adminEmail}</span>
                    </div>
                    {summary&&<div style={{fontSize:11.5,color:GRAY,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{summary}</div>}
                  </div>
                  {/* Entity ID */}
                  {log.entityId&&<span style={{fontSize:11,color:GRAY,fontFamily:"monospace",letterSpacing:".04em",flexShrink:0,display:"none"}} className="audit-entity">{log.entityId.slice(0,8)}…</span>}
                  {/* Chevron */}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="2" style={{transform:isOpen?"rotate(90deg)":"none",transition:"transform .2s",flexShrink:0}}><path d="M9 18l6-6-6-6"/></svg>
                </button>

                {/* Expanded detail */}
                {isOpen&&(
                  <div style={{background:"rgba(238,240,244,.5)",padding:"12px 20px",borderTop:"1px solid rgba(17,24,39,.05)"}}>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
                      {[
                        ["Action",    log.action],
                        ["Admin",     log.adminEmail],
                        ["Entity",    log.entityType],
                        ["Entity ID", log.entityId||"—"],
                        ["Timestamp", new Date(log.createdAt).toLocaleString()],
                        ...Object.entries(log.details).map(([k,v])=>[k, typeof v==="object"?JSON.stringify(v):String(v)]),
                      ].map(([k,v])=>(
                        <div key={k} style={{...CARD,padding:"8px 12px"}}>
                          <div style={{fontSize:10.5,fontWeight:700,letterSpacing:".08em",color:GRAY,textTransform:"uppercase",marginBottom:3}}>{k}</div>
                          <div style={{fontSize:12.5,color:DARK,fontFamily:["Entity ID","Admin ID","Timestamp"].includes(k as string)?"monospace":"inherit",wordBreak:"break-all"}}>{String(v)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: STATEMENTS & DOCUMENTS
═══════════════════════════════════════════════════════ */
type DbStmt={id:string;account_id:string;user_id:string;reference_id:string;period_start:string;period_end:string;generated_by:string;generated_at:string;opening_balance:number;closing_balance:number;total_credits:number;total_debits:number;transaction_count:number};

function StatementsTab({ users, accounts }:{ users:UserRow[]; accounts:AcctRow[] }){
  const today     = new Date();
  const thisMonth = today.toISOString().slice(0,7);

  const [selUser,    setSelUser]    = useState(users[0]?.id||"");
  const [selAcct,    setSelAcct]    = useState("");
  const [preset,     setPreset]     = useState("last_month");
  const [custStart,  setCustStart]  = useState(thisMonth+"-01");
  const [custEnd,    setCustEnd]    = useState(today.toISOString().slice(0,10));
  const [saving,     setSaving]     = useState(false);
  const [err,        setErr]        = useState("");
  const [savedStmts, setSavedStmts] = useState<DbStmt[]>([]);
  const [stmtLoading,setStmtLoading]= useState(false);

  const userAccts = accounts.filter(a=>a.userId===selUser);

  // Load saved statements whenever the selected account changes
  useEffect(()=>{
    if(!selAcct){setSavedStmts([]);return;}
    setStmtLoading(true);
    fetch(`/api/cpanel/statements/list?accountId=${selAcct}`)
      .then(r=>r.json())
      .then((j:{statements:DbStmt[]})=>setSavedStmts(j.statements??[]))
      .catch(()=>{})
      .finally(()=>setStmtLoading(false));
  },[selAcct]);

  function calcRange(p:string):{start:string;end:string}{
    const d  = new Date();
    const yr = d.getFullYear();
    const mo = d.getMonth();
    const pad= (n:number)=>String(n).padStart(2,"0");
    if(p==="this_month")  return {start:`${yr}-${pad(mo+1)}-01`,          end:today.toISOString().slice(0,10)};
    if(p==="last_month"){
      const lm=mo===0?{y:yr-1,m:12}:{y:yr,m:mo};
      const lastDay=new Date(lm.y,lm.m,0).getDate();
      return {start:`${lm.y}-${pad(lm.m)}-01`, end:`${lm.y}-${pad(lm.m)}-${lastDay}`};
    }
    if(p==="last_3m"){
      const s=new Date(yr,mo-2,1);
      return {start:`${s.getFullYear()}-${pad(s.getMonth()+1)}-01`, end:today.toISOString().slice(0,10)};
    }
    if(p==="last_6m"){
      const s=new Date(yr,mo-5,1);
      return {start:`${s.getFullYear()}-${pad(s.getMonth()+1)}-01`, end:today.toISOString().slice(0,10)};
    }
    if(p==="ytd") return {start:`${yr}-01-01`, end:today.toISOString().slice(0,10)};
    return {start:custStart, end:custEnd};
  }

  async function generate(){
    setErr("");
    if(!selAcct){setErr("Select an account.");return;}
    const {start,end}=calcRange(preset);
    if(new Date(start)>new Date(end)){setErr("Start date must be before end date.");return;}
    setSaving(true);
    try{
      const res=await fetch("/api/cpanel/statements",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({accountId:selAcct,start,end})});
      const json=await res.json() as {statement?:DbStmt;error?:string};
      if(!res.ok){setErr(json.error||"Failed to save statement.");return;}
      if(json.statement) setSavedStmts(s=>[json.statement as DbStmt,...s]);
      window.open(`/statement?accountId=${selAcct}&start=${start}&end=${end}&print=1`,"_blank");
    }catch{
      setErr("Network error. Please try again.");
    }finally{
      setSaving(false);
    }
  }

  const fmtPeriod=(s:string,e:string)=>{
    const fmt=(d:string)=>new Date(d+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
    return `${fmt(s)} – ${fmt(e)}`;
  };

  return(
    <div>
      <SectionHead title="Statements & Documents" sub="Generate and post official bank statements to customer accounts — supports any date range including backdating"/>

      <div style={{display:"grid",gridTemplateColumns:"400px 1fr",gap:20,alignItems:"flex-start"}}>

        {/* Generator form */}
        <div style={{...CARD,overflow:"hidden"}}>
          <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(17,24,39,.07)"}}>
            <div style={{fontFamily:FONT,fontWeight:700,fontSize:15,color:DARK}}>Generate & Post Statement</div>
            <div style={{fontSize:12,color:GRAY,marginTop:3}}>Statement is saved to the account and visible to the customer</div>
          </div>
          <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:14}}>
            <div>
              <label style={LBL}>Customer</label>
              <select value={selUser} onChange={e=>{setSelUser(e.target.value);setSelAcct("");}} style={SEL}>
                {users.map(u=><option key={u.id} value={u.id}>{u.firstName} {u.lastName} — {u.email}</option>)}
              </select>
            </div>
            <div>
              <label style={LBL}>Account</label>
              <select value={selAcct} onChange={e=>setSelAcct(e.target.value)} style={SEL}>
                <option value="">Select account…</option>
                {userAccts.map(a=><option key={a.id} value={a.id}>{a.accountName} ••••{a.last4} ({usd(a.balance)})</option>)}
              </select>
            </div>
            <div>
              <label style={LBL}>Statement Period</label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:6}}>
                {STMT_PRESETS.map(p=>(
                  <button key={p.v} onClick={()=>setPreset(p.v)} style={{padding:"8px 10px",borderRadius:8,border:`1px solid ${preset===p.v?"rgba(140,29,37,.3)":"rgba(17,24,39,.12)"}`,background:preset===p.v?"rgba(140,29,37,.07)":"transparent",fontSize:12.5,fontWeight:preset===p.v?700:400,color:preset===p.v?RED:MID,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>
                    {p.l}
                  </button>
                ))}
              </div>
              <div style={{fontSize:11.5,color:GRAY,padding:"6px 10px",background:"rgba(212,175,55,.07)",border:"1px solid rgba(212,175,55,.25)",borderRadius:7,display:"flex",alignItems:"center",gap:6}}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 8v4M12 16h.01"/></svg>
                Use <strong style={{margin:"0 3px"}}>Custom Range</strong> to backdate any period — month, quarter, or year
              </div>
            </div>
            {preset==="custom"&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div><label style={LBL}>From (backdate allowed)</label><input type="date" value={custStart} onChange={e=>setCustStart(e.target.value)} style={INP}/></div>
                <div><label style={LBL}>To</label><input type="date" value={custEnd} onChange={e=>setCustEnd(e.target.value)} style={INP}/></div>
              </div>
            )}
            {err&&<div style={{fontSize:13,color:"#DC2626",padding:"8px 12px",background:"rgba(220,38,38,.06)",borderRadius:7}}>{err}</div>}
            <button onClick={generate} disabled={saving} style={{background:saving?"rgba(140,29,37,.55)":RED,border:"none",borderRadius:10,padding:"12px 0",fontSize:14,fontWeight:700,color:"#fff",cursor:saving?"not-allowed":"pointer",fontFamily:FONT,display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"background .15s"}}>
              {saving
                ?<><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{animation:"spin 1s linear infinite"}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Saving…</>
                :<><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>Generate &amp; Post Statement</>
              }
            </button>
          </div>
          <div style={{padding:"14px 20px",borderTop:"1px solid rgba(17,24,39,.07)",background:"rgba(17,24,39,.01)"}}>
            {[
              ["Saved to account","Posted to the customer's dashboard — they can view it anytime."],
              ["Backdating supported","Custom Range lets you generate any historical period."],
              ["Opens PDF preview","The formatted statement opens in a new tab for review / print."],
            ].map(([title,desc])=>(
              <div key={title} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" style={{flexShrink:0,marginTop:1}}><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 8v4M12 16h.01"/></svg>
                <div>
                  <div style={{fontSize:12.5,fontWeight:600,color:DARK}}>{title}</div>
                  <div style={{fontSize:11.5,color:GRAY,marginTop:1}}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved statements for selected account */}
        <div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div style={{fontFamily:FONT,fontWeight:700,fontSize:14,color:DARK}}>
              {selAcct ? `Posted Statements — ${accounts.find(a=>a.id===selAcct)?.accountName||"Account"}` : "Select an account to see statements"}
            </div>
            {savedStmts.length>0&&<span style={{fontSize:12,color:GRAY}}>{savedStmts.length} statement{savedStmts.length!==1?"s":""}</span>}
          </div>

          {!selAcct
            ?<div style={{...CARD,padding:"40px 24px",textAlign:"center",color:GRAY,fontSize:13.5}}>Choose a customer and account to load their statement history.</div>
            :stmtLoading
            ?<div style={{...CARD,padding:"32px 24px",textAlign:"center",color:GRAY,fontSize:13.5}}>Loading…</div>
            :savedStmts.length===0
            ?<div style={{...CARD,padding:"40px 24px",textAlign:"center"}}>
              <div style={{color:DARK,fontWeight:600,fontSize:14,marginBottom:6}}>No statements posted yet</div>
              <div style={{color:GRAY,fontSize:13}}>Generate one using the form — it will appear here and in the customer&apos;s dashboard.</div>
            </div>
            :<div style={{...CARD,overflow:"hidden"}}>
              {savedStmts.map((s,i)=>(
                <div key={s.id} style={{display:"flex",alignItems:"flex-start",gap:14,padding:"16px 20px",borderBottom:i<savedStmts.length-1?"1px solid rgba(17,24,39,.06)":"none"}}>
                  <div style={{width:38,height:38,borderRadius:9,background:"rgba(140,29,37,.07)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:RED}}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6"/></svg>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:600,fontSize:13.5,color:DARK,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{fmtPeriod(s.period_start,s.period_end)}</div>
                    <div style={{fontSize:12,color:GRAY,marginTop:2}}>{s.transaction_count} txn · Opening {usd(s.opening_balance)} → Closing {usd(s.closing_balance)}</div>
                    <div style={{fontSize:11,color:GRAY,marginTop:2}}>
                      Posted by {s.generated_by} · {new Date(s.generated_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,flexShrink:0}}>
                    <span style={{fontSize:10.5,color:GRAY,fontFamily:"monospace"}}>{s.reference_id}</span>
                    <a href={`/statement?accountId=${s.account_id}&start=${s.period_start}&end=${s.period_end}&print=1`} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:5,background:"rgba(140,29,37,.07)",border:"1px solid rgba(140,29,37,.2)",borderRadius:8,padding:"6px 12px",fontSize:12.5,fontWeight:600,color:RED,textDecoration:"none"}}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
                      View PDF
                    </a>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      </div>
    </div>
  );
}

const STMT_PRESETS=[
  {v:"this_month",l:"This Month"},
  {v:"last_month",l:"Last Month"},
  {v:"last_3m",   l:"Last 3 Months"},
  {v:"last_6m",   l:"Last 6 Months"},
  {v:"ytd",       l:"Year to Date"},
  {v:"custom",    l:"Custom Range"},
];

/* ═══════════════════════════════════════════════════════
   TAB: DISPUTES & CHARGEBACKS
═══════════════════════════════════════════════════════ */
const DISPUTE_TYPES=[
  {v:"unauthorized",   l:"Unauthorized Transaction"},
  {v:"billing_error",  l:"Billing Error"},
  {v:"not_received",   l:"Item / Service Not Received"},
  {v:"duplicate",      l:"Duplicate Charge"},
  {v:"other",          l:"Other"},
];
const DISPUTE_STATUS_META:Record<string,{label:string;bg:string;text:string}>={
  open:             {label:"Open",           bg:"rgba(37,99,235,.1)",   text:"#2563EB"},
  under_review:     {label:"Under Review",   bg:"rgba(234,179,8,.12)",  text:"#854D0E"},
  more_info_needed: {label:"More Info Needed",bg:"rgba(124,58,237,.1)", text:"#7C3AED"},
  approved:         {label:"Approved",       bg:"rgba(22,163,74,.1)",   text:"#16A34A"},
  denied:           {label:"Denied",         bg:"rgba(220,38,38,.1)",   text:"#DC2626"},
};

function DisputeStatusBadge({status}:{status:string}){
  const m=DISPUTE_STATUS_META[status]??{label:status,bg:"rgba(107,114,128,.1)",text:GRAY};
  return <span style={{fontSize:11.5,fontWeight:700,padding:"3px 9px",borderRadius:99,background:m.bg,color:m.text,letterSpacing:".04em",whiteSpace:"nowrap"}}>{m.label}</span>;
}

function DisputesTab({
  disputes, users, accounts, txs,
  onOpen, onApprove, onDeny, onRequestInfo, onReview,
}:{
  disputes:DisputeRow[]; users:UserRow[]; accounts:AcctRow[]; txs:TxRow[];
  onOpen:(d:{userId:string;accountId:string;transactionId:string|null;disputeType:string;amount:number;merchant:string;description:string})=>Promise<string|null>;
  onApprove:(disputeId:string,accountId:string,userId:string,amount:number,merchant:string,notes:string)=>Promise<string|null>;
  onDeny:(disputeId:string,notes:string)=>Promise<string|null>;
  onRequestInfo:(disputeId:string,notes:string)=>Promise<string|null>;
  onReview:(disputeId:string)=>Promise<void>;
}){
  const [filter, setFilter] = useState<"all"|"open"|"under_review"|"more_info_needed"|"approved"|"denied">("open");
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState<string|null>(null);
  const [busy, setBusy] = useState<string|null>(null);
  const [notes, setNotes] = useState<Record<string,string>>({});

  /* ── New dispute form state ── */
  const [fUser, setFUser]       = useState(users[0]?.id||"");
  const [fAcct, setFAcct]       = useState("");
  const [fTx,   setFTx]         = useState("");
  const [fType, setFType]       = useState("unauthorized");
  const [fAmt,  setFAmt]        = useState("");
  const [fMerch,setFMerch]      = useState("");
  const [fDesc, setFDesc]       = useState("");
  const [fErr,  setFErr]        = useState("");
  const [fBusy, setFBusy]       = useState(false);
  const [fDone, setFDone]       = useState<string|null>(null);

  const userAccts = accounts.filter(a=>a.userId===fUser);
  const acctTxs   = txs.filter(t=>t.accountId===fAcct).slice(0,30);

  const FILTERS=["open","under_review","more_info_needed","approved","denied","all"] as const;
  const shown = filter==="all" ? disputes : disputes.filter(d=>d.status===filter);

  const counts={
    open:             disputes.filter(d=>d.status==="open").length,
    under_review:     disputes.filter(d=>d.status==="under_review").length,
    more_info_needed: disputes.filter(d=>d.status==="more_info_needed").length,
    approved:         disputes.filter(d=>d.status==="approved").length,
    denied:           disputes.filter(d=>d.status==="denied").length,
  };

  async function submitOpen(){
    if(!fAcct){setFErr("Select an account.");return;}
    if(!fAmt||parseFloat(fAmt)<=0){setFErr("Enter a valid disputed amount.");return;}
    if(!fMerch.trim()){setFErr("Enter the merchant name.");return;}
    if(!fDesc.trim()){setFErr("Describe the dispute.");return;}
    setFErr(""); setFBusy(true);
    const ref=await onOpen({userId:fUser,accountId:fAcct,transactionId:fTx||null,disputeType:fType,amount:parseFloat(fAmt),merchant:fMerch.trim(),description:fDesc.trim()});
    setFBusy(false);
    if(ref&&ref.startsWith("DSP-")){
      setFDone(ref);
      setFAcct(""); setFTx(""); setFAmt(""); setFMerch(""); setFDesc("");
      setTimeout(()=>{setFDone(null);setShowForm(false);},4000);
    } else {
      setFErr(ref||"Failed to open dispute.");
    }
  }

  async function act(id:string, fn:()=>Promise<string|null|void>){
    setBusy(id);
    await fn();
    setBusy(null);
    setExpanded(null);
  }

  const isResolved=(d:DisputeRow)=>d.status==="approved"||d.status==="denied";

  return(
    <div>
      {/* Header */}
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20,gap:12,flexWrap:"wrap"}}>
        <SectionHead title="Disputes & Chargebacks" sub="Open and manage customer dispute cases"/>
        <button onClick={()=>{setShowForm(v=>!v);setFDone(null);setFErr("");}} style={{display:"flex",alignItems:"center",gap:7,background:showForm?"rgba(17,24,39,.07)":RED,border:showForm?"1px solid rgba(17,24,39,.15)":"none",borderRadius:9,padding:"9px 18px",fontSize:13,fontWeight:600,color:showForm?DARK:"#fff",cursor:"pointer",fontFamily:"inherit",transition:"all .15s",flexShrink:0}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d={showForm?"M18 6 6 18M6 6l12 12":"M12 5v14M5 12h14"}/></svg>
          {showForm?"Cancel":"Open New Dispute"}
        </button>
      </div>

      {/* ── New dispute form ── */}
      {showForm&&(
        <div style={{...CARD,overflow:"hidden",marginBottom:24}}>
          <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(17,24,39,.07)"}}>
            <div style={{fontFamily:FONT,fontWeight:700,fontSize:15,color:DARK}}>New Dispute Case</div>
            <div style={{fontSize:12.5,color:GRAY,marginTop:3}}>Opens on behalf of the customer. Reference ID is auto-generated.</div>
          </div>
          {fDone?(
            <div style={{padding:"40px 24px",textAlign:"center"}}>
              <div style={{width:52,height:52,borderRadius:"50%",background:"rgba(22,163,74,.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",color:"#16A34A"}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <div style={{fontFamily:FONT,fontWeight:700,fontSize:17,color:DARK,marginBottom:6}}>Dispute opened</div>
              <div style={{fontSize:13,color:GRAY}}>Reference ID: <strong style={{fontFamily:"monospace",color:DARK}}>{fDone}</strong></div>
            </div>
          ):(
            <div style={{padding:"20px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div>
                <label style={LBL}>Customer</label>
                <select value={fUser} onChange={e=>{setFUser(e.target.value);setFAcct("");setFTx("");}} style={SEL}>
                  {users.map(u=><option key={u.id} value={u.id}>{u.firstName} {u.lastName} — {u.email}</option>)}
                </select>
              </div>
              <div>
                <label style={LBL}>Account</label>
                <select value={fAcct} onChange={e=>{setFAcct(e.target.value);setFTx("");}} style={SEL}>
                  <option value="">Select account…</option>
                  {userAccts.map(a=><option key={a.id} value={a.id}>{a.accountName} ••••{a.last4} ({usd(a.balance)})</option>)}
                </select>
              </div>
              <div>
                <label style={LBL}>Linked Transaction <span style={{fontWeight:400,color:GRAY}}>(optional)</span></label>
                <select value={fTx} onChange={e=>{setFTx(e.target.value);if(e.target.value){const t=acctTxs.find(t=>t.id===e.target.value);if(t){setFAmt(String(Math.abs(t.amount)));setFMerch(t.merchant);}}}} style={SEL}>
                  <option value="">No specific transaction</option>
                  {acctTxs.map(t=><option key={t.id} value={t.id}>{t.date} — {t.merchant} ({t.amount>0?"+":""}{usd(t.amount)})</option>)}
                </select>
              </div>
              <div>
                <label style={LBL}>Dispute Type</label>
                <select value={fType} onChange={e=>setFType(e.target.value)} style={SEL}>
                  {DISPUTE_TYPES.map(d=><option key={d.v} value={d.v}>{d.l}</option>)}
                </select>
              </div>
              <div>
                <label style={LBL}>Disputed Amount</label>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:GRAY,fontSize:14,pointerEvents:"none"}}>$</span>
                  <input type="number" min="0.01" step="0.01" placeholder="0.00" value={fAmt} onChange={e=>setFAmt(e.target.value)} style={{...INP,paddingLeft:24}}/>
                </div>
              </div>
              <div>
                <label style={LBL}>Merchant / Payee</label>
                <input type="text" placeholder="e.g. Amazon, Unknown Charge…" value={fMerch} onChange={e=>setFMerch(e.target.value)} style={INP}/>
              </div>
              <div style={{gridColumn:"1/-1"}}>
                <label style={LBL}>Description</label>
                <textarea rows={3} placeholder="Describe the dispute — what happened and why the customer is disputing this charge…" value={fDesc} onChange={e=>setFDesc(e.target.value)} style={{...INP,resize:"vertical",height:"auto"}}/>
              </div>
              {fErr&&<div style={{gridColumn:"1/-1",fontSize:13,color:"#DC2626",padding:"8px 12px",background:"rgba(220,38,38,.06)",borderRadius:7}}>{fErr}</div>}
              <div style={{gridColumn:"1/-1"}}>
                <button disabled={fBusy} onClick={submitOpen} style={{background:RED,border:"none",borderRadius:10,padding:"11px 32px",fontSize:14,fontWeight:700,color:"#fff",cursor:fBusy?"not-allowed":"pointer",fontFamily:FONT,opacity:fBusy?.7:1}}>
                  {fBusy?"Opening…":"Open Dispute"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:20}}>
        {([
          ["Open",             counts.open,             "#2563EB"],
          ["Under Review",     counts.under_review,     "#D97706"],
          ["More Info Needed", counts.more_info_needed, "#7C3AED"],
          ["Approved",         counts.approved,         "#16A34A"],
          ["Denied",           counts.denied,           "#DC2626"],
        ] as const).map(([label,count,color])=>(
          <div key={label} style={{...CARD,padding:"14px 16px",display:"flex",alignItems:"center",gap:10}}>
            <div style={{fontFamily:FONT,fontWeight:800,fontSize:22,color,lineHeight:1}}>{count}</div>
            <div style={{fontSize:11.5,color:GRAY,fontWeight:500,lineHeight:1.3}}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {FILTERS.map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{background:filter===f?"rgba(140,29,37,.09)":"rgba(17,24,39,.04)",color:filter===f?RED:GRAY,border:`1px solid ${filter===f?"rgba(140,29,37,.25)":"rgba(17,24,39,.1)"}`,borderRadius:7,padding:"5px 14px",fontSize:12.5,fontWeight:filter===f?700:400,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>
            {DISPUTE_STATUS_META[f]?.label??f.charAt(0).toUpperCase()+f.slice(1)} ({f==="all"?disputes.length:(counts[f as keyof typeof counts]??0)})
          </button>
        ))}
      </div>

      {/* Dispute list */}
      <div style={{...CARD,overflow:"hidden"}}>
        {shown.length===0
          ?<Empty msg={`No ${filter==="all"?"":DISPUTE_STATUS_META[filter]?.label.toLowerCase()||filter} disputes.`}/>
          :shown.map((d,i)=>{
            const user=users.find(u=>u.id===d.userId);
            const acct=accounts.find(a=>a.id===d.accountId);
            const isOpen=expanded===d.id;
            const isBusy=busy===d.id;
            const resolved=isResolved(d);
            const typeLabel=DISPUTE_TYPES.find(t=>t.v===d.disputeType)?.l||d.disputeType;

            return(
              <div key={d.id} style={{borderBottom:i<shown.length-1?"1px solid rgba(17,24,39,.06)":"none"}}>
                {/* Row */}
                <button onClick={()=>setExpanded(isOpen?null:d.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:14,padding:"16px 20px",background:isOpen?"rgba(17,24,39,.02)":"transparent",border:"none",cursor:"pointer",fontFamily:"inherit",textAlign:"left",transition:"background .12s",flexWrap:"wrap"}}>
                  {/* Icon */}
                  <div style={{width:38,height:38,borderRadius:10,background:"rgba(37,99,235,.07)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#2563EB"}}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4"/></svg>
                  </div>
                  {/* Info */}
                  <div style={{flex:1,minWidth:200}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                      <span style={{fontWeight:700,fontSize:13,color:DARK,fontFamily:"monospace",letterSpacing:".04em"}}>{d.referenceId}</span>
                      <DisputeStatusBadge status={d.status}/>
                    </div>
                    <div style={{fontWeight:500,fontSize:13.5,color:DARK,marginBottom:2}}>
                      {user?`${user.firstName} ${user.lastName}`:"Unknown"} — {d.merchant}
                    </div>
                    <div style={{fontSize:12,color:GRAY}}>
                      {typeLabel}
                      {acct&&<><span style={{margin:"0 5px"}}>·</span><span>••••{acct.last4}</span></>}
                      <span style={{margin:"0 5px"}}>·</span>
                      <span>{fmtDate(d.openedAt)}</span>
                    </div>
                  </div>
                  {/* Amount */}
                  <div style={{fontFamily:FONT,fontWeight:800,fontSize:18,color:DARK,flexShrink:0}}>{usd(d.amount)}</div>
                  {/* Chevron */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="2" style={{transform:isOpen?"rotate(90deg)":"none",transition:"transform .2s",flexShrink:0}}><path d="M9 18l6-6-6-6"/></svg>
                </button>

                {/* Expanded detail + actions */}
                {isOpen&&(
                  <div style={{background:"rgba(238,240,244,.5)",padding:"16px 20px",borderTop:"1px solid rgba(17,24,39,.05)"}}>
                    {/* Description */}
                    <div style={{...CARD,padding:"12px 16px",marginBottom:14}}>
                      <div style={{fontSize:11.5,fontWeight:700,letterSpacing:".08em",color:GRAY,textTransform:"uppercase",marginBottom:6}}>Customer Description</div>
                      <div style={{fontSize:13.5,color:MID,lineHeight:1.55}}>{d.description}</div>
                      {d.adminNotes&&(
                        <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(17,24,39,.06)"}}>
                          <div style={{fontSize:11.5,fontWeight:700,letterSpacing:".08em",color:GRAY,textTransform:"uppercase",marginBottom:4}}>Admin Notes</div>
                          <div style={{fontSize:13,color:MID,lineHeight:1.5,fontStyle:"italic"}}>{d.adminNotes}</div>
                        </div>
                      )}
                    </div>

                    {/* Actions — only show for unresolved disputes */}
                    {!resolved&&(
                      <div style={{display:"flex",gap:10,alignItems:"flex-start",flexWrap:"wrap"}}>
                        {/* Notes textarea */}
                        <textarea
                          rows={2}
                          placeholder="Admin notes (required for Deny / More Info)…"
                          value={notes[d.id]||""}
                          onChange={e=>setNotes(n=>({...n,[d.id]:e.target.value}))}
                          style={{...INP,resize:"vertical",height:"auto",flex:1,minWidth:200,fontSize:12.5}}
                        />
                        <div style={{display:"flex",gap:8,flexShrink:0,flexWrap:"wrap"}}>
                          {d.status==="open"&&(
                            <button disabled={isBusy} onClick={()=>act(d.id,()=>onReview(d.id))} style={{background:"rgba(234,179,8,.1)",border:"1px solid rgba(234,179,8,.3)",borderRadius:8,padding:"7px 14px",fontSize:12.5,fontWeight:600,color:"#854D0E",cursor:isBusy?"not-allowed":"pointer",fontFamily:"inherit",opacity:isBusy?.5:1}}>
                              {isBusy?"…":"Mark Under Review"}
                            </button>
                          )}
                          <button disabled={isBusy} onClick={()=>act(d.id,()=>onApprove(d.id,d.accountId,d.userId,d.amount,d.merchant,notes[d.id]||""))} style={{background:"rgba(22,163,74,.09)",border:"1px solid rgba(22,163,74,.25)",borderRadius:8,padding:"7px 14px",fontSize:12.5,fontWeight:600,color:"#16A34A",cursor:isBusy?"not-allowed":"pointer",fontFamily:"inherit",opacity:isBusy?.5:1}}>
                            {isBusy?"…":"✓ Approve & Credit"}
                          </button>
                          <button disabled={isBusy||!notes[d.id]?.trim()} onClick={()=>act(d.id,()=>onDeny(d.id,notes[d.id]||""))} style={{background:"rgba(220,38,38,.07)",border:"1px solid rgba(220,38,38,.2)",borderRadius:8,padding:"7px 14px",fontSize:12.5,fontWeight:600,color:"#DC2626",cursor:(isBusy||!notes[d.id]?.trim())?"not-allowed":"pointer",fontFamily:"inherit",opacity:(isBusy||!notes[d.id]?.trim())?.5:1}}>
                            {isBusy?"…":"✕ Deny"}
                          </button>
                          <button disabled={isBusy||!notes[d.id]?.trim()} onClick={()=>act(d.id,()=>onRequestInfo(d.id,notes[d.id]||""))} style={{background:"rgba(124,58,237,.07)",border:"1px solid rgba(124,58,237,.2)",borderRadius:8,padding:"7px 14px",fontSize:12.5,fontWeight:600,color:"#7C3AED",cursor:(isBusy||!notes[d.id]?.trim())?"not-allowed":"pointer",fontFamily:"inherit",opacity:(isBusy||!notes[d.id]?.trim())?.5:1}}>
                            {isBusy?"…":"? More Info"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Resolution summary for closed disputes */}
                    {resolved&&(
                      <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:d.status==="approved"?"rgba(22,163,74,.06)":"rgba(220,38,38,.05)",borderRadius:9,border:`1px solid ${d.status==="approved"?"rgba(22,163,74,.2)":"rgba(220,38,38,.15)"}`}}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={d.status==="approved"?"#16A34A":"#DC2626"} strokeWidth="2"><path d={d.status==="approved"?"M20 6 9 17l-5-5":"M18 6 6 18M6 6l12 12"}/></svg>
                        <span style={{fontSize:13,fontWeight:600,color:d.status==="approved"?"#16A34A":"#DC2626"}}>
                          {d.status==="approved"?`Approved — ${usd(d.amount)} credited to account`:"Denied — no credit issued"}
                        </span>
                        {d.resolvedAt&&<span style={{fontSize:12,color:GRAY,marginLeft:"auto"}}>{fmtDate(d.resolvedAt)}</span>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: FRAUD & RISK
═══════════════════════════════════════════════════════ */
const RULE_META:Record<string,{label:string;color:string;desc:string;severity:string}>={
  large_transaction: {label:"Large Transaction", color:"#DC2626", desc:"Single transaction ≥ $5,000",          severity:"HIGH"},
  round_amount:      {label:"Round Amount",       color:"#2563EB", desc:"Exact round amount — possible structuring", severity:"MEDIUM"},
  velocity_24h:      {label:"Velocity (24h)",     color:"#7C3AED", desc:"5+ transactions in 24 hours",          severity:"MEDIUM"},
  velocity_1h:       {label:"Velocity (1h)",      color:"#D97706", desc:"3+ transactions in 1 hour",            severity:"HIGH"},
};

function FraudTab({
  alerts, accounts, users, onDismiss, onFreeze, onScanComplete,
}:{
  alerts:FraudAlert[]; accounts:AcctRow[]; users:UserRow[];
  onDismiss:(alertId:string)=>Promise<void>;
  onFreeze:(alertId:string, acctId:string)=>Promise<void>;
  onScanComplete:(newAlerts:FraudAlert[])=>void;
}){
  const [filter, setFilter] = useState<"open"|"dismissed"|"actioned"|"all">("open");
  const [busy,   setBusy]   = useState<string|null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanMsg,  setScanMsg]  = useState<{text:string;ok:boolean}|null>(null);

  const counts={
    open:      alerts.filter(a=>a.status==="open").length,
    dismissed: alerts.filter(a=>a.status==="dismissed").length,
    actioned:  alerts.filter(a=>a.status==="actioned").length,
  };
  const shown = filter==="all" ? alerts : alerts.filter(a=>a.status===filter);

  async function scan(){
    setScanning(true); setScanMsg(null);
    try{
      const res=await fetch("/api/cpanel/fraud/scan",{method:"POST"});
      if(!res.ok) throw new Error("Scan failed");
      const json=await res.json() as {created:number; alerts:Record<string,unknown>[]};
      const mapped:FraudAlert[]=json.alerts.map(a=>({
        id:String(a.id), accountId:String(a.account_id), userId:String(a.user_id),
        transactionId:a.transaction_id?String(a.transaction_id):null,
        rule:String(a.rule), severity:String(a.severity||"medium"),
        details:(a.details as Record<string,unknown>)??{},
        status:String(a.status), createdAt:String(a.created_at),
      }));
      onScanComplete(mapped);
      setScanMsg({text:`Scan complete — ${json.created} new alert${json.created!==1?"s":""} found.`, ok:true});
    }catch{
      setScanMsg({text:"Scan failed — try again.", ok:false});
    }finally{
      setScanning(false);
    }
  }

  async function dismiss(alertId:string){
    setBusy(alertId+"d");
    await onDismiss(alertId);
    setBusy(null);
  }
  async function freeze(alertId:string, acctId:string){
    setBusy(alertId+"f");
    await onFreeze(alertId, acctId);
    setBusy(null);
  }

  const SEV_COLOR:Record<string,string>={HIGH:"#DC2626",MEDIUM:"#D97706",LOW:GRAY};

  return(
    <div>
      {/* Header + scan button */}
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20,gap:12,flexWrap:"wrap"}}>
        <SectionHead title="Fraud & Risk" sub="Automated rule-based detection — run a scan to check for new alerts"/>
        <button disabled={scanning} onClick={scan} style={{display:"flex",alignItems:"center",gap:7,background:scanning?"rgba(140,29,37,.5)":RED,border:"none",borderRadius:9,padding:"9px 18px",fontSize:13,fontWeight:600,color:"#fff",cursor:scanning?"not-allowed":"pointer",fontFamily:"inherit",transition:"all .15s",flexShrink:0}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={scanning?{animation:"spin .75s linear infinite"}:{}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          {scanning?"Scanning…":"Scan for Alerts"}
        </button>
      </div>

      {/* Scan result toast */}
      {scanMsg&&(
        <div style={{...CARD,padding:"10px 16px",marginBottom:16,fontSize:13,color:scanMsg.ok?"#16A34A":"#DC2626",display:"flex",alignItems:"center",gap:8}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d={scanMsg.ok?"M20 6 9 17l-5-5":"M18 6 6 18M6 6l12 12"}/></svg>
          {scanMsg.text}
        </div>
      )}

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
        {([["Open Alerts",counts.open,"#DC2626"],["Dismissed",counts.dismissed,GRAY],["Actioned (Frozen)",counts.actioned,"#16A34A"]] as const).map(([label,count,color])=>(
          <div key={label} style={{...CARD,padding:"16px 20px",display:"flex",alignItems:"center",gap:14}}>
            <div style={{fontFamily:FONT,fontWeight:800,fontSize:28,color,lineHeight:1}}>{count}</div>
            <div style={{fontSize:12.5,color:GRAY,fontWeight:500,lineHeight:1.3}}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {(["open","dismissed","actioned","all"] as const).map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{background:filter===f?"rgba(140,29,37,.09)":"rgba(17,24,39,.04)",color:filter===f?RED:GRAY,border:`1px solid ${filter===f?"rgba(140,29,37,.25)":"rgba(17,24,39,.1)"}`,borderRadius:7,padding:"5px 14px",fontSize:12.5,fontWeight:filter===f?700:400,cursor:"pointer",fontFamily:"inherit",textTransform:"capitalize",transition:"all .15s"}}>
            {f} ({f==="all"?alerts.length:counts[f as keyof typeof counts]??0})
          </button>
        ))}
      </div>

      {/* Rules legend */}
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {Object.entries(RULE_META).map(([key,meta])=>(
          <div key={key} style={{display:"flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:99,background:meta.color+"12",border:`1px solid ${meta.color}30`}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:meta.color,flexShrink:0}}/>
            <span style={{fontSize:11.5,fontWeight:600,color:meta.color}}>{meta.label}</span>
            <span style={{fontSize:11,color:GRAY,marginLeft:2}}>— {meta.desc}</span>
          </div>
        ))}
      </div>

      {/* Alert list */}
      <div style={{...CARD,overflow:"hidden"}}>
        {shown.length===0
          ?<Empty msg={filter==="open"?"No open alerts — run a scan to check for new activity.":`No ${filter} alerts.`}/>
          :shown.map((alert,i)=>{
            const meta=RULE_META[alert.rule]??{label:alert.rule,color:GRAY,desc:"",severity:"LOW"};
            const acct=accounts.find(a=>a.id===alert.accountId);
            const user=users.find(u=>u.id===alert.userId);
            const amt=typeof alert.details.amount==="number"?alert.details.amount:null;
            const isBusyD=busy===alert.id+"d";
            const isBusyF=busy===alert.id+"f";
            const isBusy=isBusyD||isBusyF;

            return(
              <div key={alert.id} style={{padding:"16px 20px",borderBottom:i<shown.length-1?"1px solid rgba(17,24,39,.05)":"none",background:alert.status==="open"?"#fff":"rgba(17,24,39,.01)"}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:14,flexWrap:"wrap"}}>

                  {/* Icon */}
                  <div style={{width:40,height:40,borderRadius:10,background:meta.color+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:meta.color}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/></svg>
                  </div>

                  <div style={{flex:1,minWidth:200}}>
                    {/* Rule badge + severity */}
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,flexWrap:"wrap"}}>
                      <span style={{fontSize:11.5,fontWeight:700,padding:"2px 9px",borderRadius:99,background:meta.color+"15",color:meta.color,letterSpacing:".04em"}}>{meta.label}</span>
                      <span style={{fontSize:10.5,fontWeight:700,padding:"1px 6px",borderRadius:5,background:SEV_COLOR[meta.severity]+"18",color:SEV_COLOR[meta.severity],letterSpacing:".06em"}}>{meta.severity}</span>
                      <span style={{fontSize:12,color:GRAY}}>{meta.desc}</span>
                    </div>

                    {/* User + account */}
                    <div style={{fontWeight:600,fontSize:13.5,color:DARK,marginBottom:3}}>
                      {user?`${user.firstName} ${user.lastName}`:"Unknown User"}
                    </div>
                    <div style={{fontSize:12,color:GRAY,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                      {acct&&<span style={{fontFamily:"monospace",letterSpacing:".06em"}}>••••{acct.last4}</span>}
                      {acct&&<span style={{color:"rgba(17,24,39,.2)"}}>·</span>}
                      {acct&&<span>{acct.accountName}</span>}
                      {amt!==null&&<><span style={{color:"rgba(17,24,39,.2)"}}>·</span><span style={{fontWeight:700,fontFamily:FONT,color:amt<0?"#DC2626":"#16A34A"}}>{amt>0?"+":"-"}{usd(amt)}</span></>}
                      <span style={{color:"rgba(17,24,39,.2)"}}>·</span>
                      <span>{relTime(alert.createdAt)}</span>
                    </div>

                    {/* Velocity details */}
                    {(alert.rule==="velocity_1h"||alert.rule==="velocity_24h")&&(
                      <div style={{marginTop:6,fontSize:12,color:MID,padding:"4px 10px",background:"rgba(17,24,39,.04)",borderRadius:6,display:"inline-block"}}>
                        {alert.details.count as number} transactions in the last {alert.details.window as string}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0,flexWrap:"wrap"}}>
                    {alert.status==="open"&&(
                      <>
                        <button disabled={isBusy} onClick={()=>dismiss(alert.id)} style={{background:"rgba(17,24,39,.05)",border:"1px solid rgba(17,24,39,.12)",borderRadius:8,padding:"6px 14px",fontSize:12.5,fontWeight:600,color:GRAY,cursor:isBusy?"not-allowed":"pointer",fontFamily:"inherit",opacity:isBusy?.5:1,transition:"all .15s"}}>
                          {isBusyD?"…":"Dismiss"}
                        </button>
                        {acct&&acct.status!=="frozen"&&(
                          <button disabled={isBusy} onClick={()=>freeze(alert.id,alert.accountId)} style={{display:"flex",alignItems:"center",gap:6,background:"rgba(220,38,38,.07)",border:"1px solid rgba(220,38,38,.2)",borderRadius:8,padding:"6px 14px",fontSize:12.5,fontWeight:600,color:"#DC2626",cursor:isBusy?"not-allowed":"pointer",fontFamily:"inherit",opacity:isBusy?.5:1,transition:"all .15s"}}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            {isBusyF?"…":"Freeze Account"}
                          </button>
                        )}
                        {acct&&acct.status==="frozen"&&(
                          <span style={{fontSize:12,color:"#DC2626",fontWeight:600,padding:"6px 10px",background:"rgba(220,38,38,.07)",borderRadius:8}}>Already frozen</span>
                        )}
                      </>
                    )}
                    {alert.status==="dismissed"&&(
                      <span style={{fontSize:11.5,color:GRAY,fontWeight:600,padding:"4px 10px",background:"rgba(107,114,128,.08)",borderRadius:8}}>Dismissed</span>
                    )}
                    {alert.status==="actioned"&&(
                      <span style={{fontSize:11.5,color:"#DC2626",fontWeight:600,padding:"4px 10px",background:"rgba(220,38,38,.07)",borderRadius:8,display:"flex",alignItems:"center",gap:5}}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        Account Frozen
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════════════ */
const CP_NAV=[
  {id:"Overview",      label:"Overview",       icon:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"},
  {id:"Users",         label:"Users",          icon:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"},
  {id:"Transactions",  label:"Transactions",   icon:"M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4"},
  {id:"KYC",           label:"KYC",            icon:"M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z"},
  {id:"Fraud",         label:"Fraud & Risk",   icon:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"},
  {id:"Statements",    label:"Statements",     icon:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8"},
  {id:"Audit",         label:"Audit Log",      icon:"M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2M12 12h.01M12 16h.01"},
  {id:"Reports",       label:"Reports",        icon:"M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2v14a2 2 0 0 0-2 2h-2a2 2 0 0 0-2-2z"},
  {id:"Rates",         label:"Rates & Fees",   icon:"M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6v6l4 2"},
  {id:"Compliance",    label:"Compliance",     icon:"M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z"},
  {id:"Disputes",      label:"Disputes",       icon:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4"},
  {id:"Applications",  label:"Applications",   icon:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8"},
  {id:"Notifications", label:"Notifications",  icon:"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"},
];

/* ═══════════════════════════════════════════════════════
   TAB: TRANSACTIONS
═══════════════════════════════════════════════════════ */
function TransactionsTab({
  users,accounts,pendingTxs,
  onApprove,onReject,onManual,
}:{
  users:UserRow[];accounts:AcctRow[];pendingTxs:PendingTx[];
  onApprove:(tx:PendingTx,date:string)=>Promise<void>;
  onReject:(txId:string)=>Promise<void>;
  onManual:(d:{accountId:string;userId:string;amount:number;merchant:string;category:string;date:string})=>Promise<string|null>;
}){
  const [dates,setDates]=useState<Record<string,string>>({});
  const [busy,setBusy]=useState<string|null>(null);
  const [selUser,setSelUser]=useState(users[0]?.id||"");
  const [selAcct,setSelAcct]=useState("");
  const [isCredit,setIsCredit]=useState(true);
  const [amount,setAmount]=useState(""); const [merchant,setMerchant]=useState(""); const [category,setCategory]=useState("Income");
  const [date,setDate]=useState(new Date().toISOString().split("T")[0]);
  const [manErr,setManErr]=useState(""); const [manDone,setManDone]=useState(false); const [manBusy,setManBusy]=useState(false);
  const userAccts=accounts.filter(a=>a.userId===selUser);
  const CATS=["Income","Transfer","Groceries","Dining","Shopping","Auto & Gas","Entertainment","Housing","Bill Payment","Deposit","Withdrawal","Fee","Other"];

  async function approve(tx:PendingTx){
    setBusy(tx.id);
    await onApprove(tx, dates[tx.id]??tx.postedAt.split("T")[0]);
    setBusy(null);
  }
  async function reject(txId:string){
    setBusy(txId);
    await onReject(txId);
    setBusy(null);
  }
  async function submitManual(){
    if(!selAcct){setManErr("Select an account.");return;}
    if(!amount||parseFloat(amount)<=0){setManErr("Enter a valid amount.");return;}
    if(!merchant.trim()){setManErr("Enter a description.");return;}
    setManErr("");setManBusy(true);
    const finalAmount=isCredit?parseFloat(amount):-parseFloat(amount);
    const err=await onManual({accountId:selAcct,userId:selUser,amount:finalAmount,merchant:merchant.trim(),category,date});
    setManBusy(false);
    if(err){setManErr(err);return;}
    setManDone(true); setAmount(""); setMerchant("");
    setTimeout(()=>setManDone(false),3500);
  }

  return(
    <div>
      <SectionHead title="Transactions" sub="Approve pending requests and post manual credits or debits"/>

      {/* ── Pending queue ── */}
      <div style={{...CARD,overflow:"hidden",marginBottom:24}}>
        <div style={{padding:"14px 20px",borderBottom:"1px solid rgba(17,24,39,.07)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontFamily:FONT,fontWeight:700,fontSize:15,color:DARK}}>Pending Approvals</div>
          <span style={{fontSize:12.5,fontWeight:700,padding:"2px 10px",borderRadius:99,background:pendingTxs.length>0?"rgba(217,119,6,.1)":"rgba(17,24,39,.06)",color:pendingTxs.length>0?"#D97706":GRAY}}>{pendingTxs.length} pending</span>
        </div>
        {pendingTxs.length===0
          ?<Empty msg="No pending transactions — all caught up."/>
          :pendingTxs.map((tx,i)=>{
              const credit=tx.amount>0;
              const isBusy=busy===tx.id;
              return(
                <div key={tx.id} style={{padding:"16px 20px",borderBottom:i<pendingTxs.length-1?"1px solid rgba(17,24,39,.05)":"none"}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:16,flexWrap:"wrap"}}>
                    <div style={{flex:1,minWidth:200}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                        <span style={{fontWeight:600,fontSize:13.5,color:DARK}}>{tx.userName}</span>
                        <span style={{fontSize:11,color:GRAY,fontFamily:"monospace"}}>••••{tx.accountLast4}</span>
                        <span style={{fontSize:11.5,background:"rgba(17,24,39,.06)",padding:"1px 7px",borderRadius:5,color:MID,textTransform:"capitalize"}}>{tx.transactionType}</span>
                      </div>
                      <div style={{fontSize:13,color:MID,marginBottom:3}}>{tx.merchant}</div>
                      <div style={{fontSize:12,color:GRAY}}>{tx.accountName} · Submitted {relTime(tx.submittedAt)}</div>
                      {tx.memo&&<div style={{fontSize:12,color:GRAY,marginTop:2,fontStyle:"italic"}}>"{tx.memo}"</div>}
                      {tx.extDetails&&(
                        <div style={{marginTop:8,background:"rgba(37,99,235,.04)",border:"1px solid rgba(37,99,235,.15)",borderRadius:8,padding:"9px 12px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4px 16px"}}>
                          <div style={{gridColumn:"1/-1",fontSize:11.5,fontWeight:700,color:"#1D4ED8",letterSpacing:".05em",marginBottom:4}}>EXTERNAL WIRE DETAILS</div>
                          {[["Bank",tx.extDetails.bankName||"—"],["Holder",tx.extDetails.holderName],["Routing #",tx.extDetails.routingNumber],["Account #",tx.extDetails.accountNumber],["Acct Type",tx.extDetails.accountType]].map(([label,val])=>(
                            <div key={label} style={{display:"flex",gap:5,alignItems:"baseline"}}>
                              <span style={{fontSize:11,color:GRAY,fontWeight:600,minWidth:60}}>{label}</span>
                              <span style={{fontSize:12.5,color:DARK,fontFamily:["Routing #","Account #"].includes(label)?"monospace":"inherit",fontWeight:500}}>{val}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontFamily:FONT,fontWeight:800,fontSize:20,color:credit?"#16A34A":"#DC2626"}}>{credit?"+":"-"}{usd(tx.amount)}</div>
                      <div style={{fontSize:11.5,color:GRAY,marginTop:2}}>{credit?"Credit":"Debit"}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginTop:12,flexWrap:"wrap"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:220}}>
                      <label style={{...LBL,marginBottom:0,whiteSpace:"nowrap",fontSize:12}}>Post date:</label>
                      <input type="date" value={dates[tx.id]??tx.postedAt.split("T")[0]} onChange={e=>setDates(d=>({...d,[tx.id]:e.target.value}))} style={{...INP,width:"auto",flex:1,fontSize:13}}/>
                    </div>
                    <div style={{display:"flex",gap:8,flexShrink:0}}>
                      <button disabled={isBusy} onClick={()=>approve(tx)} style={{background:"rgba(22,163,74,.09)",border:"1px solid rgba(22,163,74,.25)",borderRadius:8,padding:"7px 18px",fontSize:13,fontWeight:600,color:"#16A34A",cursor:isBusy?"not-allowed":"pointer",fontFamily:"inherit",opacity:isBusy?.5:1,transition:"all .15s"}}>{isBusy?"…":"✓ Approve"}</button>
                      <button disabled={isBusy} onClick={()=>reject(tx.id)} style={{background:"rgba(220,38,38,.07)",border:"1px solid rgba(220,38,38,.2)",borderRadius:8,padding:"7px 18px",fontSize:13,fontWeight:600,color:"#DC2626",cursor:isBusy?"not-allowed":"pointer",fontFamily:"inherit",opacity:isBusy?.5:1,transition:"all .15s"}}>{isBusy?"…":"✕ Reject"}</button>
                    </div>
                  </div>
                </div>
              );
            })
        }
      </div>

      {/* ── Manual credit / debit ── */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:20,alignItems:"flex-start"}}>
        <div style={{...CARD,overflow:"hidden"}}>
          <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(17,24,39,.07)"}}>
            <div style={{fontFamily:FONT,fontWeight:700,fontSize:15,color:DARK}}>Manual Credit / Debit</div>
            <div style={{fontSize:12.5,color:GRAY,marginTop:3}}>Post a transaction directly — no approval queue, posts immediately and updates the balance.</div>
          </div>
          {manDone?(
            <div style={{padding:"40px 24px",textAlign:"center"}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:"rgba(22,163,74,.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",color:"#16A34A"}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <div style={{fontFamily:FONT,fontWeight:700,fontSize:16,color:DARK}}>Transaction Posted</div>
              <div style={{fontSize:13,color:GRAY,marginTop:6}}>Balance updated — user will see it on next refresh.</div>
            </div>
          ):(
            <div style={{padding:"20px"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                <div><label style={LBL}>User</label><select value={selUser} onChange={e=>{setSelUser(e.target.value);setSelAcct("");}} style={SEL}>{users.map(u=><option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)}</select></div>
                <div><label style={LBL}>Account</label><select value={selAcct} onChange={e=>setSelAcct(e.target.value)} style={SEL}><option value="">Select account…</option>{userAccts.map(a=>{const isCC=a.accountType==="credit_card";const info=isCC?`owed: ${usd(a.balance)} · avail: ${usd(a.creditLimit+a.balance)}`:`bal: ${usd(a.balance)}`;return <option key={a.id} value={a.id}>{a.accountName} ••••{a.last4} ({info})</option>;})}</select></div>
              </div>
              <div style={{marginBottom:14}}>
                <label style={LBL}>Type</label>
                <div style={{display:"flex",gap:8}}>
                  {[true,false].map(c=>(
                    <button key={String(c)} onClick={()=>setIsCredit(c)} style={{flex:1,padding:"9px 0",borderRadius:8,border:`1px solid ${isCredit===c?(c?"rgba(22,163,74,.35)":"rgba(220,38,38,.35)"):"rgba(17,24,39,.12)"}`,background:isCredit===c?(c?"rgba(22,163,74,.08)":"rgba(220,38,38,.07)"):"transparent",fontSize:13,fontWeight:isCredit===c?700:400,color:isCredit===c?(c?"#16A34A":"#DC2626"):GRAY,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>
                      {c?"+ Credit":"− Debit"}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                <div>
                  <label style={LBL}>Amount</label>
                  <div style={{position:"relative"}}>
                    <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:GRAY,fontSize:14,pointerEvents:"none"}}>$</span>
                    <input type="number" min="0.01" step="0.01" placeholder="0.00" value={amount} onChange={e=>setAmount(e.target.value)} style={{...INP,paddingLeft:24}}/>
                  </div>
                </div>
                <div><label style={LBL}>Post Date</label><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={INP}/></div>
              </div>
              <div style={{marginBottom:14}}><label style={LBL}>Description / Merchant</label><input type="text" placeholder="e.g. Payroll Deposit, Wire Transfer, Fee…" value={merchant} onChange={e=>setMerchant(e.target.value)} style={INP}/></div>
              <div style={{marginBottom:18}}><label style={LBL}>Category</label><select value={category} onChange={e=>setCategory(e.target.value)} style={SEL}>{CATS.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
              {manErr&&<div style={{fontSize:13,color:"#DC2626",marginBottom:12,padding:"8px 12px",background:"rgba(220,38,38,.06)",borderRadius:7}}>{manErr}</div>}
              <button disabled={manBusy} onClick={submitManual} style={{width:"100%",background:isCredit?"#16A34A":"#DC2626",border:"none",borderRadius:10,padding:"12px 0",fontSize:14,fontWeight:700,color:"#fff",cursor:manBusy?"not-allowed":"pointer",fontFamily:FONT,opacity:manBusy?.7:1}}>
                {manBusy?"Posting…":isCredit?"Post Credit":"Post Debit"}
              </button>
            </div>
          )}
        </div>

        <div style={{...CARD,padding:"18px 20px"}}>
          <div style={{fontFamily:FONT,fontWeight:700,fontSize:14,color:DARK,marginBottom:14}}>How it works</div>
          {[
            {icon:"M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",title:"Pending queue",desc:"User-submitted transfers, deposits, and bill pays wait here until you approve or reject them."},
            {icon:"M12 5v14M5 12h14",title:"Manual post",desc:"Credit or debit any account directly. Instant — bypasses the approval queue. Use for wire transfers, corrections, or fees."},
            {icon:"M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4",title:"Backdate",desc:"Set any post date when approving or posting manually. The account balance updates immediately."},
          ].map(i=>(
            <div key={i.title} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:14}}>
              <div style={{width:30,height:30,borderRadius:7,background:"rgba(140,29,37,.07)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:RED}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={i.icon}/></svg>
              </div>
              <div>
                <div style={{fontSize:12.5,fontWeight:600,color:DARK}}>{i.title}</div>
                <div style={{fontSize:12,color:GRAY,marginTop:2,lineHeight:1.4}}>{i.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: KYC
═══════════════════════════════════════════════════════ */
function KYCTab({users,onUpdate}:{users:UserRow[];onUpdate:(userId:string,status:string)=>Promise<void>}){
  const [search,setSearch]=useState(""); const [filter,setFilter]=useState<"all"|"pending"|"verified"|"rejected">("all"); const [busy,setBusy]=useState<string|null>(null);
  const filtered=users.filter(u=>{
    const q=search.toLowerCase();
    const ms=!q||u.firstName.toLowerCase().includes(q)||u.lastName.toLowerCase().includes(q)||u.email.toLowerCase().includes(q);
    const mf=filter==="all"||(u.kycStatus||"pending")===filter;
    return ms&&mf;
  });
  async function update(userId:string,status:string){
    setBusy(userId+status);
    await onUpdate(userId,status);
    setBusy(null);
  }
  const counts={pending:users.filter(u=>(u.kycStatus||"pending")==="pending").length,verified:users.filter(u=>u.kycStatus==="verified").length,rejected:users.filter(u=>u.kycStatus==="rejected").length};
  return(
    <div>
      <SectionHead title="KYC Verification" sub="Review and approve customer identity verification"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
        {([["Pending","#D97706"],["Verified","#16A34A"],["Rejected","#DC2626"]] as const).map(([label,color])=>(
          <div key={label} style={{...CARD,padding:"14px 18px",display:"flex",alignItems:"center",gap:12}}>
            <div style={{fontFamily:FONT,fontWeight:800,fontSize:24,color}}>{counts[label.toLowerCase() as keyof typeof counts]}</div>
            <div style={{fontSize:12.5,color:GRAY,fontWeight:500}}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        {(["all","pending","verified","rejected"] as const).map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{background:filter===f?"rgba(140,29,37,.09)":"rgba(17,24,39,.04)",color:filter===f?RED:GRAY,border:`1px solid ${filter===f?"rgba(140,29,37,.25)":"rgba(17,24,39,.1)"}`,borderRadius:7,padding:"5px 14px",fontSize:12.5,fontWeight:filter===f?700:400,cursor:"pointer",fontFamily:"inherit",textTransform:"capitalize",transition:"all .15s"}}>{f}</button>
        ))}
        <div style={{flex:1,minWidth:180,position:"relative"}}>
          <svg style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="2"><path d="M21 21l-6-6M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"/></svg>
          <input type="text" placeholder="Search users…" value={search} onChange={e=>setSearch(e.target.value)} style={{...INP,paddingLeft:30,fontSize:13}}/>
        </div>
      </div>
      <div style={{...CARD,overflow:"hidden"}}>
        {filtered.length===0?<Empty msg="No users match."/>:filtered.map((u,i)=>{
          const status=u.kycStatus||"pending";
          return(
            <div key={u.id} style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:12,padding:"14px 20px",borderBottom:i<filtered.length-1?"1px solid rgba(17,24,39,.06)":"none"}}>
              <div style={{width:38,height:38,borderRadius:"50%",background:RED,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONT,fontWeight:700,fontSize:13,color:"#fff",flexShrink:0}}>{(u.firstName[0]||"?")+""+(u.lastName[0]||"?")}</div>
              <div style={{flex:1,minWidth:180}}>
                <div style={{fontWeight:600,fontSize:13.5,color:DARK}}>{u.firstName} {u.lastName}</div>
                <div style={{fontSize:12,color:GRAY,marginTop:2}}>{u.email}</div>
                <div style={{fontSize:12,color:GRAY,marginTop:1}}>Member since {u.memberSince||"—"} · {u.accountCount} account{u.accountCount!==1?"s":""}</div>
              </div>
              <Badge status={status}/>
              <div style={{display:"flex",gap:6,flexShrink:0}}>
                {status!=="verified"&&<button disabled={!!busy} onClick={()=>update(u.id,"verified")} style={{background:"rgba(22,163,74,.09)",border:"1px solid rgba(22,163,74,.25)",borderRadius:8,padding:"6px 14px",fontSize:12.5,fontWeight:600,color:"#16A34A",cursor:busy?"not-allowed":"pointer",fontFamily:"inherit",opacity:busy===u.id+"verified"?.5:1,transition:"all .15s"}}>{busy===u.id+"verified"?"…":"✓ Verify"}</button>}
                {status!=="rejected"&&<button disabled={!!busy} onClick={()=>update(u.id,"rejected")} style={{background:"rgba(220,38,38,.07)",border:"1px solid rgba(220,38,38,.2)",borderRadius:8,padding:"6px 14px",fontSize:12.5,fontWeight:600,color:"#DC2626",cursor:busy?"not-allowed":"pointer",fontFamily:"inherit",opacity:busy===u.id+"rejected"?.5:1,transition:"all .15s"}}>{busy===u.id+"rejected"?"…":"✕ Reject"}</button>}
                {status!=="pending"&&<button disabled={!!busy} onClick={()=>update(u.id,"pending")} style={{background:"rgba(17,24,39,.05)",border:"1px solid rgba(17,24,39,.12)",borderRadius:8,padding:"6px 14px",fontSize:12.5,fontWeight:600,color:GRAY,cursor:busy?"not-allowed":"pointer",fontFamily:"inherit",opacity:busy===u.id+"pending"?.5:1,transition:"all .15s"}}>{busy===u.id+"pending"?"…":"Reset"}</button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: COMPLIANCE (SAR / CTR / OFAC)
═══════════════════════════════════════════════════════ */
const COMPLIANCE_STATUS:Record<string,{label:string;bg:string;text:string}>={
  draft:     {label:"Draft",         bg:"rgba(107,114,128,.1)",  text:GRAY},
  filed:     {label:"Filed",         bg:"rgba(37,99,235,.1)",    text:"#2563EB"},
  submitted: {label:"Submitted",     bg:"rgba(22,163,74,.1)",    text:"#16A34A"},
  closed:    {label:"Closed",        bg:"rgba(17,24,39,.06)",    text:MID},
};
const OFAC_STATUS:Record<string,{label:string;bg:string;text:string}>={
  clear:            {label:"Clear",            bg:"rgba(22,163,74,.1)",    text:"#16A34A"},
  potential_match:  {label:"Potential Match",  bg:"rgba(217,119,6,.12)",   text:"#854D0E"},
  confirmed_match:  {label:"Confirmed Match",  bg:"rgba(220,38,38,.1)",    text:"#DC2626"},
  false_positive:   {label:"False Positive",   bg:"rgba(107,114,128,.1)",  text:GRAY},
};

function ComplianceTab({reports,screenings,users,accounts,txs,onFileSAR,onFileCTR,onUpdateStatus,onOfacScreen,onUpdateScreening}:{
  reports:ComplianceReport[]; screenings:OfacScreening[];
  users:UserRow[]; accounts:AcctRow[]; txs:TxRow[];
  onFileSAR:(d:{userId:string;accountId:string;transactionId:string;subjectName:string;amount:string;description:string})=>Promise<string|null>;
  onFileCTR:(d:{userId:string;accountId:string;transactionId:string;subjectName:string;amount:string;description:string})=>Promise<string|null>;
  onUpdateStatus:(reportId:string,status:string)=>Promise<string|null>;
  onOfacScreen:(userId:string,name:string)=>Promise<OfacScreening|null>;
  onUpdateScreening:(screeningId:string,status:string)=>Promise<string|null>;
}){
  const [subTab, setSubTab] = useState<"SAR"|"CTR"|"OFAC">("SAR");

  /* CTR scan */
  const [ctrEligible, setCtrEligible] = useState<Record<string,unknown>[]>([]);
  const [scanning,    setScanning]    = useState(false);
  const [scanMsg,     setScanMsg]     = useState<{text:string;ok:boolean}|null>(null);

  /* SAR form */
  const [sarOpen,    setSarOpen]    = useState(false);
  const [sarUser,    setSarUser]    = useState(users[0]?.id||"");
  const [sarAcct,    setSarAcct]    = useState("");
  const [sarTx,      setSarTx]      = useState("");
  const [sarName,    setSarName]    = useState("");
  const [sarAmt,     setSarAmt]     = useState("");
  const [sarDesc,    setSarDesc]    = useState("");
  const [sarBusy,    setSarBusy]    = useState(false);
  const [sarErr,     setSarErr]     = useState("");
  const [sarDone,    setSarDone]    = useState<string|null>(null);

  /* CTR form */
  const [ctrTxId,    setCtrTxId]    = useState<string|null>(null); // which eligible tx to file
  const [ctrName,    setCtrName]    = useState("");
  const [ctrDesc,    setCtrDesc]    = useState("");
  const [ctrBusy,    setCtrBusy]    = useState(false);
  const [ctrErr,     setCtrErr]     = useState("");
  const [ctrDone,    setCtrDone]    = useState<string|null>(null);

  /* OFAC screen form */
  const [ofacUser,   setOfacUser]   = useState(users[0]?.id||"");
  const [ofacName,   setOfacName]   = useState("");
  const [ofacBusy,   setOfacBusy]   = useState(false);
  const [ofacErr,    setOfacErr]    = useState("");
  const [ofacResult, setOfacResult] = useState<OfacScreening|null>(null);
  const [statusBusy, setStatusBusy] = useState<string|null>(null);

  const sars = reports.filter(r=>r.reportType==="SAR");
  const ctrs = reports.filter(r=>r.reportType==="CTR");
  const pendingOfac = screenings.filter(s=>s.status==="potential_match").length;

  const sarUserAccts = accounts.filter(a=>a.userId===sarUser);
  const sarAcctTxs   = txs.filter(t=>t.accountId===sarAcct).slice(0,30);

  async function runCtrScan(){
    setScanning(true); setScanMsg(null);
    try{
      const res=await fetch("/api/cpanel/compliance/ctr-scan");
      const json=await res.json() as {eligible:Record<string,unknown>[];count:number};
      setCtrEligible(json.eligible??[]);
      setScanMsg({text:`Found ${json.count} transaction${json.count!==1?"s":""} ≥ $10,000 without a CTR.`, ok:true});
    }catch{setScanMsg({text:"Scan failed — try again.",ok:false});}
    finally{setScanning(false);}
  }

  async function submitSAR(){
    if(!sarName.trim()){setSarErr("Subject name is required.");return;}
    if(!sarDesc.trim()){setSarErr("Description is required.");return;}
    setSarErr(""); setSarBusy(true);
    const ref=await onFileSAR({userId:sarUser,accountId:sarAcct,transactionId:sarTx,subjectName:sarName,amount:sarAmt,description:sarDesc});
    setSarBusy(false);
    if(ref&&ref.startsWith("SAR-")){
      setSarDone(ref);
      setSarName(""); setSarAmt(""); setSarDesc(""); setSarAcct(""); setSarTx("");
      setTimeout(()=>{setSarDone(null);setSarOpen(false);},4000);
    } else setSarErr(ref||"Failed to file SAR.");
  }

  async function submitCTR(eligTx:Record<string,unknown>){
    if(!ctrName.trim()){setCtrErr("Subject name is required.");return;}
    if(!ctrDesc.trim()){setCtrDesc(""); setCtrErr("Description is required.");return;}
    setCtrErr(""); setCtrBusy(true);
    const user=users.find(u=>u.id===eligTx.user_id);
    const ref=await onFileCTR({userId:String(eligTx.user_id||""),accountId:String(eligTx.account_id||""),transactionId:String(eligTx.id||""),subjectName:ctrName||`${user?.firstName||""} ${user?.lastName||""}`.trim(),amount:String(Math.abs(Number(eligTx.amount))),description:ctrDesc||`Cash transaction of ${usd(Math.abs(Number(eligTx.amount)))}`});
    setCtrBusy(false);
    if(ref&&ref.startsWith("CTR-")){
      setCtrDone(ref);
      setCtrEligible(prev=>prev.filter(t=>t.id!==eligTx.id));
      setCtrTxId(null); setCtrName(""); setCtrDesc("");
      setTimeout(()=>setCtrDone(null),4000);
    } else setCtrErr(ref||"Failed to file CTR.");
  }

  async function runOfacScreen(){
    const name=ofacName.trim()||(()=>{const u=users.find(u=>u.id===ofacUser);return u?`${u.firstName} ${u.lastName}`.trim():"";})();
    if(!name){setOfacErr("Enter a name or select a customer.");return;}
    setOfacErr(""); setOfacBusy(true); setOfacResult(null);
    const result=await onOfacScreen(ofacUser,name);
    setOfacBusy(false);
    if(result) setOfacResult(result);
    else setOfacErr("Screening failed — try again.");
  }

  async function reviewScreening(id:string, status:string){
    setStatusBusy(id);
    await onUpdateScreening(id,status);
    setStatusBusy(null);
  }

  async function updateReportStatus(id:string, status:string){
    setStatusBusy(id);
    await onUpdateStatus(id,status);
    setStatusBusy(null);
  }

  function ComplianceBadge({status,type}:{status:string;type:"report"|"ofac"}){
    const meta=(type==="report"?COMPLIANCE_STATUS:OFAC_STATUS)[status]??{label:status,bg:"rgba(107,114,128,.1)",text:GRAY};
    return <span style={{fontSize:11.5,fontWeight:700,padding:"2px 8px",borderRadius:99,background:meta.bg,color:meta.text,letterSpacing:".04em",whiteSpace:"nowrap"}}>{meta.label}</span>;
  }

  const STATUS_FLOW:Record<string,string[]>={
    draft:["filed","closed"], filed:["submitted","closed"], submitted:["closed"],
  };

  return(
    <div>
      <SectionHead title="Compliance" sub="SAR, CTR filings and OFAC/sanctions screening"/>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14,marginBottom:24}}>
        <StatCard label="Total SARs"        value={String(sars.length)}    sub={`${sars.filter(r=>r.status==="draft").length} draft`}          color="#DC2626" icon="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6"/>
        <StatCard label="Total CTRs"        value={String(ctrs.length)}    sub={`${ctrs.filter(r=>r.status==="submitted").length} submitted`}   color="#D97706" icon="M21 12a9 9 0 1 1-6.219-8.56"/>
        <StatCard label="OFAC Screenings"   value={String(screenings.length)} sub={`${pendingOfac} potential match${pendingOfac!==1?"es":""}`} color={pendingOfac>0?"#DC2626":"#7C3AED"} icon="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <StatCard label="Unfiled Large Txs" value={String(ctrEligible.length)} sub="scan to detect ≥ $10,000"                                  color={ctrEligible.length>0?"#D97706":GRAY} icon="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/>
      </div>

      {/* Sub-tabs */}
      <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
        {(["SAR","CTR","OFAC"] as const).map(t=>(
          <button key={t} onClick={()=>setSubTab(t)} style={{background:subTab===t?"rgba(140,29,37,.09)":"rgba(17,24,39,.04)",color:subTab===t?RED:GRAY,border:`1px solid ${subTab===t?"rgba(140,29,37,.25)":"rgba(17,24,39,.1)"}`,borderRadius:7,padding:"6px 20px",fontSize:13,fontWeight:subTab===t?700:400,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>
            {t==="SAR"?"Suspicious Activity (SAR)":t==="CTR"?"Currency Transactions (CTR)":"OFAC / Sanctions Screening"}
          </button>
        ))}
      </div>

      {/* ── SAR ── */}
      {subTab==="SAR"&&(
        <div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:8}}>
            <div style={{fontSize:13,color:GRAY}}>{sars.length} SAR{sars.length!==1?"s":""} filed</div>
            <button onClick={()=>{setSarOpen(v=>!v);setSarDone(null);setSarErr("");}} style={{display:"flex",alignItems:"center",gap:7,background:sarOpen?"rgba(17,24,39,.07)":RED,border:sarOpen?"1px solid rgba(17,24,39,.15)":"none",borderRadius:9,padding:"8px 18px",fontSize:13,fontWeight:600,color:sarOpen?DARK:"#fff",cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d={sarOpen?"M18 6 6 18M6 6l12 12":"M12 5v14M5 12h14"}/></svg>
              {sarOpen?"Cancel":"File New SAR"}
            </button>
          </div>

          {sarOpen&&(
            <div style={{...CARD,overflow:"hidden",marginBottom:20}}>
              <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(17,24,39,.07)"}}>
                <div style={{fontFamily:FONT,fontWeight:700,fontSize:14,color:DARK}}>Suspicious Activity Report</div>
                <div style={{fontSize:12,color:GRAY,marginTop:2}}>Filed internally — submit to FinCEN via BSA E-Filing System</div>
              </div>
              {sarDone?(
                <div style={{padding:"36px 24px",textAlign:"center"}}>
                  <div style={{width:48,height:48,borderRadius:"50%",background:"rgba(22,163,74,.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",color:"#16A34A"}}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                  </div>
                  <div style={{fontFamily:FONT,fontWeight:700,fontSize:15,color:DARK}}>SAR Filed</div>
                  <div style={{fontSize:13,color:GRAY,marginTop:6}}>Reference: <strong style={{fontFamily:"monospace"}}>{sarDone}</strong> — status: Draft</div>
                </div>
              ):(
                <div style={{padding:"20px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  <div><label style={LBL}>Customer (Subject)</label><select value={sarUser} onChange={e=>{setSarUser(e.target.value);setSarAcct("");setSarTx("");setSarName(()=>{const u=users.find(u=>u.id===e.target.value);return u?`${u.firstName} ${u.lastName}`.trim():"";});}} style={SEL}>{users.map(u=><option key={u.id} value={u.id}>{u.firstName} {u.lastName} — {u.email}</option>)}</select></div>
                  <div><label style={LBL}>Account <span style={{fontWeight:400,color:GRAY}}>(optional)</span></label><select value={sarAcct} onChange={e=>{setSarAcct(e.target.value);setSarTx("");}} style={SEL}><option value="">No specific account</option>{sarUserAccts.map(a=><option key={a.id} value={a.id}>{a.accountName} ••••{a.last4}</option>)}</select></div>
                  <div><label style={LBL}>Linked Transaction <span style={{fontWeight:400,color:GRAY}}>(optional)</span></label><select value={sarTx} onChange={e=>{setSarTx(e.target.value);if(e.target.value){const t=sarAcctTxs.find(t=>t.id===e.target.value);if(t)setSarAmt(String(Math.abs(t.amount)));} }} style={SEL}><option value="">No specific transaction</option>{sarAcctTxs.map(t=><option key={t.id} value={t.id}>{t.date} — {t.merchant} ({t.amount>0?"+":""}{usd(t.amount)})</option>)}</select></div>
                  <div><label style={LBL}>Subject Full Name</label><input type="text" placeholder="Full legal name" value={sarName} onChange={e=>setSarName(e.target.value)} style={INP}/></div>
                  <div><label style={LBL}>Amount Involved <span style={{fontWeight:400,color:GRAY}}>(optional)</span></label><div style={{position:"relative"}}><span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:GRAY,pointerEvents:"none"}}>$</span><input type="number" min="0" step="0.01" placeholder="0.00" value={sarAmt} onChange={e=>setSarAmt(e.target.value)} style={{...INP,paddingLeft:24}}/></div></div>
                  <div style={{gridColumn:"1/-1"}}><label style={LBL}>Description of Suspicious Activity</label><textarea rows={4} placeholder="Describe the suspicious activity, pattern observed, and reason for filing…" value={sarDesc} onChange={e=>setSarDesc(e.target.value)} style={{...INP,resize:"vertical",height:"auto"}}/></div>
                  {sarErr&&<div style={{gridColumn:"1/-1",fontSize:13,color:"#DC2626",padding:"8px 12px",background:"rgba(220,38,38,.06)",borderRadius:7}}>{sarErr}</div>}
                  <div style={{gridColumn:"1/-1"}}><button disabled={sarBusy} onClick={submitSAR} style={{background:RED,border:"none",borderRadius:10,padding:"11px 32px",fontSize:14,fontWeight:700,color:"#fff",cursor:sarBusy?"not-allowed":"pointer",fontFamily:FONT,opacity:sarBusy?.7:1}}>{sarBusy?"Filing…":"File SAR (Draft)"}</button></div>
                </div>
              )}
            </div>
          )}

          <div style={{...CARD,overflow:"hidden"}}>
            {sars.length===0
              ?<Empty msg="No SARs filed. Use the form above to file a Suspicious Activity Report."/>
              :sars.map((r,i)=>{
                const user=users.find(u=>u.id===r.userId);
                const nextStatuses=STATUS_FLOW[r.status]??[];
                return(
                  <div key={r.id} style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:12,padding:"14px 20px",borderBottom:i<sars.length-1?"1px solid rgba(17,24,39,.06)":"none"}}>
                    <div style={{width:38,height:38,borderRadius:9,background:"rgba(220,38,38,.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#DC2626"}}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6"/></svg>
                    </div>
                    <div style={{flex:1,minWidth:200}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                        <span style={{fontWeight:700,fontSize:12.5,fontFamily:"monospace",color:DARK}}>{r.referenceId}</span>
                        <ComplianceBadge status={r.status} type="report"/>
                      </div>
                      <div style={{fontSize:13.5,fontWeight:600,color:DARK,marginBottom:2}}>{r.subjectName}</div>
                      <div style={{fontSize:12,color:GRAY}}>{user?user.email:"—"}{r.amount!=null&&<> · {usd(r.amount)}</>} · {fmtDate(r.createdAt)}</div>
                      {r.description&&<div style={{fontSize:12,color:MID,marginTop:3,fontStyle:"italic",maxWidth:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.description}</div>}
                    </div>
                    {nextStatuses.length>0&&(
                      <div style={{display:"flex",gap:6,flexShrink:0}}>
                        {nextStatuses.map(s=>(
                          <button key={s} disabled={statusBusy===r.id} onClick={()=>updateReportStatus(r.id,s)} style={{background:s==="closed"?"rgba(17,24,39,.05)":s==="submitted"?"rgba(22,163,74,.09)":"rgba(37,99,235,.08)",border:`1px solid ${s==="closed"?"rgba(17,24,39,.12)":s==="submitted"?"rgba(22,163,74,.25)":"rgba(37,99,235,.2)"}`,borderRadius:8,padding:"5px 14px",fontSize:12.5,fontWeight:600,color:s==="closed"?GRAY:s==="submitted"?"#16A34A":"#2563EB",cursor:statusBusy===r.id?"not-allowed":"pointer",fontFamily:"inherit",textTransform:"capitalize",opacity:statusBusy===r.id?.5:1}}>
                            {statusBusy===r.id?"…":s.charAt(0).toUpperCase()+s.slice(1)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            }
          </div>
        </div>
      )}

      {/* ── CTR ── */}
      {subTab==="CTR"&&(
        <div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:8}}>
            <div style={{fontSize:13,color:GRAY}}>{ctrs.length} CTR{ctrs.length!==1?"s":""} filed{ctrDone&&<span style={{marginLeft:8,color:"#16A34A",fontWeight:600}}>✓ {ctrDone} filed</span>}</div>
            <button disabled={scanning} onClick={runCtrScan} style={{display:"flex",alignItems:"center",gap:7,background:scanning?"rgba(140,29,37,.5)":RED,border:"none",borderRadius:9,padding:"8px 18px",fontSize:13,fontWeight:600,color:"#fff",cursor:scanning?"not-allowed":"pointer",fontFamily:"inherit",flexShrink:0}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={scanning?{animation:"spin .75s linear infinite"}:{}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              {scanning?"Scanning…":"Scan for Eligible Transactions"}
            </button>
          </div>

          {scanMsg&&<div style={{...CARD,padding:"10px 16px",marginBottom:16,fontSize:13,color:scanMsg.ok?"#16A34A":"#DC2626",display:"flex",alignItems:"center",gap:8}}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d={scanMsg.ok?"M20 6 9 17l-5-5":"M18 6 6 18M6 6l12 12"}/></svg>{scanMsg.text}</div>}

          {ctrEligible.length>0&&(
            <div style={{...CARD,overflow:"hidden",marginBottom:20}}>
              <div style={{padding:"12px 20px",borderBottom:"1px solid rgba(17,24,39,.07)",fontFamily:FONT,fontWeight:700,fontSize:13.5,color:DARK}}>
                Transactions Requiring CTR ({ctrEligible.length})
              </div>
              {ctrEligible.map((tx,i)=>{
                const user=users.find(u=>u.id===tx.user_id);
                const acct=accounts.find(a=>a.id===tx.account_id);
                const isFilingThis=ctrTxId===String(tx.id);
                return(
                  <div key={String(tx.id)} style={{padding:"14px 20px",borderBottom:i<ctrEligible.length-1?"1px solid rgba(17,24,39,.05)":"none"}}>
                    <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                      <div style={{flex:1,minWidth:200}}>
                        <div style={{fontWeight:600,fontSize:13.5,color:DARK,marginBottom:2}}>{user?`${user.firstName} ${user.lastName}`:String(tx.user_id||"")}</div>
                        <div style={{fontSize:12,color:GRAY}}>{String(tx.merchant||"")} · {acct?`${acct.accountName} ••••${acct.last4}`:""} · {fmtDate(String(tx.posted_at||""))}</div>
                      </div>
                      <div style={{fontFamily:FONT,fontWeight:800,fontSize:18,color:Number(tx.amount)>0?"#16A34A":"#DC2626",flexShrink:0}}>{Number(tx.amount)>0?"+":"-"}{usd(Number(tx.amount))}</div>
                      <button onClick={()=>{setCtrTxId(isFilingThis?null:String(tx.id));if(!isFilingThis){const u=users.find(u=>u.id===tx.user_id);setCtrName(u?`${u.firstName} ${u.lastName}`.trim():"");setCtrDesc(`Cash transaction of ${usd(Math.abs(Number(tx.amount)))} on ${fmtDate(String(tx.posted_at||""))}`);setCtrErr("");}}} style={{background:isFilingThis?"rgba(17,24,39,.07)":RED,border:isFilingThis?"1px solid rgba(17,24,39,.15)":"none",borderRadius:8,padding:"7px 14px",fontSize:12.5,fontWeight:600,color:isFilingThis?DARK:"#fff",cursor:"pointer",fontFamily:"inherit",flexShrink:0,transition:"all .15s"}}>
                        {isFilingThis?"Cancel":"File CTR"}
                      </button>
                    </div>
                    {isFilingThis&&(
                      <div style={{marginTop:12,padding:"14px 16px",background:"rgba(17,24,39,.02)",borderRadius:9,border:"1px solid rgba(17,24,39,.08)",display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                        <div><label style={LBL}>Subject Full Name</label><input type="text" value={ctrName} onChange={e=>setCtrName(e.target.value)} style={INP}/></div>
                        <div style={{gridColumn:"1/-1"}}><label style={LBL}>Description</label><textarea rows={2} value={ctrDesc} onChange={e=>setCtrDesc(e.target.value)} style={{...INP,resize:"vertical",height:"auto"}}/></div>
                        {ctrErr&&<div style={{gridColumn:"1/-1",fontSize:12.5,color:"#DC2626"}}>{ctrErr}</div>}
                        <div style={{gridColumn:"1/-1"}}><button disabled={ctrBusy} onClick={()=>submitCTR(tx)} style={{background:RED,border:"none",borderRadius:9,padding:"9px 24px",fontSize:13.5,fontWeight:700,color:"#fff",cursor:ctrBusy?"not-allowed":"pointer",fontFamily:FONT,opacity:ctrBusy?.7:1}}>{ctrBusy?"Filing…":"Confirm & File CTR"}</button></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div style={{...CARD,overflow:"hidden"}}>
            <div style={{padding:"12px 20px",borderBottom:"1px solid rgba(17,24,39,.07)",fontFamily:FONT,fontWeight:700,fontSize:13.5,color:DARK}}>Filed CTRs</div>
            {ctrs.length===0
              ?<Empty msg="No CTRs filed. Scan for eligible transactions above."/>
              :ctrs.map((r,i)=>{
                const user=users.find(u=>u.id===r.userId);
                return(
                  <div key={r.id} style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:12,padding:"13px 20px",borderBottom:i<ctrs.length-1?"1px solid rgba(17,24,39,.06)":"none"}}>
                    <div style={{width:36,height:36,borderRadius:9,background:"rgba(217,119,6,.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#D97706"}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    </div>
                    <div style={{flex:1,minWidth:200}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                        <span style={{fontWeight:700,fontSize:12.5,fontFamily:"monospace",color:DARK}}>{r.referenceId}</span>
                        <ComplianceBadge status={r.status} type="report"/>
                      </div>
                      <div style={{fontSize:13,fontWeight:600,color:DARK}}>{r.subjectName}</div>
                      <div style={{fontSize:12,color:GRAY}}>{user?user.email:"—"}{r.amount!=null&&<> · {usd(r.amount)}</>} · {fmtDate(r.createdAt)}</div>
                    </div>
                    {(STATUS_FLOW[r.status]??[]).map(s=>(
                      <button key={s} disabled={statusBusy===r.id} onClick={()=>updateReportStatus(r.id,s)} style={{background:s==="closed"?"rgba(17,24,39,.05)":"rgba(22,163,74,.09)",border:`1px solid ${s==="closed"?"rgba(17,24,39,.12)":"rgba(22,163,74,.25)"}`,borderRadius:8,padding:"5px 14px",fontSize:12.5,fontWeight:600,color:s==="closed"?GRAY:"#16A34A",cursor:statusBusy===r.id?"not-allowed":"pointer",fontFamily:"inherit",textTransform:"capitalize",opacity:statusBusy===r.id?.5:1}}>
                        {statusBusy===r.id?"…":s.charAt(0).toUpperCase()+s.slice(1)}
                      </button>
                    ))}
                  </div>
                );
              })
            }
          </div>
        </div>
      )}

      {/* ── OFAC ── */}
      {subTab==="OFAC"&&(
        <div>
          {/* Screen form */}
          <div style={{...CARD,overflow:"hidden",marginBottom:20}}>
            <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(17,24,39,.07)"}}>
              <div style={{fontFamily:FONT,fontWeight:700,fontSize:14,color:DARK}}>OFAC / Sanctions Name Screen</div>
              <div style={{fontSize:12,color:GRAY,marginTop:2}}>Screen a customer against the internal watchlist — result is logged automatically</div>
            </div>
            <div style={{padding:"20px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,alignItems:"end"}}>
              <div>
                <label style={LBL}>Customer (auto-fills name)</label>
                <select value={ofacUser} onChange={e=>{setOfacUser(e.target.value);const u=users.find(u=>u.id===e.target.value);if(u)setOfacName(`${u.firstName} ${u.lastName}`.trim());}} style={SEL}>
                  {users.map(u=><option key={u.id} value={u.id}>{u.firstName} {u.lastName} — {u.email}</option>)}
                </select>
              </div>
              <div>
                <label style={LBL}>Name to Screen</label>
                <input type="text" placeholder="Override or enter manually…" value={ofacName} onChange={e=>setOfacName(e.target.value)} style={INP}/>
              </div>
              <div style={{gridColumn:"1/-1",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                <button disabled={ofacBusy} onClick={runOfacScreen} style={{background:RED,border:"none",borderRadius:9,padding:"10px 24px",fontSize:13.5,fontWeight:700,color:"#fff",cursor:ofacBusy?"not-allowed":"pointer",fontFamily:FONT,opacity:ofacBusy?.7:1,display:"flex",alignItems:"center",gap:7}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={ofacBusy?{animation:"spin .75s linear infinite"}:{}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  {ofacBusy?"Screening…":"Run OFAC Screen"}
                </button>
                {ofacErr&&<span style={{fontSize:13,color:"#DC2626"}}>{ofacErr}</span>}
                {ofacResult&&(
                  <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:8,padding:"8px 16px",background:ofacResult.status==="clear"?"rgba(22,163,74,.07)":"rgba(217,119,6,.1)",border:`1px solid ${ofacResult.status==="clear"?"rgba(22,163,74,.2)":"rgba(217,119,6,.3)"}`,borderRadius:9}}>
                    <ComplianceBadge status={ofacResult.status} type="ofac"/>
                    <span style={{fontSize:13,color:MID}}>Score: <strong>{ofacResult.matchScore}</strong>/100</span>
                    {ofacResult.matchedEntry&&<span style={{fontSize:12.5,color:DARK}}>Matched: <em>{ofacResult.matchedEntry}</em></span>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Screening history */}
          <div style={{...CARD,overflow:"hidden"}}>
            <div style={{padding:"12px 20px",borderBottom:"1px solid rgba(17,24,39,.07)",fontFamily:FONT,fontWeight:700,fontSize:13.5,color:DARK}}>Screening History ({screenings.length})</div>
            {screenings.length===0
              ?<Empty msg="No screenings performed yet. Use the form above."/>
              :screenings.map((s,i)=>{
                const user=users.find(u=>u.id===s.userId);
                const isPending=s.status==="potential_match";
                return(
                  <div key={s.id} style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:12,padding:"13px 20px",borderBottom:i<screenings.length-1?"1px solid rgba(17,24,39,.06)":"none",background:isPending?"rgba(217,119,6,.03)":"#fff"}}>
                    <div style={{width:36,height:36,borderRadius:9,background:s.status==="clear"?"rgba(22,163,74,.08)":s.status==="potential_match"?"rgba(217,119,6,.1)":"rgba(220,38,38,.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:s.status==="clear"?"#16A34A":s.status==="potential_match"?"#D97706":"#DC2626"}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div style={{flex:1,minWidth:200}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                        <span style={{fontWeight:600,fontSize:13.5,color:DARK}}>{s.screenedName}</span>
                        <ComplianceBadge status={s.status} type="ofac"/>
                        <span style={{fontSize:11.5,fontWeight:700,padding:"1px 7px",borderRadius:5,background:"rgba(17,24,39,.06)",color:s.matchScore>=50?"#D97706":GRAY}}>Score: {s.matchScore}</span>
                      </div>
                      <div style={{fontSize:12,color:GRAY}}>
                        {user?user.email:"manual entry"}
                        {s.matchedEntry&&<> · Matched: <em>{s.matchedEntry}</em></>}
                        {" · "}{fmtDate(s.createdAt)}
                        {s.reviewedBy&&<> · Reviewed by {s.reviewedBy}</>}
                      </div>
                    </div>
                    {isPending&&(
                      <div style={{display:"flex",gap:6,flexShrink:0}}>
                        <button disabled={statusBusy===s.id} onClick={()=>reviewScreening(s.id,"confirmed_match")} style={{background:"rgba(220,38,38,.07)",border:"1px solid rgba(220,38,38,.2)",borderRadius:8,padding:"5px 12px",fontSize:12.5,fontWeight:600,color:"#DC2626",cursor:statusBusy===s.id?"not-allowed":"pointer",fontFamily:"inherit",opacity:statusBusy===s.id?.5:1}}>Confirm</button>
                        <button disabled={statusBusy===s.id} onClick={()=>reviewScreening(s.id,"false_positive")} style={{background:"rgba(107,114,128,.07)",border:"1px solid rgba(107,114,128,.2)",borderRadius:8,padding:"5px 12px",fontSize:12.5,fontWeight:600,color:GRAY,cursor:statusBusy===s.id?"not-allowed":"pointer",fontFamily:"inherit",opacity:statusBusy===s.id?.5:1}}>False Positive</button>
                      </div>
                    )}
                    {s.status==="confirmed_match"&&(
                      <span style={{fontSize:11.5,fontWeight:700,padding:"4px 10px",borderRadius:8,background:"rgba(220,38,38,.07)",color:"#DC2626",flexShrink:0}}>⚠ Action Required</span>
                    )}
                  </div>
                );
              })
            }
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: INTEREST RATES & FEES
═══════════════════════════════════════════════════════ */
const RATE_TYPE_COLOR:Record<string,{bg:string;text:string}>={
  apy:{bg:"rgba(22,163,74,.1)",text:"#16A34A"},
  apr:{bg:"rgba(220,38,38,.1)",text:"#DC2626"},
};

function RatesTab({rates,fees,users,accounts,onUpdateRate,onUpdateFee,onApplyFee,onApplyInterest}:{
  rates:RateConfig[]; fees:FeeSchedule[];
  users:UserRow[]; accounts:AcctRow[];
  onUpdateRate:(key:string,value:number)=>Promise<string|null>;
  onUpdateFee:(key:string,amount:number)=>Promise<string|null>;
  onApplyFee:(accountId:string,userId:string,amount:number,feeLabel:string)=>Promise<string|null>;
  onApplyInterest:(accountId:string,userId:string,amount:number,rateLabel:string)=>Promise<string|null>;
}){
  const [editingRate, setEditingRate] = useState<string|null>(null);
  const [rateInput,   setRateInput]   = useState("");
  const [rateBusy,    setRateBusy]    = useState(false);
  const [rateErr,     setRateErr]     = useState("");

  const [editingFee,  setEditingFee]  = useState<string|null>(null);
  const [feeInput,    setFeeInput]    = useState("");
  const [feeBusy,     setFeeBusy]     = useState(false);
  const [feeErr,      setFeeErr]      = useState("");

  /* Apply fee form */
  const [fSelUser, setFSelUser] = useState(users[0]?.id||"");
  const [fSelAcct, setFSelAcct] = useState("");
  const [fSelFee,  setFSelFee]  = useState(fees[0]?.key||"");
  const [fWaived,  setFWaived]  = useState(false);
  const [fBusy,    setFBusy]    = useState(false);
  const [fErr,     setFErr]     = useState("");
  const [fDone,    setFDone]    = useState(false);

  /* Apply interest form */
  const [iSelUser, setISelUser] = useState(users[0]?.id||"");
  const [iSelAcct, setISelAcct] = useState("");
  const [iSelRate, setISelRate] = useState(rates[0]?.key||"");
  const [iBusy,    setIBusy]    = useState(false);
  const [iErr,     setIErr]     = useState("");
  const [iDone,    setIDone]    = useState(false);

  const fUserAccts = accounts.filter(a=>a.userId===fSelUser&&a.accountType!=="credit_card");
  const iUserAccts = accounts.filter(a=>a.userId===iSelUser&&a.accountType!=="credit_card");

  const selectedFee  = fees.find(f=>f.key===fSelFee);
  const selectedRate = rates.find(r=>r.key===iSelRate);
  const iAcct        = accounts.find(a=>a.id===iSelAcct);
  const monthlyInterest = (selectedRate && iAcct && iAcct.balance > 0)
    ? parseFloat((iAcct.balance * (selectedRate.value / 100) / 12).toFixed(2))
    : 0;

  async function saveRate(key:string){
    const v=parseFloat(rateInput);
    if(isNaN(v)||v<0||v>100){setRateErr("Enter a value between 0 and 100.");return;}
    setRateBusy(true); setRateErr("");
    const err=await onUpdateRate(key,v);
    setRateBusy(false);
    if(err){setRateErr(err);return;}
    setEditingRate(null);
  }

  async function saveFee(key:string){
    const v=parseFloat(feeInput);
    if(isNaN(v)||v<0){setFeeErr("Enter a valid amount (0 or greater).");return;}
    setFeeBusy(true); setFeeErr("");
    const err=await onUpdateFee(key,v);
    setFeeBusy(false);
    if(err){setFeeErr(err);return;}
    setEditingFee(null);
  }

  async function submitFee(){
    if(!fSelAcct){setFErr("Select an account.");return;}
    if(!fSelFee){setFErr("Select a fee type.");return;}
    if(fWaived){setFDone(true); setTimeout(()=>{setFDone(false);setFWaived(false);},3000); return;}
    const fee=fees.find(f=>f.key===fSelFee);
    if(!fee){setFErr("Fee not found.");return;}
    setFErr(""); setFBusy(true);
    const err=await onApplyFee(fSelAcct,fSelUser,fee.amount,fee.label);
    setFBusy(false);
    if(err){setFErr(err);return;}
    setFDone(true); setFWaived(false);
    setTimeout(()=>{setFDone(false);setFSelAcct("");},3000);
  }

  async function submitInterest(){
    if(!iSelAcct){setIErr("Select an account.");return;}
    if(!iSelRate){setIErr("Select a rate.");return;}
    if(monthlyInterest<=0){setIErr("Balance must be positive to apply interest.");return;}
    setIErr(""); setIBusy(true);
    const err=await onApplyInterest(iSelAcct,iSelUser,monthlyInterest,selectedRate?.label||iSelRate);
    setIBusy(false);
    if(err){setIErr(err);return;}
    setIDone(true);
    setTimeout(()=>{setIDone(false);setISelAcct("");},3000);
  }

  const APY_RATES = rates.filter(r=>r.rateType==="apy");
  const APR_RATES = rates.filter(r=>r.rateType==="apr");
  const activeFees = fees.filter(f=>f.active);

  return(
    <div>
      <SectionHead title="Interest Rates & Fees" sub="Configure product rates and fee schedule — changes take effect immediately"/>

      {/* Rate overview row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14,marginBottom:24}}>
        <StatCard label="APY Products"   value={String(APY_RATES.length)}  sub={`avg ${(APY_RATES.reduce((s,r)=>s+r.value,0)/Math.max(APY_RATES.length,1)).toFixed(2)}% APY`} color="#16A34A" icon="M2 20h20M4 20V10M20 20V10M10 20V14h4v6M1 10l11-7 11 7"/>
        <StatCard label="APR Products"   value={String(APR_RATES.length)}  sub={`avg ${(APR_RATES.reduce((s,r)=>s+r.value,0)/Math.max(APR_RATES.length,1)).toFixed(2)}% APR`} color={RED}     icon="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z"/>
        <StatCard label="Fee Types"      value={String(activeFees.length)} sub={`${fees.filter(f=>f.waivable).length} waivable`}                                               color="#D97706" icon="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 8v4M12 16h.01"/>
        <StatCard label="Highest Rate"   value={rates.length>0?`${Math.max(...rates.map(r=>r.value)).toFixed(2)}%`:"—"} sub="across all products"                              color="#7C3AED" icon="M5 3l14 9-14 9V3z"/>
      </div>

      {/* Interest Rates */}
      <div style={{...CARD,overflow:"hidden",marginBottom:20}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(17,24,39,.07)",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{fontFamily:FONT,fontWeight:700,fontSize:15,color:DARK}}>Interest Rate Configuration</div>
            <div style={{fontSize:12,color:GRAY,marginTop:2}}>Click a rate to edit it inline — changes persist immediately</div>
          </div>
        </div>

        {rates.length===0
          ?<Empty msg="No rates configured. Run the SQL migration in Supabase to seed the rate_config table."/>
          :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:0}}>
            {rates.map((rate,i)=>{
              const isEditing=editingRate===rate.key;
              const tc=RATE_TYPE_COLOR[rate.rateType]??RATE_TYPE_COLOR.apy;
              return(
                <div key={rate.key} style={{padding:"16px 20px",borderBottom:"1px solid rgba(17,24,39,.05)",borderRight:i%2===0?"1px solid rgba(17,24,39,.05)":"none",background:isEditing?"rgba(17,24,39,.01)":"#fff"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                    <span style={{fontSize:11.5,fontWeight:700,padding:"2px 7px",borderRadius:99,background:tc.bg,color:tc.text,letterSpacing:".04em",textTransform:"uppercase"}}>{rate.rateType}</span>
                    {!isEditing&&(
                      <button onClick={()=>{setEditingRate(rate.key);setRateInput(String(rate.value));setRateErr("");}} style={{background:"none",border:"none",cursor:"pointer",padding:"2px 6px",borderRadius:6,color:GRAY,fontSize:12,fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Edit
                      </button>
                    )}
                  </div>
                  <div style={{fontSize:13,fontWeight:600,color:MID,marginBottom:4}}>{rate.label}</div>
                  {isEditing?(
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                        <div style={{position:"relative",flex:1}}>
                          <input type="number" min="0" max="100" step="0.01" value={rateInput} onChange={e=>setRateInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")saveRate(rate.key);if(e.key==="Escape")setEditingRate(null);}} autoFocus style={{...INP,fontSize:14,paddingRight:26}}/>
                          <span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",fontSize:13,color:GRAY,pointerEvents:"none"}}>%</span>
                        </div>
                      </div>
                      <div style={{display:"flex",gap:6}}>
                        <button disabled={rateBusy} onClick={()=>saveRate(rate.key)} style={{flex:1,background:RED,border:"none",borderRadius:7,padding:"6px 0",fontSize:12.5,fontWeight:700,color:"#fff",cursor:rateBusy?"not-allowed":"pointer",fontFamily:"inherit",opacity:rateBusy?.6:1}}>{rateBusy?"…":"Save"}</button>
                        <button onClick={()=>{setEditingRate(null);setRateErr("");}} style={{background:"rgba(17,24,39,.06)",border:"1px solid rgba(17,24,39,.12)",borderRadius:7,padding:"6px 12px",fontSize:12.5,fontWeight:600,color:GRAY,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
                      </div>
                      {rateErr&&<div style={{fontSize:11.5,color:"#DC2626",marginTop:4}}>{rateErr}</div>}
                    </div>
                  ):(
                    <div style={{fontFamily:FONT,fontWeight:800,fontSize:26,color:rate.rateType==="apy"?"#16A34A":"#DC2626",lineHeight:1.1}}>
                      {rate.value.toFixed(2)}<span style={{fontSize:14,fontWeight:500,color:GRAY}}>%</span>
                    </div>
                  )}
                  {rate.updatedBy&&!isEditing&&<div style={{fontSize:10.5,color:GRAY,marginTop:4}}>Updated by {rate.updatedBy}</div>}
                </div>
              );
            })}
          </div>
        }
      </div>

      {/* Fee Schedule */}
      <div style={{...CARD,overflow:"hidden",marginBottom:20}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(17,24,39,.07)"}}>
          <div style={{fontFamily:FONT,fontWeight:700,fontSize:15,color:DARK}}>Fee Schedule</div>
          <div style={{fontSize:12,color:GRAY,marginTop:2}}>Click the amount to edit — active fees can be applied to any account</div>
        </div>
        {fees.length===0
          ?<Empty msg="No fees configured. Run the SQL migration in Supabase to seed the fee_schedule table."/>
          :<table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead>
              <tr style={{borderBottom:"1px solid rgba(17,24,39,.07)"}}>
                {["Fee Type","Description","Amount","Waivable",""].map(h=>(
                  <th key={h} style={{textAlign:"left",padding:"10px 20px",fontWeight:600,fontSize:11.5,color:GRAY,letterSpacing:".04em",whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fees.map((fee,i)=>{
                const isEditing=editingFee===fee.key;
                return(
                  <tr key={fee.key} style={{borderBottom:i<fees.length-1?"1px solid rgba(17,24,39,.05)":"none",background:isEditing?"rgba(17,24,39,.01)":"#fff"}}>
                    <td style={{padding:"13px 20px",fontWeight:600,color:DARK}}>{fee.label}</td>
                    <td style={{padding:"13px 20px",color:GRAY,fontSize:12.5,maxWidth:260}}>{fee.description}</td>
                    <td style={{padding:"13px 20px",fontFamily:FONT,fontWeight:700,color:DARK,whiteSpace:"nowrap"}}>
                      {isEditing?(
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <div style={{position:"relative"}}>
                            <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:GRAY,fontSize:13,pointerEvents:"none"}}>$</span>
                            <input type="number" min="0" step="0.01" value={feeInput} onChange={e=>setFeeInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")saveFee(fee.key);if(e.key==="Escape")setEditingFee(null);}} autoFocus style={{...INP,width:110,paddingLeft:22,fontSize:13}}/>
                          </div>
                          <button disabled={feeBusy} onClick={()=>saveFee(fee.key)} style={{background:RED,border:"none",borderRadius:7,padding:"6px 12px",fontSize:12.5,fontWeight:700,color:"#fff",cursor:feeBusy?"not-allowed":"pointer",fontFamily:"inherit",opacity:feeBusy?.6:1}}>{feeBusy?"…":"Save"}</button>
                          <button onClick={()=>{setEditingFee(null);setFeeErr("");}} style={{background:"rgba(17,24,39,.06)",border:"1px solid rgba(17,24,39,.12)",borderRadius:7,padding:"6px 10px",fontSize:12.5,fontWeight:600,color:GRAY,cursor:"pointer",fontFamily:"inherit"}}>✕</button>
                          {feeErr&&<span style={{fontSize:11.5,color:"#DC2626"}}>{feeErr}</span>}
                        </div>
                      ):(
                        <button onClick={()=>{setEditingFee(fee.key);setFeeInput(String(fee.amount));setFeeErr("");}} style={{background:"none",border:"none",cursor:"pointer",fontFamily:FONT,fontWeight:700,fontSize:14,color:DARK,padding:"2px 4px",borderRadius:5,textDecoration:"underline dotted rgba(17,24,39,.25)"}}>
                          {usd(fee.amount)}
                        </button>
                      )}
                    </td>
                    <td style={{padding:"13px 20px"}}>
                      {fee.waivable
                        ?<span style={{fontSize:11.5,fontWeight:600,padding:"2px 8px",borderRadius:99,background:"rgba(22,163,74,.1)",color:"#16A34A"}}>Waivable</span>
                        :<span style={{fontSize:11.5,fontWeight:600,padding:"2px 8px",borderRadius:99,background:"rgba(107,114,128,.1)",color:GRAY}}>Fixed</span>
                      }
                    </td>
                    <td style={{padding:"13px 20px"}}/>
                  </tr>
                );
              })}
            </tbody>
          </table>
        }
      </div>

      {/* Apply section */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>

        {/* Apply Fee */}
        <div style={{...CARD,overflow:"hidden"}}>
          <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(17,24,39,.07)"}}>
            <div style={{fontFamily:FONT,fontWeight:700,fontSize:14,color:DARK}}>Apply Fee to Account</div>
            <div style={{fontSize:12,color:GRAY,marginTop:2}}>Post a fee debit — reduces balance immediately</div>
          </div>
          {fDone?(
            <div style={{padding:"36px 24px",textAlign:"center"}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:"rgba(22,163,74,.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",color:"#16A34A"}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <div style={{fontFamily:FONT,fontWeight:700,fontSize:15,color:DARK}}>{fWaived?"Fee Waived":"Fee Applied"}</div>
              <div style={{fontSize:13,color:GRAY,marginTop:6}}>{fWaived?"No charge was posted to the account.":"Balance updated."}</div>
            </div>
          ):(
            <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:12}}>
              <div><label style={LBL}>Customer</label><select value={fSelUser} onChange={e=>{setFSelUser(e.target.value);setFSelAcct("");}} style={SEL}>{users.map(u=><option key={u.id} value={u.id}>{u.firstName} {u.lastName} — {u.email}</option>)}</select></div>
              <div><label style={LBL}>Account</label><select value={fSelAcct} onChange={e=>setFSelAcct(e.target.value)} style={SEL}><option value="">Select account…</option>{fUserAccts.map(a=><option key={a.id} value={a.id}>{a.accountName} ••••{a.last4} ({usd(a.balance)})</option>)}</select></div>
              <div><label style={LBL}>Fee Type</label><select value={fSelFee} onChange={e=>setFSelFee(e.target.value)} style={SEL}>{activeFees.map(f=><option key={f.key} value={f.key}>{f.label} — {usd(f.amount)}{f.waivable?" (waivable)":""}</option>)}</select></div>
              {selectedFee?.waivable&&(
                <label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:MID,cursor:"pointer"}}>
                  <input type="checkbox" checked={fWaived} onChange={e=>setFWaived(e.target.checked)} style={{width:15,height:15,cursor:"pointer"}}/>
                  Waive this fee (customer courtesy — no charge posted)
                </label>
              )}
              {selectedFee&&(
                <div style={{padding:"10px 14px",background:fWaived?"rgba(22,163,74,.06)":"rgba(220,38,38,.05)",border:`1px solid ${fWaived?"rgba(22,163,74,.2)":"rgba(220,38,38,.15)"}`,borderRadius:8,fontSize:13,fontWeight:600,color:fWaived?"#16A34A":"#DC2626"}}>
                  {fWaived?`Waived — ${usd(selectedFee.amount)} will NOT be charged`:`Charge: ${usd(selectedFee.amount)}`}
                </div>
              )}
              {fErr&&<div style={{fontSize:13,color:"#DC2626",padding:"8px 12px",background:"rgba(220,38,38,.06)",borderRadius:7}}>{fErr}</div>}
              <button disabled={fBusy} onClick={submitFee} style={{background:fWaived?"#16A34A":RED,border:"none",borderRadius:10,padding:"11px 0",fontSize:14,fontWeight:700,color:"#fff",cursor:fBusy?"not-allowed":"pointer",fontFamily:FONT,opacity:fBusy?.7:1}}>
                {fBusy?"…":fWaived?"Waive Fee":"Apply Fee"}
              </button>
            </div>
          )}
        </div>

        {/* Apply Interest */}
        <div style={{...CARD,overflow:"hidden"}}>
          <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(17,24,39,.07)"}}>
            <div style={{fontFamily:FONT,fontWeight:700,fontSize:14,color:DARK}}>Apply Monthly Interest</div>
            <div style={{fontSize:12,color:GRAY,marginTop:2}}>Post one month of interest credit to a deposit account</div>
          </div>
          {iDone?(
            <div style={{padding:"36px 24px",textAlign:"center"}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:"rgba(22,163,74,.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",color:"#16A34A"}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <div style={{fontFamily:FONT,fontWeight:700,fontSize:15,color:DARK}}>Interest Posted</div>
              <div style={{fontSize:13,color:GRAY,marginTop:6}}>{usd(monthlyInterest)} credited to account.</div>
            </div>
          ):(
            <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:12}}>
              <div><label style={LBL}>Customer</label><select value={iSelUser} onChange={e=>{setISelUser(e.target.value);setISelAcct("");}} style={SEL}>{users.map(u=><option key={u.id} value={u.id}>{u.firstName} {u.lastName} — {u.email}</option>)}</select></div>
              <div><label style={LBL}>Account</label><select value={iSelAcct} onChange={e=>setISelAcct(e.target.value)} style={SEL}><option value="">Select deposit account…</option>{iUserAccts.map(a=><option key={a.id} value={a.id}>{a.accountName} ••••{a.last4} ({usd(a.balance)})</option>)}</select></div>
              <div><label style={LBL}>Rate</label><select value={iSelRate} onChange={e=>setISelRate(e.target.value)} style={SEL}>{APY_RATES.map(r=><option key={r.key} value={r.key}>{r.label} — {r.value.toFixed(2)}% APY</option>)}</select></div>
              {iSelAcct&&selectedRate&&(
                <div style={{padding:"12px 16px",background:"rgba(22,163,74,.06)",border:"1px solid rgba(22,163,74,.2)",borderRadius:9}}>
                  <div style={{fontSize:11.5,fontWeight:700,color:GRAY,letterSpacing:".07em",textTransform:"uppercase",marginBottom:6}}>Calculation</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4px 0",fontSize:13,color:MID}}>
                    <span>Balance</span><span style={{textAlign:"right",fontWeight:700,color:DARK}}>{iAcct?usd(iAcct.balance):"—"}</span>
                    <span>APY</span><span style={{textAlign:"right",fontWeight:700,color:DARK}}>{selectedRate.value.toFixed(2)}%</span>
                    <span>Period</span><span style={{textAlign:"right",color:DARK}}>1 month (÷12)</span>
                    <div style={{gridColumn:"1/-1",height:1,background:"rgba(17,24,39,.1)",margin:"6px 0"}}/>
                    <span style={{fontWeight:700,color:DARK}}>Interest</span><span style={{textAlign:"right",fontFamily:FONT,fontWeight:800,fontSize:15,color:"#16A34A"}}>{usd(monthlyInterest)}</span>
                  </div>
                </div>
              )}
              {iErr&&<div style={{fontSize:13,color:"#DC2626",padding:"8px 12px",background:"rgba(220,38,38,.06)",borderRadius:7}}>{iErr}</div>}
              <button disabled={iBusy||monthlyInterest<=0} onClick={submitInterest} style={{background:"#16A34A",border:"none",borderRadius:10,padding:"11px 0",fontSize:14,fontWeight:700,color:"#fff",cursor:(iBusy||monthlyInterest<=0)?"not-allowed":"pointer",fontFamily:FONT,opacity:(iBusy||monthlyInterest<=0)?.5:1}}>
                {iBusy?"Posting…":`Post ${monthlyInterest>0?usd(monthlyInterest)+" ":""}Interest`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: REPORTS & ANALYTICS
═══════════════════════════════════════════════════════ */
function HBar({items,fmt}:{items:{label:string;value:number;color:string}[];fmt:(n:number)=>string}){
  const max=Math.max(...items.map(i=>Math.abs(i.value)),1);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {items.map(item=>{
        const pct=Math.round((Math.abs(item.value)/max)*100);
        return(
          <div key={item.label}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
              <span style={{fontSize:12.5,color:MID,fontWeight:500}}>{item.label}</span>
              <span style={{fontSize:12.5,fontWeight:700,color:DARK}}>{fmt(item.value)}</span>
            </div>
            <div style={{height:7,borderRadius:99,background:"rgba(17,24,39,.07)",overflow:"hidden"}}>
              <div style={{width:`${pct}%`,height:"100%",borderRadius:99,background:item.color,transition:"width .5s ease"}}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ReportsTab({users,accounts,txs,apps,disputes,fraudAlerts}:{users:UserRow[];accounts:AcctRow[];txs:TxRow[];apps:AppRow[];disputes:DisputeRow[];fraudAlerts:FraudAlert[]}){
  const depositAccts     = accounts.filter(a=>a.accountType!=="credit_card");
  const creditAccts      = accounts.filter(a=>a.accountType==="credit_card");
  const totalDeposits    = depositAccts.reduce((s,a)=>s+Math.max(a.balance,0),0);
  const totalOwed        = creditAccts.reduce((s,a)=>s+Math.abs(Math.min(a.balance,0)),0);
  const customerUsers    = users.filter(u=>u.role!=="admin");
  const openDisputes     = disputes.filter(d=>["open","under_review","more_info_needed"].includes(d.status));
  const openDisputeValue = openDisputes.reduce((s,d)=>s+d.amount,0);
  const openFraud        = fraudAlerts.filter(a=>a.status==="open").length;

  const TYPE_LABELS:Record<string,string>={
    checking:"Checking",savings:"Savings",credit_card:"Credit Card",
    money_market:"Money Market",cd:"CD",business_checking:"Business Checking",business_savings:"Business Savings",
  };
  const TYPE_COLORS:Record<string,string>={
    checking:"#2563EB",savings:"#16A34A",credit_card:RED,
    money_market:"#7C3AED",cd:"#D97706",business_checking:"#0891B2",business_savings:"#059669",
  };

  const acctByType=accounts.reduce((m,a)=>{
    const k=a.accountType||"other";
    if(!m[k]) m[k]={count:0,balance:0};
    m[k].count++;
    m[k].balance+=a.accountType==="credit_card"?0:Math.max(a.balance,0);
    return m;
  },{} as Record<string,{count:number;balance:number}>);

  const acctTypeItems=Object.entries(acctByType)
    .sort((a,b)=>b[1].balance-a[1].balance)
    .map(([type,{count,balance}])=>({
      label:`${TYPE_LABELS[type]||type} (${count})`,
      value:balance,
      color:TYPE_COLORS[type]||GRAY,
    }));

  const catMap=txs.reduce((m,t)=>{
    const cat=t.category||"Other";
    if(!m[cat]) m[cat]=0;
    m[cat]+=Math.abs(t.amount);
    return m;
  },{} as Record<string,number>);

  const catItems=Object.entries(catMap)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,8)
    .map(([label,value])=>({label,value,color:"#2563EB"}));

  const kycCounts={
    verified:users.filter(u=>u.kycStatus==="verified").length,
    pending: users.filter(u=>u.kycStatus==="pending").length,
    rejected:users.filter(u=>u.kycStatus==="rejected").length,
  };
  const appCounts={
    approved:apps.filter(a=>a.status==="approved").length,
    pending: apps.filter(a=>a.status==="pending").length,
    rejected:apps.filter(a=>a.status==="rejected").length,
  };
  const disputeByType=disputes.reduce((m,d)=>{
    const k=DISPUTE_TYPES.find(t=>t.v===d.disputeType)?.l||d.disputeType;
    if(!m[k]) m[k]=0; m[k]+=d.amount; return m;
  },{} as Record<string,number>);

  const fraudByRule=fraudAlerts.reduce((m,a)=>{
    const k=RULE_META[a.rule]?.label||a.rule;
    if(!m[k]) m[k]=0; m[k]++; return m;
  },{} as Record<string,number>);

  function downloadCSV(filename:string, rows:string[][]){
    const csv=rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(",")).join("\r\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a"); a.href=url; a.download=filename; a.click();
    URL.revokeObjectURL(url);
  }

  function exportAccounts(){ downloadCSV(`fscb-accounts-${new Date().toISOString().slice(0,10)}.csv`,[["ID","Name","Type","Last4","Balance","Status","User ID","Credit Limit"],...accounts.map(a=>[a.id,a.accountName,a.accountType,a.last4,String(a.balance),a.status,a.userId,String(a.creditLimit||"")])]); }
  function exportUsers(){    downloadCSV(`fscb-users-${new Date().toISOString().slice(0,10)}.csv`,[["ID","First","Last","Email","Phone","Since","KYC","Role","Accts","Balance"],...users.map(u=>[u.id,u.firstName,u.lastName,u.email,u.phone,u.memberSince,u.kycStatus,u.role,String(u.accountCount),String(u.totalBalance)])]); }
  function exportTxs(){      downloadCSV(`fscb-transactions-${new Date().toISOString().slice(0,10)}.csv`,[["ID","Merchant","Category","Amount","Date","User ID","Account ID"],...txs.map(t=>[t.id,t.merchant,t.category,String(t.amount),t.date,t.userId,t.accountId])]); }
  function exportDisputes(){ downloadCSV(`fscb-disputes-${new Date().toISOString().slice(0,10)}.csv`,[["ID","Reference","Type","Amount","Merchant","Status","Description","Opened","Resolved"],...disputes.map(d=>[d.id,d.referenceId,d.disputeType,String(d.amount),d.merchant,d.status,d.description,d.openedAt,d.resolvedAt||""])]); }

  const EXPORTS=[
    {label:"Export Accounts",     desc:`${accounts.length} accounts`,       fn:exportAccounts, color:"#2563EB", icon:"M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z"},
    {label:"Export Customers",    desc:`${customerUsers.length} customers`,  fn:exportUsers,    color:"#7C3AED", icon:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"},
    {label:"Export Transactions", desc:`${txs.length} recent posted`,        fn:exportTxs,      color:"#059669", icon:"M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4"},
    {label:"Export Disputes",     desc:`${disputes.length} cases`,           fn:exportDisputes, color:"#D97706", icon:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4"},
  ] as const;

  return(
    <div>
      <SectionHead title="Reports & Analytics" sub="Live data computed from the loaded snapshot — use CSV exports for full datasets"/>

      {/* Top stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(165px,1fr))",gap:14,marginBottom:24}}>
        <StatCard label="Total Deposits"     value={usd(totalDeposits)}     sub={`${depositAccts.length} deposit accounts`}     color="#059669" icon="M2 20h20M4 20V10M20 20V10M10 20V14h4v6M1 10l11-7 11 7"/>
        <StatCard label="Credit Outstanding" value={usd(totalOwed)}         sub={`${creditAccts.length} credit accounts`}       color={RED}     icon="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z"/>
        <StatCard label="Active Customers"   value={String(customerUsers.length)} sub={`${users.length} total registered`}    color="#2563EB" icon="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
        <StatCard label="Disputes at Risk"   value={usd(openDisputeValue)}  sub={`${openDisputes.length} open cases`}           color="#D97706" icon="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4"/>
        <StatCard label="Open Fraud Alerts"  value={String(openFraud)}      sub="requiring action"                              color={openFraud>0?"#DC2626":GRAY} icon="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/>
        <StatCard label="Pending Apps"       value={String(appCounts.pending)} sub={`${apps.length} total submitted`}          color={appCounts.pending>0?"#D97706":GRAY} icon="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6"/>
      </div>

      {/* Main charts row */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
        <div style={{...CARD,overflow:"hidden"}}>
          <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(17,24,39,.07)"}}>
            <div style={{fontFamily:FONT,fontWeight:700,fontSize:14,color:DARK}}>Balance by Account Type</div>
            <div style={{fontSize:12,color:GRAY,marginTop:2}}>Deposit balance under management, by product</div>
          </div>
          <div style={{padding:"20px"}}>
            {acctTypeItems.length===0
              ?<Empty msg="No accounts yet."/>
              :<HBar items={acctTypeItems} fmt={usd}/>
            }
          </div>
        </div>

        <div style={{...CARD,overflow:"hidden"}}>
          <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(17,24,39,.07)"}}>
            <div style={{fontFamily:FONT,fontWeight:700,fontSize:14,color:DARK}}>Top Transaction Categories</div>
            <div style={{fontSize:12,color:GRAY,marginTop:2}}>Volume from last 50 posted transactions</div>
          </div>
          <div style={{padding:"20px"}}>
            {catItems.length===0
              ?<Empty msg="No transactions yet."/>
              :<HBar items={catItems} fmt={usd}/>
            }
          </div>
        </div>
      </div>

      {/* Small metric cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,marginBottom:20}}>
        <div style={{...CARD,overflow:"hidden"}}>
          <div style={{padding:"14px 18px",borderBottom:"1px solid rgba(17,24,39,.07)"}}>
            <div style={{fontFamily:FONT,fontWeight:700,fontSize:13.5,color:DARK}}>KYC Verification Status</div>
          </div>
          <div style={{padding:"16px 18px"}}>
            <HBar items={[
              {label:`Verified (${kycCounts.verified})`,  value:kycCounts.verified,  color:"#16A34A"},
              {label:`Pending (${kycCounts.pending})`,    value:kycCounts.pending,   color:"#D97706"},
              {label:`Rejected (${kycCounts.rejected})`,  value:kycCounts.rejected,  color:"#DC2626"},
            ]} fmt={n=>String(n)}/>
          </div>
        </div>

        <div style={{...CARD,overflow:"hidden"}}>
          <div style={{padding:"14px 18px",borderBottom:"1px solid rgba(17,24,39,.07)"}}>
            <div style={{fontFamily:FONT,fontWeight:700,fontSize:13.5,color:DARK}}>Application Outcomes</div>
          </div>
          <div style={{padding:"16px 18px"}}>
            <HBar items={[
              {label:`Approved (${appCounts.approved})`, value:appCounts.approved, color:"#16A34A"},
              {label:`Pending (${appCounts.pending})`,   value:appCounts.pending,  color:"#D97706"},
              {label:`Rejected (${appCounts.rejected})`, value:appCounts.rejected, color:"#DC2626"},
            ]} fmt={n=>String(n)}/>
          </div>
        </div>

        <div style={{...CARD,overflow:"hidden"}}>
          <div style={{padding:"14px 18px",borderBottom:"1px solid rgba(17,24,39,.07)"}}>
            <div style={{fontFamily:FONT,fontWeight:700,fontSize:13.5,color:DARK}}>Fraud Alerts by Rule</div>
          </div>
          <div style={{padding:"16px 18px"}}>
            {Object.keys(fraudByRule).length===0
              ?<Empty msg="No fraud alerts yet."/>
              :<HBar items={Object.entries(fraudByRule).sort((a,b)=>b[1]-a[1]).map(([label,value])=>({label,value,color:RED}))} fmt={n=>String(n)}/>
            }
          </div>
        </div>
      </div>

      {/* Disputes breakdown */}
      {Object.keys(disputeByType).length>0&&(
        <div style={{...CARD,overflow:"hidden",marginBottom:20}}>
          <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(17,24,39,.07)"}}>
            <div style={{fontFamily:FONT,fontWeight:700,fontSize:14,color:DARK}}>Dispute Volume by Type</div>
            <div style={{fontSize:12,color:GRAY,marginTop:2}}>Total disputed amount across all cases, grouped by dispute category</div>
          </div>
          <div style={{padding:"20px"}}>
            <HBar items={Object.entries(disputeByType).sort((a,b)=>b[1]-a[1]).map(([label,value])=>({label,value,color:"#2563EB"}))} fmt={usd}/>
          </div>
        </div>
      )}

      {/* CSV Exports */}
      <div style={{...CARD,overflow:"hidden"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(17,24,39,.07)"}}>
          <div style={{fontFamily:FONT,fontWeight:700,fontSize:14,color:DARK}}>Data Exports</div>
          <div style={{fontSize:12,color:GRAY,marginTop:2}}>Download CSV files — all data currently loaded in this session</div>
        </div>
        <div style={{padding:"20px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>
          {EXPORTS.map(item=>(
            <button key={item.label} onClick={item.fn} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:`${item.color}08`,border:`1px solid ${item.color}25`,borderRadius:10,cursor:"pointer",fontFamily:"inherit",textAlign:"left",transition:"all .15s",width:"100%"}}>
              <div style={{width:38,height:38,borderRadius:9,background:`${item.color}15`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:item.color}}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={item.icon}/></svg>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13.5,fontWeight:700,color:DARK,marginBottom:2}}>{item.label}</div>
                <div style={{fontSize:12,color:GRAY}}>{item.desc}</div>
              </div>
              <svg style={{flexShrink:0}} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════════════ */
function AdminSidebar({active,set,adminName,adminEmail,onSignOut,fraudOpenCount,disputeOpenCount}:{active:string;set:(t:string)=>void;adminName:string;adminEmail:string;onSignOut:()=>void;fraudOpenCount:number;disputeOpenCount:number}){
  const initials=(adminName.split(" ").map(w=>w[0]).join("").slice(0,2)||"A").toUpperCase();
  return(
    <aside style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>

      {/* Logo */}
      <Link href="/" style={{display:"flex",alignItems:"center",gap:11,textDecoration:"none",padding:"20px 18px 18px",borderBottom:"1px solid rgba(255,255,255,.1)",flexShrink:0}}>
        <div style={{width:40,height:40,borderRadius:10,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
            <path d="M4 19V8.5L12 4l8 4.5V19" stroke={GOLD} strokeWidth="2.2" strokeLinejoin="round"/>
            <path d="M9 19v-5h6v5" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <div style={{fontFamily:FONT,fontWeight:800,fontSize:18,color:"#fff",letterSpacing:".01em",lineHeight:1.1}}>FSCB</div>
          <div style={{fontSize:8.5,letterSpacing:".28em",color:"rgba(255,255,255,.5)",textTransform:"uppercase",marginTop:2}}>Control Panel</div>
        </div>
      </Link>

      {/* Nav scroll area */}
      <div style={{flex:1,overflowY:"auto",padding:"14px 12px 8px"}}>
        <div style={{fontSize:9.5,fontWeight:700,letterSpacing:".13em",textTransform:"uppercase",color:"rgba(255,255,255,.4)",marginBottom:6,paddingLeft:8}}>Navigation</div>
        {CP_NAV.map(item=>{
          const on=active===item.id;
          const showBadge=(item.id==="Fraud"&&fraudOpenCount>0)||(item.id==="Disputes"&&disputeOpenCount>0);
          const badgeCount=item.id==="Fraud"?fraudOpenCount:disputeOpenCount;
          return(
            <button key={item.id} onClick={()=>set(item.id)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"8px 10px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:on?600:400,color:on?"#fff":"rgba(255,255,255,.68)",background:on?"rgba(255,255,255,.14)":"transparent",textAlign:"left",marginBottom:1,transition:"all .12s",borderLeft:on?`3px solid ${GOLD}`:"3px solid transparent"}}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={on?2.2:1.7} style={{flexShrink:0}}><path d={item.icon}/></svg>
              <span style={{flex:1}}>{item.label}</span>
              {showBadge&&<span style={{fontSize:10,fontWeight:700,padding:"1px 6px",borderRadius:99,background:GOLD,color:DARK,letterSpacing:".03em",flexShrink:0}}>{badgeCount}</span>}
            </button>
          );
        })}

        <div style={{height:1,background:"rgba(255,255,255,.1)",margin:"12px 4px"}}/>
        <div style={{fontSize:9.5,fontWeight:700,letterSpacing:".13em",textTransform:"uppercase",color:"rgba(255,255,255,.4)",marginBottom:6,paddingLeft:8}}>Quick Links</div>
        <Link href="/dashboard" style={{display:"flex",alignItems:"center",gap:10,padding:"8px 13px",borderRadius:8,fontSize:13,color:"rgba(255,255,255,.65)",textDecoration:"none",transition:"all .12s"}}
          onMouseEnter={e=>{const a=e.currentTarget as HTMLAnchorElement;a.style.color="#fff";a.style.background="rgba(255,255,255,.1)";}}
          onMouseLeave={e=>{const a=e.currentTarget as HTMLAnchorElement;a.style.color="rgba(255,255,255,.65)";a.style.background="transparent";}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10"/></svg>
          User Dashboard
        </Link>
      </div>

      {/* Admin profile footer */}
      <div style={{borderTop:"1px solid rgba(255,255,255,.1)",padding:"14px 16px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <div style={{width:34,height:34,borderRadius:"50%",background:GOLD,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONT,fontWeight:700,fontSize:12,color:DARK,flexShrink:0}}>{initials}</div>
          <div style={{minWidth:0}}>
            <div style={{fontSize:12.5,fontWeight:600,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{adminName}</div>
            <div style={{fontSize:10.5,color:"rgba(255,255,255,.48)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{adminEmail}</div>
          </div>
        </div>
        <button onClick={onSignOut} style={{display:"flex",alignItems:"center",gap:7,width:"100%",background:"rgba(255,255,255,.09)",border:"1px solid rgba(255,255,255,.16)",borderRadius:7,padding:"7px 12px",fontSize:12.5,color:"rgba(255,255,255,.72)",cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}
          onMouseEnter={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.background="rgba(255,255,255,.18)";b.style.color="#fff";}}
          onMouseLeave={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.background="rgba(255,255,255,.09)";b.style.color="rgba(255,255,255,.72)";}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          Sign out
        </button>
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */
export default function CpanelPage(){
  const [loading,  setLoading]  = useState(true);
  const [isAdmin,  setIsAdmin]  = useState(false);
  const [tab,      setTab]      = useState("Overview");
  const [adminInfo,setAdminInfo]= useState({name:"",email:""});

  const [users,       setUsers]       = useState<UserRow[]>([]);
  const [accounts,    setAccounts]    = useState<AcctRow[]>([]);
  const [txs,         setTxs]         = useState<TxRow[]>([]);
  const [pendingTxs,  setPendingTxs]  = useState<PendingTx[]>([]);
  const [apps,        setApps]        = useState<AppRow[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
  const [disputes,    setDisputes]    = useState<DisputeRow[]>([]);
  const [auditLogs,   setAuditLogs]   = useState<AuditLog[]>([]);
  const [rateConfigs, setRateConfigs] = useState<RateConfig[]>([]);
  const [feeSchedules,setFeeSchedules]= useState<FeeSchedule[]>([]);
  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([]);
  const [ofacScreenings,    setOfacScreenings]    = useState<OfacScreening[]>([]);

  const load = useCallback(async()=>{
    const sb=createClient();
    const {data:{user}}=await sb.auth.getUser();
    if(!user){window.location.href="/login";return;}

    /* Check admin role */
    const {data:myProfile}=await sb.from("profiles").select("first_name,last_name,role").eq("id",user.id).single();
    const role=(myProfile as Record<string,string>|null)?.role;
    if(role!=="admin"){setLoading(false);return;}

    setIsAdmin(true);
    setAdminInfo({name:`${(myProfile as Record<string,string>)?.first_name||""} ${(myProfile as Record<string,string>)?.last_name||""}`.trim()||user.email||"Admin",email:user.email||""});

    /* Fetch all data via server-side route (bypasses RLS) */
    const res = await fetch("/api/cpanel/data");
    const json = await res.json();
    const profiles            = json.profiles            ?? [];
    const accts               = json.accounts            ?? [];
    const transactions        = json.transactions        ?? [];
    const pendingTransactions = json.pendingTransactions ?? [];
    const applications        = json.applications        ?? [];
    const fraudAlertsRaw      = (json.fraudAlerts        ?? []) as Record<string,unknown>[];
    const disputesRaw         = (json.disputes           ?? []) as Record<string,unknown>[];
    const auditLogsRaw        = (json.auditLogs          ?? []) as Record<string,unknown>[];
    const rateConfigRaw       = (json.rateConfig         ?? []) as Record<string,unknown>[];
    const feeScheduleRaw      = (json.feeSchedule        ?? []) as Record<string,unknown>[];
    const complianceRaw       = (json.complianceReports  ?? []) as Record<string,unknown>[];
    const ofacRaw             = (json.ofacScreenings     ?? []) as Record<string,unknown>[];

    /* Map users + aggregate balances */
    const acctList=(accts??[]) as Record<string,unknown>[];
    const profList=(profiles??[]) as Record<string,unknown>[];

    const mappedUsers:UserRow[]=profList.map(p=>{
      const ua=acctList.filter(a=>a.user_id===p.id);
      return{
        id:String(p.id),
        email:String(p.email||""),
        firstName:String(p.first_name||""),
        lastName:String(p.last_name||""),
        phone:String(p.phone||""),
        memberSince:p.member_since?new Date(String(p.member_since)).getFullYear().toString():"",
        role:String(p.role||"user"),
        kycStatus:String(p.kyc_status||"pending"),
        accountCount:ua.length,
        totalBalance:ua.reduce((s,a)=>s+Number(a.balance||0),0),
      };
    });

    const mappedAccts:AcctRow[]=acctList.map(a=>({
      id:String(a.id),userId:String(a.user_id),
      accountType:String(a.account_type||""),
      accountName:String(a.account_name||""),
      last4:String(a.account_number_last4||""),
      balance:Number(a.balance||0),
      status:String(a.status||"active"),
      creditLimit:Number(a.credit_limit??5000),
    }));

    const mappedTxs:TxRow[]=((transactions??[]) as Record<string,unknown>[]).map(t=>({
      id:String(t.id),merchant:String(t.merchant||""),
      category:String(t.category||""),amount:Number(t.amount||0),
      date:new Date(String(t.posted_at)).toLocaleDateString("en-US",{month:"short",day:"numeric"}),
      userId:String(t.user_id||""),accountId:String(t.account_id||""),
    }));

    const pendingList=((pendingTransactions??[]) as Record<string,unknown>[]);
    const mappedPending:PendingTx[]=pendingList.map(t=>{
      const prof=profList.find(p=>p.id===t.user_id);
      const acct=acctList.find(a=>a.id===t.account_id);
      let extDetails:ExtDetails|undefined;
      let displayMemo=String(t.memo||"");
      try{
        const parsed=JSON.parse(String(t.memo||""));
        if(parsed.type==="external_transfer"){
          extDetails={bankName:String(parsed.bankName||""),routingNumber:String(parsed.routingNumber||""),accountNumber:String(parsed.accountNumber||""),accountType:String(parsed.accountType||""),holderName:String(parsed.holderName||""),note:String(parsed.note||"")};
          displayMemo=parsed.note||"";
        }
      }catch{/* not JSON */}
      return{
        id:String(t.id),
        userId:String(t.user_id||""),
        userName:prof?`${prof.first_name||""} ${prof.last_name||""}`.trim():String(t.user_id||""),
        accountId:String(t.account_id||""),
        accountName:String(acct?.account_name||""),
        accountLast4:String(acct?.account_number_last4||""),
        merchant:String(t.merchant||""),
        category:String(t.category||""),
        amount:Number(t.amount||0),
        transactionType:String(t.transaction_type||"debit"),
        memo:displayMemo,
        submittedAt:String(t.submitted_at||t.posted_at||""),
        postedAt:String(t.posted_at||new Date().toISOString()),
        extDetails,
      };
    });

    const mappedApps:AppRow[]=((applications??[]) as Record<string,unknown>[]).map(a=>({
      id:String(a.id),
      referenceId:String(a.reference_id||""),
      firstName:String(a.first_name||""),
      lastName:String(a.last_name||""),
      email:String(a.email||""),
      phone:String(a.phone||""),
      accountType:String(a.account_type||""),
      accountName:String(a.account_name||a.account_type||""),
      category:String(a.category||""),
      status:String(a.status||"pending"),
      submittedAt:String(a.submitted_at||""),
      userId:String(a.user_id||""),
    }));

    const mappedFraud:FraudAlert[]=fraudAlertsRaw.map(a=>({
      id:String(a.id),
      accountId:String(a.account_id),
      userId:String(a.user_id),
      transactionId:a.transaction_id?String(a.transaction_id):null,
      rule:String(a.rule),
      severity:String(a.severity||"medium"),
      details:(a.details as Record<string,unknown>)??{},
      status:String(a.status),
      createdAt:String(a.created_at),
    }));

    const mappedDisputes:DisputeRow[]=disputesRaw.map(d=>({
      id:String(d.id),
      userId:String(d.user_id),
      accountId:String(d.account_id),
      transactionId:d.transaction_id?String(d.transaction_id):null,
      referenceId:String(d.reference_id||""),
      disputeType:String(d.dispute_type||"other"),
      amount:Number(d.amount||0),
      merchant:String(d.merchant||""),
      description:String(d.description||""),
      status:String(d.status||"open"),
      adminNotes:String(d.admin_notes||""),
      creditTxId:d.credit_tx_id?String(d.credit_tx_id):null,
      openedAt:String(d.opened_at||d.created_at||""),
      resolvedAt:d.resolved_at?String(d.resolved_at):null,
    }));

    setUsers(mappedUsers);
    setAccounts(mappedAccts);
    setTxs(mappedTxs);
    setPendingTxs(mappedPending);
    setApps(mappedApps);
    setFraudAlerts(mappedFraud);
    const mappedAudit:AuditLog[]=auditLogsRaw.map(l=>({
      id:String(l.id),
      adminId:String(l.admin_id||""),
      adminEmail:String(l.admin_email||""),
      action:String(l.action||""),
      entityType:String(l.entity_type||""),
      entityId:l.entity_id?String(l.entity_id):null,
      details:(l.details as Record<string,unknown>)??{},
      createdAt:String(l.created_at||""),
    }));

    setDisputes(mappedDisputes);
    setAuditLogs(mappedAudit);

    const mappedRates:RateConfig[]=rateConfigRaw.map(r=>({
      key:String(r.key),label:String(r.label),productType:String(r.product_type||""),
      rateType:String(r.rate_type||"apy"),value:Number(r.value||0),
      updatedAt:String(r.updated_at||""),updatedBy:r.updated_by?String(r.updated_by):null,
    }));
    const mappedFees:FeeSchedule[]=feeScheduleRaw.map(f=>({
      key:String(f.key),label:String(f.label),description:String(f.description||""),
      amount:Number(f.amount||0),waivable:Boolean(f.waivable),active:Boolean(f.active),
      updatedAt:String(f.updated_at||""),updatedBy:f.updated_by?String(f.updated_by):null,
    }));
    setRateConfigs(mappedRates);
    setFeeSchedules(mappedFees);

    const mappedCompliance:ComplianceReport[]=complianceRaw.map(r=>({
      id:String(r.id), reportType:String(r.report_type||""),
      referenceId:String(r.reference_id||""),
      userId:r.user_id?String(r.user_id):null,
      accountId:r.account_id?String(r.account_id):null,
      transactionId:r.transaction_id?String(r.transaction_id):null,
      subjectName:String(r.subject_name||""),
      amount:r.amount!=null?Number(r.amount):null,
      description:String(r.description||""),
      status:String(r.status||"draft"),
      filedAt:r.filed_at?String(r.filed_at):null,
      filedBy:r.filed_by?String(r.filed_by):null,
      createdAt:String(r.created_at||""),
    }));
    const mappedOfac:OfacScreening[]=ofacRaw.map(s=>({
      id:String(s.id), userId:s.user_id?String(s.user_id):null,
      screenedName:String(s.screened_name||""),
      matchScore:Number(s.match_score||0),
      matchedEntry:s.matched_entry?String(s.matched_entry):null,
      status:String(s.status||"clear"),
      reviewedBy:s.reviewed_by?String(s.reviewed_by):null,
      reviewedAt:s.reviewed_at?String(s.reviewed_at):null,
      createdAt:String(s.created_at||""),
    }));
    setComplianceReports(mappedCompliance);
    setOfacScreenings(mappedOfac);

    setLoading(false);

    fetch("/api/cpanel/action",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"syncCreditAvailableBalances"})});
  },[]);

  useEffect(()=>{load();},[load]);

  /* ── Actions ── */
  async function cAction(payload:Record<string,unknown>):Promise<string|null>{
    const res=await fetch("/api/cpanel/action",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
    if(!res.ok){const j=await res.json().catch(()=>({}));return(j as Record<string,string>).error||"Request failed";}
    return null;
  }

  async function handleFreezeToggle(acctId:string, nowFrozen:boolean, _userId:string){
    const err=await cAction({action:"freezeToggle",acctId,nowFrozen});
    if(!err) setAccounts(prev=>prev.map(a=>a.id===acctId?{...a,status:nowFrozen?"frozen":"active"}:a));
  }

  async function handleAppStatus(id:string, status:"approved"|"rejected"){
    if(status==="approved"){
      await fetch("/api/cpanel/approve",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({applicationId:id})});
    } else {
      await cAction({action:"rejectApplication",applicationId:id});
    }
    setApps(prev=>prev.map(a=>a.id===id?{...a,status}:a));
  }

  async function handleApproveTransaction(tx:PendingTx, date:string){
    const res=await fetch("/api/cpanel/action",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"approveTransaction",txId:tx.id,accountId:tx.accountId,amount:tx.amount,date})});
    if(!res.ok) return;
    const {pairedTxId}=await res.json() as {pairedTxId:string|null};
    const pairedTx=pairedTxId?pendingTxs.find(t=>t.id===pairedTxId):null;
    setAccounts(prev=>{
      let next=prev.map(a=>a.id===tx.accountId?{...a,balance:a.balance+tx.amount}:a);
      if(pairedTx) next=next.map(a=>a.id===pairedTx.accountId?{...a,balance:a.balance+pairedTx.amount}:a);
      return next;
    });
    setPendingTxs(prev=>prev.filter(t=>t.id!==tx.id&&t.id!==pairedTxId));
  }

  async function handleRejectTransaction(txId:string){
    const res=await fetch("/api/cpanel/action",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"rejectTransaction",txId})});
    if(!res.ok) return;
    const {pairedTxId}=await res.json() as {pairedTxId:string|null};
    setPendingTxs(prev=>prev.filter(t=>t.id!==txId&&t.id!==pairedTxId));
  }

  async function handleManualTransaction(form:{accountId:string;userId:string;amount:number;merchant:string;category:string;date:string}):Promise<string|null>{
    const err=await cAction({action:"manualTransaction",...form});
    if(!err){
      const acct=accounts.find(a=>a.id===form.accountId);
      if(acct) setAccounts(prev=>prev.map(a=>a.id===form.accountId?{...a,balance:acct.balance+form.amount}:a));
    }
    return err;
  }

  async function handleKYCUpdate(userId:string, kycStatus:string){
    const err=await cAction({action:"kycUpdate",userId,kycStatus});
    if(!err) setUsers(prev=>prev.map(u=>u.id===userId?{...u,kycStatus}:u));
  }

  async function handleDismissFraudAlert(alertId:string){
    const err=await cAction({action:"dismissFraudAlert",alertId});
    if(!err) setFraudAlerts(prev=>prev.map(a=>a.id===alertId?{...a,status:"dismissed"}:a));
  }

  async function handleFreezeFromFraud(alertId:string, acctId:string){
    const err=await cAction({action:"freezeFromFraud",alertId,acctId});
    if(!err){
      setFraudAlerts(prev=>prev.map(a=>a.id===alertId?{...a,status:"actioned"}:a));
      setAccounts(prev=>prev.map(a=>a.id===acctId?{...a,status:"frozen"}:a));
    }
  }

  async function handleOpenDispute(d:{userId:string;accountId:string;transactionId:string|null;disputeType:string;amount:number;merchant:string;description:string}):Promise<string|null>{
    const res=await fetch("/api/cpanel/action",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"openDispute",...d})});
    const json=await res.json() as Record<string,string>;
    if(!res.ok) return json.error||"Failed";
    const newDispute:DisputeRow={
      id:crypto.randomUUID(),userId:d.userId,accountId:d.accountId,
      transactionId:d.transactionId,referenceId:json.refId,
      disputeType:d.disputeType,amount:d.amount,merchant:d.merchant,
      description:d.description,status:"open",adminNotes:"",
      creditTxId:null,openedAt:new Date().toISOString(),resolvedAt:null,
    };
    setDisputes(prev=>[newDispute,...prev]);
    return json.refId;
  }

  async function handleApproveDispute(disputeId:string,accountId:string,userId:string,amount:number,merchant:string,notes:string):Promise<string|null>{
    const err=await cAction({action:"approveDispute",disputeId,accountId,userId,amount,merchant,adminNotes:notes});
    if(!err){
      setDisputes(prev=>prev.map(d=>d.id===disputeId?{...d,status:"approved",resolvedAt:new Date().toISOString()}:d));
      setAccounts(prev=>prev.map(a=>a.id===accountId?{...a,balance:a.balance+Math.abs(amount)}:a));
    }
    return err;
  }

  async function handleDenyDispute(disputeId:string,notes:string):Promise<string|null>{
    const err=await cAction({action:"denyDispute",disputeId,adminNotes:notes});
    if(!err) setDisputes(prev=>prev.map(d=>d.id===disputeId?{...d,status:"denied",adminNotes:notes,resolvedAt:new Date().toISOString()}:d));
    return err;
  }

  async function handleRequestDisputeInfo(disputeId:string,notes:string):Promise<string|null>{
    const err=await cAction({action:"requestDisputeInfo",disputeId,adminNotes:notes});
    if(!err) setDisputes(prev=>prev.map(d=>d.id===disputeId?{...d,status:"more_info_needed",adminNotes:notes}:d));
    return err;
  }

  async function handleReviewDispute(disputeId:string):Promise<void>{
    const err=await cAction({action:"reviewDispute",disputeId});
    if(!err) setDisputes(prev=>prev.map(d=>d.id===disputeId?{...d,status:"under_review"}:d));
  }

  async function handleCreditLimitUpdate(acctId:string, limit:number):Promise<string|null>{
    const err=await cAction({action:"setCreditLimit",acctId,limit});
    if(!err) setAccounts(prev=>prev.map(a=>a.id===acctId?{...a,creditLimit:limit}:a));
    return err;
  }

  async function handleFileSAR(d:{userId:string;accountId:string;transactionId:string;subjectName:string;amount:string;description:string}):Promise<string|null>{
    const res=await fetch("/api/cpanel/action",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"fileSAR",...d})});
    const json=await res.json() as Record<string,string>;
    if(!res.ok) return json.error||"Failed";
    const newReport:ComplianceReport={id:crypto.randomUUID(),reportType:"SAR",referenceId:json.refId,userId:d.userId||null,accountId:d.accountId||null,transactionId:d.transactionId||null,subjectName:d.subjectName,amount:d.amount?Number(d.amount):null,description:d.description,status:"draft",filedAt:null,filedBy:null,createdAt:new Date().toISOString()};
    setComplianceReports(prev=>[newReport,...prev]);
    return json.refId;
  }

  async function handleFileCTR(d:{userId:string;accountId:string;transactionId:string;subjectName:string;amount:string;description:string}):Promise<string|null>{
    const res=await fetch("/api/cpanel/action",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"fileCTR",...d})});
    const json=await res.json() as Record<string,string>;
    if(!res.ok) return json.error||"Failed";
    const newReport:ComplianceReport={id:crypto.randomUUID(),reportType:"CTR",referenceId:json.refId,userId:d.userId||null,accountId:d.accountId||null,transactionId:d.transactionId||null,subjectName:d.subjectName,amount:d.amount?Number(d.amount):null,description:d.description,status:"filed",filedAt:new Date().toISOString(),filedBy:"admin",createdAt:new Date().toISOString()};
    setComplianceReports(prev=>[newReport,...prev]);
    return json.refId;
  }

  async function handleUpdateComplianceStatus(reportId:string, status:string):Promise<string|null>{
    const err=await cAction({action:"updateComplianceStatus",reportId,status});
    if(!err) setComplianceReports(prev=>prev.map(r=>r.id===reportId?{...r,status}:r));
    return err;
  }

  async function handleOfacScreen(userId:string, name:string):Promise<OfacScreening|null>{
    const res=await fetch("/api/cpanel/compliance/ofac-screen",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId,name})});
    const json=await res.json() as {screening:Record<string,unknown>;error?:string};
    if(!res.ok) return null;
    const s=json.screening;
    const mapped:OfacScreening={id:String(s.id),userId:s.user_id?String(s.user_id):null,screenedName:String(s.screened_name||""),matchScore:Number(s.match_score||0),matchedEntry:s.matched_entry?String(s.matched_entry):null,status:String(s.status||"clear"),reviewedBy:null,reviewedAt:null,createdAt:String(s.created_at||"")};
    setOfacScreenings(prev=>[mapped,...prev]);
    return mapped;
  }

  async function handleUpdateOfacScreening(screeningId:string, status:string):Promise<string|null>{
    const err=await cAction({action:"updateOfacScreening",screeningId,status});
    if(!err) setOfacScreenings(prev=>prev.map(s=>s.id===screeningId?{...s,status}:s));
    return err;
  }

  async function handleUpdateRate(key:string, value:number):Promise<string|null>{
    const err=await cAction({action:"updateRate",key,value});
    if(!err) setRateConfigs(prev=>prev.map(r=>r.key===key?{...r,value}:r));
    return err;
  }

  async function handleUpdateFee(key:string, amount:number):Promise<string|null>{
    const err=await cAction({action:"updateFee",key,amount});
    if(!err) setFeeSchedules(prev=>prev.map(f=>f.key===key?{...f,amount}:f));
    return err;
  }

  async function handleApplyFee(accountId:string, userId:string, amount:number, feeLabel:string):Promise<string|null>{
    const err=await cAction({action:"applyFee",accountId,userId,amount,feeLabel});
    if(!err) setAccounts(prev=>prev.map(a=>a.id===accountId?{...a,balance:a.balance-Math.abs(amount)}:a));
    return err;
  }

  async function handleApplyInterest(accountId:string, userId:string, amount:number, rateLabel:string):Promise<string|null>{
    const err=await cAction({action:"applyInterest",accountId,userId,amount,rateLabel});
    if(!err) setAccounts(prev=>prev.map(a=>a.id===accountId?{...a,balance:a.balance+Math.abs(amount)}:a));
    return err;
  }

  async function signOut(){
    const sb=createClient();
    await sb.auth.signOut();
    window.location.href="/login";
  }

  /* ── Render ── */
  if(loading) return <LoadingSpinner/>;
  if(!isAdmin) return <AccessDenied/>;

  return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"Inter,system-ui,sans-serif",display:"flex"}}>

      {/* ── Fixed red sidebar ── */}
      <div style={{
        width:262,flexShrink:0,position:"fixed",top:0,left:0,bottom:0,zIndex:40,
        background:RED,display:"flex",flexDirection:"column",
        boxShadow:"3px 0 16px rgba(0,0,0,.18)"
      }}>
        <AdminSidebar
          active={tab}
          set={setTab}
          adminName={adminInfo.name}
          adminEmail={adminInfo.email}
          onSignOut={signOut}
          fraudOpenCount={fraudAlerts.filter(a=>a.status==="open").length}
          disputeOpenCount={disputes.filter(d=>d.status==="open"||d.status==="more_info_needed").length}
        />
      </div>

      {/* ── Main column ── */}
      <div style={{marginLeft:262,flex:1,display:"flex",flexDirection:"column",minHeight:"100vh",minWidth:0}}>

        {/* Red topbar */}
        <header style={{
          position:"sticky",top:0,zIndex:30,
          background:RED,
          boxShadow:"0 2px 10px rgba(140,29,37,.25)",
          padding:"0 32px",height:58,
          display:"flex",alignItems:"center",gap:16,flexShrink:0
        }}>
          <div style={{flex:1,display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:2,height:18,background:GOLD,borderRadius:2,flexShrink:0}}/>
            <span style={{fontFamily:FONT,fontWeight:700,fontSize:15,color:"#fff",letterSpacing:".01em"}}>{tab}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:7,padding:"5px 11px 5px 9px",borderRadius:8,background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.18)"}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span style={{fontSize:12.5,fontWeight:700,color:GOLD,letterSpacing:".04em"}}>ADMIN</span>
          </div>
        </header>

        {/* Content — full width, no maxWidth cap */}
        <main style={{flex:1,padding:"28px 36px",width:"100%",boxSizing:"border-box"}}>
          {tab==="Overview"      && <OverviewTab users={users} accounts={accounts} txs={txs} apps={apps}/>}
          {tab==="Users"         && <UsersTab    users={users} accounts={accounts} onFreezeToggle={handleFreezeToggle} onCreditLimitUpdate={handleCreditLimitUpdate}/>}
          {tab==="Transactions"  && <TransactionsTab users={users} accounts={accounts} pendingTxs={pendingTxs} onApprove={handleApproveTransaction} onReject={handleRejectTransaction} onManual={handleManualTransaction}/>}
          {tab==="KYC"           && <KYCTab users={users} onUpdate={handleKYCUpdate}/>}
          {tab==="Statements"    && <StatementsTab users={users} accounts={accounts}/>}
          {tab==="Audit"         && <AuditTab logs={auditLogs}/>}
          {tab==="Reports"       && <ReportsTab users={users} accounts={accounts} txs={txs} apps={apps} disputes={disputes} fraudAlerts={fraudAlerts}/>}
          {tab==="Rates"         && <RatesTab rates={rateConfigs} fees={feeSchedules} users={users} accounts={accounts} onUpdateRate={handleUpdateRate} onUpdateFee={handleUpdateFee} onApplyFee={handleApplyFee} onApplyInterest={handleApplyInterest}/>}
          {tab==="Compliance"    && <ComplianceTab reports={complianceReports} screenings={ofacScreenings} users={users} accounts={accounts} txs={txs} onFileSAR={handleFileSAR} onFileCTR={handleFileCTR} onUpdateStatus={handleUpdateComplianceStatus} onOfacScreen={handleOfacScreen} onUpdateScreening={handleUpdateOfacScreening}/>}
          {tab==="Fraud"         && <FraudTab alerts={fraudAlerts} accounts={accounts} users={users} onDismiss={handleDismissFraudAlert} onFreeze={handleFreezeFromFraud} onScanComplete={setFraudAlerts}/>}
          {tab==="Disputes"      && <DisputesTab disputes={disputes} users={users} accounts={accounts} txs={txs} onOpen={handleOpenDispute} onApprove={handleApproveDispute} onDeny={handleDenyDispute} onRequestInfo={handleRequestDisputeInfo} onReview={handleReviewDispute}/>}
          {tab==="Applications"  && <ApplicationsTab apps={apps} onUpdateStatus={handleAppStatus}/>}
          {tab==="Notifications" && <NotificationsTab users={users}/>}
        </main>
      </div>

    </div>
  );
}
