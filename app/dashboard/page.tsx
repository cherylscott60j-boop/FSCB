"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { BANK } from "@/lib/bankConstants";

/* ── Design tokens ───────────────────────────────── */
const FONT = "var(--font-montserrat),'Libre Franklin',sans-serif";
const RED  = "#8C1D25";
const GOLD = "#D4AF37";
const DARK = "#111827";
const MID  = "#374151";
const GRAY = "#6B7280";
const BG   = "#F5F7FA";

const CARD    = { background:"#fff", borderRadius:12, border:"1px solid rgba(17,24,39,.08)", boxShadow:"0 1px 4px rgba(17,24,39,.06)" } as const;
const DIVIDER = { height:1, background:"rgba(17,24,39,.07)", margin:"0" } as const;

/* ── Modal form primitives ───────────────────────── */
const LBL:React.CSSProperties = {display:"block",fontSize:12.5,fontWeight:600,color:MID,marginBottom:5,letterSpacing:".01em"};
const INP:React.CSSProperties = {width:"100%",padding:"9px 12px",border:"1px solid rgba(17,24,39,.15)",borderRadius:8,fontSize:13.5,fontFamily:"inherit",color:DARK,outline:"none",boxSizing:"border-box"};
const SEL:React.CSSProperties = {...INP,cursor:"pointer",appearance:"auto"};

/* ── Account type meta ───────────────────────────── */
const ACC_META: Record<string,{label:string;color:string;grad:string}> = {
  checking:          {label:"Checking",          color:"#1D4ED8", grad:"linear-gradient(135deg,#1E3A6E 0%,#0F2247 60%,#091830 100%)"},
  savings:           {label:"Savings",           color:"#059669", grad:"linear-gradient(135deg,#065F46 0%,#044034 60%,#022A23 100%)"},
  credit_card:       {label:"Credit Card",       color:"#7C3AED", grad:"linear-gradient(135deg,#5B1D8C 0%,#3B1260 60%,#220A40 100%)"},
  money_market:      {label:"Money Market",      color:"#B45309", grad:"linear-gradient(135deg,#78350F 0%,#4D2106 60%,#2D1203 100%)"},
  cd:                {label:"CD",                color:"#0891B2", grad:"linear-gradient(135deg,#164E63 0%,#0C3448 60%,#071E2D 100%)"},
  business_checking: {label:"Business Checking", color:RED,       grad:"linear-gradient(135deg,#7B1020 0%,#5A0C18 60%,#36070E 100%)"},
  business_savings:  {label:"Business Savings",  color:"#047857", grad:"linear-gradient(135deg,#064E3B 0%,#033327 60%,#011F18 100%)"},
};

const CAT_COLOR: Record<string,string> = {
  Groceries:"#059669", Income:"#16A34A", "Auto & Gas":"#D97706",
  Entertainment:"#DB2777", Transfer:"#6B7280",
  Dining:"#DC2626", Shopping:"#7C3AED", Housing:RED,
};

/* ── Types ───────────────────────────────────────── */
type Acct  = {id:string;label:string;number:string;accountNumber:string;balance:number;available:number;type:string;color:string;grad:string;creditLimit:number;rate:number;openedAt:string;accountType:string;};
type Tx    = {id:string;date:string;merchant:string;category:string;amount:number;status:string;};
type Spend = {category:string;amount:number;budget:number;};
type Notif = {id:string;type:string;title:string;message:string;created_at:string;};
type ModalKey = "transfer"|"paybill"|"deposit"|"zelle"|"lockcard";
type ExtAcct = {id:string;nickname:string;bankName:string;routingNumber:string;accountNumber:string;accountType:string;holderName:string;};

/* ── External bank logos ─────────────────────────── */
const EXT_BANKS=[
  {key:"chase",    name:"Chase",            logo:"/CHASE.png"},
  {key:"bofa",     name:"Bank of America",  logo:"/boa.png"},
  {key:"wells",    name:"Wells Fargo",      logo:"/Wellsfargo.png"},
  {key:"td",       name:"TD Bank",          logo:"/TD.png"},
  {key:"regions",  name:"Regions Bank",     logo:"/REGION.png"},
];

/* ── Helpers ─────────────────────────────────────── */
const usd  = (n:number) => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(Math.abs(n));
const pct  = (n:number) => `${(n*100).toFixed(2)}% APY`;

function greet(){
  const h=new Date().getHours();
  return h<12?"Good morning":h<17?"Good afternoon":"Good evening";
}
function relTime(iso:string){
  const d=Math.floor((Date.now()-new Date(iso).getTime())/86400000);
  if(d===0)return"Today";if(d===1)return"Yesterday";
  if(d<7)return`${d} days ago`;
  return new Date(iso).toLocaleDateString("en-US",{month:"short",day:"numeric"});
}

/* ── Mappers ─────────────────────────────────────── */
function mapAcct(a:Record<string,unknown>):Acct{
  const k=String(a.account_type);
  const m=ACC_META[k]??{label:k,color:GRAY,grad:"linear-gradient(135deg,#374151,#111827)"};
  const creditLimit=Number(a.credit_limit??5000);
  const balance=Number(a.balance);
  return {
    id:String(a.id), label:String(a.account_name),
    number:`••••  ${a.account_number_last4}`,
    accountNumber:String(a.account_number??""),
    balance, available:k==="credit_card"?creditLimit+balance:Number(a.available_balance)||balance,
    type:m.label, color:m.color, grad:m.grad,
    creditLimit,
    rate:Number(a.interest_rate??0),
    openedAt:String(a.opened_at??""),
    accountType:k,
  };
}
function mapTx(t:Record<string,unknown>):Tx{
  return {
    id:String(t.id),
    date:new Date(t.posted_at as string).toLocaleDateString("en-US",{month:"short",day:"numeric"}),
    merchant:String(t.merchant), category:String(t.category), amount:Number(t.amount),
    status:String(t.status||"posted"),
  };
}
function calcSpend(txs:Record<string,unknown>[]):Spend[]{
  const totals:Record<string,number>={};
  txs.forEach(t=>{ if(Number(t.amount)<0){ const c=String(t.category); totals[c]=(totals[c]??0)+Math.abs(Number(t.amount)); } });
  const max=Math.max(...Object.values(totals),1);
  return Object.entries(totals).sort((a,b)=>b[1]-a[1]).map(([category,amount])=>({category,amount,budget:max}));
}

/* ═════════════════════════════════════════════════════
   BASE COMPONENTS
═════════════════════════════════════════════════════ */

