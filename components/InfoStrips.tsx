"use client";

import SwitchCTA from "./SwitchCTA";
import ProtectionBanner from "./ProtectionBanner";
import ScamShield from "./ScamShield";

export default function InfoStrips() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "64px 0" }}>
      <SwitchCTA />
      <ProtectionBanner />
      <ScamShield />
    </div>
  );
}
