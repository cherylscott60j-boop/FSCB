import SiteLayout from "@/components/SiteLayout";
import FAQAccordion from "@/components/FAQAccordion";
import {
  BLUE, CheckList, ClosingCTA, DARK, FONT, GRAY, IconCards,
  OverlapSection, ProductHero, SectionTitle, StepsSection, TINT,
} from "@/components/product/ui";

// Width and height in inches (all boxes are 24" deep). Prices are per year.
const SIZES = [
  { name: "Small", w: 3, h: 5, price: 60, fits: "Passports, birth certificates, a few pieces of jewelry" },
  { name: "Medium", w: 5, h: 5, price: 85, fits: "Property deeds, wills, savings bonds, small keepsakes" },
  { name: "Large", w: 3, h: 10, price: 110, fits: "Document folders, coin collections, watch boxes" },
  { name: "Extra large", w: 5, h: 10, price: 150, fits: "Family photos, heirlooms, external hard drives" },
  { name: "Jumbo", w: 10, h: 10, price: 240, fits: "Larger collections, archive boxes, bulky valuables" },
];

const FEATURES = [
  { t: "Dual-key security", d: "Every box needs two keys to open: yours and ours. We never hold a copy of your key.", icon: "M15 7a2 2 0 0 1 2 2m4 0a6 6 0 0 1-7.743 5.743L11 17H9v2H7v2H4a1 1 0 0 1-1-1v-2.586a1 1 0 0 1 .293-.707l5.964-5.964A6 6 0 1 1 21 9z" },
  { t: "Secure vault", d: "Boxes are kept in a monitored, fire-resistant vault with time-locked doors.", icon: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" },
  { t: "Private viewing rooms", d: "Open your box in a private room, away from other customers and staff.", icon: "M8 11V7a4 4 0 1 1 8 0v4M5 11h14v10H5z" },
  { t: "Access logged and verified", d: "Every visit requires photo ID and a signature, and is recorded in the access log.", icon: "M9 12l2 2 4-4M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" },
  { t: "Climate controlled", d: "Steady temperature and humidity help protect paper, photos and fabrics.", icon: "M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" },
  { t: "Joint renters", d: "Add a spouse, family member or deputy so someone you trust can access the box.", icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" },
];

const STORE = [
  { t: "Important documents", d: "Deeds, titles, original wills, marriage and birth certificates." },
  { t: "Jewelry and heirlooms", d: "Pieces you don't wear often and family items that can't be replaced." },
  { t: "Collections", d: "Coins, stamps and other small collectibles." },
  { t: "Digital backups", d: "A hard drive or USB stick with copies of photos and important files." },
];

const DONT_STORE = [
  ["Cash", "It doesn't earn interest. Keep it in a savings account instead."],
  ["Your only copy of a will", "Others may not be able to open your box after you pass away. Keep a copy with your attorney."],
  ["Passports you may need urgently", "You can only reach your box during branch hours."],
  ["Anything dangerous or illegal", "Firearms, explosives, flammable or perishable items aren't allowed."],
];

const STEPS = [
  { t: "Check availability", d: "Call or message us to find out which sizes are free at your preferred branch." },
  { t: "Visit with ID", d: "Bring a photo ID for every renter. You'll sign a rental agreement and signature card." },
  { t: "Get your keys", d: "You'll receive two keys for your box. Keep them somewhere safe and separate." },
];

const ACCESS_HOURS = [
  ["Mon–Fri", "9am – 4:30pm"],
  ["Saturday", "9am – 11:30am"],
  ["Sunday", "Closed"],
];

const FAQS = [
  { q: "Are the contents of my box insured?", a: "No. Safe deposit box contents aren't covered by the bank or by any deposit insurance. We recommend adding them to your home insurance or taking out a separate valuables policy, and keeping a list and photos of what's inside." },
  { q: "Can the bank see what's in my box?", a: "No. Only you and any joint renters or deputies know what's inside. Staff never open your box with you, and we don't hold a copy of your key." },
  { q: "What happens if I lose a key?", a: "Let us know straight away. If you still have one key, we'll order a replacement for $25. If both keys are lost, the lock is drilled and replaced in your presence for $175." },
  { q: "Do I need a bank account to rent a box?", a: "Yes, you'll need a checking or savings account with us. Your annual fee is paid automatically from that account each year." },
  { q: "Who can access my box?", a: "Only renters named on the agreement and any deputies you've authorized. Each person must show photo ID and sign the access log on every visit." },
  { q: "What happens to my box if I pass away?", a: "A joint renter can keep accessing the box as normal. Otherwise the executor of your estate can access it once they provide the required legal documents." },
  { q: "Can I change to a different size?", a: "Yes, subject to availability. We'll refund any unused portion of your current fee when you switch." },
];

/* Front-on drawing of each box size, scaled to the largest box. */
function BoxGlyph({ w, h }: { w: number; h: number }) {
  const unit = 7;
  return (
    <div style={{ height: 10 * unit + 4, display: "flex", alignItems: "flex-end", justifyContent: "center", marginBottom: 18 }}>
      <div style={{ width: w * unit, height: h * unit, border: `2px solid ${BLUE}`, borderRadius: 3, background: "rgba(8,0,255,.06)", position: "relative" }}>
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 10, height: 4, marginLeft: -5, marginTop: -2, borderRadius: 2, background: BLUE }} />
      </div>
    </div>
  );
}