function AccountCard({a}:{a:Acct}){
  const isCC=a.type==="Credit Card";
  return(
    <div className="db-account-card" style={{background:a.grad,borderRadius:16,boxShadow:"0 8px 32px rgba(0,0,0,.28),0 2px 8px rgba(0,0,0,.18)",padding:"22px 24px 20px",position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",minHeight:164}}>
      <div style={{position:"absolute",top:-48,right:-48,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,.06)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:-20,right:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,.04)",pointerEvents:"none"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4,position:"relative"}}>
        <div style={{fontFamily:FONT,fontWeight:700,fontSize:13.5,color:"rgba(255,255,255,.9)",letterSpacing:".01em"}}>{a.label}</div>
        <div style={{display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:"#4ADE80",flexShrink:0,boxShadow:"0 0 6px #4ADE80"}}/>
          <span style={{fontSize:10.5,color:"rgba(255,255,255,.5)",letterSpacing:".06em",fontWeight:500}}>ACTIVE</span>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:"auto",position:"relative"}}>
        <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:4,background:"rgba(255,255,255,.12)",color:"rgba(255,255,255,.7)",letterSpacing:".08em",textTransform:"uppercase"}}>{a.type}</span>
        <span style={{fontSize:12,color:"rgba(255,255,255,.45)",fontFamily:"'Courier New',monospace",letterSpacing:".12em"}}>{a.number}</span>
      </div>
      <div className="db-card-body" style={{marginTop:20,position:"relative"}}>
        <div style={{fontSize:10.5,fontWeight:600,color:"rgba(255,255,255,.45)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>{isCC?"Current Balance":"Account Balance"}</div>
        <div className="db-card-balance" style={{fontFamily:FONT,fontWeight:800,fontSize:30,color:"#fff",letterSpacing:"-.025em",lineHeight:1}}>{isCC?usd(Math.abs(Math.min(a.balance,0))):<>{a.balance<0?"–":""}{usd(a.balance)}</>}</div>
      </div>
      <div className="db-card-divider" style={{height:1,background:"rgba(255,255,255,.12)",margin:"14px 0 10px"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",position:"relative"}}>
        <span style={{fontSize:11.5,color:"rgba(255,255,255,.45)",fontWeight:500}}>{isCC?"Available Credit":"Available Balance"}</span>
        <span style={{fontFamily:FONT,fontWeight:700,fontSize:13.5,color:"rgba(255,255,255,.85)"}}>{usd(a.available)}</span>
      </div>
      {isCC&&a.creditLimit>0&&(
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",position:"relative",marginTop:6}}>
          <span style={{fontSize:11.5,color:"rgba(255,255,255,.45)",fontWeight:500}}>Credit Limit</span>
          <span style={{fontFamily:FONT,fontWeight:700,fontSize:13.5,color:"rgba(255,255,255,.85)"}}>{usd(a.creditLimit)}</span>
        </div>
      )}
    </div>
  );
}

function TxRow({tx}:{tx:Tx}){
  const credit=tx.amount>0;
  const cc=CAT_COLOR[tx.category]??GRAY;
  const pending=tx.status==="pending";
  const rejected=tx.status==="rejected";
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr auto",alignItems:"center",gap:16,padding:"12px 20px",borderBottom:"1px solid rgba(17,24,39,.06)",opacity:rejected?.5:1}}>
      <div style={{display:"flex",alignItems:"center",gap:12,minWidth:0}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:pending?"#D97706":rejected?GRAY:cc,flexShrink:0}}/>
        <div style={{minWidth:0}}>
          <div style={{fontSize:13.5,fontWeight:500,color:DARK,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{tx.merchant}</div>
          <div style={{fontSize:12,color:GRAY,marginTop:2}}>
            <span style={{marginRight:8}}>{tx.category}</span><span>{tx.date}</span>
            {pending&&<span style={{marginLeft:8,fontSize:10.5,fontWeight:700,padding:"1px 6px",borderRadius:4,background:"rgba(217,119,6,.12)",color:"#92400E"}}>PENDING</span>}
            {rejected&&<span style={{marginLeft:8,fontSize:10.5,fontWeight:700,padding:"1px 6px",borderRadius:4,background:"rgba(107,114,128,.12)",color:GRAY}}>REJECTED</span>}
          </div>
        </div>
      </div>
      <div style={{textAlign:"right",flexShrink:0}}>
        <div style={{fontFamily:FONT,fontWeight:700,fontSize:14,color:pending?"#D97706":credit?"#16A34A":DARK,whiteSpace:"nowrap"}}>{credit?"+":"-"}{usd(tx.amount)}</div>
        <div style={{fontSize:11,color:pending?"#D97706":credit?"#16A34A":"#DC2626",marginTop:2}}>{pending?"Pending":rejected?"Rejected":credit?"Credit":"Debit"}</div>
      </div>
    </div>
  );
}

function SpendRow({s}:{s:Spend}){
  const p=Math.min((s.amount/s.budget)*100,100);
  const bar=CAT_COLOR[s.category]??GRAY;
  return(
    <div style={{padding:"10px 0"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
        <span style={{fontSize:13,color:MID,fontWeight:500}}>{s.category}</span>
        <span style={{fontSize:12.5,fontWeight:600,color:DARK}}>{usd(s.amount)}</span>
      </div>
      <div style={{height:5,background:"rgba(17,24,39,.08)",borderRadius:99,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${p}%`,background:bar,borderRadius:99}}/>
      </div>
    </div>
  );
}

function QuickBtn({icon,label,onClick}:{icon:string;label:string;onClick?:()=>void}){
  const [hov,setHov]=useState(false);
  return(
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,flexShrink:0,background:hov?"rgba(140,29,37,.06)":"transparent",border:`1px solid ${hov?"rgba(140,29,37,.25)":"rgba(17,24,39,.1)"}`,borderRadius:10,padding:"12px 16px",cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>
      <div style={{width:34,height:34,borderRadius:8,background:hov?"rgba(140,29,37,.1)":"rgba(17,24,39,.06)",display:"flex",alignItems:"center",justifyContent:"center",color:hov?RED:MID,transition:"all .15s"}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={icon}/></svg>
      </div>
      <span style={{fontSize:11.5,fontWeight:600,color:hov?RED:MID,whiteSpace:"nowrap"}}>{label}</span>
    </button>
  );
}

const BOT_NAV=[
  {label:"Home",     icon:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", tab:"Overview"},
  {label:"Accounts", icon:"M2 20h20M4 20V10M20 20V10M10 20V14h4v6M1 10l11-7 11 7",          tab:"Accounts"},
  {label:"Transfer", icon:"M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4",           tab:"Transfers"},
  {label:"Cards",    icon:"M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z", tab:"Cards"},
  {label:"More",     icon:"M4 6h16M4 12h16M4 18h16",                                       tab:"__more__"},
];
const MORE_TABS = new Set(["History","Pay Bills","Statements","Profile"]);
const MORE_ITEMS=[
  {id:"History",    label:"History",    icon:"M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"},
  {id:"Pay Bills",  label:"Pay Bills",  icon:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8"},
  {id:"Statements", label:"Statements", icon:"M21 8v13H3V8M23 3H1v5h22V3zM10 12h4"},
  {id:"Profile",    label:"Profile",    icon:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"},
];
function BottomNav({active,set,onMore}:{active:string;set:(t:string)=>void;onMore:()=>void}){
  return(
    <nav className="db-bottom-nav">
      {BOT_NAV.map(t=>{
        const isMore=t.tab==="__more__";
        const on=isMore?MORE_TABS.has(active):active===t.tab;
        return(
          <button key={t.label} onClick={(e)=>{if(isMore){e.stopPropagation();onMore();}else set(t.tab);}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:"6px 10px",color:on?RED:GRAY,fontFamily:"inherit",flex:1,transition:"color .15s"}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={on?2.5:1.8}><path d={t.icon}/></svg>
            <span style={{fontSize:10,fontWeight:on?700:500}}>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
function MoreSheet({open,onClose,onSelect,onSignOut}:{open:boolean;onClose:()=>void;onSelect:(t:string)=>void;onSignOut:()=>void}){
  if(!open)return null;
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:300,background:"rgba(0,0,0,.45)"}}>
      <div onClick={e=>e.stopPropagation()} className="more-sheet-panel" style={{
        position:"absolute",bottom:0,left:0,right:0,
        background:"#fff",borderRadius:"20px 20px 0 0",
        paddingBottom:"calc(16px + env(safe-area-inset-bottom))",
        boxShadow:"0 -4px 32px rgba(17,24,39,.15)"
      }}>
        <div style={{width:36,height:4,background:"rgba(17,24,39,.12)",borderRadius:2,margin:"12px auto 14px"}}/>
        <div style={{padding:"0 20px 10px",borderBottom:"1px solid rgba(17,24,39,.07)"}}>
          <span style={{fontSize:11,letterSpacing:".08em",textTransform:"uppercase",color:GRAY,fontWeight:600}}>More</span>
        </div>
        {MORE_ITEMS.map(item=>(
          <button key={item.id} onClick={()=>{onSelect(item.id);onClose();}} style={{display:"flex",alignItems:"center",gap:14,width:"100%",background:"none",border:"none",padding:"14px 24px",cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="1.8"><path d={item.icon}/></svg>
            <span style={{fontSize:15,color:DARK,fontWeight:500}}>{item.label}</span>
          </button>
        ))}
        <div style={{margin:"4px 16px 0",borderTop:"1px solid rgba(17,24,39,.07)",paddingTop:4}}>
          <button onClick={onSignOut} style={{display:"flex",alignItems:"center",gap:14,width:"100%",background:"none",border:"none",padding:"14px 8px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",color:RED}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            <span style={{fontSize:15,fontWeight:500}}>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function PageSkeleton(){
  return(
    <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center",fontFamily:FONT}}>
        <div style={{margin:"0 auto 18px",display:"flex",justifyContent:"center"}}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/fscb-horizontal-logo.webp" alt="FSCB" style={{height:40,width:"auto"}} />
        </div>
        <div style={{fontWeight:700,fontSize:16,color:DARK,marginBottom:12}}>Loading your accounts…</div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5" style={{animation:"spin .75s linear infinite"}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════
   MODAL COMPONENTS
═════════════════════════════════════════════════════ */

function ModalShell({title,onClose,children}:{title:string;onClose:()=>void;children:React.ReactNode}){
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.52)",backdropFilter:"blur(4px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:460,boxShadow:"0 24px 64px rgba(0,0,0,.28)",overflow:"hidden"}}>
        <div style={{padding:"18px 24px",borderBottom:"1px solid rgba(17,24,39,.08)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontFamily:FONT,fontWeight:700,fontSize:16,color:DARK}}>{title}</span>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",padding:5,color:GRAY,lineHeight:0,borderRadius:6}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function SuccessState({msg,onClose}:{msg:string;onClose:()=>void}){
  return(
    <div style={{padding:"40px 24px",textAlign:"center"}}>
      <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(22,163,74,.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",color:"#16A34A"}}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <div style={{fontFamily:FONT,fontWeight:700,fontSize:17,color:DARK,marginBottom:8}}>Done!</div>
      <div style={{fontSize:14,color:GRAY,marginBottom:24,lineHeight:1.55,maxWidth:320,margin:"0 auto 24px"}}>{msg}</div>
      <button onClick={onClose} style={{background:RED,color:"#fff",border:"none",borderRadius:9,padding:"10px 28px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Close</button>
    </div>
  );
}
function PendingState({msg,onClose}:{msg:string;onClose:()=>void}){
  return(
    <div style={{padding:"40px 24px",textAlign:"center"}}>
      <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(217,119,6,.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",color:"#D97706"}}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      </div>
      <div style={{fontFamily:FONT,fontWeight:700,fontSize:17,color:DARK,marginBottom:8}}>Submitted for Review</div>
      <div style={{fontSize:14,color:GRAY,marginBottom:24,lineHeight:1.55,maxWidth:320,margin:"0 auto 24px"}}>{msg}</div>
      <button onClick={onClose} style={{background:RED,color:"#fff",border:"none",borderRadius:9,padding:"10px 28px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Close</button>
    </div>
  );
}
function FreezeState({onClose}:{onClose:()=>void}){
  return(
    <div style={{padding:"40px 24px",textAlign:"center"}}>
      <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(220,38,38,.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",color:"#DC2626"}}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </div>
      <div style={{fontFamily:FONT,fontWeight:700,fontSize:17,color:DARK,marginBottom:8}}>Account Frozen</div>
      <div style={{fontSize:14,color:GRAY,lineHeight:1.6,maxWidth:320,margin:"0 auto 24px"}}>
        Your transaction is on hold and your account is frozen for security reasons. Please contact Customer Care for verification and to restore access.
      </div>
      <button onClick={onClose} style={{background:RED,color:"#fff",border:"none",borderRadius:9,padding:"10px 28px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Close</button>
    </div>
  );
}
function ErrBanner({msg}:{msg:string}){
  if(!msg)return null;
  return <div style={{fontSize:13,color:"#DC2626",marginBottom:12,padding:"8px 12px",background:"rgba(220,38,38,.06)",borderRadius:7}}>{msg}</div>;
}
function Row2({children}:{children:React.ReactNode}){
  return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{children}</div>;
}
function AmtInput({value,set}:{value:string;set:(v:string)=>void}){
  return(
    <div style={{position:"relative"}}>
      <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:GRAY,fontSize:14,pointerEvents:"none"}}>$</span>
      <input type="number" min="0.01" step="0.01" placeholder="0.00" value={value} onChange={e=>set(e.target.value)} style={{...INP,paddingLeft:24}}/>
    </div>
  );
}

function TransferModal({onClose,accounts,userId}:{onClose:()=>void;accounts:Acct[];userId:string}){
  const dep=accounts.filter(a=>a.type!=="Credit Card");
  const [from,setFrom]   = useState(dep[0]?.id||"");
  const [to,setTo]       = useState(dep[1]?.id||"external");
  const [amt,setAmt]     = useState("");
  const [note,setNote]   = useState("");
  const [err,setErr]     = useState("");
  const [done,setDone]   = useState(false);
  const [frozen,setFrozen] = useState(false);
  const [busy,setBusy]   = useState(false);

  /* external transfer state */
  const [extAccts,setExtAccts]   = useState<ExtAcct[]>([]);
  const [extMode,setExtMode]     = useState<"pick"|"new">("pick");
  const [selExtId,setSelExtId]   = useState<string|null>(null);
  const [saveAcct,setSaveAcct]   = useState(true);
  const [extForm,setExtForm]     = useState({routingNumber:"",accountNumber:"",accountType:"checking",holderName:"",bankName:"",nickname:""});
  const [selBank,setSelBank]     = useState<string>("");
  const upExt=(k:keyof typeof extForm,v:string)=>setExtForm(f=>({...f,[k]:v}));

  const isExt = to==="external";

  useEffect(()=>{
    if(!isExt) return;
    createClient().from("external_accounts").select("*").eq("user_id",userId).order("created_at",{ascending:false}).then(({data})=>{
      const list=(data||[]) as ExtAcct[];
      setExtAccts(list);
      if(list.length>0){setExtMode("pick");setSelExtId(list[0].id);}
      else setExtMode("new");
    });
  },[isExt,userId]);

  async function submit(){
    if(!amt||parseFloat(amt)<=0){setErr("Please enter a valid amount.");return;}
    setBusy(true); setErr("");
    const sb=createClient();

    if(isExt){
      let ext:ExtAcct|null=null;
      if(extMode==="pick"){
        ext=extAccts.find(a=>a.id===selExtId)||null;
        if(!ext){setErr("Select an external account.");setBusy(false);return;}
      } else {
        if(extForm.routingNumber.length!==9){setErr("Routing number must be 9 digits.");setBusy(false);return;}
        if(!extForm.accountNumber){setErr("Enter the account number.");setBusy(false);return;}
        if(!extForm.holderName.trim()){setErr("Enter the account holder name.");setBusy(false);return;}
        let savedId="";
        if(saveAcct){
          const {data,error}=await sb.from("external_accounts").insert({
            user_id:userId,routing_number:extForm.routingNumber,account_number:extForm.accountNumber,
            account_type:extForm.accountType,holder_name:extForm.holderName,
            bank_name:extForm.bankName||null,nickname:extForm.nickname||null,
          }).select("id").single();
          if(error){setErr(error.message);setBusy(false);return;}
          savedId=(data as Record<string,string>)?.id||"";
        }
        ext={id:savedId,routingNumber:extForm.routingNumber,accountNumber:extForm.accountNumber,accountType:extForm.accountType,holderName:extForm.holderName,bankName:extForm.bankName,nickname:extForm.nickname};
      }
      const memoPayload=JSON.stringify({type:"external_transfer",extAccountId:ext.id||null,bankName:ext.bankName||"External Bank",routingNumber:ext.routingNumber,accountNumber:ext.accountNumber,accountType:ext.accountType,holderName:ext.holderName,note:note||null});
      const {error}=await sb.from("transactions").insert({
        account_id:from,user_id:userId,
        merchant:`External Transfer → ${ext.bankName||"External Bank"}`,
        category:"Transfer",amount:-parseFloat(amt),transaction_type:"transfer",
        posted_at:new Date().toISOString(),submitted_at:new Date().toISOString(),
        memo:memoPayload,status:"pending",
      });
      if(error){setErr(error.message);setBusy(false);return;}
      await fetch("/api/transfer/freeze",{method:"POST"});
      setBusy(false);
      setFrozen(true);
      setDone(true);
      return;
    }

    /* internal transfer */
    if(from===to){setErr("From and To must be different.");setBusy(false);return;}
    const toName=accounts.find(a=>a.id===to)?.label||"Account";
    const fromName=accounts.find(a=>a.id===from)?.label||"Account";
    const now=new Date().toISOString();
    const parsedAmt=parseFloat(amt);
    const {error}=await sb.from("transactions").insert([
      {account_id:from,user_id:userId,merchant:`Transfer → ${toName}`,
       category:"Transfer",amount:-parsedAmt,transaction_type:"transfer",
       posted_at:now,submitted_at:now,memo:note||null,status:"pending"},
      {account_id:to,user_id:userId,merchant:`Transfer ← ${fromName}`,
       category:"Transfer",amount:parsedAmt,transaction_type:"transfer",
       posted_at:now,submitted_at:now,memo:note||null,status:"pending"},
    ]);
    setBusy(false);
    if(error){setErr(error.message);return;}
    setDone(true);
  }

  if(done)return <ModalShell title="Transfer Money" onClose={onClose}>{frozen?<FreezeState onClose={onClose}/>:<PendingState msg="Your transfer request is pending admin approval. You'll see it in Recent Activity once posted." onClose={onClose}/>}</ModalShell>;
  return(
    <ModalShell title="Transfer Money" onClose={onClose}>
      <div style={{padding:"20px 24px",maxHeight:"78vh",overflowY:"auto"}}>

        <div style={{marginBottom:14}}>
          <label style={LBL}>From Account</label>
          <select value={from} onChange={e=>{const v=e.target.value;setFrom(v);if(to===v){setTo(dep.find(a=>a.id!==v)?.id||"external");setErr("");}}} style={SEL}>
            {dep.map(a=><option key={a.id} value={a.id}>{a.label} — {usd(a.balance)}</option>)}
          </select>
        </div>

        <div style={{marginBottom:isExt?14:14}}>
          <label style={LBL}>To Account</label>
          <select value={to} onChange={e=>{setTo(e.target.value);setErr("");}} style={SEL}>
            {dep.filter(a=>a.id!==from).map(a=><option key={a.id} value={a.id}>{a.label}</option>)}
            <option value="external">External / Other Bank</option>
          </select>
        </div>

        {/* ── External bank section ── */}
        {isExt&&(
          <div style={{background:"rgba(17,24,39,.03)",border:"1px solid rgba(17,24,39,.09)",borderRadius:10,padding:"14px 16px",marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <span style={{fontSize:12.5,fontWeight:700,color:MID}}>External Bank Details</span>
              {extAccts.length>0&&(
                <button onClick={()=>setExtMode(m=>m==="pick"?"new":"pick")} style={{background:"none",border:"none",fontSize:12,fontWeight:600,color:RED,cursor:"pointer",fontFamily:"inherit",padding:0}}>
                  {extMode==="pick"?"+ Add New Account":"← Saved Accounts"}
                </button>
              )}
            </div>

            {extMode==="pick"&&extAccts.length>0?(
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {extAccts.map(a=>(
                  <label key={a.id} style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",padding:"10px 12px",border:`1.5px solid ${selExtId===a.id?RED:"rgba(17,24,39,.1)"}`,borderRadius:9,background:selExtId===a.id?"rgba(140,29,37,.04)":"#fff",transition:"all .15s"}}>
                    <input type="radio" name="extAcct" checked={selExtId===a.id} onChange={()=>setSelExtId(a.id)} style={{accentColor:RED,marginTop:2,flexShrink:0}}/>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,color:DARK}}>{a.nickname||a.bankName||"External Account"}</div>
                      <div style={{fontSize:12,color:GRAY,marginTop:2}}>
                        {a.bankName&&<>{a.bankName} · </>}
                        <span style={{textTransform:"capitalize"}}>{a.accountType}</span>
                        {" · "}••••{(a.accountNumber||"").slice(-4)}
                      </div>
                      <div style={{fontSize:11.5,color:GRAY}}>{a.holderName} · Routing ••••{(a.routingNumber||"").slice(-4)}</div>
                    </div>
                  </label>
                ))}
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {/* Bank logo picker */}
                <div>
                  <label style={LBL}>Select Your Bank</label>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7}}>
                    {EXT_BANKS.map(b=>(
                      <button key={b.key} type="button"
                        onClick={()=>{setSelBank(b.key);upExt("bankName",b.name);}}
                        style={{padding:"10px 6px 8px",border:`1.5px solid ${selBank===b.key?RED:"rgba(17,24,39,.12)"}`,borderRadius:9,background:selBank===b.key?"rgba(140,29,37,.04)":"#fff",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5,transition:"all .15s",fontFamily:"inherit",outline:"none"}}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={b.logo} alt={b.name} style={{height:28,width:"auto",maxWidth:64,objectFit:"contain"}}/>
                        <span style={{fontSize:10,fontWeight:600,color:selBank===b.key?RED:MID,textAlign:"center",lineHeight:1.3}}>{b.name}</span>
                      </button>
                    ))}
                    <button type="button"
                      onClick={()=>{setSelBank("other");upExt("bankName","");}}
                      style={{padding:"10px 6px 8px",border:`1.5px solid ${selBank==="other"?RED:"rgba(17,24,39,.12)"}`,borderRadius:9,background:selBank==="other"?"rgba(140,29,37,.04)":"#fff",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5,transition:"all .15s",fontFamily:"inherit",outline:"none"}}>
                      <div style={{height:28,width:28,borderRadius:"50%",background:"rgba(17,24,39,.07)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={selBank==="other"?RED:GRAY} strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                      </div>
                      <span style={{fontSize:10,fontWeight:600,color:selBank==="other"?RED:MID,textAlign:"center",lineHeight:1.3}}>Other</span>
                    </button>
                  </div>
                  {selBank==="other"&&(
                    <div style={{marginTop:8}}>
                      <input type="text" placeholder="Enter your bank name" value={extForm.bankName} onChange={e=>upExt("bankName",e.target.value)} style={INP}/>
                    </div>
                  )}
                </div>

                {/* Account fields — shown once a bank is chosen */}
                {selBank&&(
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {/* Selected bank banner */}
                    <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"rgba(140,29,37,.04)",border:"1px solid rgba(140,29,37,.16)",borderRadius:8}}>
                      {selBank!=="other"&&EXT_BANKS.find(b=>b.key===selBank)&&(
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={EXT_BANKS.find(b=>b.key===selBank)!.logo} alt="" style={{height:20,width:"auto",maxWidth:52,objectFit:"contain"}}/>
                      )}
                      <span style={{fontSize:13,fontWeight:700,color:RED}}>{extForm.bankName||"Other Bank"}</span>
                      <button type="button" onClick={()=>{setSelBank("");upExt("bankName","");}} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",padding:"2px 6px",color:GRAY,fontSize:11.5,fontWeight:500,fontFamily:"inherit",borderRadius:5}}>Change</button>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                      <div>
                        <label style={LBL}>Routing Number</label>
                        <input type="text" inputMode="numeric" maxLength={9} placeholder="9-digit ABA" value={extForm.routingNumber} onChange={e=>upExt("routingNumber",e.target.value.replace(/\D/g,""))} style={INP}/>
                      </div>
                      <div>
                        <label style={LBL}>Account Number</label>
                        <input type="text" inputMode="numeric" placeholder="Account number" value={extForm.accountNumber} onChange={e=>upExt("accountNumber",e.target.value.replace(/\D/g,""))} style={INP}/>
                      </div>
                      <div>
                        <label style={LBL}>Account Type</label>
                        <select value={extForm.accountType} onChange={e=>upExt("accountType",e.target.value)} style={{...INP,appearance:"auto" as React.CSSProperties["appearance"],cursor:"pointer"}}>
                          <option value="checking">Checking</option>
                          <option value="savings">Savings</option>
                        </select>
                      </div>
                      <div>
                        <label style={LBL}>Account Holder Name</label>
                        <input type="text" placeholder="Full name on account" value={extForm.holderName} onChange={e=>upExt("holderName",e.target.value)} style={INP}/>
                      </div>
                      <div style={{gridColumn:"1/-1"}}>
                        <label style={LBL}>Nickname <span style={{fontWeight:400,color:GRAY}}>(optional)</span></label>
                        <input type="text" placeholder="e.g. My Chase Savings" value={extForm.nickname} onChange={e=>upExt("nickname",e.target.value)} style={INP}/>
                      </div>
                      <div style={{gridColumn:"1/-1"}}>
                        <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13,color:MID}}>
                          <input type="checkbox" checked={saveAcct} onChange={e=>setSaveAcct(e.target.checked)} style={{accentColor:RED,width:15,height:15,cursor:"pointer"}}/>
                          Save this account for future transfers
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div style={{marginBottom:14}}><label style={LBL}>Amount</label><AmtInput value={amt} set={setAmt}/></div>
        <div style={{marginBottom:20}}>
          <label style={LBL}>Note <span style={{fontWeight:400,color:GRAY}}>(optional)</span></label>
          <input type="text" placeholder={isExt?"e.g. Rent payment, wire transfer…":"e.g. Savings transfer…"} value={note} onChange={e=>setNote(e.target.value)} style={INP}/>
        </div>

        <ErrBanner msg={err}/>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,background:"rgba(17,24,39,.06)",border:"none",borderRadius:9,padding:"10px 0",fontSize:13.5,fontWeight:600,color:MID,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
          <button disabled={busy} style={{flex:2,background:RED,border:"none",borderRadius:9,padding:"10px 0",fontSize:13.5,fontWeight:600,color:"#fff",cursor:busy?"not-allowed":"pointer",fontFamily:"inherit",opacity:busy?.7:1}} onClick={submit}>
            {busy?"Submitting…":isExt?"Send External Transfer":"Transfer Funds"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function PayBillModal({onClose,accounts,userId}:{onClose:()=>void;accounts:Acct[];userId:string}){
  const dep=accounts.filter(a=>a.type!=="Credit Card");
  const [from,setFrom]=useState(dep[0]?.id||"");
  const [payee,setPayee]=useState(""); const [amt,setAmt]=useState("");
  const [date,setDate]=useState(new Date().toISOString().split("T")[0]);
  const [err,setErr]=useState(""); const [done,setDone]=useState(false); const [busy,setBusy]=useState(false);
  async function submit(){
    if(!payee.trim()){setErr("Please enter a payee.");return;}
    if(!amt||parseFloat(amt)<=0){setErr("Please enter a valid amount.");return;}
    setBusy(true);
    const sb=createClient();
    const {error}=await sb.from("transactions").insert({
      account_id:from,user_id:userId,merchant:payee.trim(),
      category:"Bill Payment",amount:-parseFloat(amt),transaction_type:"payment",
      posted_at:new Date(date+"T12:00:00").toISOString(),submitted_at:new Date().toISOString(),
      memo:null,status:"pending",
    });
    setBusy(false);
    if(error){setErr(error.message);return;}
    setDone(true);
  }
  if(done)return <ModalShell title="Pay a Bill" onClose={onClose}><PendingState msg={`Your payment to ${payee} is pending admin approval. It will post once reviewed.`} onClose={onClose}/></ModalShell>;
  return(
    <ModalShell title="Pay a Bill" onClose={onClose}>
      <div style={{padding:"20px 24px"}}>
        <div style={{marginBottom:14}}><label style={LBL}>Pay From</label><select value={from} onChange={e=>setFrom(e.target.value)} style={SEL}>{dep.map(a=><option key={a.id} value={a.id}>{a.label} — {usd(a.balance)}</option>)}</select></div>
        <div style={{marginBottom:14}}><label style={LBL}>Payee</label><input type="text" placeholder="e.g. City Electric, AT&T…" value={payee} onChange={e=>setPayee(e.target.value)} style={INP}/></div>
        <Row2><div><label style={LBL}>Amount</label><AmtInput value={amt} set={setAmt}/></div><div><label style={LBL}>Payment Date</label><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={INP}/></div></Row2>
        <div style={{marginTop:14}}><ErrBanner msg={err}/></div>
        <div style={{display:"flex",gap:10,marginTop:8}}>
          <button onClick={onClose} style={{flex:1,background:"rgba(17,24,39,.06)",border:"none",borderRadius:9,padding:"10px 0",fontSize:13.5,fontWeight:600,color:MID,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
          <button disabled={busy} style={{flex:2,background:RED,border:"none",borderRadius:9,padding:"10px 0",fontSize:13.5,fontWeight:600,color:"#fff",cursor:busy?"not-allowed":"pointer",fontFamily:"inherit",opacity:busy?.7:1}} onClick={submit}>{busy?"Submitting…":"Schedule Payment"}</button>
        </div>
      </div>
    </ModalShell>
  );
}

function DepositCheckModal({onClose,accounts,userId}:{onClose:()=>void;accounts:Acct[];userId:string}){
  const dep=accounts.filter(a=>a.type!=="Credit Card");
  const [toAcct,setToAcct]=useState(dep[0]?.id||"");
  const [amt,setAmt]=useState(""); const [front,setFront]=useState<string|null>(null); const [back,setBack]=useState<string|null>(null);
  const [err,setErr]=useState(""); const [done,setDone]=useState(false); const [busy,setBusy]=useState(false);
  async function submit(){
    if(!amt||parseFloat(amt)<=0){setErr("Enter the check amount.");return;}
    if(!front){setErr("Upload the front of the check.");return;}
    if(!back){setErr("Upload the back of the check.");return;}
    setBusy(true);
    const sb=createClient();
    const {error}=await sb.from("transactions").insert({
      account_id:toAcct,user_id:userId,merchant:"Check Deposit",
      category:"Deposit",amount:parseFloat(amt),transaction_type:"credit",
      posted_at:new Date().toISOString(),submitted_at:new Date().toISOString(),
      memo:null,status:"pending",
    });
    setBusy(false);
    if(error){setErr(error.message);return;}
    setDone(true);
  }
  function FileZone({label,file,onFile}:{label:string;file:string|null;onFile:(f:string)=>void}){
    return(<div><div style={LBL}>{label}</div><label style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,border:`1.5px dashed ${file?"#16A34A":"rgba(17,24,39,.2)"}`,borderRadius:10,padding:"18px 12px",cursor:"pointer",background:file?"rgba(22,163,74,.04)":"rgba(17,24,39,.02)",transition:"all .15s"}}>{file?<><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg><span style={{fontSize:12,color:"#16A34A",fontWeight:600}}>Selected</span></>:<><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg><span style={{fontSize:12,color:GRAY}}>Tap to upload</span></>}<input type="file" accept="image/*" style={{display:"none"}} onChange={e=>e.target.files&&onFile(e.target.files[0].name)}/></label></div>);
  }
  if(done)return <ModalShell title="Deposit a Check" onClose={onClose}><PendingState msg={`Your check deposit of ${usd(parseFloat(amt))} is pending admin review. Funds will appear once approved.`} onClose={onClose}/></ModalShell>;
  return(
    <ModalShell title="Deposit a Check" onClose={onClose}>
      <div style={{padding:"20px 24px"}}>
        <div style={{marginBottom:14}}><label style={LBL}>Deposit To</label><select value={toAcct} onChange={e=>setToAcct(e.target.value)} style={SEL}>{dep.map(a=><option key={a.id} value={a.id}>{a.label}</option>)}</select></div>
        <div style={{marginBottom:16}}><label style={LBL}>Check Amount</label><AmtInput value={amt} set={setAmt}/></div>
        <Row2><FileZone label="Front of Check" file={front} onFile={setFront}/><FileZone label="Back of Check" file={back} onFile={setBack}/></Row2>
        <div style={{marginTop:16}}><ErrBanner msg={err}/></div>
        <div style={{display:"flex",gap:10,marginTop:8}}>
          <button onClick={onClose} style={{flex:1,background:"rgba(17,24,39,.06)",border:"none",borderRadius:9,padding:"10px 0",fontSize:13.5,fontWeight:600,color:MID,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
          <button disabled={busy} style={{flex:2,background:RED,border:"none",borderRadius:9,padding:"10px 0",fontSize:13.5,fontWeight:600,color:"#fff",cursor:busy?"not-allowed":"pointer",fontFamily:"inherit",opacity:busy?.7:1}} onClick={submit}>{busy?"Submitting…":"Submit Deposit"}</button>
        </div>
      </div>
    </ModalShell>
  );
}

function ZelleModal({onClose,accounts,userId}:{onClose:()=>void;accounts:Acct[];userId:string}){
  const dep=accounts.filter(a=>a.type!=="Credit Card");
  const [from,setFrom]=useState(dep[0]?.id||""); const [recipient,setRecipient]=useState(""); const [amt,setAmt]=useState(""); const [note,setNote]=useState("");
  const [err,setErr]=useState(""); const [done,setDone]=useState(false); const [busy,setBusy]=useState(false);
  async function submit(){
    if(!recipient.trim()){setErr("Enter a recipient.");return;}
    if(!amt||parseFloat(amt)<=0){setErr("Enter a valid amount.");return;}
    setBusy(true);
    const sb=createClient();
    const {error}=await sb.from("transactions").insert({
      account_id:from,user_id:userId,merchant:`Zelle® → ${recipient.trim()}`,
      category:"Transfer",amount:-parseFloat(amt),transaction_type:"debit",
      posted_at:new Date().toISOString(),submitted_at:new Date().toISOString(),
      memo:note||null,status:"pending",
    });
    setBusy(false);
    if(error){setErr(error.message);return;}
    setDone(true);
  }
  if(done)return <ModalShell title="Send with Zelle®" onClose={onClose}><PendingState msg={`Your Zelle® request of ${usd(parseFloat(amt))} to ${recipient} is pending admin approval.`} onClose={onClose}/></ModalShell>;
  return(
    <ModalShell title="Send with Zelle®" onClose={onClose}>
      <div style={{padding:"20px 24px"}}>
        <div style={{background:"rgba(90,90,215,.06)",border:"1px solid rgba(90,90,215,.18)",borderRadius:10,padding:"10px 14px",marginBottom:16,display:"flex",gap:10,alignItems:"center"}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A5AD7" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          <span style={{fontSize:12.5,color:"#4B4BBA",fontWeight:500}}>Powered by Zelle® — money moves typically within minutes.</span>
        </div>
        <div style={{marginBottom:14}}><label style={LBL}>From Account</label><select value={from} onChange={e=>setFrom(e.target.value)} style={SEL}>{dep.map(a=><option key={a.id} value={a.id}>{a.label} — {usd(a.balance)}</option>)}</select></div>
        <div style={{marginBottom:14}}><label style={LBL}>Recipient (email or US mobile)</label><input type="text" placeholder="jane@example.com or (555) 867-5309" value={recipient} onChange={e=>setRecipient(e.target.value)} style={INP}/></div>
        <div style={{marginBottom:14}}><label style={LBL}>Amount</label><AmtInput value={amt} set={setAmt}/></div>
        <div style={{marginBottom:20}}><label style={LBL}>Note <span style={{fontWeight:400,color:GRAY}}>(optional)</span></label><input type="text" placeholder="e.g. Dinner, rent…" value={note} onChange={e=>setNote(e.target.value)} style={INP}/></div>
        <ErrBanner msg={err}/>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,background:"rgba(17,24,39,.06)",border:"none",borderRadius:9,padding:"10px 0",fontSize:13.5,fontWeight:600,color:MID,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
          <button disabled={busy} style={{flex:2,background:"#5A5AD7",border:"none",borderRadius:9,padding:"10px 0",fontSize:13.5,fontWeight:600,color:"#fff",cursor:busy?"not-allowed":"pointer",fontFamily:"inherit",opacity:busy?.7:1}} onClick={submit}>{busy?"Submitting…":`Send${amt&&parseFloat(amt)>0?` ${usd(parseFloat(amt))}`:""}`}</button>
        </div>
      </div>
    </ModalShell>
  );
}

/* ═════════════════════════════════════════════════════
   TAB CONTENT COMPONENTS
═════════════════════════════════════════════════════ */

/* ── Accounts Tab ───────────────────────────────── */
function DetailRow({label,value,copyVal,revealed,onToggleReveal,canHide}:{label:string;value:string;copyVal:string;revealed:boolean;onToggleReveal?:()=>void;canHide?:boolean}){
  const [copied,setCopied]=useState(false);
  function doCopy(){navigator.clipboard.writeText(copyVal).catch(()=>{});setCopied(true);setTimeout(()=>setCopied(false),1500);}
  const display=canHide&&!revealed?value.replace(/\S/g,"•"):value;
  return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid rgba(17,24,39,.05)"}}>
      <span style={{fontSize:12,color:GRAY,fontWeight:500,minWidth:180}}>{label}</span>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:13,fontFamily:"monospace",color:DARK,fontWeight:600,letterSpacing:".06em"}}>{display}</span>
        {canHide&&onToggleReveal&&(
          <button onClick={onToggleReveal} title={revealed?"Hide":"Show"} style={{background:"none",border:"none",cursor:"pointer",padding:2,color:GRAY,display:"flex",alignItems:"center"}}>
            {revealed
              ?<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              :<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            }
          </button>
        )}
        <button onClick={doCopy} title="Copy" style={{background:"none",border:"none",cursor:"pointer",padding:2,color:copied?"#059669":GRAY,display:"flex",alignItems:"center",transition:"color .2s"}}>
          {copied
            ?<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            :<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          }
        </button>
      </div>
    </div>
  );
}

function AccountsTab({accounts,onSetModal}:{accounts:Acct[];onSetModal:(m:ModalKey)=>void}){
  const [expandedId,setExpandedId]=useState<string|null>(null);
  const [revealedIds,setRevealedIds]=useState<Set<string>>(new Set());

  function toggleExpand(id:string){setExpandedId(v=>v===id?null:id);}
  function toggleReveal(key:string){setRevealedIds(v=>{const s=new Set(v);s.has(key)?s.delete(key):s.add(key);return s;});}

  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <div>
          <h2 style={{margin:"0 0 4px",fontFamily:FONT,fontWeight:800,fontSize:20,color:DARK}}>My Accounts</h2>
          <p style={{margin:0,fontSize:13,color:GRAY}}>{accounts.length} active account{accounts.length!==1?"s":""}</p>
        </div>
        <button onClick={()=>{window.location.href="/open-account";}} style={{background:RED,color:"#fff",border:"none",borderRadius:9,padding:"9px 18px",fontSize:13.5,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Open Account
        </button>
      </div>

      {accounts.map(a=>{
        const isCC=a.type==="Credit Card";
        const util=isCC?Math.round((Math.abs(Math.min(a.balance,0))/a.creditLimit)*100):null;
        const isExpanded=expandedId===a.id;
        return(
          <div key={a.id} style={{...CARD,marginBottom:12,overflow:"hidden"}}>
            <div style={{display:"flex",alignItems:"center",gap:16,padding:"18px 20px",flexWrap:"wrap"}}>
              {/* Color swatch */}
              <div style={{width:44,height:44,borderRadius:10,background:a.grad,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0,0,0,.18)"}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.9)" strokeWidth="1.8">
                  <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z"/>
                </svg>
              </div>
              {/* Info */}
              <div style={{flex:1,minWidth:120}}>
                <div style={{fontFamily:FONT,fontWeight:700,fontSize:15,color:DARK}}>{a.label}</div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginTop:3}}>
                  <span style={{fontSize:10.5,fontWeight:700,padding:"2px 7px",borderRadius:4,background:a.color+"18",color:a.color,letterSpacing:".04em"}}>{a.type}</span>
                  <span style={{fontSize:12,color:GRAY,fontFamily:"monospace",letterSpacing:".08em"}}>{a.number}</span>
                </div>
                {a.rate>0&&<div style={{fontSize:12,color:"#059669",marginTop:3,fontWeight:500}}>{pct(a.rate)}</div>}
              </div>
              {/* Balance */}
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontFamily:FONT,fontWeight:800,fontSize:22,color:a.balance<0?"#DC2626":DARK}}>{a.balance<0?"–":""}{usd(a.balance)}</div>
                <div style={{fontSize:12,color:GRAY,marginTop:2}}>{isCC?"Available credit":"Available"}: <span style={{fontWeight:600,color:MID}}>{usd(a.available)}</span></div>
              </div>
            </div>

            {/* Credit utilization bar */}
            {isCC&&util!==null&&(
              <div style={{padding:"0 20px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:GRAY,marginBottom:5}}>
                  <span>Credit utilization</span>
                  <span style={{color:util>75?"#DC2626":util>50?"#D97706":DARK,fontWeight:600}}>{util}%</span>
                </div>
                <div style={{height:4,background:"rgba(17,24,39,.08)",borderRadius:99,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${util}%`,background:util>75?"#DC2626":util>50?"#D97706":"#059669",borderRadius:99,transition:"width .4s"}}/>
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{borderTop:"1px solid rgba(17,24,39,.06)",padding:"12px 20px",display:"flex",gap:8,flexWrap:"wrap"}}>
              {[
                {label:"Transfer",  fn:()=>onSetModal("transfer")},
                {label:"Pay Bill",  fn:()=>onSetModal("paybill")},
                {label:"Statements",fn:()=>{}},
              ].map(btn=>(
                <button key={btn.label} onClick={btn.fn} style={{background:"rgba(17,24,39,.04)",border:"1px solid rgba(17,24,39,.1)",borderRadius:7,padding:"6px 14px",fontSize:12.5,fontWeight:600,color:MID,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}
                  onMouseEnter={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.color=RED;b.style.borderColor="rgba(140,29,37,.3)";}}
                  onMouseLeave={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.color=MID;b.style.borderColor="rgba(17,24,39,.1)";}}>
                  {btn.label}
                </button>
              ))}
              <button onClick={()=>toggleExpand(a.id)} style={{background:isExpanded?"rgba(140,29,37,.07)":"rgba(17,24,39,.04)",border:`1px solid ${isExpanded?"rgba(140,29,37,.25)":"rgba(17,24,39,.1)"}`,borderRadius:7,padding:"6px 14px",fontSize:12.5,fontWeight:600,color:isExpanded?RED:MID,cursor:"pointer",fontFamily:"inherit",transition:"all .15s",display:"flex",alignItems:"center",gap:5}}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>
                {isExpanded?"Hide Details":"Account Details"}
              </button>
            </div>

            {/* Expandable banking details */}
            {isExpanded&&(
              <div style={{borderTop:"1px solid rgba(17,24,39,.06)",padding:"14px 20px 6px",background:"rgba(249,250,251,.7)"}}>
                <div style={{fontSize:11,fontWeight:700,color:GRAY,letterSpacing:".08em",marginBottom:8,textTransform:"uppercase"}}>Banking Details</div>
                <DetailRow label="Account Number" value={a.accountNumber||"Not assigned"} copyVal={a.accountNumber||""} revealed={revealedIds.has(a.id+"-acct")} onToggleReveal={()=>toggleReveal(a.id+"-acct")} canHide/>
                <DetailRow label="ABA / ACH Routing" value={BANK.achRouting} copyVal={BANK.achRouting} revealed/>
                <DetailRow label="Domestic Wire Routing" value={BANK.wireRouting} copyVal={BANK.wireRouting} revealed/>
                <DetailRow label="SWIFT / BIC (International)" value={BANK.swiftCode} copyVal={BANK.swiftCode} revealed/>
                <p style={{fontSize:11,color:GRAY,margin:"10px 0 8px",lineHeight:1.5}}>Use these details to receive wire transfers or set up direct deposits. For international transfers, provide your bank name: <strong>First State Community Bank</strong>.</p>
              </div>
            )}
          </div>
        );
      })}

      {accounts.length===0&&(
        <div style={{...CARD,padding:"48px 24px",textAlign:"center",color:GRAY}}>
          <div style={{marginBottom:12}}>No accounts found.</div>
          <button onClick={()=>{window.location.href="/open-account";}} style={{background:RED,color:"#fff",border:"none",borderRadius:9,padding:"9px 20px",fontSize:13.5,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Open Your First Account</button>
        </div>
      )}
    </div>
  );
}

