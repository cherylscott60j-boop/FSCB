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

  async function saveCreditLimit(acct:AcctRow){
    const val=parseFloat(limitInput);
    if(isNaN(val)||val<0){setLimitErr("Enter a valid amount.");return;}
    if(val>50000){setLimitErr("Maximum limit is $50,000.");return;}
    setLimitBusy(true);setLimitErr("");
    const err=await onCreditLimitUpdate(acct.id,val);
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
                                  <div style={{fontFamily:FONT,fontWeight:700,fontSize:15,color:a.balance<0?"#DC2626":DARK}}>{usd(a.balance)}</div>
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
                                            type="number" min="0" max="50000" step="100"
                                            value={limitInput}
                                            onChange={e=>setLimitInput(e.target.value)}
                                            onKeyDown={e=>{if(e.key==="Enter")saveCreditLimit(a);if(e.key==="Escape")setEditingLimit(null);}}
                                            autoFocus
                                            style={{...INP,width:130,paddingLeft:22,fontSize:13,height:32,padding:"4px 8px 4px 22px"}}
                                          />
                                        </div>
                                        <button disabled={limitBusy} onClick={()=>saveCreditLimit(a)} style={{background:"rgba(22,163,74,.09)",border:"1px solid rgba(22,163,74,.25)",borderRadius:7,padding:"4px 12px",fontSize:12,fontWeight:600,color:"#16A34A",cursor:limitBusy?"not-allowed":"pointer",fontFamily:"inherit",opacity:limitBusy?.5:1}}>
                                          {limitBusy?"…":"Save"}
                                        </button>
                                        <button onClick={()=>{setEditingLimit(null);setLimitErr("");}} style={{background:"rgba(17,24,39,.05)",border:"1px solid rgba(17,24,39,.12)",borderRadius:7,padding:"4px 10px",fontSize:12,fontWeight:600,color:GRAY,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
                                        {limitErr&&<span style={{fontSize:12,color:"#DC2626"}}>{limitErr}</span>}
                                      </>
                                    ):(
                                      <>
                                        <span style={{fontSize:13,fontWeight:700,color:DARK}}>{a.creditLimit>0?usd(a.creditLimit):"Not set"}</span>
                                        <button onClick={()=>{setEditingLimit(a.id);setLimitInput(a.creditLimit>0?String(a.creditLimit):"");setLimitErr("");}} style={{display:"flex",alignItems:"center",gap:5,background:"rgba(212,175,55,.08)",border:"1px solid rgba(212,175,55,.3)",borderRadius:7,padding:"4px 10px",fontSize:12,fontWeight:600,color:"#92701A",cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>
                                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                          {a.creditLimit>0?"Edit Limit":"Set Limit"}
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
   SIDEBAR
═══════════════════════════════════════════════════════ */
const CP_NAV=[
  {id:"Overview",      label:"Overview",       icon:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"},
  {id:"Users",         label:"Users",          icon:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"},
  {id:"Transactions",  label:"Transactions",   icon:"M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4"},
  {id:"KYC",           label:"KYC",            icon:"M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z"},
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
                <div><label style={LBL}>Account</label><select value={selAcct} onChange={e=>setSelAcct(e.target.value)} style={SEL}><option value="">Select account…</option>{userAccts.map(a=><option key={a.id} value={a.id}>{a.accountName} ••••{a.last4} ({usd(a.balance)})</option>)}</select></div>
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
function AdminSidebar({active,set,adminName,adminEmail,onSignOut}:{active:string;set:(t:string)=>void;adminName:string;adminEmail:string;onSignOut:()=>void}){
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
          return(
            <button key={item.id} onClick={()=>set(item.id)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"9px 12px",borderRadius:9,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13.5,fontWeight:on?600:400,color:on?RED:MID,background:on?"rgba(140,29,37,.07)":"transparent",textAlign:"left",marginBottom:2,transition:"all .15s",borderLeft:on?`3px solid ${RED}`:"3px solid transparent"}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={on?2.2:1.8} style={{flexShrink:0}}><path d={item.icon}/></svg>
              {item.label}
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

  const [users,    setUsers]    = useState<UserRow[]>([]);
  const [accounts, setAccounts] = useState<AcctRow[]>([]);
  const [txs,      setTxs]      = useState<TxRow[]>([]);
  const [pendingTxs,setPendingTxs]=useState<PendingTx[]>([]);
  const [apps,     setApps]     = useState<AppRow[]>([]);

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
    const profiles     = json.profiles            ?? [];
    const accts        = json.accounts            ?? [];
    const transactions = json.transactions        ?? [];
    const pendingTransactions = json.pendingTransactions ?? [];
    const applications = json.applications        ?? [];

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
      creditLimit:Number(a.credit_limit||0),
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

    setUsers(mappedUsers);
    setAccounts(mappedAccts);
    setTxs(mappedTxs);
    setPendingTxs(mappedPending);
    setApps(mappedApps);
    setLoading(false);
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
    const err=await cAction({action:"approveTransaction",txId:tx.id,accountId:tx.accountId,amount:tx.amount,date});
    if(!err){
      const acct=accounts.find(a=>a.id===tx.accountId);
      if(acct) setAccounts(prev=>prev.map(a=>a.id===tx.accountId?{...a,balance:acct.balance+tx.amount}:a));
      setPendingTxs(prev=>prev.filter(t=>t.id!==tx.id));
    }
  }

  async function handleRejectTransaction(txId:string){
    const err=await cAction({action:"rejectTransaction",txId});
    if(!err) setPendingTxs(prev=>prev.filter(t=>t.id!==txId));
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
          />
        </div>

        {/* Main content */}
        <main style={{padding:"28px 32px",maxWidth:1200,width:"100%"}}>
          {tab==="Overview"      && <OverviewTab users={users} accounts={accounts} txs={txs} apps={apps}/>}
          {tab==="Users"         && <UsersTab    users={users} accounts={accounts} onFreezeToggle={handleFreezeToggle} onCreditLimitUpdate={handleCreditLimitUpdate}/>}
          {tab==="Transactions"  && <TransactionsTab users={users} accounts={accounts} pendingTxs={pendingTxs} onApprove={handleApproveTransaction} onReject={handleRejectTransaction} onManual={handleManualTransaction}/>}
          {tab==="KYC"           && <KYCTab users={users} onUpdate={handleKYCUpdate}/>}
          {tab==="Applications"  && <ApplicationsTab apps={apps} onUpdateStatus={handleAppStatus}/>}
          {tab==="Notifications" && <NotificationsTab users={users}/>}
        </main>
      </div>

    </div>
  );
}
