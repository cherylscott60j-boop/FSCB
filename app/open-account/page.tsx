"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import TopBar from "@/components/TopBar";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const FONT = "var(--font-poppins), sans-serif";
const BLUE = "#0800FF";
const DARK = "#111827";
const MID  = "#374151";
const GRAY = "#6B7280";
const BG   = "#F4F5FB";

/* ─── US States ──────────────────────────────────────────────────────────── */
const STATES = "Alabama,Alaska,Arizona,Arkansas,California,Colorado,Connecticut,Delaware,Florida,Georgia,Hawaii,Idaho,Illinois,Indiana,Iowa,Kansas,Kentucky,Louisiana,Maine,Maryland,Massachusetts,Michigan,Minnesota,Mississippi,Missouri,Montana,Nebraska,Nevada,New Hampshire,New Jersey,New Mexico,New York,North Carolina,North Dakota,Ohio,Oklahoma,Oregon,Pennsylvania,Rhode Island,South Carolina,South Dakota,Tennessee,Texas,Utah,Vermont,Virginia,Washington,West Virginia,Wisconsin,Wyoming".split(",");

/* ─── Account definitions ─────────────────────────────────────────────────── */
type AccountType = "deposit" | "credit";
interface Account {
  id: string; name: string; tag: string | null; fee: string;
  min: string; bestFor: string; highlights: string[];
  type: AccountType; minDeposit?: number;
}

const PERSONAL_ACCOUNTS: Account[] = [
  { id:"free-checking",   name:"Free Checking",        tag:null,          fee:"$0 / month",   min:"No minimum",       bestFor:"Everyday spending & bill pay",             highlights:["No monthly fee — ever","55,000+ surcharge-free ATMs","Early direct deposit (2 days early)"], type:"deposit", minDeposit:0 },
  { id:"premium-checking",name:"Premium Checking",     tag:"Most Popular", fee:"$0 / month*",  min:"$500 avg. balance", bestFor:"Direct deposit users who want perks",      highlights:["ATM fee rebates nationwide","Higher debit purchase limits","Free first order of checks","Priority customer service"], type:"deposit", minDeposit:25 },
  { id:"regular-savings", name:"Regular Savings",      tag:null,          fee:"$0 / month",   min:"No minimum",       bestFor:"Emergency fund or savings goals",           highlights:["Competitive APY, compounded daily","Automatic round-up deposits","Goal tracking in app"], type:"deposit", minDeposit:0 },
  { id:"money-market",    name:"Money Market",         tag:"Best Rate",   fee:"$0 / month*",  min:"$2,500 minimum",   bestFor:"Larger balances earning maximum yield",     highlights:["Highest tiered APY","Unlimited transfers","Check-writing privileges","Same-day link to checking"], type:"deposit", minDeposit:2500 },
  { id:"community-card",  name:"Community Credit Card",tag:null,          fee:"$0 annual fee",min:"Good credit 620+",  bestFor:"Simple everyday rewards, no complexity",    highlights:["1% cashback on all purchases","0% intro APR for 12 months","No foreign transaction fees","Free credit score monitoring"], type:"credit" },
  { id:"rewards-card",    name:"Rewards Credit Card",  tag:"Best Value",  fee:"$0 annual fee",min:"Good–Excellent 680+",bestFor:"Max rewards on groceries, gas & dining",  highlights:["3% cashback on groceries & gas","2% cashback on dining","1% on all other purchases","Rewards never expire"], type:"credit" },
];
const BUSINESS_ACCOUNTS: Account[] = [
  { id:"biz-basic-checking",   name:"Business Basic Checking",   tag:null,          fee:"$0 / month",  min:"$0 to open",       bestFor:"New businesses & sole proprietors",        highlights:["200 transactions/month","Free business online & mobile banking","Business debit card included","Dedicated local business banker"], type:"deposit", minDeposit:0 },
  { id:"biz-premium-checking", name:"Business Premium Checking", tag:"Most Popular", fee:"$0 / month*", min:"$500 avg. balance", bestFor:"Growing businesses with high volume",       highlights:["Unlimited transactions","Same-day ACH payments","Multi-user roles & permissions","ACH and wire fee discounts"], type:"deposit", minDeposit:100 },
  { id:"biz-savings",          name:"Business Savings",          tag:null,          fee:"$0 / month",  min:"$100 to open",     bestFor:"Tax reserves & operating cash buffer",      highlights:["Competitive business APY","Instant transfers to business checking","6 withdrawals/month"], type:"deposit", minDeposit:100 },
  { id:"biz-money-market",     name:"Business Money Market",     tag:"Best Rate",   fee:"$0 / month*", min:"$2,500 minimum",   bestFor:"Larger cash reserves earning higher yield", highlights:["Highest tiered business APY","Unlimited transfers","Treasury sweep available","Same-day link to business checking"], type:"deposit", minDeposit:2500 },
  { id:"biz-credit-card",      name:"Business Rewards Card",     tag:"New",         fee:"$0 annual fee",min:"Good–Excellent 680+",bestFor:"Business spending with cash back rewards", highlights:["2% back on office supplies, gas & dining","1% back on all other purchases","0% intro APR for 12 months","Up to $50,000 credit limit · free employee cards"], type:"credit" },
];

