"use client";

import { useEffect, useState } from "react";

/* True once `ms` milliseconds have passed since the component mounted.
   Used to keep the loading screen up long enough to be seen. */
export function useMinDuration(ms: number) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return done;
}
