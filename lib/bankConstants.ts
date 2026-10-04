export const BANK = {
  name:        "Safeguard Global Investment Bank",
  achRouting:  "083000137",
  wireRouting: "026073150",
  swiftCode:   "SGIBUS33",
  address:     "1 Harbor Point Plaza, New York, NY 10004",
} as const;

export const CREDIT = {
  defaultLimit: 2_500,
  maxLimit:     50_000,
} as const;