/* ─── Form state ──────────────────────────────────────────────────────────── */
interface FormData {
  firstName:string; lastName:string; dob:string; ssn:string;
  email:string; phone:string; usCitizen:string;
  password:string; confirmPassword:string;
  businessName:string; businessType:string; ein:string;
  established:string; businessPhone:string; industry:string;
  street:string; city:string; state:string; zip:string;
  sameMailing:string; mailingStreet:string; mailingCity:string;
  mailingState:string; mailingZip:string; timeAtAddress:string;
  existingAccount:string; fundingMethod:string;
  routingNumber:string; bankAccountNumber:string;
  discFDIC:boolean; discPrivacy:boolean; discTerms:boolean;
  discEStatements:boolean; discCertify:boolean;
}
const EMPTY: FormData = {
  firstName:"",lastName:"",dob:"",ssn:"",email:"",phone:"",usCitizen:"",
  password:"",confirmPassword:"",
  businessName:"",businessType:"",ein:"",established:"",businessPhone:"",industry:"",
  street:"",city:"",state:"",zip:"",sameMailing:"yes",
  mailingStreet:"",mailingCity:"",mailingState:"",mailingZip:"",timeAtAddress:"",
  existingAccount:"",fundingMethod:"",routingNumber:"",bankAccountNumber:"",
  discFDIC:false,discPrivacy:false,discTerms:false,discEStatements:false,discCertify:false,
};

/* ─── Field primitives ────────────────────────────────────────────────────── */
const iStyle: React.CSSProperties = {
  width:"100%",padding:"12px 16px",fontSize:14.5,borderRadius:4,
  border:"1.5px solid rgba(17,24,39,.14)",outline:"none",
  boxSizing:"border-box",background:"#fff",color:DARK,fontFamily:"inherit",
  transition:"border-color .15s",
};

