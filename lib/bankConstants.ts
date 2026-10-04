export const BANK = {
  name:        "Safeguard Global Investment Bank",
  // Placeholders — not a real ACH/wire routing number. Replace with your
  // actual assigned routing number(s) before any real-money use.
  achRouting:  "[ACH ROUTING NUMBER]",
  wireRouting: "[WIRE ROUTING NUMBER]",
  swiftCode:   "[SWIFT / BIC CODE]",
  address:     "[REGISTERED ADDRESS]",
} as const;

export const CREDIT = {
  defaultLimit: 2_500,
  maxLimit:     50_000,
} as const;
