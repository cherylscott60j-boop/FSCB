import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
    return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name:    body.name.trim(),
    email:   body.email.trim(),
    phone:   body.phone?.trim() || null,
    topic:   body.topic?.trim() || null,
    message: body.message.trim(),
    status:  "new",
  });

  if (error) {
    console.error("[contact] insert error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