export default function SafeDepositBoxesPage() {
  return (
    <SiteLayout>
      <ProductHero
        eyebrow="Safe deposit boxes"
        title="Keep what matters most safe and private"
        subtitle="Store documents, jewelry and keepsakes in a secure vault, protected by dual-key locks and accessible only to you and the people you choose."
        primary={{ label: "Check availability", href: "/about/contact" }}
        secondary={{ label: "Compare box sizes", href: "#sizes" }}
        highlights={[
          { v: "From $60", l: "Per year" },
          { v: "5 sizes", l: "To choose from" },
          { v: "2 keys", l: "Needed to open" },
        ]}
        image={{ src: "/safe-deposit-hero.jpg", alt: "Keys in the lock of a safe deposit box in our vault", position: "38% 55%" }}
      />

      {/* Sizes */}
      <OverlapSection id="sizes" maxWidth={1240}>
        <div style={{ background: "#fff", borderRadius: 8, border: "1px solid rgba(17,24,39,.1)", padding: "34px 32px 30px" }}>
          <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 22, color: DARK, marginBottom: 4 }}>Box sizes and prices</div>
          <div style={{ fontSize: 14, color: GRAY, marginBottom: 28 }}>All boxes are 24 inches deep. Prices are per year.</div>
          <div className="g-5col" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
            {SIZES.map((s) => (
              <div key={s.name} style={{ border: "1px solid rgba(17,24,39,.1)", borderRadius: 8, padding: "22px 18px", textAlign: "center", display: "flex", flexDirection: "column" }}>
                <BoxGlyph w={s.w} h={s.h} />
                <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 17, color: DARK }}>{s.name}</div>
                <div style={{ fontSize: 13, color: GRAY, marginBottom: 12 }}>{s.w}&quot; × {s.h}&quot; × 24&quot;</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: BLUE, lineHeight: 1 }}>${s.price}</div>
                <div style={{ fontSize: 12, color: GRAY, marginBottom: 14 }}>per year</div>
                <div style={{ fontSize: 13, color: GRAY, lineHeight: 1.5, borderTop: "1px solid rgba(17,24,39,.08)", paddingTop: 12, marginTop: "auto" }}>{s.fits}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: GRAY, lineHeight: 1.6, margin: "18px 0 0" }}>
            Sizes depend on availability at each branch. Your annual fee is paid automatically from your account with us.
          </p>
        </div>
      </OverlapSection>

      {/* Features */}
      <section className="mob-section" style={{ background: "#fff", padding: "40px 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SectionTitle eyebrow="Security" title="Protected at every step" />
          <IconCards items={FEATURES} />
        </div>
      </section>

      {/* What to store */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
          <div>
            <SectionTitle eyebrow="What to store" title="Ideal for things you can't replace" mb={28} />
            <CheckList items={STORE} />
          </div>
          <div style={{ background: "#fff", borderRadius: 8, border: "1px solid rgba(17,24,39,.08)", padding: "32px 30px" }}>
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 20, color: DARK, marginBottom: 18 }}>Better kept somewhere else</div>
            {DONT_STORE.map(([t, d]) => (
              <div key={t} style={{ display: "flex", gap: 14, padding: "14px 0", borderTop: "1px solid rgba(17,24,39,.08)" }}>
                <div style={{ flex: "none", width: 26, height: 26, borderRadius: "50%", border: `2px solid ${BLUE}`, color: BLUE, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 6l12 12M18 6L6 18" /></svg>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15.5, color: DARK, marginBottom: 3 }}>{t}</div>
                  <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.6 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance notice + access */}
      <section className="mob-section" style={{ background: "#fff", padding: "80px 32px" }}>
        <div className="mob-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }}>
          <div style={{ background: BLUE, color: "#fff", borderRadius: 8, padding: "40px 36px" }}>
            <div style={{ fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700, color: "rgba(255,255,255,.75)", marginBottom: 12 }}>Good to know</div>
            <h3 style={{ fontFamily: FONT, fontWeight: 600, fontSize: 26, margin: "0 0 16px", letterSpacing: "-.01em" }}>Box contents aren&apos;t insured by the bank</h3>
            <p style={{ fontSize: 15.5, color: "rgba(255,255,255,.8)", lineHeight: 1.7, margin: "0 0 20px" }}>
              The things you keep in a safe deposit box aren&apos;t covered by the bank or by any deposit insurance. To protect them:
            </p>
            {["Add them to your home or renters insurance policy", "Keep an up-to-date list of what's in your box", "Take photos of valuable items and store them elsewhere"].map((t) => (
              <div key={t} style={{ display: "flex", gap: 12, padding: "10px 0", borderTop: "1px solid rgba(255,255,255,.18)", fontSize: 15 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" style={{ flex: "none", marginTop: 2 }}><path d="M5 12l5 5L20 7" /></svg>
                {t}
              </div>
            ))}
          </div>

          <div style={{ border: `2px solid ${BLUE}`, borderRadius: 8, padding: "40px 36px" }}>
            <div style={{ fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700, color: BLUE, marginBottom: 12 }}>Vault access</div>
            <h3 style={{ fontFamily: FONT, fontWeight: 600, fontSize: 26, margin: "0 0 8px", color: DARK, letterSpacing: "-.01em" }}>Main Street branch</h3>
            <p style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.6, margin: "0 0 20px" }}>102 Main Street, Downtown, ST 00001</p>
            {ACCESS_HOURS.map(([d, h]) => (
              <div key={d} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderTop: "1px solid rgba(17,24,39,.08)", fontSize: 15 }}>
                <span style={{ color: GRAY }}>{d}</span>
                <span style={{ color: DARK, fontWeight: 600 }}>{h}</span>
              </div>
            ))}
            <p style={{ fontSize: 13, color: GRAY, lineHeight: 1.6, margin: "16px 0 0" }}>
              The vault closes 30 minutes before the branch. Bring your key and photo ID on every visit.
            </p>
          </div>
        </div>
      </section>

      <StepsSection title="Rent a box in three steps" steps={STEPS} />

      {/* FAQ */}
      <section className="mob-section" style={{ background: TINT, padding: "80px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <SectionTitle eyebrow="FAQs" title="Your questions answered" center mb={40} />
          <FAQAccordion faqs={FAQS} accent={BLUE} />
        </div>
      </section>

      <ClosingCTA
        title="Find a box that's right for you"
        text="Get in touch to check which sizes are available, or visit our Main Street branch."
        primary={{ label: "Check availability", href: "/about/contact" }}
        secondary={{ label: "Find the branch", href: "/about/contact#branches" }}
      />
    </SiteLayout>
  );
}
