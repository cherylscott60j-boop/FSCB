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
type DisputeRow = {
  id:string; userId:string; accountId:string;
  transactionId:string|null; referenceId:string;
  disputeType:string; amount:number; merchant:string;
  description:string; status:string; adminNotes:string;
  creditTxId:string|null; openedAt:string; resolvedAt:string|null;
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
    <div style={{...CARD,padding:"20px 22px",display:"flex",alignItems:"flex-start",gap:14}}>
      <div style={{width:42,height:42,borderRadius:10,background:c+"15",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:c}}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={icon}/></svg>
      </div>
      <div>
        <div style={{fontSize:11.5,fontWeight:600,color:GRAY,letterSpacing:".06em",textTransform:"uppercase",marginBottom:4}}>{label}</div>
        <div style={{fontFamily:FONT,fontWeight:800,fontSize:24,color:DARK,letterSpacing:"-.02em"}}>{value}</div>
        {sub&&<div style={{fontSize:12,color:GRAY,marginTop:2}}>{sub}</div>}
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
   SIDEBAR
═══════════════════════════════════════════════════════ */
function AdminSidebar({active,set,adminName,adminEmail,onSignOut,fraudOpenCount,disputeOpenCount}:{active:string;set:(t:string)=>void;adminName:string;adminEmail:string;onSignOut:()=>void;fraudOpenCount:number;disputeOpenCount:number}){
  const initials=(adminName.split(" ").map(w=>w[0]).join("").slice(0,2)||"A").toUpperCase();
  return(
    <aside style={{display:"flex",flexDirection:"column",flex:1,height:"100%",overflowY:"auto"}}>
      <div style={{padding:"20px 16px 8px",flex:1,overflowY:"auto"}}>

        {/* Admin badge */}
        <div style={{background:"rgba(140,29,37,.07)",border:"1px solid rgba(140,29,37,.15)",borderRadius:9,padding:"8px 12px",marginBottom:18,display:"flex",alignItems:"center",gap:8}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span style={{fontSize:12,fontWeight:700,color:RED,letterSpacing:".04em"}}>ADMIN CONTROL PANEL</span>
        </div>

        {/* Nav */}
        <div style={{fontSize:10.5,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:GRAY,marginBottom:8,paddingLeft:8}}>Navigation</div>
        {CP_NAV.map(item=>{
          const on=active===item.id;
          const showBadge=(item.id==="Fraud"&&fraudOpenCount>0)||(item.id==="Disputes"&&disputeOpenCount>0);
          const badgeCount=item.id==="Fraud"?fraudOpenCount:disputeOpenCount;
          return(
            <button key={item.id} onClick={()=>set(item.id)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"9px 12px",borderRadius:9,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13.5,fontWeight:on?600:400,color:on?RED:MID,background:on?"rgba(140,29,37,.07)":"transparent",textAlign:"left",marginBottom:2,transition:"all .15s",borderLeft:on?`3px solid ${RED}`:"3px solid transparent"}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={on?2.2:1.8} style={{flexShrink:0}}><path d={item.icon}/></svg>
              <span style={{flex:1}}>{item.label}</span>
              {showBadge&&<span style={{fontSize:10.5,fontWeight:700,padding:"1px 6px",borderRadius:99,background:"#DC2626",color:"#fff",letterSpacing:".03em",flexShrink:0}}>{badgeCount}</span>}
            </button>
          );
        })}

        {/* Divider + user dashboard link */}
        <div style={{height:1,background:"rgba(17,24,39,.07)",margin:"14px 0 12px"}}/>
        <div style={{fontSize:10.5,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:GRAY,marginBottom:8,paddingLeft:8}}>Links</div>
        <Link href="/dashboard" style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:9,fontSize:13,color:MID,textDecoration:"none",borderLeft:"3px solid transparent",transition:"all .15s"}}
          onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.color=RED;(e.currentTarget as HTMLAnchorElement).style.borderLeftColor=RED;}}
          onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.color=MID;(e.currentTarget as HTMLAnchorElement).style.borderLeftColor="transparent";}}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10"/></svg>
          User Dashboard
        </Link>
      </div>

      {/* Bottom */}
      <div style={{borderTop:"1px solid rgba(17,24,39,.07)",padding:"16px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <div style={{width:34,height:34,borderRadius:"50%",background:RED,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONT,fontWeight:700,fontSize:12,color:"#fff",flexShrink:0}}>{initials}</div>
          <div style={{minWidth:0}}>
            <div style={{fontSize:13,fontWeight:600,color:DARK,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{adminName}</div>
            <div style={{fontSize:11,color:GRAY,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{adminEmail}</div>
          </div>
        </div>
        <button onClick={onSignOut} style={{display:"flex",alignItems:"center",gap:8,width:"100%",background:"none",border:"1px solid rgba(17,24,39,.1)",borderRadius:8,padding:"8px 12px",fontSize:13,color:GRAY,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}
          onMouseEnter={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.color=RED;b.style.borderColor="rgba(140,29,37,.3)";}}
          onMouseLeave={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.color=GRAY;b.style.borderColor="rgba(17,24,39,.1)";}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
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
    setDisputes(mappedDisputes);
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

  async function signOut(){
    const sb=createClient();
    await sb.auth.signOut();
    window.location.href="/login";
  }

  /* ── Render ── */
  if(loading) return <LoadingSpinner/>;
  if(!isAdmin) return <AccessDenied/>;

  return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"Inter,system-ui,sans-serif"}}>

      {/* ── Header ── */}
      <header style={{position:"sticky",top:0,zIndex:50,background:"#fff",borderBottom:"1px solid rgba(17,24,39,.09)",boxShadow:"0 1px 4px rgba(17,24,39,.06)"}}>
        <div style={{maxWidth:"100%",padding:"0 24px",height:60,display:"flex",alignItems:"center",gap:16}}>

          {/* Logo */}
          <Link href="/" style={{display:"flex",alignItems:"center",gap:9,textDecoration:"none",flexShrink:0}}>
            <div style={{width:34,height:34,borderRadius:9,background:RED,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M4 19V8.5L12 4l8 4.5V19" stroke={GOLD} strokeWidth="2" strokeLinejoin="round"/>
                <path d="M9 19v-5h6v5" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{lineHeight:1.15}}>
              <div style={{fontFamily:FONT,fontWeight:800,fontSize:15,color:RED}}>FSCB</div>
              <div style={{fontSize:8,letterSpacing:".3em",color:GRAY,textTransform:"uppercase"}}>Control Panel</div>
            </div>
          </Link>

          <div style={{flex:1,display:"flex",alignItems:"center"}}>
            <span style={{fontSize:14,fontWeight:600,color:DARK}}>{tab}</span>
          </div>

          {/* Admin chip */}
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"5px 10px 5px 8px",borderRadius:8,background:"rgba(140,29,37,.07)",border:"1px solid rgba(140,29,37,.18)"}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span style={{fontSize:12.5,fontWeight:700,color:RED}}>Admin</span>
          </div>
        </div>
      </header>

      {/* ── Layout ── */}
      <div className="cpanel-layout" style={{display:"grid",gridTemplateColumns:"240px 1fr",minHeight:"calc(100vh - 60px)"}}>

        {/* Sidebar */}
        <div className="cpanel-sidebar" style={{borderRight:"1px solid rgba(17,24,39,.08)",background:"#fff",position:"sticky",top:60,height:"calc(100vh - 60px)"}}>
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

        {/* Main content */}
        <main style={{padding:"28px 32px",maxWidth:1200,width:"100%"}}>
          {tab==="Overview"      && <OverviewTab users={users} accounts={accounts} txs={txs} apps={apps}/>}
          {tab==="Users"         && <UsersTab    users={users} accounts={accounts} onFreezeToggle={handleFreezeToggle} onCreditLimitUpdate={handleCreditLimitUpdate}/>}
          {tab==="Transactions"  && <TransactionsTab users={users} accounts={accounts} pendingTxs={pendingTxs} onApprove={handleApproveTransaction} onReject={handleRejectTransaction} onManual={handleManualTransaction}/>}
          {tab==="KYC"           && <KYCTab users={users} onUpdate={handleKYCUpdate}/>}
          {tab==="Fraud"         && <FraudTab alerts={fraudAlerts} accounts={accounts} users={users} onDismiss={handleDismissFraudAlert} onFreeze={handleFreezeFromFraud} onScanComplete={setFraudAlerts}/>}
          {tab==="Disputes"      && <DisputesTab disputes={disputes} users={users} accounts={accounts} txs={txs} onOpen={handleOpenDispute} onApprove={handleApproveDispute} onDeny={handleDenyDispute} onRequestInfo={handleRequestDisputeInfo} onReview={handleReviewDispute}/>}
          {tab==="Applications"  && <ApplicationsTab apps={apps} onUpdateStatus={handleAppStatus}/>}
          {tab==="Notifications" && <NotificationsTab users={users}/>}
        </main>
      </div>

    </div>
  );
}