function Field({ label, children, hint }:{ label:string; children:React.ReactNode; hint?:string }) {
  return (
    <div>
      <label style={{display:"block",fontSize:12.5,fontWeight:700,color:MID,marginBottom:6,letterSpacing:".02em",textTransform:"uppercase"}}>{label}</label>
      {children}
      {hint&&<p style={{fontSize:12,color:GRAY,marginTop:5,lineHeight:1.5}}>{hint}</p>}
    </div>
  );
}
function TextInput({ value,onChange,placeholder,type="text",autoComplete }:{ value:string;onChange:(v:string)=>void;placeholder?:string;type?:string;autoComplete?:string }) {
  return <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} autoComplete={autoComplete} style={iStyle}/>;
}
function Select({ value,onChange,children }:{ value:string;onChange:(v:string)=>void;children:React.ReactNode }) {
  return (
    <select value={value} onChange={e=>onChange(e.target.value)} style={{...iStyle,appearance:"none",backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",backgroundRepeat:"no-repeat",backgroundPosition:"right 14px center",paddingRight:40,cursor:"pointer"}}>
      {children}
    </select>
  );
}
function RadioGroup({ name,value,onChange,options }:{ name:string;value:string;onChange:(v:string)=>void;options:{value:string;label:string}[] }) {
  return (
    <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
      {options.map(opt=>(
        <label key={opt.value} style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer",padding:"11px 18px",border:`1.5px solid ${value===opt.value?BLUE:"rgba(17,24,39,.12)"}`,borderRadius:4,background:value===opt.value?"rgba(8,0,255,.04)":"#fff",flex:"1 1 120px",transition:"all .15s"}}>
          <input type="radio" name={name} value={opt.value} checked={value===opt.value} onChange={()=>onChange(opt.value)} style={{accentColor:BLUE,width:16,height:16}}/>
          <span style={{fontSize:14,fontWeight:600,color:DARK}}>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}
function DiscCheck({ checked,onChange,children }:{ checked:boolean;onChange:(v:boolean)=>void;children:React.ReactNode }) {
  return (
    <label style={{display:"flex",gap:13,cursor:"pointer",alignItems:"flex-start",padding:"14px 16px",borderRadius:4,border:`1.5px solid ${checked?"rgba(8,0,255,.25)":"rgba(17,24,39,.08)"}`,background:checked?"rgba(8,0,255,.03)":"#fff",transition:"all .15s"}}>
      <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} style={{accentColor:BLUE,width:17,height:17,marginTop:1,flexShrink:0,cursor:"pointer"}}/>
      <span style={{fontSize:13.5,color:DARK,lineHeight:1.6}}>{children}</span>
    </label>
  );
}

/* ─── Deep-link ───────────────────────────────────────────────────────────── */
function DeepLinkHandler({ onDeepLink }:{ onDeepLink:(cat:"personal"|"business",acc:Account)=>void }) {
  const params = useSearchParams();
  useEffect(()=>{
    const id=params.get("account"); if(!id) return;
    const p=PERSONAL_ACCOUNTS.find(a=>a.id===id);
    if(p){onDeepLink("personal",p);return;}
    const b=BUSINESS_ACCOUNTS.find(a=>a.id===id);
    if(b) onDeepLink("business",b);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  return null;
}

/* ─── Step tracker ────────────────────────────────────────────────────────── */
const STEPS = ["Account Type","Choose Account","Your Info","Address","Review & Submit"];

function StepTracker({ current }:{ current:number }) {
  return (
    <div className="step-tracker-wrap" style={{background:"#fff",border:"1px solid rgba(17,24,39,.1)",borderRadius:8,overflowX:"auto"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:0,padding:"28px 32px 24px",minWidth:"fit-content",margin:"0 auto"}}>
      {STEPS.map((label,i)=>{
        const n=i+1;
        const done=n<current;
        const active=n===current;
        return(
          <div key={label} style={{display:"flex",alignItems:"center"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
              <div style={{width:34,height:34,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONT,fontWeight:800,fontSize:13,transition:"all .25s",background:done?BLUE:active?"rgba(8,0,255,.1)":"rgba(17,24,39,.06)",color:done?"#fff":active?BLUE:GRAY,border:active?`2px solid ${BLUE}`:"2px solid transparent"}}>
                {done?(
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M5 12l5 5L20 7"/></svg>
                ):n}
              </div>
              <span className="step-label" style={{fontSize:11,fontWeight:active?700:500,color:active?BLUE:done?MID:GRAY,whiteSpace:"nowrap",letterSpacing:".01em"}}>{label}</span>
            </div>
            {i<STEPS.length-1&&<div className="step-connector" style={{width:60,height:2,background:done?"rgba(8,0,255,.35)":"rgba(17,24,39,.08)",margin:"0 6px 20px",flexShrink:0,transition:"background .25s"}}/>}
          </div>
        );
      })}
    </div>
    </div>
  );
}

/* ─── Section card ────────────────────────────────────────────────────────── */
function Section({ title,children }:{ title:string;children:React.ReactNode }) {
  return (
    <div style={{background:"#fff",border:"1px solid rgba(17,24,39,.08)",borderRadius:8,padding:"32px 32px 28px",marginBottom:20}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:26,paddingBottom:18,borderBottom:"1px solid rgba(17,24,39,.07)"}}>
        <div style={{fontFamily:FONT,fontWeight:600,fontSize:16,color:DARK}}>{title}</div>
      </div>
      {children}
    </div>
  );
}

/* ─── Nav buttons ─────────────────────────────────────────────────────────── */
function BackBtn({ onClick }:{ onClick:()=>void }) {
  return (
    <button onClick={onClick} style={{background:"none",border:"1.5px solid rgba(17,24,39,.14)",color:MID,fontFamily:FONT,fontSize:14,fontWeight:600,padding:"12px 26px",borderRadius:4,cursor:"pointer",display:"flex",alignItems:"center",gap:7,transition:"all .15s"}}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
      Back
    </button>
  );
}
function NextBtn({ onClick,disabled=false,label="Continue",loading=false }:{ onClick:()=>void;disabled?:boolean;label?:string;loading?:boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{background:loading?BLUE:disabled?"rgba(17,24,39,.1)":BLUE,color:loading?"#fff":disabled?GRAY:"#fff",border:"none",fontFamily:FONT,fontSize:15,fontWeight:700,padding:"13px 34px",borderRadius:4,cursor:loading?"wait":disabled?"not-allowed":"pointer",display:"inline-flex",alignItems:"center",gap:9,transition:"all .2s"}}>
      {loading&&<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{animation:"spin .75s linear infinite"}}><path d="M21 12a9 9 0 1 1-6.22-8.56"/></svg>}
      {loading?"Submitting…":label}
      {!loading&&!disabled&&<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>}
    </button>
  );
}

/* ─── Main ────────────────────────────────────────────────────────────────── */
export default function OpenAccountPage() {
  const [step,setStep]               = useState(1);
  const [category,setCategory]       = useState<"personal"|"business"|null>(null);
  const [selectedAccount,setSelected]= useState<Account|null>(null);
  const [form,setForm]               = useState<FormData>(EMPTY);
  const [submitting,setSubmitting]   = useState(false);
  const [submitError,setSubmitError] = useState("");
  const [loggedInUserId,setLoggedInUserId] = useState<string|null|undefined>(undefined);

  useEffect(()=>{
    const sb = createClient();
    sb.auth.getUser().then(async ({data:{user}})=>{
      if(!user){ setLoggedInUserId(null); return; }

      setLoggedInUserId(user.id);
      // Pre-fill from existing profile
      const {data:profile} = await sb.from("profiles").select("first_name,last_name,phone,date_of_birth,email").eq("id", user.id).single();
      const p = profile as Record<string,string>|null;
      setForm(prev=>({
        ...prev,
        email:      p?.email      || user.email || prev.email,
        firstName:  p?.first_name || prev.firstName,
        lastName:   p?.last_name  || prev.lastName,
        phone:      p?.phone      || prev.phone,
        dob:        p?.date_of_birth || prev.dob,
      }));
    });
  },[]);

  const isGuest = loggedInUserId === null;

  const update=(field:keyof FormData,value:string|boolean)=>setForm(p=>({...p,[field]:value}));
  const handleDeepLink=(cat:"personal"|"business",acc:Account)=>{setCategory(cat);setSelected(acc);setStep(3);};
  const accounts=category==="personal"?PERSONAL_ACCOUNTS:BUSINESS_ACCOUNTS;
  const isBusiness=category==="business";
  const isCredit=selectedAccount?.type==="credit";
  const allDiscs=form.discFDIC&&form.discPrivacy&&form.discTerms&&form.discEStatements&&form.discCertify;

  async function handleSubmit(){
    if(!allDiscs||submitting) return;
    if(isGuest){
      if(!form.password){setSubmitError("Please create a password.");return;}
      if(form.password!==form.confirmPassword){setSubmitError("Passwords do not match.");return;}
      if(form.password.length<8){setSubmitError("Password must be at least 8 characters.");return;}
    }
    setSubmitting(true);
    setSubmitError("");
    try{
      const endpoint = isGuest ? "/api/register" : "/api/applications";
      const res=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({account:selectedAccount?.id,accountName:selectedAccount?.name,businessName:form.businessName,category,firstName:form.firstName,lastName:form.lastName,email:form.email,phone:form.phone,dob:form.dob,street:form.street,city:form.city,state:form.state,zip:form.zip,password:form.password})});
      let data:{success:boolean;error?:string}={success:false,error:"Unexpected server error."};
      try{ data=await res.json(); }catch{ /* non-JSON response */ }
      if(data.success){
        setStep(6);
      } else {
        setSubmitError(data.error||"Something went wrong. Please try again.");
      }
    }catch{
      setSubmitError("Could not reach the server. Please check your connection.");
    }finally{
      setSubmitting(false);
    }
  }

  if(loggedInUserId === undefined) return null;

  return(
    <div style={{minHeight:"100vh",background:BG}}>
      <Suspense fallback={null}><DeepLinkHandler onDeepLink={handleDeepLink}/></Suspense>

      {/* ── Site Nav ─────────────────────────────────────────── */}
      <TopBar/>
      <Nav/>

      {/* ── Header ───────────────────────────────────────────── */}
      <section className="mob-hero" style={{background:BLUE,clipPath:"polygon(0 0, 100% 0, 100% calc(100% - 40px), 0 100%)",padding:"56px 32px 120px",fontFamily:FONT}}>
        <div style={{maxWidth:1180,margin:"0 auto"}}>
          <div style={{fontSize:12.5,letterSpacing:".14em",textTransform:"uppercase",fontWeight:700,color:"rgba(255,255,255,.75)",marginBottom:12}}>{step<6?`Step ${step} of ${STEPS.length}`:"Application submitted"}</div>
          <h1 style={{fontWeight:600,fontSize:"clamp(28px, 4vw, 42px)",lineHeight:1.2,letterSpacing:"-.02em",color:"#fff",margin:"0 0 12px"}}>Open an account</h1>
          <p style={{fontSize:17,lineHeight:1.65,color:"rgba(255,255,255,.82)",margin:0,maxWidth:560}}>Apply online in about 5 minutes. Your progress is saved as you go through each step.</p>
        </div>
      </section>

      {step<6&&(
        <div className="mob-px" style={{maxWidth:1180,margin:"-72px auto 0",position:"relative",boxSizing:"border-box"}}>
          <StepTracker current={step}/>
        </div>
      )}

      {/* ── Content ──────────────────────────────────────────── */}
      <div style={{maxWidth:1180,margin:"0 auto",padding:step<6?"0":"40px 24px 60px"}}>
      {step<6?(
        <div className="oa-split" style={{display:"grid",gridTemplateColumns:"1fr 420px",alignItems:"start"}}>
          <div style={{padding:"40px 24px 60px"}}>

        {/* ═══ STEP 1 ═══ */}
        {step===1&&(
          <div>
            <div style={{marginBottom:32}}>
              <h2 style={{fontFamily:FONT,fontWeight:600,fontSize:28,color:DARK,margin:"0 0 8px",letterSpacing:"-.015em"}}>What account are you opening today?</h2>
              <p style={{fontSize:15,color:GRAY,margin:0,lineHeight:1.6}}>Choose personal for individual banking, or business for your company.</p>
            </div>
            <div className="mob-stack" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:36}}>
              {([
                {key:"personal" as const,title:"Personal Banking",sub:"Checking, savings, and credit cards for individuals and families.",icon:"M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z",items:["Free & Premium Checking","Regular Savings & Money Market","Community & Rewards Credit Cards"]},
                {key:"business" as const,title:"Business Banking",sub:"Accounts for LLCs, corporations, sole proprietors, and nonprofits.",icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 0-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4",items:["Business Basic & Premium Checking","Business Savings & Money Market","Business Rewards Card (2% cash back)"]},
              ] as const).map(cat=>{
                const sel=category===cat.key;
                return(
                  <button key={cat.key} onClick={()=>setCategory(cat.key)} style={{background:sel?"rgba(8,0,255,.04)":"#fff",border:`2px solid ${sel?BLUE:"rgba(17,24,39,.09)"}`,borderRadius:8,padding:"32px 28px",cursor:"pointer",textAlign:"left",fontFamily:FONT,position:"relative",transition:"all .2s"}}>
                    {sel&&<div style={{position:"absolute",top:16,right:16,width:26,height:26,borderRadius:"50%",background:BLUE,display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M5 12l5 5L20 7"/></svg></div>}
                    <div style={{width:52,height:52,borderRadius:8,background:sel?"rgba(8,0,255,.1)":"rgba(17,24,39,.05)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,transition:"background .2s"}}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={sel?BLUE:GRAY} strokeWidth="1.7"><path d={cat.icon}/></svg>
                    </div>
                    <div style={{fontWeight:600,fontSize:20,color:DARK,marginBottom:8}}>{cat.title}</div>
                    <div style={{fontSize:13.5,color:GRAY,lineHeight:1.6,marginBottom:20}}>{cat.sub}</div>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {cat.items.map(item=>(
                        <div key={item} style={{display:"flex",gap:9,alignItems:"center",fontSize:13.5}}>
                          <div style={{width:18,height:18,borderRadius:"50%",background:"rgba(8,0,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="3"><path d="M5 12l5 5L20 7"/></svg>
                          </div>
                          <span style={{color:DARK,fontWeight:500}}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{display:"flex",justifyContent:"flex-end"}}>
              <NextBtn onClick={()=>{if(category)setStep(2);}} disabled={!category} label="Continue"/>
            </div>
          </div>
        )}

        {/* ═══ STEP 2 ═══ */}
        {step===2&&(
          <div>
            <div style={{marginBottom:32}}>
              <button onClick={()=>setStep(1)} style={{background:"none",border:"none",color:GRAY,cursor:"pointer",fontSize:13.5,display:"flex",alignItems:"center",gap:6,marginBottom:14,fontFamily:"inherit",padding:0,fontWeight:600}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>Back
              </button>
              <h2 style={{fontFamily:FONT,fontWeight:600,fontSize:28,color:DARK,margin:"0 0 8px",letterSpacing:"-.015em"}}>Choose Your Account</h2>
              <p style={{fontSize:15,color:GRAY,margin:0}}>Select the account that best fits your needs. You can always open additional accounts later.</p>
            </div>
            <div className="mob-stack" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:32}}>
              {accounts.map(acc=>{
                const sel=selectedAccount?.id===acc.id;
                return(
                  <button key={acc.id} onClick={()=>setSelected(acc)} style={{background:sel?"rgba(8,0,255,.03)":"#fff",border:`2px solid ${sel?BLUE:"rgba(17,24,39,.08)"}`,borderRadius:8,padding:"24px 22px 22px",cursor:"pointer",textAlign:"left",fontFamily:FONT,position:"relative",transition:"all .2s"}}>
                    {acc.tag&&(
                      <div style={{position:"absolute",top:-12,left:18,background:acc.tag==="Most Popular"?BLUE:BLUE,color:"#fff",fontSize:10,fontWeight:800,letterSpacing:".1em",textTransform:"uppercase",padding:"3px 12px",borderRadius:4}}>{acc.tag}</div>
                    )}
                    {sel&&<div style={{position:"absolute",top:14,right:14,width:24,height:24,borderRadius:"50%",background:BLUE,display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M5 12l5 5L20 7"/></svg></div>}
                    <div style={{fontFamily:FONT,fontWeight:600,fontSize:17,color:DARK,marginBottom:5}}>{acc.name}</div>
                    <div style={{fontSize:12.5,color:GRAY,marginBottom:14,lineHeight:1.5}}>{acc.bestFor}</div>
                    <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
                      <span style={{background:"rgba(17,24,39,.06)",color:MID,fontSize:11.5,fontWeight:700,padding:"3px 10px",borderRadius:4}}>{acc.fee}</span>
                      <span style={{background:"rgba(17,24,39,.06)",color:MID,fontSize:11.5,fontWeight:700,padding:"3px 10px",borderRadius:4}}>{acc.min}</span>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:7}}>
                      {acc.highlights.map(h=>(
                        <div key={h} style={{display:"flex",gap:8,alignItems:"flex-start",fontSize:13}}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.5" style={{flexShrink:0,marginTop:1}}><path d="M5 12l5 5L20 7"/></svg>
                          <span style={{color:DARK,lineHeight:1.45}}>{h}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <BackBtn onClick={()=>setStep(1)}/>
              <NextBtn onClick={()=>{if(selectedAccount)setStep(3);}} disabled={!selectedAccount}/>
            </div>
          </div>
        )}

        {/* ═══ STEP 3 ═══ */}
        {step===3&&(
          <div>
            <button onClick={()=>setStep(2)} style={{background:"none",border:"none",color:GRAY,cursor:"pointer",fontSize:13.5,display:"flex",alignItems:"center",gap:6,marginBottom:22,fontFamily:"inherit",padding:0,fontWeight:600}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>Back
            </button>
            <div style={{marginBottom:28}}>
              <h2 style={{fontFamily:FONT,fontWeight:600,fontSize:28,color:DARK,margin:"0 0 8px",letterSpacing:"-.015em"}}>Tell Us About You</h2>
              <p style={{fontSize:14,color:GRAY,margin:0,lineHeight:1.5}}>All information is encrypted and used solely to verify your identity and open your account.</p>
            </div>
            <Section title="Personal Information">
              <div className="mob-form-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
                <Field label="Legal First Name"><TextInput value={form.firstName} onChange={v=>update("firstName",v)} placeholder="First name" autoComplete="given-name"/></Field>
                <Field label="Legal Last Name"><TextInput value={form.lastName} onChange={v=>update("lastName",v)} placeholder="Last name" autoComplete="family-name"/></Field>
                <Field label="Date of Birth" hint="You must be 18 years or older to open an account."><TextInput type="date" value={form.dob} onChange={v=>update("dob",v)} autoComplete="bday"/></Field>
                <Field label="Social Security Number" hint="Required by the USA PATRIOT Act to verify your identity."><TextInput type="password" value={form.ssn} onChange={v=>update("ssn",v)} placeholder="•••-••-••••" autoComplete="off"/></Field>
                <Field label="Email Address"><TextInput type="email" value={form.email} onChange={v=>update("email",v)} placeholder="you@example.com" autoComplete="email"/></Field>
                <Field label="Mobile Phone"><TextInput type="tel" value={form.phone} onChange={v=>update("phone",v)} placeholder="(555) 000-0000" autoComplete="tel"/></Field>
              </div>
              <div style={{marginTop:20,background:"rgba(17,24,39,.025)",border:"1px solid rgba(17,24,39,.07)",borderRadius:4,padding:"16px 18px"}}>
                <Field label="Are you a U.S. Citizen or Permanent Resident?" hint="Non-residents must visit a branch to open an account.">
                  <RadioGroup name="usCitizen" value={form.usCitizen} onChange={v=>update("usCitizen",v)} options={[{value:"yes",label:"Yes"},{value:"no",label:"No — I'll visit a branch"}]}/>
                </Field>
              </div>
            </Section>
            {isGuest&&(
              <Section title="Create Online Banking Password">
                <p style={{fontSize:13.5,color:GRAY,margin:"0 0 20px",lineHeight:1.55}}>You&apos;ll use your email and this password to log in once your application is approved.</p>
                <div className="mob-form-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
                  <Field label="Password" hint="Minimum 8 characters."><TextInput type="password" value={form.password} onChange={v=>update("password",v)} placeholder="Create a password" autoComplete="new-password"/></Field>
                  <Field label="Confirm Password"><TextInput type="password" value={form.confirmPassword} onChange={v=>update("confirmPassword",v)} placeholder="Re-enter password" autoComplete="new-password"/></Field>
                </div>
              </Section>
            )}
            {isBusiness&&(
              <Section title="Business Information">
                <div className="mob-form-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
                  <div style={{gridColumn:"1/-1"}}><Field label="Legal Business Name"><TextInput value={form.businessName} onChange={v=>update("businessName",v)} placeholder="Full legal business name" autoComplete="organization"/></Field></div>
                  <Field label="Business Type"><Select value={form.businessType} onChange={v=>update("businessType",v)}><option value="">Select type</option>{["Sole Proprietorship","Single-Member LLC","Multi-Member LLC","S Corporation","C Corporation","General Partnership","Nonprofit Organization","Other"].map(t=><option key={t} value={t}>{t}</option>)}</Select></Field>
                  <Field label="EIN / Tax ID" hint="Sole proprietors may use their SSN."><TextInput value={form.ein} onChange={v=>update("ein",v)} placeholder="XX-XXXXXXX" autoComplete="off"/></Field>
                  <Field label="Date Established"><TextInput type="date" value={form.established} onChange={v=>update("established",v)}/></Field>
                  <Field label="Business Phone"><TextInput type="tel" value={form.businessPhone} onChange={v=>update("businessPhone",v)} placeholder="(555) 000-0000" autoComplete="tel"/></Field>
                  <div style={{gridColumn:"1/-1"}}><Field label="Industry"><Select value={form.industry} onChange={v=>update("industry",v)}><option value="">Select industry</option>{["Retail Trade","Food & Beverage","Healthcare","Construction","Professional Services","Technology","Real Estate","Transportation","Non-profit","Agriculture","Manufacturing","Education","Other"].map(t=><option key={t} value={t}>{t}</option>)}</Select></Field></div>
                </div>
              </Section>
            )}
            <div style={{display:"flex",justifyContent:"space-between"}}><BackBtn onClick={()=>setStep(2)}/><NextBtn onClick={()=>setStep(4)}/></div>
          </div>
        )}

        {/* ═══ STEP 4 ═══ */}
        {step===4&&(
          <div>
            <button onClick={()=>setStep(3)} style={{background:"none",border:"none",color:GRAY,cursor:"pointer",fontSize:13.5,display:"flex",alignItems:"center",gap:6,marginBottom:22,fontFamily:"inherit",padding:0,fontWeight:600}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>Back
            </button>
            <div style={{marginBottom:28}}>
              <h2 style={{fontFamily:FONT,fontWeight:600,fontSize:28,color:DARK,margin:"0 0 8px",letterSpacing:"-.015em"}}>Your Address</h2>
              <p style={{fontSize:15,color:GRAY,margin:0,lineHeight:1.6}}>We need your residential address to verify your identity and mail your account materials.</p>
            </div>
            <Section title="Home / Primary Address">
              <div style={{display:"flex",flexDirection:"column",gap:20}}>
                <Field label="Street Address"><TextInput value={form.street} onChange={v=>update("street",v)} placeholder="123 Main Street" autoComplete="street-address"/></Field>
                <div className="mob-form-2" style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:16}}>
                  <Field label="City"><TextInput value={form.city} onChange={v=>update("city",v)} placeholder="City" autoComplete="address-level2"/></Field>
                  <Field label="State"><Select value={form.state} onChange={v=>update("state",v)}><option value="">State</option>{STATES.map(s=><option key={s} value={s}>{s}</option>)}</Select></Field>
                  <Field label="ZIP"><TextInput value={form.zip} onChange={v=>update("zip",v)} placeholder="00000" autoComplete="postal-code"/></Field>
                </div>
                <Field label="Time at This Address"><Select value={form.timeAtAddress} onChange={v=>update("timeAtAddress",v)}><option value="">Select</option>{["Less than 1 year","1–2 years","2–5 years","5–10 years","10+ years"].map(t=><option key={t} value={t}>{t}</option>)}</Select></Field>
                <Field label="Is your mailing address the same?">
                  <RadioGroup name="sameMailing" value={form.sameMailing} onChange={v=>update("sameMailing",v)} options={[{value:"yes",label:"Yes, same address"},{value:"no",label:"No, different address"}]}/>
                </Field>
                {form.sameMailing==="no"&&(
                  <div style={{padding:"22px 24px",background:"rgba(17,24,39,.02)",border:"1px solid rgba(17,24,39,.08)",borderRadius:8}}>
                    <div style={{fontWeight:700,fontSize:12,color:DARK,marginBottom:16,letterSpacing:".02em",textTransform:"uppercase"}}>Mailing Address</div>
                    <div style={{display:"flex",flexDirection:"column",gap:16}}>
                      <Field label="Street Address"><TextInput value={form.mailingStreet} onChange={v=>update("mailingStreet",v)} placeholder="PO Box or street address"/></Field>
                      <div className="mob-form-2" style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:16}}>
                        <Field label="City"><TextInput value={form.mailingCity} onChange={v=>update("mailingCity",v)} placeholder="City"/></Field>
                        <Field label="State"><Select value={form.mailingState} onChange={v=>update("mailingState",v)}><option value="">State</option>{STATES.map(s=><option key={s} value={s}>{s}</option>)}</Select></Field>
                        <Field label="ZIP"><TextInput value={form.mailingZip} onChange={v=>update("mailingZip",v)} placeholder="00000"/></Field>
                      </div>
                    </div>
                  </div>
                )}
                <Field label="Existing SGGINV Customer?">
                  <RadioGroup name="existingAccount" value={form.existingAccount} onChange={v=>update("existingAccount",v)} options={[{value:"yes",label:"Yes, existing customer"},{value:"no",label:"No, first account"}]}/>
                </Field>
              </div>
            </Section>
            <div style={{display:"flex",justifyContent:"space-between"}}><BackBtn onClick={()=>setStep(3)}/><NextBtn onClick={()=>setStep(5)}/></div>
          </div>
        )}

        {/* ═══ STEP 5 ═══ */}
        {step===5&&(
          <div>
            <button onClick={()=>setStep(4)} style={{background:"none",border:"none",color:GRAY,cursor:"pointer",fontSize:13.5,display:"flex",alignItems:"center",gap:6,marginBottom:22,fontFamily:"inherit",padding:0,fontWeight:600}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>Back
            </button>
            <div style={{marginBottom:28}}>
              <h2 style={{fontFamily:FONT,fontWeight:600,fontSize:28,color:DARK,margin:"0 0 8px",letterSpacing:"-.015em"}}>Review &amp; Submit</h2>
              <p style={{fontSize:15,color:GRAY,margin:0}}>Confirm your details and accept the required disclosures to submit.</p>
            </div>

            {/* Summary */}
            <Section title="Application Summary">
              <div style={{display:"flex",flexDirection:"column",gap:0}}>
                {[{label:"Account",value:selectedAccount?.name??""},{label:"Type",value:category==="personal"?"Personal Banking":"Business Banking"},{label:"Name",value:`${form.firstName} ${form.lastName}`.trim()||"—"},{label:"Email",value:form.email||"—"},{label:"Phone",value:form.phone||"—"},{label:"Address",value:form.street?`${form.street}, ${form.city}, ${form.state} ${form.zip}`:"—"}].map(({label,value},i,arr)=>(
                  <div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 0",borderBottom:i<arr.length-1?"1px solid rgba(17,24,39,.06)":"none"}}>
                    <span style={{fontSize:13.5,color:GRAY,fontWeight:500}}>{label}</span>
                    <span style={{fontSize:14,fontWeight:700,color:DARK,maxWidth:"60%",textAlign:"right"}}>{value}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Initial deposit */}
            {!isCredit&&(
              <Section title="Initial Deposit">
                {(selectedAccount?.minDeposit??0)>0&&(
                  <div style={{background:"rgba(8,0,255,.07)",border:"1px solid rgba(8,0,255,.25)",borderRadius:4,padding:"11px 16px",marginBottom:18,fontSize:13.5,color:DARK}}>
                    This account requires a minimum opening deposit of <strong>${selectedAccount?.minDeposit?.toLocaleString()}</strong>.
                  </div>
                )}
                <p style={{fontSize:14,color:GRAY,margin:"0 0 18px"}}>How would you like to fund your new account?</p>
                <RadioGroup name="fundingMethod" value={form.fundingMethod} onChange={v=>update("fundingMethod",v)} options={[{value:"transfer",label:"Transfer from another bank"},{value:"check",label:"Mail a check"},{value:"branch",label:"Deposit at a branch"}]}/>
                {form.fundingMethod==="transfer"&&(
                  <div className="mob-form-2" style={{marginTop:20,display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
                    <Field label="Routing Number (ABA)"><TextInput value={form.routingNumber} onChange={v=>update("routingNumber",v)} placeholder="9-digit routing number"/></Field>
                    <Field label="Account Number"><TextInput value={form.bankAccountNumber} onChange={v=>update("bankAccountNumber",v)} placeholder="Your account number"/></Field>
                  </div>
                )}
                {form.fundingMethod==="check"&&(
                  <div style={{marginTop:16,padding:"16px 20px",background:"rgba(17,24,39,.03)",borderRadius:4,fontSize:14,color:DARK,lineHeight:1.7}}>
                    Make your check payable to <strong>Safeguard Global Investment Bank</strong> and mail to:<br/>
                    <span style={{color:GRAY}}>Attn: New Accounts · 102 Main Street · Hometown, ST 00000</span>
                  </div>
                )}
              </Section>
            )}

            {/* Disclosures */}
            <Section title="Required Disclosures">
              <p style={{fontSize:13.5,color:GRAY,margin:"0 0 18px",lineHeight:1.55}}>Please read and acknowledge each of the following before submitting.</p>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <DiscCheck checked={form.discFDIC} onChange={v=>update("discFDIC",v)}>I understand my deposits are <strong>not covered by any deposit protection scheme</strong>. <Link href="/disclosures#deposits" style={{color:BLUE}}>View notice →</Link></DiscCheck>
                <DiscCheck checked={form.discPrivacy} onChange={v=>update("discPrivacy",v)}>I have received and read SGGINV&apos;s <strong>Privacy Notice</strong>. <Link href="/privacy" style={{color:BLUE}}>View notice →</Link></DiscCheck>
                <DiscCheck checked={form.discTerms} onChange={v=>update("discTerms",v)}>I agree to the <strong>Account Terms &amp; Conditions</strong> and <strong>Terms of Use</strong>. <Link href="/terms" style={{color:BLUE}}>View terms →</Link></DiscCheck>
                <DiscCheck checked={form.discEStatements} onChange={v=>update("discEStatements",v)}>I consent to receive <strong>electronic statements and disclosures</strong> via email. I may opt out at any time by contacting SGGINV.</DiscCheck>
                <DiscCheck checked={form.discCertify} onChange={v=>update("discCertify",v)}><strong>I certify</strong> under penalty of perjury that all information in this application is true, accurate, and complete. I authorize SGGINV to verify this information and perform a credit or identity inquiry as needed.</DiscCheck>
              </div>
            </Section>

            {isBusiness&&(
              <div style={{background:"rgba(8,0,255,.06)",border:"1px solid rgba(8,0,255,.22)",borderRadius:4,padding:"14px 18px",marginBottom:24,fontSize:13.5,color:DARK,lineHeight:1.55}}>
                <strong>Business accounts:</strong> After submission, a banker will contact you within 1 business day to schedule your in-branch document verification.
              </div>
            )}

            {submitError&&(
              <div style={{background:"rgba(8,0,255,.06)",border:"1px solid rgba(8,0,255,.25)",borderRadius:4,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"flex-start",gap:10}}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" style={{flexShrink:0,marginTop:1}}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                <span style={{fontSize:13.5,color:DARK,lineHeight:1.5}}>{submitError}</span>
              </div>
            )}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <BackBtn onClick={()=>setStep(4)}/>
              <NextBtn onClick={handleSubmit} disabled={!allDiscs||submitting} label="Submit Application" loading={submitting}/>
            </div>
          </div>
        )}

          </div>

          {/* Right: image panel, half the viewport height, cut on the bottom edge like the hero */}
          <div
            className="oa-split-img"
            style={{
              position:"sticky",
              top:114,
              height:"50vh",
              overflow:"hidden",
              background:BLUE,
              clipPath:"polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 56px))",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/open-account-side.png"
              alt=""
              style={{position:"absolute",bottom:0,right:0,width:"100%",height:"auto",maxWidth:460}}
            />
          </div>
        </div>
      ):(
        step===6&&(
          <div style={{maxWidth:640,margin:"0 auto",textAlign:"center",paddingTop:16}}>
            {/* Animated success */}
            <div style={{width:90,height:90,borderRadius:"50%",background:"rgba(8,0,255,.08)",border:"2px solid rgba(8,0,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 28px"}}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.2" strokeLinecap="round"><path d="M5 12l5 5L20 7"/></svg>
            </div>

            <div style={{display:"inline-flex",alignItems:"center",gap:7,background:"rgba(8,0,255,.06)",border:"1px solid rgba(8,0,255,.2)",borderRadius:4,padding:"5px 14px",fontSize:12,fontWeight:700,color:BLUE,letterSpacing:".06em",textTransform:"uppercase",marginBottom:20}}>
              Application Submitted
            </div>

            <h2 style={{fontFamily:FONT,fontWeight:600,fontSize:32,color:DARK,margin:"0 0 14px",letterSpacing:"-.02em"}}>You&apos;re all set, {form.firstName||"valued customer"}!</h2>
            <p style={{fontSize:15.5,color:GRAY,margin:"0 0 36px",lineHeight:1.7}}>
              Your application for a <strong style={{color:DARK}}>{selectedAccount?.name}</strong> has been submitted. Our team will review it and you&apos;ll hear from us shortly.
            </p>

            {/* What's next */}
            <div style={{background:"#fff",border:"1px solid rgba(17,24,39,.08)",borderRadius:8,padding:"28px 30px",textAlign:"left",marginBottom:28}}>
              <div style={{fontFamily:FONT,fontWeight:600,fontSize:16,color:DARK,marginBottom:24}}>What happens next</div>
              <div style={{display:"flex",flexDirection:"column",gap:0}}>
                {[
                  {n:"1",title:"Application review",body:isBusiness?"A business banker will call you within 1 business day to schedule your in-branch document verification.":"Most applications are approved same day. If we need anything, you'll hear from us within 1 business day."},
                  {n:"2",title:"Email confirmation",body:`We'll send a confirmation to ${form.email||"the email on your account"} once your application is reviewed.`},
                  {n:"3",title:isCredit?"Card delivery":"Account activation",body:isCredit?`If approved, your card arrives in 7–10 business days.${isGuest?" You can log in with the password you created to track your application.":""}`:`Once approved, your account will be active.${isGuest?" You can log in with the email and password you created — your login is activated upon approval.":""}`},
                ].map((item,i,arr)=>(
                  <div key={item.n} style={{display:"flex",gap:16,alignItems:"flex-start",paddingBottom:i<arr.length-1?20:0,marginBottom:i<arr.length-1?20:0,borderBottom:i<arr.length-1?"1px solid rgba(17,24,39,.06)":"none"}}>
                    <div style={{flex:"none",width:34,height:34,borderRadius:"50%",background:BLUE,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONT,fontWeight:800,fontSize:14}}>{item.n}</div>
                    <div style={{paddingTop:4}}>
                      <div style={{fontWeight:700,fontSize:15,color:DARK,marginBottom:4}}>{item.title}</div>
                      <div style={{fontSize:13.5,color:GRAY,lineHeight:1.6}}>{item.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
              {isGuest?(
                <>
                  <Link href="/login" style={{background:BLUE,color:"#fff",textDecoration:"none",fontFamily:FONT,fontSize:15,fontWeight:700,padding:"14px 30px",borderRadius:4,display:"inline-flex",alignItems:"center",gap:8}}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/></svg>
                    Enroll in Online Banking
                  </Link>
                  <Link href="/" style={{background:"#fff",color:DARK,textDecoration:"none",fontFamily:FONT,fontSize:15,fontWeight:600,padding:"14px 30px",borderRadius:4,border:"1.5px solid rgba(17,24,39,.13)",display:"inline-block"}}>
                    Return to Home
                  </Link>
                </>
              ):(
                <Link href="/dashboard" style={{background:BLUE,color:"#fff",textDecoration:"none",fontFamily:FONT,fontSize:15,fontWeight:700,padding:"14px 30px",borderRadius:4,display:"inline-flex",alignItems:"center",gap:8}}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                  Return to Dashboard
                </Link>
              )}
            </div>

            <p style={{marginTop:28,fontSize:13,color:GRAY,lineHeight:1.6}}>
              Questions? Call <a href="tel:5553021900" style={{color:BLUE,fontWeight:600,textDecoration:"none"}}>(555) 302-1900</a> or{" "}
              <Link href="/about/contact" style={{color:BLUE,fontWeight:600,textDecoration:"none"}}>visit a branch</Link>.
            </p>
          </div>
        ))}
      </div>

      {submitting&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:"#fff",borderRadius:8,padding:"44px 60px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.5" style={{animation:"spin .75s linear infinite"}}><path d="M21 12a9 9 0 1 1-6.22-8.56"/></svg>
            <div style={{fontFamily:FONT,fontWeight:600,fontSize:18,color:DARK}}>Submitting Your Application</div>
            <div style={{fontSize:14,color:GRAY,lineHeight:1.6}}>Please don&apos;t close this page…</div>
          </div>
        </div>
      )}
      <Footer/>
    </div>
  );
}