/* ── Transfers Tab ──────────────────────────────── */
function TransfersTab({accounts,txs,userId}:{accounts:Acct[];txs:Tx[];userId:string}){
  const dep=accounts.filter(a=>a.type!=="Credit Card");
  const initTo=dep.filter(a=>a.id!==dep[0]?.id)[0]?.id||"external";
  const [from,setFrom]=useState(dep[0]?.id||"");
  const [to,setTo]=useState(initTo);
  const [amt,setAmt]=useState(""); const [memo,setMemo]=useState("");
  const [err,setErr]=useState(""); const [done,setDone]=useState(false); const [frozen,setFrozen]=useState(false); const [busy,setBusy]=useState(false);

  /* external transfer state */
  const [extAccts,setExtAccts]=useState<ExtAcct[]>([]);
  const [extMode,setExtMode]=useState<"pick"|"new">("pick");
  const [selExtId,setSelExtId]=useState<string|null>(null);
  const [saveAcct,setSaveAcct]=useState(true);
  const [extForm,setExtForm]=useState({routingNumber:"",accountNumber:"",accountType:"checking",holderName:"",bankName:"",nickname:""});
  const [selBank,setSelBank]=useState<string>("");
  const upExt=(k:keyof typeof extForm,v:string)=>setExtForm(f=>({...f,[k]:v}));

  const isExt=to==="external";
  const recent=txs.filter(t=>t.category==="Transfer").slice(0,5);

  useEffect(()=>{
    if(!isExt) return;
    createClient().from("external_accounts").select("*").eq("user_id",userId).order("created_at",{ascending:false}).then(({data})=>{
      const list=(data||[]) as ExtAcct[];
      setExtAccts(list);
      if(list.length>0){setExtMode("pick");setSelExtId(list[0].id);}
      else setExtMode("new");
    });
  },[isExt,userId]);

  async function submit(){
    if(!amt||parseFloat(amt)<=0){setErr("Please enter a valid amount.");return;}
    setBusy(true); setErr("");
    const sb=createClient();

    if(isExt){
      let ext:ExtAcct|null=null;
      if(extMode==="pick"){
        ext=extAccts.find(a=>a.id===selExtId)||null;
        if(!ext){setErr("Select an external account.");setBusy(false);return;}
      } else {
        if(extForm.routingNumber.length!==9){setErr("Routing number must be 9 digits.");setBusy(false);return;}
        if(!extForm.accountNumber){setErr("Enter the account number.");setBusy(false);return;}
        if(!extForm.holderName.trim()){setErr("Enter the account holder name.");setBusy(false);return;}
        let savedId="";
        if(saveAcct){
          const {data,error}=await sb.from("external_accounts").insert({
            user_id:userId,routing_number:extForm.routingNumber,account_number:extForm.accountNumber,
            account_type:extForm.accountType,holder_name:extForm.holderName,
            bank_name:extForm.bankName||null,nickname:extForm.nickname||null,
          }).select("id").single();
          if(error){setErr(error.message);setBusy(false);return;}
          savedId=(data as Record<string,string>)?.id||"";
        }
        ext={id:savedId,routingNumber:extForm.routingNumber,accountNumber:extForm.accountNumber,accountType:extForm.accountType,holderName:extForm.holderName,bankName:extForm.bankName,nickname:extForm.nickname};
      }
      const memoPayload=JSON.stringify({type:"external_transfer",extAccountId:ext.id||null,bankName:ext.bankName||"External Bank",routingNumber:ext.routingNumber,accountNumber:ext.accountNumber,accountType:ext.accountType,holderName:ext.holderName,note:memo||null});
      const {error}=await sb.from("transactions").insert({
        account_id:from,user_id:userId,
        merchant:`External Transfer → ${ext.bankName||"External Bank"}`,
        category:"Transfer",amount:-parseFloat(amt),transaction_type:"transfer",
        posted_at:new Date().toISOString(),submitted_at:new Date().toISOString(),
        memo:memoPayload,status:"pending",
      });
      if(error){setErr(error.message);setBusy(false);return;}
      await fetch("/api/transfer/freeze",{method:"POST"});
      setBusy(false);
      setFrozen(true);
      setDone(true);
      return;
    }

    /* internal transfer */
    if(from===to){setErr("From and To must be different.");setBusy(false);return;}
    const toName=accounts.find(a=>a.id===to)?.label||"Account";
    const fromName=accounts.find(a=>a.id===from)?.label||"Account";
    const now=new Date().toISOString();
    const parsedAmt=parseFloat(amt);
    const {error}=await sb.from("transactions").insert([
      {account_id:from,user_id:userId,merchant:`Transfer → ${toName}`,
       category:"Transfer",amount:-parsedAmt,transaction_type:"transfer",
       posted_at:now,submitted_at:now,memo:memo||null,status:"pending"},
      {account_id:to,user_id:userId,merchant:`Transfer ← ${fromName}`,
       category:"Transfer",amount:parsedAmt,transaction_type:"transfer",
       posted_at:now,submitted_at:now,memo:memo||null,status:"pending"},
    ]);
    setBusy(false);
    if(error){setErr(error.message);return;}
    setDone(true);
  }

  return(
    <div className="db-action-grid">

      {/* Form */}
      <div style={{...CARD,overflow:"hidden"}}>
        <div style={{padding:"18px 24px",borderBottom:"1px solid rgba(17,24,39,.07)"}}>
          <h2 style={{margin:0,fontFamily:FONT,fontWeight:700,fontSize:17,color:DARK}}>Transfer Money</h2>
          <p style={{margin:"4px 0 0",fontSize:13,color:GRAY}}>Move funds between your accounts instantly.</p>
        </div>
        {done?(
          frozen?(
            <FreezeState onClose={()=>{setDone(false);setFrozen(false);setAmt("");setMemo("");setExtForm({routingNumber:"",accountNumber:"",accountType:"checking",holderName:"",bankName:"",nickname:""});setSelBank("");}}/>
          ):(
          <div style={{padding:"48px 24px",textAlign:"center"}}>
            <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(217,119,6,.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",color:"#D97706"}}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <div style={{fontFamily:FONT,fontWeight:700,fontSize:17,color:DARK,marginBottom:8}}>Submitted for Review</div>
            <div style={{fontSize:14,color:GRAY,marginBottom:24,lineHeight:1.55}}>Your transfer request is pending admin approval.</div>
            <button onClick={()=>{setDone(false);setAmt("");setMemo("");setExtForm({routingNumber:"",accountNumber:"",accountType:"checking",holderName:"",bankName:"",nickname:""});setSelBank("");}} style={{background:RED,color:"#fff",border:"none",borderRadius:9,padding:"10px 24px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>New Transfer</button>
          </div>
          )
        ):(
          <div style={{padding:"24px"}}>
            <div style={{marginBottom:16}}><label style={LBL}>From Account</label><select value={from} onChange={e=>{const v=e.target.value;setFrom(v);if(to===v){setTo(dep.find(a=>a.id!==v)?.id||"external");setErr("");}}} style={SEL}>{dep.map(a=><option key={a.id} value={a.id}>{a.label} — {usd(a.balance)}</option>)}</select></div>
            <div style={{marginBottom:isExt?16:16}}>
              <label style={LBL}>To Account</label>
              <select value={to} onChange={e=>{setTo(e.target.value);setErr("");}} style={SEL}>
                {dep.filter(a=>a.id!==from).map(a=><option key={a.id} value={a.id}>{a.label}</option>)}
                <option value="external">External / Other Bank</option>
              </select>
            </div>

            {/* ── External bank section ── */}
            {isExt&&(
              <div style={{background:"rgba(17,24,39,.03)",border:"1px solid rgba(17,24,39,.09)",borderRadius:10,padding:"14px 16px",marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <span style={{fontSize:12.5,fontWeight:700,color:MID}}>External Bank Details</span>
                  {extAccts.length>0&&(
                    <button onClick={()=>setExtMode(m=>m==="pick"?"new":"pick")} style={{background:"none",border:"none",fontSize:12,fontWeight:600,color:RED,cursor:"pointer",fontFamily:"inherit",padding:0}}>
                      {extMode==="pick"?"+ Add New Account":"← Saved Accounts"}
                    </button>
                  )}
                </div>
                {extMode==="pick"&&extAccts.length>0?(
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {extAccts.map(a=>(
                      <label key={a.id} style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",padding:"10px 12px",border:`1.5px solid ${selExtId===a.id?RED:"rgba(17,24,39,.1)"}`,borderRadius:9,background:selExtId===a.id?"rgba(140,29,37,.04)":"#fff",transition:"all .15s"}}>
                        <input type="radio" name="extAcctTab" checked={selExtId===a.id} onChange={()=>setSelExtId(a.id)} style={{accentColor:RED,marginTop:2,flexShrink:0}}/>
                        <div>
                          <div style={{fontSize:13,fontWeight:600,color:DARK}}>{a.nickname||a.bankName||"External Account"}</div>
                          <div style={{fontSize:12,color:GRAY,marginTop:2}}>
                            {a.bankName&&<>{a.bankName} · </>}
                            <span style={{textTransform:"capitalize"}}>{a.accountType}</span>
                            {" · "}••••{(a.accountNumber||"").slice(-4)}
                          </div>
                          <div style={{fontSize:11.5,color:GRAY}}>{a.holderName} · Routing ••••{(a.routingNumber||"").slice(-4)}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                ):(
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {/* Bank logo picker */}
                    <div>
                      <label style={LBL}>Select Your Bank</label>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7}}>
                        {EXT_BANKS.map(b=>(
                          <button key={b.key} type="button"
                            onClick={()=>{setSelBank(b.key);upExt("bankName",b.name);}}
                            style={{padding:"10px 6px 8px",border:`1.5px solid ${selBank===b.key?RED:"rgba(17,24,39,.12)"}`,borderRadius:9,background:selBank===b.key?"rgba(140,29,37,.04)":"#fff",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5,transition:"all .15s",fontFamily:"inherit",outline:"none"}}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={b.logo} alt={b.name} style={{height:28,width:"auto",maxWidth:64,objectFit:"contain"}}/>
                            <span style={{fontSize:10,fontWeight:600,color:selBank===b.key?RED:MID,textAlign:"center",lineHeight:1.3}}>{b.name}</span>
                          </button>
                        ))}
                        <button type="button"
                          onClick={()=>{setSelBank("other");upExt("bankName","");}}
                          style={{padding:"10px 6px 8px",border:`1.5px solid ${selBank==="other"?RED:"rgba(17,24,39,.12)"}`,borderRadius:9,background:selBank==="other"?"rgba(140,29,37,.04)":"#fff",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5,transition:"all .15s",fontFamily:"inherit",outline:"none"}}>
                          <div style={{height:28,width:28,borderRadius:"50%",background:"rgba(17,24,39,.07)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={selBank==="other"?RED:GRAY} strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                          </div>
                          <span style={{fontSize:10,fontWeight:600,color:selBank==="other"?RED:MID,textAlign:"center",lineHeight:1.3}}>Other</span>
                        </button>
                      </div>
                      {selBank==="other"&&(
                        <div style={{marginTop:8}}>
                          <input type="text" placeholder="Enter your bank name" value={extForm.bankName} onChange={e=>upExt("bankName",e.target.value)} style={INP}/>
                        </div>
                      )}
                    </div>

                    {/* Account fields — shown once a bank is chosen */}
                    {selBank&&(
                      <div style={{display:"flex",flexDirection:"column",gap:10}}>
                        {/* Selected bank banner */}
                        <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"rgba(140,29,37,.04)",border:"1px solid rgba(140,29,37,.16)",borderRadius:8}}>
                          {selBank!=="other"&&EXT_BANKS.find(b=>b.key===selBank)&&(
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={EXT_BANKS.find(b=>b.key===selBank)!.logo} alt="" style={{height:20,width:"auto",maxWidth:52,objectFit:"contain"}}/>
                          )}
                          <span style={{fontSize:13,fontWeight:700,color:RED}}>{extForm.bankName||"Other Bank"}</span>
                          <button type="button" onClick={()=>{setSelBank("");upExt("bankName","");}} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",padding:"2px 6px",color:GRAY,fontSize:11.5,fontWeight:500,fontFamily:"inherit",borderRadius:5}}>Change</button>
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                          <div>
                            <label style={LBL}>Routing Number</label>
                            <input type="text" inputMode="numeric" maxLength={9} placeholder="9-digit ABA" value={extForm.routingNumber} onChange={e=>upExt("routingNumber",e.target.value.replace(/\D/g,""))} style={INP}/>
                          </div>
                          <div>
                            <label style={LBL}>Account Number</label>
                            <input type="text" inputMode="numeric" placeholder="Account number" value={extForm.accountNumber} onChange={e=>upExt("accountNumber",e.target.value.replace(/\D/g,""))} style={INP}/>
                          </div>
                          <div>
                            <label style={LBL}>Account Type</label>
                            <select value={extForm.accountType} onChange={e=>upExt("accountType",e.target.value)} style={{...INP,appearance:"auto" as React.CSSProperties["appearance"],cursor:"pointer"}}>
                              <option value="checking">Checking</option>
                              <option value="savings">Savings</option>
                            </select>
                          </div>
                          <div>
                            <label style={LBL}>Account Holder Name</label>
                            <input type="text" placeholder="Full name on account" value={extForm.holderName} onChange={e=>upExt("holderName",e.target.value)} style={INP}/>
                          </div>
                          <div style={{gridColumn:"1/-1"}}>
                            <label style={LBL}>Nickname <span style={{fontWeight:400,color:GRAY}}>(optional)</span></label>
                            <input type="text" placeholder="e.g. My Chase Savings" value={extForm.nickname} onChange={e=>upExt("nickname",e.target.value)} style={INP}/>
                          </div>
                          <div style={{gridColumn:"1/-1"}}>
                            <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13,color:MID}}>
                              <input type="checkbox" checked={saveAcct} onChange={e=>setSaveAcct(e.target.checked)} style={{accentColor:RED,width:15,height:15,cursor:"pointer"}}/>
                              Save this account for future transfers
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div style={{marginBottom:16}}><label style={LBL}>Amount</label><AmtInput value={amt} set={setAmt}/></div>
            <div style={{marginBottom:20}}><label style={LBL}>Memo <span style={{fontWeight:400,color:GRAY}}>(optional)</span></label><input type="text" placeholder={isExt?"e.g. Rent payment, wire transfer…":"e.g. Monthly savings transfer…"} value={memo} onChange={e=>setMemo(e.target.value)} style={INP}/></div>
            <ErrBanner msg={err}/>
            <button disabled={busy} style={{width:"100%",background:RED,border:"none",borderRadius:10,padding:"12px 0",fontSize:14,fontWeight:700,color:"#fff",cursor:busy?"not-allowed":"pointer",fontFamily:FONT,opacity:busy?.7:1}} onClick={submit}>
              {busy?"Submitting…":isExt?"Send External Transfer":"Transfer Funds"}
            </button>
            <p style={{margin:"12px 0 0",fontSize:12,color:GRAY,textAlign:"center"}}>Transfers are posted once approved by the bank.</p>
          </div>
        )}
      </div>

      {/* Recent transfers */}
      <div style={{...CARD,overflow:"hidden"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(17,24,39,.07)"}}>
          <div style={{fontFamily:FONT,fontWeight:700,fontSize:15,color:DARK}}>Recent Transfers</div>
        </div>
        {recent.length===0
          ?<div style={{padding:"28px 20px",textAlign:"center",color:GRAY,fontSize:13}}>No recent transfers this month.</div>
          :recent.map(tx=><TxRow key={tx.id} tx={tx}/>)
        }
      </div>
    </div>
  );
}

/* ── Pay Bills Tab ──────────────────────────────── */
function PayBillsTab({accounts,txs,userId}:{accounts:Acct[];txs:Tx[];userId:string}){
  const dep=accounts.filter(a=>a.type!=="Credit Card");
  const [from,setFrom]=useState(dep[0]?.id||""); const [payee,setPayee]=useState(""); const [amt,setAmt]=useState(""); const [date,setDate]=useState(new Date().toISOString().split("T")[0]);
  const [err,setErr]=useState(""); const [done,setDone]=useState(false); const [busy,setBusy]=useState(false);
  const recentPmts=txs.filter(t=>["Housing","Shopping","Dining","Entertainment","Auto & Gas"].includes(t.category)&&t.amount<0).slice(0,6);
  const PAYEES=["Mortgage / Rent","City Electric","Water Utility","Internet / Cable","Car Insurance","Phone Bill","Health Insurance","Credit Card"];
  return(
    <div className="db-action-grid">

      {/* Form */}
      <div style={{...CARD,overflow:"hidden"}}>
        <div style={{padding:"18px 24px",borderBottom:"1px solid rgba(17,24,39,.07)"}}>
          <h2 style={{margin:0,fontFamily:FONT,fontWeight:700,fontSize:17,color:DARK}}>Pay a Bill</h2>
          <p style={{margin:"4px 0 0",fontSize:13,color:GRAY}}>Schedule one-time or recurring bill payments.</p>
        </div>
        {done?(
          <div style={{padding:"48px 24px",textAlign:"center"}}>
            <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(217,119,6,.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",color:"#D97706"}}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <div style={{fontFamily:FONT,fontWeight:700,fontSize:17,color:DARK,marginBottom:8}}>Submitted for Review</div>
            <div style={{fontSize:14,color:GRAY,marginBottom:24,lineHeight:1.55}}>Your payment to {payee} is pending admin approval.</div>
            <button onClick={()=>{setDone(false);setPayee("");setAmt("");}} style={{background:RED,color:"#fff",border:"none",borderRadius:9,padding:"10px 24px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Pay Another Bill</button>
          </div>
        ):(
          <div style={{padding:"24px"}}>
            <div style={{marginBottom:16}}><label style={LBL}>Pay From</label><select value={from} onChange={e=>setFrom(e.target.value)} style={SEL}>{dep.map(a=><option key={a.id} value={a.id}>{a.label} — {usd(a.balance)}</option>)}</select></div>
            <div style={{marginBottom:16}}>
              <label style={LBL}>Payee</label>
              <input list="payees" type="text" placeholder="Enter payee name or choose below…" value={payee} onChange={e=>setPayee(e.target.value)} style={INP}/>
              <datalist id="payees">{PAYEES.map(p=><option key={p} value={p}/>)}</datalist>
            </div>
            <div style={{marginBottom:16,display:"flex",flexWrap:"wrap",gap:6}}>
              {PAYEES.slice(0,4).map(p=>(
                <button key={p} onClick={()=>setPayee(p)} style={{background:"rgba(17,24,39,.04)",border:"1px solid rgba(17,24,39,.1)",borderRadius:6,padding:"4px 10px",fontSize:12,color:MID,cursor:"pointer",fontFamily:"inherit"}}>{p}</button>
              ))}
            </div>
            <Row2>
              <div><label style={LBL}>Amount</label><AmtInput value={amt} set={setAmt}/></div>
              <div><label style={LBL}>Payment Date</label><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={INP}/></div>
            </Row2>
            <div style={{marginTop:16}}><ErrBanner msg={err}/></div>
            <button disabled={busy} style={{width:"100%",marginTop:8,background:RED,border:"none",borderRadius:10,padding:"12px 0",fontSize:14,fontWeight:700,color:"#fff",cursor:busy?"not-allowed":"pointer",fontFamily:FONT,opacity:busy?.7:1}} onClick={async()=>{
              if(!payee.trim()){setErr("Please enter a payee.");return;}
              if(!amt||parseFloat(amt)<=0){setErr("Please enter a valid amount.");return;}
              setBusy(true);
              const sb=createClient();
              const {error}=await sb.from("transactions").insert({
                account_id:from,user_id:userId,merchant:payee.trim(),
                category:"Bill Payment",amount:-parseFloat(amt),transaction_type:"payment",
                posted_at:new Date(date+"T12:00:00").toISOString(),submitted_at:new Date().toISOString(),
                memo:null,status:"pending",
              });
              setBusy(false);
              if(error){setErr(error.message);return;}
              setErr("");setDone(true);
            }}>
              {busy?"Submitting…":"Schedule Payment"}
            </button>
          </div>
        )}
      </div>

      {/* Recent */}
      <div style={{...CARD,overflow:"hidden"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(17,24,39,.07)"}}>
          <div style={{fontFamily:FONT,fontWeight:700,fontSize:15,color:DARK}}>Recent Payments</div>
        </div>
        {recentPmts.length===0
          ?<div style={{padding:"28px 20px",textAlign:"center",color:GRAY,fontSize:13}}>No recent payments this month.</div>
          :recentPmts.map(tx=><TxRow key={tx.id} tx={tx}/>)
        }
      </div>
    </div>
  );
}

/* ── Cards Tab ──────────────────────────────────── */
function CardsTab({accounts}:{accounts:Acct[]}){
  const [frozen,setFrozen]=useState<Set<string>>(new Set());
  const [busy,setBusy]=useState<string|null>(null);
  async function toggle(a:Acct){
    setBusy(a.id);
    const sb=createClient();
    const nowFrozen=!frozen.has(a.id);
    await sb.from("accounts").update({status:nowFrozen?"frozen":"active"}).eq("id",a.id);
    setFrozen(prev=>{const n=new Set(prev);nowFrozen?n.add(a.id):n.delete(a.id);return n;});
    setBusy(null);
  }
  return(
    <div>
      <div style={{marginBottom:20}}>
        <h2 style={{margin:"0 0 4px",fontFamily:FONT,fontWeight:800,fontSize:20,color:DARK}}>Cards & Account Management</h2>
        <p style={{margin:0,fontSize:13,color:GRAY}}>Freeze, unfreeze, and manage your debit and credit cards.</p>
      </div>
      <div className="db-cards" style={{marginBottom:0}}>
        {accounts.map(a=>{
          const isFrozen=frozen.has(a.id);
          const isCC=a.type==="Credit Card";
          return(
            <div key={a.id} style={{display:"flex",flexDirection:"column",gap:12}}>
              {/* Premium card */}
              <div style={{opacity:isFrozen?.55:1,transition:"opacity .3s",filter:isFrozen?"grayscale(.8)":"none"}}>
                <AccountCard a={a}/>
              </div>
              {/* Controls */}
              <div style={{...CARD,padding:"16px"}}>
                {isFrozen&&(
                  <div style={{background:"rgba(220,38,38,.06)",border:"1px solid rgba(220,38,38,.15)",borderRadius:8,padding:"8px 12px",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <span style={{fontSize:12.5,color:"#DC2626",fontWeight:600}}>Card is frozen — no new transactions</span>
                  </div>
                )}
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  <button disabled={busy===a.id} onClick={()=>toggle(a)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",background:isFrozen?"rgba(22,163,74,.08)":"rgba(220,38,38,.06)",border:`1px solid ${isFrozen?"rgba(22,163,74,.2)":"rgba(220,38,38,.15)"}`,borderRadius:9,padding:"10px 14px",cursor:busy===a.id?"not-allowed":"pointer",fontFamily:"inherit",transition:"all .15s",opacity:busy===a.id?.5:1}}>
                    <span style={{fontSize:13,fontWeight:600,color:isFrozen?"#16A34A":"#DC2626"}}>{busy===a.id?"Processing…":isFrozen?"Unfreeze Card":"Freeze Card"}</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={isFrozen?"#16A34A":"#DC2626"} strokeWidth="2"><path d={isFrozen?"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4":"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"}/></svg>
                  </button>
                  {isCC&&(
                    <div style={{fontSize:12.5,color:GRAY,padding:"6px 0",borderTop:"1px solid rgba(17,24,39,.06)",marginTop:4}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span>Credit Limit</span><span style={{fontWeight:600,color:DARK}}>{usd(a.creditLimit)}</span></div>
                      <div style={{display:"flex",justifyContent:"space-between"}}><span>APR</span><span style={{fontWeight:600,color:DARK}}>{(a.rate*100).toFixed(2)}%</span></div>
                    </div>
                  )}
                  {!isCC&&a.rate>0&&(
                    <div style={{fontSize:12.5,color:GRAY,padding:"6px 0",borderTop:"1px solid rgba(17,24,39,.06)",marginTop:4}}>
                      <div style={{display:"flex",justifyContent:"space-between"}}><span>Interest Rate</span><span style={{fontWeight:600,color:"#059669"}}>{(a.rate*100).toFixed(2)}% APY</span></div>
                    </div>
                  )}
                  <button style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"1px solid rgba(17,24,39,.1)",borderRadius:9,padding:"9px 14px",cursor:"pointer",fontFamily:"inherit",fontSize:13,color:MID,transition:"all .15s",width:"100%"}}
                    onMouseEnter={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.color=RED;b.style.borderColor="rgba(140,29,37,.3)";}}
                    onMouseLeave={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.color=MID;b.style.borderColor="rgba(17,24,39,.1)";}}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/></svg>
                    Report Lost or Stolen
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Statements Tab ─────────────────────────────── */
type DashStmt={id:string;account_id:string;reference_id:string;period_start:string;period_end:string;generated_at:string;opening_balance:number;closing_balance:number;total_credits:number;total_debits:number;transaction_count:number};

function StatementsTab({onClose,accounts}:{onClose:()=>void;accounts:Acct[]}){
  const [stmts,   setStmts]   = useState<DashStmt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    createClient()
      .from("statements")
      .select("id,account_id,reference_id,period_start,period_end,generated_at,opening_balance,closing_balance,total_credits,total_debits,transaction_count")
      .order("generated_at",{ascending:false})
      .limit(50)
      .then(({data})=>{setStmts((data??[]) as DashStmt[]);setLoading(false);});
  },[]);

  const acctName=(id:string)=>{
    const a=accounts.find(a=>a.id===id);
    return a?`${a.label} ••••${a.number.slice(-4)}`:"Account";
  };

  const fmtPeriod=(s:string,e:string)=>{
    const f=(d:string)=>new Date(d+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
    return `${f(s)} – ${f(e)}`;
  };

  return(
    <div>
      <div style={{marginBottom:20}}>
        <h2 style={{margin:"0 0 4px",fontFamily:FONT,fontWeight:800,fontSize:20,color:DARK}}>Statements</h2>
        <p style={{margin:0,fontSize:13,color:GRAY}}>Official account statements posted by the bank.</p>
      </div>

      {loading?(
        <div style={{...CARD,padding:"40px 24px",textAlign:"center",color:GRAY,fontSize:13.5}}>Loading statements…</div>
      ):stmts.length===0?(
        <div style={{...CARD,padding:"48px 24px",textAlign:"center"}}>
          <div style={{width:48,height:48,borderRadius:12,background:"rgba(140,29,37,.07)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",color:RED}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6"/></svg>
          </div>
          <div style={{fontFamily:FONT,fontWeight:700,fontSize:15,color:DARK,marginBottom:6}}>No statements yet</div>
          <div style={{fontSize:13,color:GRAY,maxWidth:300,margin:"0 auto"}}>Your bank will post statements to your account. They&apos;ll appear here when available.</div>
        </div>
      ):(
        <div style={{...CARD,overflow:"hidden"}}>
          {stmts.map((s,i)=>(
            <div key={s.id} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 22px",borderBottom:i<stmts.length-1?"1px solid rgba(17,24,39,.05)":"none"}}>
              <div style={{width:40,height:40,borderRadius:10,background:"rgba(140,29,37,.07)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:RED}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6"/></svg>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:600,color:DARK,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{acctName(s.account_id)}</div>
                <div style={{fontSize:12.5,color:MID,marginTop:2}}>{fmtPeriod(s.period_start,s.period_end)}</div>
                <div style={{fontSize:11.5,color:GRAY,marginTop:2}}>
                  {s.transaction_count} transaction{s.transaction_count!==1?"s":""} · Closing balance {usd(s.closing_balance)}
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5,flexShrink:0}}>
                <span style={{fontSize:10,color:GRAY,fontFamily:"monospace"}}>{s.reference_id}</span>
                <a href={`/statement?accountId=${s.account_id}&start=${s.period_start}&end=${s.period_end}`} target="_blank" rel="noopener noreferrer"
                  style={{display:"flex",alignItems:"center",gap:5,background:"none",border:`1px solid rgba(140,29,37,.25)`,borderRadius:8,padding:"6px 13px",fontSize:12.5,fontWeight:600,color:RED,textDecoration:"none",transition:"all .15s"}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
                  View PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Profile Tab ────────────────────────────────── */
function ProfileTab({profile,accounts,initials}:{
  profile:{firstName:string;lastName:string;email:string;phone:string;dob:string;lastLogin:string;memberSince:string;kycStatus:string};
  accounts:Acct[];
  initials:string;
}){
  const KYC_COLOR:Record<string,{bg:string;text:string}>={
    verified:{bg:"rgba(22,163,74,.1)",text:"#16A34A"},
    pending: {bg:"rgba(217,119,6,.1)", text:"#D97706"},
    rejected:{bg:"rgba(220,38,38,.1)", text:"#DC2626"},
  };
  const kyc=KYC_COLOR[profile.kycStatus]??KYC_COLOR.pending;
  const totalBalance=accounts.reduce((s,a)=>s+a.balance,0);

  function Row({label,value}:{label:string;value:string}){
    return(
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:"1px solid rgba(17,24,39,.06)"}}>
        <span style={{fontSize:13,color:GRAY,fontWeight:500}}>{label}</span>
        <span style={{fontSize:13.5,color:DARK,fontWeight:600,textAlign:"right",maxWidth:"60%",wordBreak:"break-all"}}>{value||"—"}</span>
      </div>
    );
  }

  return(
    <div>
      <div style={{marginBottom:20}}>
        <h2 style={{margin:"0 0 4px",fontFamily:FONT,fontWeight:800,fontSize:20,color:DARK}}>My Profile</h2>
        <p style={{margin:0,fontSize:13,color:GRAY}}>Your personal information and account details.</p>
      </div>

      <div className="db-profile">

        {/* Left — personal info */}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>

          {/* Avatar + name card */}
          <div style={{background:"#fff",borderRadius:16,border:"1px solid rgba(17,24,39,.08)",boxShadow:"0 1px 4px rgba(17,24,39,.06)",padding:"28px 28px 24px"}}><div className="db-profile-hero">
            <div style={{width:72,height:72,borderRadius:"50%",background:`linear-gradient(145deg,${RED},#5a1018)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONT,fontWeight:800,fontSize:26,color:"#fff",flexShrink:0,boxShadow:"0 4px 16px rgba(140,29,37,.35)"}}>
              {initials}
            </div>
            <div>
              <div style={{fontFamily:FONT,fontWeight:800,fontSize:20,color:DARK,marginBottom:6}}>{profile.firstName} {profile.lastName}</div>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <span style={{fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:99,background:kyc.bg,color:kyc.text,textTransform:"capitalize",letterSpacing:".03em"}}>
                  {profile.kycStatus==="verified"?"✓ Verified":profile.kycStatus==="rejected"?"✕ Rejected":"⏳ Pending Verification"}
                </span>
                {profile.memberSince&&<span style={{fontSize:12,color:GRAY}}>Member since {profile.memberSince}</span>}
              </div>
            </div></div>{/* /db-profile-hero */}
          </div>

          {/* Personal details */}
          <div style={{background:"#fff",borderRadius:16,border:"1px solid rgba(17,24,39,.08)",boxShadow:"0 1px 4px rgba(17,24,39,.06)",padding:"20px 24px"}}>
            <div style={{fontFamily:FONT,fontWeight:700,fontSize:14,color:DARK,marginBottom:4}}>Personal Information</div>
            <div style={{fontSize:12,color:GRAY,marginBottom:16}}>Contact support to update your details.</div>
            <Row label="Full Name"    value={`${profile.firstName} ${profile.lastName}`.trim()}/>
            <Row label="Email Address" value={profile.email}/>
            <Row label="Phone Number" value={profile.phone}/>
            <Row label="Date of Birth" value={profile.dob ? new Date(profile.dob+"T00:00:00").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}) : ""}/>
          </div>

          {/* Security */}
          <div style={{background:"#fff",borderRadius:16,border:"1px solid rgba(17,24,39,.08)",boxShadow:"0 1px 4px rgba(17,24,39,.06)",padding:"20px 24px"}}>
            <div style={{fontFamily:FONT,fontWeight:700,fontSize:14,color:DARK,marginBottom:16}}>Security</div>
            <Row label="Last Login"  value={profile.lastLogin}/>
            <div style={{padding:"14px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:13,color:GRAY,fontWeight:500}}>Password</span>
              <span style={{fontSize:13,color:GRAY,fontFamily:"monospace",letterSpacing:".2em"}}>••••••••••</span>
            </div>
          </div>
        </div>

        {/* Right — account summary */}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>

          {/* Account summary */}
          <div style={{background:"#fff",borderRadius:16,border:"1px solid rgba(17,24,39,.08)",boxShadow:"0 1px 4px rgba(17,24,39,.06)",padding:"20px 24px"}}>
            <div style={{fontFamily:FONT,fontWeight:700,fontSize:14,color:DARK,marginBottom:16}}>Account Summary</div>
            <div style={{display:"flex",gap:12,marginBottom:16}}>
              <div style={{flex:1,background:"rgba(140,29,37,.05)",borderRadius:12,padding:"14px 16px",textAlign:"center"}}>
                <div style={{fontFamily:FONT,fontWeight:800,fontSize:24,color:RED}}>{accounts.length}</div>
                <div style={{fontSize:11.5,color:GRAY,marginTop:2}}>Active Account{accounts.length!==1?"s":""}</div>
              </div>
              <div style={{flex:1,background:"rgba(22,163,74,.05)",borderRadius:12,padding:"14px 16px",textAlign:"center"}}>
                <div style={{fontFamily:FONT,fontWeight:800,fontSize:18,color:"#16A34A"}}>{new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",notation:"compact",maximumFractionDigits:1}).format(totalBalance)}</div>
                <div style={{fontSize:11.5,color:GRAY,marginTop:2}}>Total Balance</div>
              </div>
            </div>
            {accounts.map(a=>(
              <div key={a.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid rgba(17,24,39,.05)"}}>
                <div style={{width:34,height:34,borderRadius:8,background:a.grad,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.9)" strokeWidth="2"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z"/></svg>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:DARK,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.label}</div>
                  <div style={{fontSize:11.5,color:GRAY,fontFamily:"monospace",letterSpacing:".06em"}}>{a.number}</div>
                </div>
                <div style={{fontSize:13,fontWeight:700,color:DARK,fontFamily:FONT,flexShrink:0}}>{new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(a.balance)}</div>
              </div>
            ))}
            {accounts.length===0&&<div style={{padding:"12px 0",textAlign:"center",fontSize:13,color:GRAY}}>No active accounts.</div>}
          </div>

          {/* Need help */}
          <div style={{background:"#fff",borderRadius:16,border:"1px solid rgba(17,24,39,.08)",boxShadow:"0 1px 4px rgba(17,24,39,.06)",padding:"18px 20px"}}>
            <div style={{fontFamily:FONT,fontWeight:700,fontSize:13.5,color:DARK,marginBottom:8}}>Need to update your info?</div>
            <p style={{margin:"0 0 14px",fontSize:12.5,color:GRAY,lineHeight:1.55}}>To change your name, address, or other personal details, please contact our support team.</p>
            <Link href="/about/contact" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:RED,color:"#fff",borderRadius:9,padding:"9px 0",fontSize:13,fontWeight:600,textDecoration:"none",fontFamily:FONT}}>
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════
   HISTORY TAB
═════════════════════════════════════════════════════ */
function HistoryTab({txs}:{txs:Tx[]}){
  const [filter,setFilter]=useState<"all"|"debits"|"credits">("all");
  const [shown,setShown]=useState(25);
  const filtered=txs.filter(t=>filter==="all"||(filter==="debits"&&t.amount<0)||(filter==="credits"&&t.amount>0));
  return(
    <div>
      <div style={{marginBottom:20}}>
        <h2 style={{margin:"0 0 4px",fontFamily:FONT,fontWeight:800,fontSize:20,color:DARK}}>Transaction History</h2>
        <p style={{margin:0,fontSize:13,color:GRAY}}>{txs.length} total posted transaction{txs.length!==1?"s":""}</p>
      </div>
      <div style={{...CARD,overflow:"hidden"}}>
        <div style={{padding:"10px 20px",display:"flex",gap:4,borderBottom:"1px solid rgba(17,24,39,.07)"}}>
          {(["all","debits","credits"] as const).map(f=>(
            <button key={f} onClick={()=>{setFilter(f);setShown(25);}} style={{background:filter===f?"rgba(140,29,37,.08)":"transparent",color:filter===f?RED:GRAY,border:"none",borderRadius:6,padding:"5px 14px",fontSize:12.5,fontWeight:filter===f?600:400,cursor:"pointer",fontFamily:"inherit",transition:"all .15s",textTransform:"capitalize"}}>
              {f==="all"?"All":f==="debits"?"Debits":"Credits"}
            </button>
          ))}
          <span style={{marginLeft:"auto",fontSize:12,color:GRAY,alignSelf:"center"}}>{filtered.length} transaction{filtered.length!==1?"s":""}</span>
        </div>
        {filtered.length===0
          ?<div style={{padding:"40px 20px",textAlign:"center",color:GRAY,fontSize:13.5}}>No transactions match this filter.</div>
          :filtered.slice(0,shown).map(tx=><TxRow key={tx.id} tx={tx}/>)
        }
        {filtered.length>shown&&(
          <div style={{padding:"14px 20px",borderTop:"1px solid rgba(17,24,39,.06)",textAlign:"center"}}>
            <button onClick={()=>setShown(n=>n+25)} style={{background:"none",border:"1px solid rgba(17,24,39,.12)",borderRadius:8,padding:"8px 22px",fontSize:13,color:MID,cursor:"pointer",fontFamily:"inherit"}}
              onMouseEnter={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.borderColor=RED;b.style.color=RED;}}
              onMouseLeave={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.borderColor="rgba(17,24,39,.12)";b.style.color=MID;}}>
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════
   SIDEBAR
═════════════════════════════════════════════════════ */
const NAV_ITEMS=[
  {id:"Overview",   label:"Overview",   icon:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10"},
  {id:"Accounts",   label:"Accounts",   icon:"M2 20h20M4 20V10M20 20V10M10 20V14h4v6M1 10l11-7 11 7"},
  {id:"History",    label:"History",    icon:"M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"},
  {id:"Transfers",  label:"Transfers",  icon:"M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4"},
  {id:"Pay Bills",  label:"Pay Bills",  icon:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8"},
  {id:"Cards",      label:"Cards",      icon:"M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z"},
  {id:"Statements", label:"Statements", icon:"M21 8v13H3V8M23 3H1v5h22V3zM10 12h4"},
  {id:"Profile",    label:"Profile",    icon:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"},
];

const QUICK_ITEMS=[
  {id:"transfer",    label:"Transfer Money",   icon:"M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4"},
  {id:"paybill",     label:"Pay a Bill",       icon:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8"},
  {id:"deposit",     label:"Deposit Check",    icon:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"},
  {id:"zelle",       label:"Send with Zelle",  icon:"M13 10V3L4 14h7v7l9-11h-7z"},
  {id:"lockcard",    label:"Lock / Freeze Card",icon:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"},
  {id:"openaccount", label:"Open Account",     icon:"M12 5v14M5 12h14"},
];

function Sidebar({active,set,profile,initials,onSignOut,onQuickAction,isAdmin}:{active:string;set:(t:string)=>void;profile:{firstName:string;memberSince:string};initials:string;onSignOut:()=>void;onQuickAction:(id:string)=>void;isAdmin:boolean}){
  return(
    <aside style={{display:"flex",flexDirection:"column",flex:1,height:"100%",overflowY:"auto"}}>
      <div style={{padding:"20px 16px 8px",flex:1,overflowY:"auto"}}>

        {/* ── Navigation ── */}
        <div style={{fontSize:10.5,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:GRAY,marginBottom:8,paddingLeft:8}}>Navigation</div>
        {NAV_ITEMS.map(item=>{
          const on=active===item.id;
          return(
            <button key={item.id} onClick={()=>set(item.id)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"9px 12px",borderRadius:9,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13.5,fontWeight:on?600:400,color:on?RED:MID,background:on?"rgba(140,29,37,.07)":"transparent",textAlign:"left",marginBottom:2,transition:"all .15s",borderLeft:on?`3px solid ${RED}`:"3px solid transparent"}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={on?2.2:1.8} style={{flexShrink:0}}><path d={item.icon}/></svg>
              {item.label}
            </button>
          );
        })}

        {/* ── Quick Actions ── */}
        <div style={{height:1,background:"rgba(17,24,39,.07)",margin:"14px 0 12px"}}/>
        <div style={{fontSize:10.5,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:GRAY,marginBottom:8,paddingLeft:8}}>Quick Actions</div>
        {QUICK_ITEMS.map(item=>(
          <button key={item.id} onClick={()=>onQuickAction(item.id)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"8px 12px",borderRadius:9,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:400,color:MID,background:"transparent",textAlign:"left",marginBottom:1,transition:"all .15s",borderLeft:"3px solid transparent"}}
            onMouseEnter={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.background="rgba(140,29,37,.05)";b.style.color=RED;b.style.borderLeftColor=RED;}}
            onMouseLeave={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.background="transparent";b.style.color=MID;b.style.borderLeftColor="transparent";}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{flexShrink:0}}><path d={item.icon}/></svg>
            {item.label}
          </button>
        ))}

        {/* ── Admin link ── */}
        {isAdmin&&(
          <>
            <div style={{height:1,background:"rgba(17,24,39,.07)",margin:"14px 0 12px"}}/>
            <div style={{fontSize:10.5,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:GRAY,marginBottom:8,paddingLeft:8}}>Admin</div>
            <Link href="/cpanel" style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:9,fontSize:13,fontWeight:600,color:RED,textDecoration:"none",background:"rgba(140,29,37,.06)",border:"1px solid rgba(140,29,37,.15)",marginBottom:2}}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0}}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Control Panel
            </Link>
          </>
        )}
      </div>

      {/* ── Bottom: user + sign out ── */}
      <div style={{borderTop:"1px solid rgba(17,24,39,.07)",padding:"16px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <div style={{width:34,height:34,borderRadius:"50%",background:RED,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONT,fontWeight:700,fontSize:12,color:"#fff",flexShrink:0}}>{initials}</div>
          <div style={{minWidth:0}}>
            <div style={{fontSize:13.5,fontWeight:600,color:DARK,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{profile.firstName}</div>
            {profile.memberSince&&<div style={{fontSize:11.5,color:GRAY}}>Member since {profile.memberSince}</div>}
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

/* ═════════════════════════════════════════════════════
   PAGE
═════════════════════════════════════════════════════ */
export default function DashboardPage(){
  const [tab,setTab]           = useState("Overview");
  const [sidebarOpen,setSidebarOpen] = useState(false);
  const [moreOpen,setMoreOpen] = useState(false);
  const [txFilter,setTxFilter] = useState<"all"|"debits"|"credits">("all");
  const [loading,setLoading]   = useState(true);
  const [modal,setModal]       = useState<ModalKey|null>(null);

  const [profile,setProfile]   = useState({firstName:"",lastName:"",email:"",phone:"",dob:"",lastLogin:"",memberSince:"",role:"",kycStatus:""});
  const [userId,setUserId]     = useState("");
  const [accounts,setAccounts] = useState<Acct[]>([]);
  const [txs,setTxs]           = useState<Tx[]>([]);
  const [spend,setSpend]       = useState<Spend[]>([]);
  const [notifs,setNotifs]     = useState<Notif[]>([]);
  const [txShown,setTxShown]   = useState(10);
  const [bellOpen,setBellOpen] = useState(false);
  const [pendingApps,setPendingApps]=useState<{id:string;accountName:string;referenceId:string;submittedAt:string}[]>([]);
  const [showSessionWarning,setShowSessionWarning] = useState(false);
  const [countdown,setCountdown] = useState(60);

  const inactivityTimer = useRef<ReturnType<typeof setTimeout>|null>(null);
  const warningActive   = useRef(false);

  const loadDashboard=useCallback(async()=>{
    const sb=createClient();
    const {data:{user}}=await sb.auth.getUser();
    if(!user){window.location.href="/login";return;}
    const now=new Date(),mo=now.getMonth()+1,yr=now.getFullYear(),mm=String(mo).padStart(2,"0");
    const [{data:p},{data:a},{data:t},{data:tp},{data:n},{data:aps}]=await Promise.all([
      sb.from("profiles").select("first_name,last_name,email,phone,date_of_birth,member_since,role,kyc_status").eq("id",user.id).single(),
      sb.from("accounts").select("*").eq("user_id",user.id).eq("status","active").order("opened_at"),
      sb.from("transactions").select("*").eq("user_id",user.id).eq("status","posted").order("posted_at",{ascending:false}).limit(100),
      sb.from("transactions").select("*").eq("user_id",user.id).eq("status","pending").order("submitted_at",{ascending:false}),
      sb.from("notifications").select("*").eq("user_id",user.id).order("created_at",{ascending:false}).limit(20),
      sb.from("applications").select("id,account_type,account_name,reference_id,submitted_at,status").eq("user_id",user.id).in("status",["pending","approved"]).order("submitted_at",{ascending:false}),
    ]);
    const ll=user.last_sign_in_at?new Date(user.last_sign_in_at).toLocaleString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit"}):"";
    const pr=p as Record<string,string>|null;
    setProfile({firstName:pr?.first_name||user.email?.split("@")[0]||"User",lastName:pr?.last_name||"",email:pr?.email||user.email||"",phone:pr?.phone||"",dob:pr?.date_of_birth||"",lastLogin:ll,memberSince:pr?.member_since?new Date(pr.member_since).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}):"",role:pr?.role||"",kycStatus:pr?.kyc_status||"pending"});
    setUserId(user.id);
    setAccounts(((a??[]) as Record<string,unknown>[]).map(mapAcct));
    const posted=(t??[]) as Record<string,unknown>[];
    const pendingRows=(tp??[]) as Record<string,unknown>[];
    const rt=[...pendingRows,...posted];
    setTxs(rt.map(mapTx));
    const thisMonthPosted=posted.filter(tx=>{ const d=new Date(String(tx.posted_at)); return d.getFullYear()===yr&&d.getMonth()+1===mo; });
    setSpend(calcSpend(thisMonthPosted));
    setNotifs((n??[]) as Notif[]);
    setPendingApps(((aps??[]) as Record<string,unknown>[]).filter(a=>a.status==="pending").map(a=>({
      id:String(a.id),
      accountName:String(a.account_name||a.account_type||"Account"),
      referenceId:String(a.reference_id||""),
      submittedAt:String(a.submitted_at||""),
    })));
    setLoading(false);
  },[]);

  useEffect(()=>{ loadDashboard(); },[loadDashboard]);

  useEffect(()=>{
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  useEffect(()=>{
    if(!userId) return;
    const sb=createClient();
    const ch=sb
      .channel(`dash_${userId}`)
      .on("postgres_changes",{event:"*",schema:"public",table:"transactions",filter:`user_id=eq.${userId}`},()=>{ loadDashboard(); })
      .on("postgres_changes",{event:"UPDATE",schema:"public",table:"accounts",filter:`user_id=eq.${userId}`},()=>{ loadDashboard(); })
      .on("postgres_changes",{event:"UPDATE",schema:"public",table:"applications",filter:`user_id=eq.${userId}`},()=>{ loadDashboard(); })
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"notifications",filter:`user_id=eq.${userId}`},()=>{ loadDashboard(); })
      .subscribe();
    return ()=>{ sb.removeChannel(ch); };
  },[userId,loadDashboard]);

  const signOut = useCallback(async()=>{
    const sb=createClient();
    await sb.auth.signOut();
    window.location.replace("/login");
  },[]);

  /* ── Back-button lock: keep logged-in users on dashboard ── */
  useEffect(()=>{
    window.history.pushState({dashboardLocked:true},"","/dashboard");
    function handlePop(){ window.history.pushState({dashboardLocked:true},"","/dashboard"); }
    window.addEventListener("popstate",handlePop);
    return ()=>{ window.removeEventListener("popstate",handlePop); };
  },[]);

  /* ── Inactivity timer: show warning after 5 min of no activity ── */
  useEffect(()=>{
    const TIMEOUT=5*60*1000;
    function startTimer(){
      if(inactivityTimer.current) clearTimeout(inactivityTimer.current);
      inactivityTimer.current=setTimeout(()=>{
        warningActive.current=true;
        setShowSessionWarning(true);
        setCountdown(60);
      },TIMEOUT);
    }
    function handleActivity(){ if(!warningActive.current) startTimer(); }
    const events=["mousemove","mousedown","keydown","touchstart","scroll"] as const;
    events.forEach(e=>window.addEventListener(e,handleActivity,{passive:true}));
    startTimer();
    return ()=>{
      if(inactivityTimer.current) clearTimeout(inactivityTimer.current);
      events.forEach(e=>window.removeEventListener(e,handleActivity));
    };
  },[]);

  /* ── Countdown tick: auto-logout when countdown reaches 0 ── */
  useEffect(()=>{
    if(!showSessionWarning) return;
    if(countdown<=0){ signOut(); return; }
    const t=setTimeout(()=>setCountdown(c=>c-1),1000);
    return ()=>clearTimeout(t);
  },[showSessionWarning,countdown,signOut]);

  if(loading)return <PageSkeleton/>;

  const netWorth = accounts.reduce((s,a)=>s+a.balance,0);
  const liquid   = accounts.filter(a=>["Checking","Savings"].includes(a.type)).reduce((s,a)=>s+a.balance,0);
  const ccs      = accounts.filter(a=>a.type==="Credit Card");
  const utilPct  = ccs.length?Math.round((ccs.reduce((s,a)=>s+Math.abs(Math.min(a.balance,0)),0)/ccs.reduce((s,a)=>s+a.creditLimit,0))*100):0;
  const initials = `${profile.firstName[0]??""}${profile.lastName[0]??""}`.toUpperCase()||"U";
  const monthLabel=new Date().toLocaleDateString("en-US",{month:"long",year:"numeric"});
  const shown    = txs.filter(t=>txFilter==="all"||(txFilter==="debits"&&t.amount<0)||(txFilter==="credits"&&t.amount>0));
  const totalSpent=spend.reduce((s,i)=>s+i.amount,0);

  const NCOLOR:Record<string,string>={info:"#2563EB",success:"#16A34A",warning:"#D97706",error:"#DC2626"};
  const NICON:Record<string,string>={
    info:"M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 8v4M12 16h.01",
    success:"M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3",
    warning:"M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
    error:"M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  };

  async function markRead(id:string){
    const sb=createClient();
    await sb.from("notifications").update({read:true}).eq("id",id);
    setNotifs(prev=>prev.filter(n=>n.id!==id));
  }
  async function markAllRead(){
    const sb=createClient();
    await sb.from("notifications").update({read:true}).eq("read",false);
    setNotifs([]);
    setBellOpen(false);
  }

  function setTabAndClose(t:string){setTab(t);setSidebarOpen(false);}

  function continueSession(){
    warningActive.current=false;
    setShowSessionWarning(false);
    setCountdown(60);
    if(inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current=setTimeout(()=>{
      warningActive.current=true;
      setShowSessionWarning(true);
      setCountdown(60);
    },5*60*1000);
  }

  return(
    <div onClick={()=>{setBellOpen(false);setSidebarOpen(false);setMoreOpen(false);}} className="db-shell" style={{minHeight:"100vh",background:BG,fontFamily:"Inter,system-ui,sans-serif"}}>

      {/* ═══ HEADER ═══════════════════════════════════════════ */}
      <header className="db-header" style={{position:"sticky",top:0,zIndex:50,background:"#fff",borderBottom:"1px solid rgba(17,24,39,.09)",boxShadow:"0 1px 4px rgba(17,24,39,.06)"}}>
        <div className="db-header-inner" style={{maxWidth:"100%",padding:"0 24px",height:60,display:"flex",alignItems:"center",gap:16}}>

          <Link href="/" style={{display:"flex",alignItems:"center",textDecoration:"none",flexShrink:0}}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/fscb-horizontal-logo.webp" alt="FSCB" style={{height:32,width:"auto"}} />
          </Link>

          {/* Active tab label — desktop */}
          <div style={{flex:1,display:"flex",alignItems:"center"}}>
            <span style={{fontSize:14,fontWeight:600,color:DARK}} className="db-tab-title">{tab}</span>
          </div>

          <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0,marginLeft:"auto"}}>
            {/* Bell */}
            <div style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
              <button onClick={()=>setBellOpen(o=>!o)} style={{background:bellOpen?"rgba(17,24,39,.05)":"none",border:"none",cursor:"pointer",padding:8,borderRadius:8,color:GRAY,position:"relative",transition:"background .15s"}}
                onMouseEnter={e=>(e.currentTarget.style.background="rgba(17,24,39,.05)")}
                onMouseLeave={e=>{if(!bellOpen)(e.currentTarget as HTMLButtonElement).style.background="transparent";}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {notifs.length>0&&<span style={{position:"absolute",top:5,right:5,width:7,height:7,borderRadius:"50%",background:RED,border:"1.5px solid #fff"}}/>}
              </button>
              {bellOpen&&(
                <div style={{position:"absolute",top:"calc(100% + 6px)",right:0,width:"min(320px, calc(100vw - 16px))",background:"#fff",border:"1px solid rgba(17,24,39,.1)",borderRadius:12,boxShadow:"0 8px 32px rgba(17,24,39,.14)",zIndex:200,overflow:"hidden"}}>
                  <div style={{padding:"13px 16px",borderBottom:"1px solid rgba(17,24,39,.07)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <span style={{fontFamily:FONT,fontWeight:700,fontSize:14,color:DARK}}>Notifications</span>
                    {notifs.length>0&&<button onClick={markAllRead} style={{background:"none",border:"none",fontSize:12,fontWeight:600,color:RED,cursor:"pointer",fontFamily:"inherit",padding:0}}>Mark all read</button>}
                  </div>
                  {notifs.length===0
                    ?<div style={{padding:"28px 16px",textAlign:"center",color:GRAY,fontSize:13}}>You&apos;re all caught up.</div>
                    :notifs.map((n,i)=>{
                      const c=NCOLOR[n.type]??GRAY;
                      return(
                        <div key={n.id} onClick={()=>markRead(n.id)} style={{display:"flex",gap:12,padding:"12px 16px",borderBottom:i<notifs.length-1?"1px solid rgba(17,24,39,.05)":"none",alignItems:"flex-start",cursor:"pointer",transition:"background .12s"}}
                          onMouseEnter={e=>(e.currentTarget.style.background="rgba(17,24,39,.025)")}
                          onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                          <div style={{width:30,height:30,borderRadius:8,background:c+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:c,marginTop:1}}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={NICON[n.type]??NICON.info}/></svg>
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            {n.title&&<div style={{fontSize:12.5,fontWeight:600,color:DARK,marginBottom:2}}>{n.title}</div>}
                            <div style={{fontSize:12.5,color:MID,lineHeight:1.45}}>{n.message}</div>
                            <div style={{fontSize:11,color:GRAY,marginTop:3}}>{relTime(n.created_at)}</div>
                          </div>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="2" style={{flexShrink:0,marginTop:3}}><path d="M18 6 6 18M6 6l12 12"/></svg>
                        </div>
                      );
                    })
                  }
                </div>
              )}
            </div>

            {/* User pill */}
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"5px 10px 5px 5px",borderRadius:8,border:"1px solid rgba(17,24,39,.1)",background:"#FAFAFA",cursor:"default"}}>
              <div style={{width:27,height:27,borderRadius:"50%",background:RED,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONT,fontWeight:700,fontSize:11,color:"#fff",flexShrink:0}}>{initials}</div>
              <span className="db-user-name" style={{fontSize:13,fontWeight:500,color:DARK}}>{profile.firstName}</span>
            </div>

            {/* Sign out — desktop only */}
            <button onClick={signOut} className="db-sign-out" style={{background:"none",border:"1px solid rgba(17,24,39,.1)",borderRadius:8,padding:"6px 12px",fontSize:13,color:GRAY,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5,transition:"all .15s"}}
              onMouseEnter={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.color=RED;b.style.borderColor="rgba(140,29,37,.3)";}}
              onMouseLeave={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.color=GRAY;b.style.borderColor="rgba(17,24,39,.1)";}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
              Sign out
            </button>

            {/* Hamburger — mobile */}
            <button className="db-nav-mobile-btn" onClick={(e)=>{e.stopPropagation();setSidebarOpen(o=>!o);}} aria-label="Menu">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={sidebarOpen?"M18 6 6 18M6 6l12 12":"M3 6h18M3 12h18M3 18h18"}/></svg>
            </button>
          </div>
        </div>
      </header>

      {/* ═══ LAYOUT ═══════════════════════════════════════════ */}
      <div className="db-body"><div className="db-layout">

        {/* Mobile overlay */}
        <div onClick={()=>setSidebarOpen(false)} className={`db-overlay${sidebarOpen?" db-overlay--open":""}`}/>

        {/* Sidebar */}
        <div onClick={e=>e.stopPropagation()} className={`db-sidebar${sidebarOpen?" db-sidebar--open":""}`}>
          <Sidebar
            active={tab}
            set={setTabAndClose}
            profile={profile}
            initials={initials}
            onSignOut={signOut}
            isAdmin={profile.role==="admin"}
            onQuickAction={(id)=>{
              setSidebarOpen(false);
              if(id==="transfer"||id==="paybill"||id==="deposit"||id==="zelle") setModal(id as ModalKey);
              else if(id==="lockcard")    setTab("Cards");
              else if(id==="openaccount") window.location.href="/open-account";
            }}
          />
        </div>

        {/* Main content */}
        <main className="db-content">

          {/* ── Overview ── */}
          {tab==="Overview"&&(
            <div>
              {/* KYC banner */}
              {profile.kycStatus!=="verified"&&(
                <div style={{background:"rgba(217,119,6,.07)",border:"1px solid rgba(217,119,6,.22)",borderRadius:10,padding:"12px 16px",marginBottom:20,display:"flex",alignItems:"flex-start",gap:10}}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" style={{flexShrink:0,marginTop:1}}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/></svg>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:"#92400E"}}>Identity Verification {profile.kycStatus==="rejected"?"Rejected":"Pending"}</div>
                    <div style={{fontSize:12.5,color:"#78350F",marginTop:2,lineHeight:1.5}}>{profile.kycStatus==="rejected"?"Your KYC was rejected. Please contact support to resubmit documents.":"Your account is pending identity verification. Some features may be limited until confirmed by the bank."}</div>
                  </div>
                </div>
              )}
              {/* Greeting row */}
              <div className="db-hero-row" style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:20}}>
                <div>
                  <h1 style={{fontFamily:FONT,fontWeight:800,fontSize:22,color:RED,margin:"0 0 4px",letterSpacing:"-.015em"}}>{greet()}, {profile.firstName}.</h1>
                  <p style={{margin:0,fontSize:12.5,color:GRAY}}>{profile.lastLogin&&<>{profile.lastLogin} · </>}<span style={{color:"#16A34A",fontWeight:500}}>All accounts secure</span></p>
                </div>
                <div className="db-net-pill" style={{background:"#fff",border:"1px solid rgba(17,24,39,.08)",borderRadius:10,padding:"10px 18px",boxShadow:"0 1px 3px rgba(17,24,39,.05)"}}>
                  <div style={{textAlign:"right"}}><div style={{fontSize:11,color:GOLD,letterSpacing:".06em",textTransform:"uppercase",marginBottom:2}}>Net Worth</div><div style={{fontFamily:FONT,fontWeight:800,fontSize:20,color:RED,letterSpacing:"-.015em"}}>{usd(netWorth)}</div></div>
                  <div className="db-net-sep" style={{width:1,...DIVIDER,height:32,margin:"0 4px"}}/>
                  <div><div style={{fontSize:11,color:GOLD,letterSpacing:".06em",textTransform:"uppercase",marginBottom:2}}>Liquid</div><div style={{fontFamily:FONT,fontWeight:700,fontSize:14,color:"#16A34A"}}>{usd(liquid)}</div></div>
                  <div className="db-net-sep" style={{width:1,...DIVIDER,height:32,margin:"0 4px"}}/>
                  <div><div style={{fontSize:11,color:GOLD,letterSpacing:".06em",textTransform:"uppercase",marginBottom:2}}>Credit</div><div style={{fontFamily:FONT,fontWeight:700,fontSize:14,color:utilPct>75?"#DC2626":DARK}}>{utilPct}% used</div></div>
                </div>
              </div>

              {/* Account cards / empty state */}
              {accounts.length===0?(
                <div style={{...CARD,padding:"48px 32px",marginBottom:20,textAlign:"center"}}>
                  {pendingApps.length>0?(
                    <>
                      <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(217,119,6,.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px"}}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                      </div>
                      <div style={{fontFamily:FONT,fontWeight:700,fontSize:18,color:DARK,marginBottom:8}}>Application Under Review</div>
                      <div style={{fontSize:13.5,color:GRAY,lineHeight:1.6,marginBottom:24,maxWidth:420,margin:"0 auto 24px"}}>
                        Your application for a <strong style={{color:DARK}}>{pendingApps[0].accountName}</strong> is being reviewed by our team. We typically process applications within 1–2 business days.
                      </div>
                      <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(217,119,6,.07)",border:"1px solid rgba(217,119,6,.2)",borderRadius:8,padding:"8px 16px",fontSize:12.5,color:"#92400E",fontWeight:600}}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                        Ref: {pendingApps[0].referenceId}
                      </div>
                      {pendingApps.length>1&&<div style={{fontSize:12,color:GRAY,marginTop:12}}>+{pendingApps.length-1} more application{pendingApps.length-1!==1?"s":""} pending</div>}
                    </>
                  ):(
                    <>
                      <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(140,29,37,.08)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px"}}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="1.8"><path d="M4 19V8.5L12 4l8 4.5V19"/><path d="M9 19v-5h6v5"/></svg>
                      </div>
                      <div style={{fontFamily:FONT,fontWeight:700,fontSize:18,color:DARK,marginBottom:8}}>Welcome to FSCB, {profile.firstName}!</div>
                      <div style={{fontSize:13.5,color:GRAY,lineHeight:1.6,marginBottom:28,maxWidth:400,margin:"0 auto 28px"}}>You don&apos;t have any accounts yet. Open your first account to get started with banking, savings, and more.</div>
                      <Link href="/open-account" style={{display:"inline-flex",alignItems:"center",gap:8,background:RED,color:"#fff",borderRadius:10,padding:"12px 28px",fontSize:14,fontWeight:700,fontFamily:FONT,textDecoration:"none",boxShadow:"0 4px 14px -2px rgba(140,29,37,.4)"}}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                        Open an Account
                      </Link>
                    </>
                  )}
                </div>
              ):(
                <div className="db-cards" style={{marginBottom:20}}>
                  {accounts.map(a=><AccountCard key={a.id} a={a}/>)}
                </div>
              )}

              {/* Main 2-col */}
              <div className="db-main">
                {/* Transactions */}
                <div style={{...CARD,overflow:"hidden"}}>
                  <div style={{padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(17,24,39,.07)"}}>
                    <div><div style={{fontFamily:FONT,fontWeight:700,fontSize:15,color:RED}}>Recent Activity</div><div style={{fontSize:12,color:GRAY,marginTop:2}}>{monthLabel}</div></div>
                    <button onClick={()=>setTab("History")} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,fontWeight:600,color:RED,fontFamily:"inherit",padding:0}}>View all</button>
                  </div>
                  <div style={{padding:"10px 20px",display:"flex",gap:4,borderBottom:"1px solid rgba(17,24,39,.07)"}}>
                    {(["all","debits","credits"] as const).map(f=>(
                      <button key={f} onClick={()=>{setTxFilter(f);setTxShown(10);}} style={{background:txFilter===f?"rgba(140,29,37,.08)":"transparent",color:txFilter===f?RED:GRAY,border:"none",borderRadius:6,padding:"5px 14px",fontSize:12.5,fontWeight:txFilter===f?600:400,cursor:"pointer",fontFamily:"inherit",transition:"all .15s",textTransform:"capitalize"}}>
                        {f==="all"?"All transactions":f==="debits"?"Debits":"Credits"}
                      </button>
                    ))}
                  </div>
                  {shown.length===0
                    ?<div style={{padding:"40px 20px",textAlign:"center",color:GRAY,fontSize:13.5}}>No transactions match this filter.</div>
                    :shown.slice(0,txShown).map(tx=><TxRow key={tx.id} tx={tx}/>)
                  }
                  {shown.length>txShown&&<div style={{padding:"14px 20px",borderTop:"1px solid rgba(17,24,39,.06)",textAlign:"center"}}>
                    <button onClick={()=>setTxShown(n=>n+10)} style={{background:"none",border:"1px solid rgba(17,24,39,.12)",borderRadius:8,padding:"8px 22px",fontSize:13,color:MID,cursor:"pointer",fontFamily:"inherit"}}
                      onMouseEnter={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.borderColor=RED;b.style.color=RED;}}
                      onMouseLeave={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.borderColor="rgba(17,24,39,.12)";b.style.color=MID;}}>
                      Load more transactions
                    </button>
                  </div>}
                </div>

                {/* Right sidebar */}
                <div style={{display:"flex",flexDirection:"column",gap:16}}>
                  {/* Spending */}
                  <div style={{...CARD,overflow:"hidden"}}>
                    <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(17,24,39,.07)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div><div style={{fontFamily:FONT,fontWeight:700,fontSize:15,color:RED}}>Monthly Spending</div><div style={{fontSize:12,color:GRAY,marginTop:2}}>{monthLabel}</div></div>
                    </div>
                    <div style={{padding:"4px 20px 0"}}>
                      {spend.length===0
                        ?<div style={{padding:"28px 0",textAlign:"center",color:GRAY,fontSize:13}}>No spending this month yet.</div>
                        :spend.map(s=><SpendRow key={s.category} s={s}/>)
                      }
                    </div>
                    {spend.length>0&&<div style={{margin:"4px 20px 16px",paddingTop:12,borderTop:"1px solid rgba(17,24,39,.07)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:12.5,color:GRAY}}>Total spent</span>
                      <span style={{fontFamily:FONT,fontWeight:700,fontSize:14,color:DARK}}>{usd(totalSpent)}</span>
                    </div>}
                  </div>

                  {/* Alerts */}
                  <div style={{...CARD,overflow:"hidden"}}>
                    <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(17,24,39,.07)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div style={{fontFamily:FONT,fontWeight:700,fontSize:15,color:RED}}>Alerts</div>
                      {notifs.length>0&&<span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:99,background:"rgba(140,29,37,.1)",color:RED}}>{notifs.length}</span>}
                    </div>
                    {notifs.length===0
                      ?<div style={{padding:"24px 20px",textAlign:"center",color:GRAY,fontSize:13}}>No alerts.</div>
                      :notifs.map((n,i)=>{
                        const c=NCOLOR[n.type]??GRAY;
                        return(
                          <div key={n.id} style={{display:"flex",gap:12,padding:"13px 20px",borderBottom:i<notifs.length-1?"1px solid rgba(17,24,39,.05)":"none",alignItems:"flex-start"}}>
                            <div style={{width:30,height:30,borderRadius:8,background:c+"12",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:c,marginTop:1}}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={NICON[n.type]??NICON.info}/></svg>
                            </div>
                            <div><div style={{fontSize:13,color:DARK,lineHeight:1.45}}>{n.message}</div><div style={{fontSize:11.5,color:GRAY,marginTop:3}}>{relTime(n.created_at)}</div></div>
                          </div>
                        );
                      })
                    }
                  </div>

                  {/* Help */}
                  <div style={{...CARD,padding:"18px 20px"}}>
                    <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:12}}>
                      <div style={{width:36,height:36,borderRadius:9,background:"rgba(140,29,37,.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:RED}}>
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.27 6.27l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      </div>
                      <div><div style={{fontFamily:FONT,fontWeight:700,fontSize:14,color:DARK,marginBottom:3}}>Need help?</div><div style={{fontSize:12.5,color:GRAY,lineHeight:1.5}}>Mon–Fri 9am–5pm · Sat 9am–12pm</div></div>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <Link href="/about/contact" style={{flex:1,textAlign:"center",background:RED,color:"#fff",borderRadius:8,padding:"9px 0",fontSize:13,fontWeight:600,textDecoration:"none"}}>Contact Us</Link>
                      <a href="tel:18005552722" style={{flex:1,textAlign:"center",background:"rgba(17,24,39,.05)",color:MID,border:"1px solid rgba(17,24,39,.1)",borderRadius:8,padding:"9px 0",fontSize:13,fontWeight:600,textDecoration:"none"}}>Call Us</a>
                    </div>
                  </div>
                </div>
              </div>{/* /db-main */}
            </div>
          )}

          {/* ── History ── */}
          {tab==="History"&&<HistoryTab txs={txs}/>}

          {/* ── Accounts ── */}
          {tab==="Accounts"&&<AccountsTab accounts={accounts} onSetModal={setModal}/>}

          {/* ── Transfers ── */}
          {tab==="Transfers"&&<TransfersTab accounts={accounts} txs={txs} userId={userId}/>}

          {/* ── Pay Bills ── */}
          {tab==="Pay Bills"&&<PayBillsTab accounts={accounts} txs={txs} userId={userId}/>}

          {/* ── Cards ── */}
          {tab==="Cards"&&<CardsTab accounts={accounts}/>}

          {/* ── Statements ── */}
          {tab==="Statements"&&<StatementsTab onClose={()=>setTab("Overview")} accounts={accounts}/>}

          {/* ── Profile ── */}
          {tab==="Profile"&&<ProfileTab profile={profile} accounts={accounts} initials={initials}/>}

        </main>
      </div>{/* /db-layout */}</div>{/* /db-body */}

      <BottomNav active={tab} set={setTabAndClose} onMore={()=>setMoreOpen(true)}/>
      <MoreSheet open={moreOpen} onClose={()=>setMoreOpen(false)} onSelect={t=>{setTab(t);setMoreOpen(false);setSidebarOpen(false);}} onSignOut={signOut}/>

      {/* ═══ MODALS ═══════════════════════════════════════════ */}
      {modal==="transfer" && <TransferModal     onClose={()=>setModal(null)} accounts={accounts} userId={userId}/>}
      {modal==="paybill"  && <PayBillModal      onClose={()=>setModal(null)} accounts={accounts} userId={userId}/>}
      {modal==="deposit"  && <DepositCheckModal onClose={()=>setModal(null)} accounts={accounts} userId={userId}/>}
      {modal==="zelle"    && <ZelleModal        onClose={()=>setModal(null)} accounts={accounts} userId={userId}/>}

      {/* ═══ SESSION TIMEOUT WARNING ══════════════════════════ */}
      {showSessionWarning&&(
        <div style={{position:"fixed",inset:0,zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}}
          onClick={e=>e.stopPropagation()}>
          {/* Backdrop */}
          <div style={{position:"absolute",inset:0,background:"rgba(17,24,39,.55)",backdropFilter:"blur(3px)"}}/>
          {/* Card */}
          <div style={{position:"relative",width:"100%",maxWidth:400,background:"#fff",borderRadius:16,boxShadow:"0 20px 60px rgba(17,24,39,.22)",padding:"32px 28px 28px",textAlign:"center"}}>
            {/* Warning icon */}
            <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(217,119,6,.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div style={{fontFamily:FONT,fontWeight:800,fontSize:18,color:DARK,marginBottom:8}}>Session Expiring Soon</div>
            <div style={{fontSize:14,color:GRAY,lineHeight:1.6,marginBottom:24}}>
              You&apos;ve been inactive for a while. For your security, your session will automatically end in
            </div>
            {/* Countdown circle */}
            <div style={{width:72,height:72,borderRadius:"50%",border:`4px solid ${countdown>10?"#D97706":"#DC2626"}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",transition:"border-color .3s"}}>
              <span style={{fontFamily:FONT,fontWeight:800,fontSize:24,color:countdown>10?"#D97706":"#DC2626",transition:"color .3s"}}>{countdown}</span>
            </div>
            <div style={{fontSize:12,color:GRAY,marginBottom:28}}>seconds</div>
            {/* Buttons */}
            <div style={{display:"flex",gap:10,flexDirection:"column"}}>
              <button onClick={continueSession}
                style={{width:"100%",padding:"12px",background:RED,border:"none",borderRadius:10,fontFamily:FONT,fontWeight:700,fontSize:14,color:"#fff",cursor:"pointer",transition:"opacity .15s"}}
                onMouseEnter={e=>(e.currentTarget.style.opacity=".88")}
                onMouseLeave={e=>(e.currentTarget.style.opacity="1")}>
                Continue Session
              </button>
              <button onClick={()=>signOut()}
                style={{width:"100%",padding:"12px",background:"none",border:"1px solid rgba(17,24,39,.15)",borderRadius:10,fontFamily:FONT,fontWeight:600,fontSize:14,color:GRAY,cursor:"pointer",transition:"all .15s"}}
                onMouseEnter={e=>{e.currentTarget.style.color=RED;e.currentTarget.style.borderColor="rgba(140,29,37,.3)";}}
                onMouseLeave={e=>{e.currentTarget.style.color=GRAY;e.currentTarget.style.borderColor="rgba(17,24,39,.15)";}}>
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
