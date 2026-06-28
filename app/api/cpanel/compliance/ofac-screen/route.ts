import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if ((profile as Record<string, string> | null)?.role !== "admin") return null;
  return user;
}

function scoreMatch(a: string, b: string): number {
  const na = a.toLowerCase().trim();
  const nb = b.toLowerCase().trim();
  if (na === nb) return 100;
  if (na.includes(nb) || nb.includes(na)) return 87;
  const wa = new Set(na.split(/\s+/).filter(w => w.length > 2));
  const wb = new Set(nb.split(/\s+/).filter(w => w.length > 2));
  if (wa.size === 0 || wb.size === 0) return 0;
  let overlap = 0;
  for (const w of wa) { if (wb.has(w)) overlap++; }
  return Math.round((overlap / Math.max(wa.size, wb.size)) * 70);
}

export async function POST(request: Request) {
  const admin_user = await verifyAdmin();
  if (!admin_user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { userId, name } = await request.json() as { userId?: string; name: string };
  if (!name?.trim()) return NextResponse.json({ error: "Name is required." }, { status: 400 });

  const admin = createAdminClient();

  const { data: watchlist } = await admin.from("ofac_watchlist").select("name,country,category");

  let highestScore = 0;
  let matchedEntry: string | null = null;

  for (const entry of (watchlist ?? []) as Record<string, string>[]) {
    const score = scoreMatch(name, entry.name);
    if (score > highestScore) {
      highestScore = score;
      matchedEntry = entry.name;
    }
  }

  const status = highestScore >= 50 ? "potential_match" : "clear";
  if (highestScore < 30) matchedEntry = null;

  const { data: inserted, error } = await admin.from("ofac_screenings").insert({
    user_id:       userId || null,
    screened_name: name.trim(),
    match_score:   highestScore,
    matched_entry: matchedEntry,
    status,
  }).select("id,user_id,screened_name,match_score,matched_entry,status,reviewed_by,reviewed_at,created_at").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ screening: inserted, score: highestScore, matchedEntry, status });
}
