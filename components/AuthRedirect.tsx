"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthRedirect() {
  const router = useRouter();
  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace("/dashboard");
    });
  }, [router]);
  return null;
}
