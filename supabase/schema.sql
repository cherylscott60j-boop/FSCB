-- ============================================================
-- SGGINV Banking App — Supabase Schema
-- Run in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Shared trigger: auto-set updated_at ──────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- 1. PROFILES
--    One row per auth.users entry — created automatically on
--    signup via the trigger below.
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name     TEXT NOT NULL DEFAULT '',
  last_name      TEXT NOT NULL DEFAULT '',
  email          TEXT NOT NULL,
  phone          TEXT,
  date_of_birth  DATE,
  address_line1  TEXT,
  address_line2  TEXT,
  city           TEXT,
  state          TEXT,
  zip            TEXT,
  member_since   DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Auto-create a profile row whenever a new auth user is created
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'last_name', '')
    )
    ON CONFLICT (id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    -- Never let a profiles insert error block auth user creation
    NULL;
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ============================================================
-- 2. ACCOUNTS
--    All deposit accounts a user holds.
-- ============================================================
CREATE TYPE account_type AS ENUM (
  'checking',
  'savings',
  'credit_card',
  'money_market',
  'cd',
  'business_checking',
  'business_savings',
  'business_credit_card'
);
-- Live DB migration: ALTER TYPE account_type ADD VALUE 'business_credit_card';

CREATE TYPE account_status AS ENUM ('active', 'frozen', 'closed');

CREATE TABLE IF NOT EXISTS accounts (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_type          account_type NOT NULL,
  account_name          TEXT NOT NULL,
  account_number        TEXT,
  account_number_last4  CHAR(4) NOT NULL,
  balance               NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  available_balance     NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  credit_limit          NUMERIC(15,2),           -- credit cards only
  interest_rate         NUMERIC(6,4),             -- APY/APR as decimal (e.g. 0.0425 = 4.25%)
  status                account_status NOT NULL DEFAULT 'active',
  freeze_reason         TEXT,                                     -- 'transfer_hold' for auto-freezes; NULL for manual admin freezes
  opened_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "accounts_select_own"
  ON accounts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "accounts_insert_own"
  ON accounts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "accounts_update_own"
  ON accounts FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_accounts_user_id   ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_type       ON accounts(account_type);
CREATE INDEX IF NOT EXISTS idx_accounts_status     ON accounts(status);

CREATE TRIGGER trg_accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ============================================================
-- 3. TRANSACTIONS
--    All debit/credit activity per account.
--    amount > 0 = credit (money coming in)
--    amount < 0 = debit  (money going out)
-- ============================================================
CREATE TYPE transaction_type AS ENUM (
  'debit', 'credit', 'transfer', 'payment', 'fee', 'interest', 'refund'
);

CREATE TYPE transaction_status AS ENUM ('pending', 'posted', 'failed', 'cancelled');

CREATE TABLE IF NOT EXISTS transactions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id       UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  merchant         TEXT NOT NULL,
  category         TEXT NOT NULL,
  amount           NUMERIC(15,2) NOT NULL,
  transaction_type transaction_type NOT NULL,
  status           transaction_status NOT NULL DEFAULT 'posted',
  description      TEXT,
  reference_id     TEXT,
  posted_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transactions_select_own"
  ON transactions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "transactions_insert_own"
  ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id    ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_posted_at  ON transactions(posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category   ON transactions(category);


-- ============================================================
-- 4. CARDS
--    Debit or credit cards tied to an account.
-- ============================================================
CREATE TYPE card_type   AS ENUM ('debit', 'credit');
CREATE TYPE card_status AS ENUM ('active', 'frozen', 'cancelled', 'expired');

CREATE TABLE IF NOT EXISTS cards (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id       UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_type        card_type NOT NULL,
  last_four        CHAR(4) NOT NULL,
  expiry_month     SMALLINT NOT NULL CHECK (expiry_month BETWEEN 1 AND 12),
  expiry_year      SMALLINT NOT NULL,
  cardholder_name  TEXT NOT NULL,
  status           card_status NOT NULL DEFAULT 'active',
  issued_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cards_select_own"
  ON cards FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "cards_update_own"
  ON cards FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_cards_account_id ON cards(account_id);
CREATE INDEX IF NOT EXISTS idx_cards_user_id    ON cards(user_id);

CREATE TRIGGER trg_cards_updated_at
  BEFORE UPDATE ON cards
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ============================================================
-- 5. LOANS
--    Mortgage, auto, personal, and other loan accounts.
-- ============================================================
CREATE TYPE loan_type AS ENUM (
  'personal', 'mortgage', 'auto', 'home_equity', 'business', 'student'
);

CREATE TYPE loan_status AS ENUM ('active', 'paid_off', 'defaulted', 'in_review');

CREATE TABLE IF NOT EXISTS loans (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  loan_type         loan_type NOT NULL,
  loan_name         TEXT NOT NULL,
  original_amount   NUMERIC(15,2) NOT NULL,
  remaining_balance NUMERIC(15,2) NOT NULL,
  interest_rate     NUMERIC(6,4) NOT NULL,   -- e.g. 0.0699 = 6.99%
  monthly_payment   NUMERIC(15,2) NOT NULL,
  next_payment_date DATE,
  origination_date  DATE NOT NULL,
  maturity_date     DATE,
  status            loan_status NOT NULL DEFAULT 'active',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "loans_select_own"
  ON loans FOR SELECT USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_loans_user_id ON loans(user_id);
CREATE INDEX IF NOT EXISTS idx_loans_status  ON loans(status);

CREATE TRIGGER trg_loans_updated_at
  BEFORE UPDATE ON loans
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ============================================================
-- 6. APPLICATIONS
--    Open-account form submissions.
--    SSN is NEVER stored — handled out-of-band if needed.
-- ============================================================
CREATE TYPE application_category AS ENUM ('personal', 'business');

CREATE TYPE application_status AS ENUM (
  'pending', 'approved', 'denied', 'cancelled', 'more_info_needed'
);

-- Live DB migration: ALTER TABLE applications ADD COLUMN IF NOT EXISTS account_name TEXT;
CREATE TABLE IF NOT EXISTS applications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reference_id    TEXT UNIQUE NOT NULL,
  account_type    TEXT NOT NULL,
  account_name    TEXT,
  category        application_category NOT NULL,
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  date_of_birth   DATE,
  status          application_status NOT NULL DEFAULT 'pending',
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at     TIMESTAMPTZ,
  reviewer_notes  TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Anyone (including unauthenticated visitors) may submit an application
CREATE POLICY "applications_insert_anyone"
  ON applications FOR INSERT WITH CHECK (true);

-- Logged-in users may view their own applications
CREATE POLICY "applications_select_own"
  ON applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_applications_user_id   ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status    ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_ref       ON applications(reference_id);

CREATE TRIGGER trg_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ============================================================
-- 7. CONTACT MESSAGES
--    Contact-form submissions — anyone may send.
-- ============================================================
CREATE TYPE contact_status AS ENUM ('new', 'read', 'replied', 'closed');

CREATE TABLE IF NOT EXISTS contact_messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT,
  topic        TEXT,
  message      TEXT NOT NULL,
  status       contact_status NOT NULL DEFAULT 'new',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contact_messages_insert_anyone"
  ON contact_messages FOR INSERT WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);


-- ============================================================
-- 8. NOTIFICATIONS
--    Per-user alerts shown in the dashboard alerts panel.
-- ============================================================
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error');

CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type       notification_type NOT NULL DEFAULT 'info',
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  read       BOOLEAN NOT NULL DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select_own"
  ON notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_own"
  ON notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id   ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread    ON notifications(user_id, read) WHERE read = false;


-- ============================================================
-- 9. FRAUD ALERTS
--    Rule-based fraud detection results. Admin-only via service
--    role — no user-facing RLS policies needed.
-- ============================================================
CREATE TABLE IF NOT EXISTS fraud_alerts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id     UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  rule           TEXT NOT NULL,
  severity       TEXT NOT NULL DEFAULT 'medium',  -- low | medium | high
  details        JSONB NOT NULL DEFAULT '{}',
  status         TEXT NOT NULL DEFAULT 'open',    -- open | dismissed | actioned
  reviewed_at    TIMESTAMPTZ,
  reviewed_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE fraud_alerts ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_fraud_alerts_account_id ON fraud_alerts(account_id);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_user_id    ON fraud_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_status     ON fraud_alerts(status);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_created_at ON fraud_alerts(created_at DESC);


-- ============================================================
-- 10. DISPUTES
--    Customer dispute and chargeback case management.
-- ============================================================
CREATE TABLE IF NOT EXISTS disputes (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id     UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  reference_id   TEXT UNIQUE NOT NULL,
  dispute_type   TEXT NOT NULL,   -- unauthorized | billing_error | not_received | duplicate | other
  amount         NUMERIC(15,2) NOT NULL,
  merchant       TEXT NOT NULL,
  description    TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'open', -- open | under_review | more_info_needed | approved | denied
  admin_notes    TEXT,
  credit_tx_id   UUID REFERENCES transactions(id) ON DELETE SET NULL,
  opened_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at    TIMESTAMPTZ,
  resolved_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "disputes_select_own"
  ON disputes FOR SELECT USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_disputes_user_id    ON disputes(user_id);
CREATE INDEX IF NOT EXISTS idx_disputes_account_id ON disputes(account_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status     ON disputes(status);
CREATE INDEX IF NOT EXISTS idx_disputes_opened_at  ON disputes(opened_at DESC);

CREATE TRIGGER trg_disputes_updated_at
  BEFORE UPDATE ON disputes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ============================================================
-- 11. AUDIT LOGS
--    Immutable record of every admin action. No RLS needed —
--    only the service role writes/reads this table.
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_email TEXT NOT NULL,
  action      TEXT NOT NULL,      -- e.g. 'account.freeze', 'dispute.approve'
  entity_type TEXT NOT NULL,      -- 'account' | 'transaction' | 'application' | 'dispute' | 'fraud' | 'kyc'
  entity_id   TEXT,
  details     JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id   ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action     ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);


-- ============================================================
-- 12. BUDGETS
--    Monthly spending cap per category, set by the user.
-- ============================================================
CREATE TABLE IF NOT EXISTS budgets (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category   TEXT NOT NULL,
  amount     NUMERIC(15,2) NOT NULL CHECK (amount >= 0),
  month      SMALLINT NOT NULL CHECK (month BETWEEN 1 AND 12),
  year       SMALLINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, category, month, year)
);

ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "budgets_all_own"
  ON budgets FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_budgets_user_period ON budgets(user_id, year, month);

CREATE TRIGGER trg_budgets_updated_at
  BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ============================================================
-- 13. INTEREST RATE CONFIGURATION
--    Admin-editable APY / APR table per product type.
--    Service role only — no customer RLS policy needed.
-- ============================================================
CREATE TABLE IF NOT EXISTS rate_config (
  key          TEXT PRIMARY KEY,
  label        TEXT NOT NULL,
  product_type TEXT NOT NULL,
  rate_type    TEXT NOT NULL CHECK (rate_type IN ('apy','apr')),
  value        NUMERIC(8,4) NOT NULL DEFAULT 0,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by   TEXT
);

ALTER TABLE rate_config ENABLE ROW LEVEL SECURITY;

INSERT INTO rate_config (key, label, product_type, rate_type, value) VALUES
  ('checking_apy',      'Checking APY',              'checking',      'apy', 0.01),
  ('savings_apy',       'Regular Savings APY',        'savings',       'apy', 2.50),
  ('hys_apy',           'High-Yield Savings APY',     'savings',       'apy', 4.75),
  ('money_market_apy',  'Money Market APY',           'money_market',  'apy', 3.25),
  ('cd_6_apy',          '6-Month CD APY',             'cd',            'apy', 4.00),
  ('cd_12_apy',         '12-Month CD APY',            'cd',            'apy', 4.50),
  ('cd_24_apy',         '24-Month CD APY',            'cd',            'apy', 4.75),
  ('rewards_apr',       'Rewards Card APR',           'credit_card',   'apr', 19.99),
  ('cashback_apr',      'Cash Back Card APR',         'credit_card',   'apr', 21.99),
  ('secured_apr',       'Secured Card APR',           'credit_card',   'apr', 24.99)
ON CONFLICT (key) DO NOTHING;


-- ============================================================
-- 14. FEE SCHEDULE
--    Admin-editable fee amounts. Service role only.
-- ============================================================
CREATE TABLE IF NOT EXISTS fee_schedule (
  key        TEXT PRIMARY KEY,
  label      TEXT NOT NULL,
  description TEXT,
  amount     NUMERIC(10,2) NOT NULL DEFAULT 0,
  waivable   BOOLEAN NOT NULL DEFAULT TRUE,
  active     BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by TEXT
);

ALTER TABLE fee_schedule ENABLE ROW LEVEL SECURITY;

INSERT INTO fee_schedule (key, label, description, amount, waivable) VALUES
  ('monthly_maintenance', 'Monthly Maintenance Fee',    'Monthly account maintenance charge',           12.00, true),
  ('overdraft',           'Overdraft Fee',              'Per occurrence when balance goes negative',     35.00, true),
  ('wire_domestic',       'Domestic Wire Transfer',     'Outgoing domestic wire',                       25.00, false),
  ('wire_international',  'International Wire Transfer','Outgoing international wire',                  45.00, false),
  ('atm_out_of_network',  'Out-of-Network ATM Fee',    'Per ATM transaction outside our network',       3.50, true),
  ('stop_payment',        'Stop Payment Fee',           'Per stop payment order',                       30.00, false),
  ('returned_item',       'Returned Item Fee',          'Returned check or ACH item',                   35.00, true),
  ('late_payment',        'Late Payment Fee',           'Credit card payment received after due date',  29.00, true)
ON CONFLICT (key) DO NOTHING;


-- ============================================================
-- 15. COMPLIANCE REPORTS (SAR & CTR)
--    Suspicious Activity Reports and Currency Transaction Reports.
--    Service role only — customers cannot see these.
-- ============================================================
CREATE TABLE IF NOT EXISTS compliance_reports (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type    TEXT NOT NULL CHECK (report_type IN ('SAR','CTR')),
  reference_id   TEXT UNIQUE NOT NULL,
  user_id        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  account_id     UUID REFERENCES accounts(id) ON DELETE SET NULL,
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  subject_name   TEXT NOT NULL,
  amount         NUMERIC(15,2),
  description    TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','filed','submitted','closed')),
  filed_at       TIMESTAMPTZ,
  filed_by       TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE compliance_reports ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_compliance_type   ON compliance_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_compliance_status ON compliance_reports(status);
CREATE INDEX IF NOT EXISTS idx_compliance_user   ON compliance_reports(user_id);

CREATE TRIGGER trg_compliance_updated_at
  BEFORE UPDATE ON compliance_reports
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ============================================================
-- 16. OFAC WATCHLIST
--    Internal sanctions watchlist. In production seeded from
--    the OFAC SDN list. Service role only.
-- ============================================================
CREATE TABLE IF NOT EXISTS ofac_watchlist (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name     TEXT NOT NULL,
  country  TEXT,
  category TEXT NOT NULL DEFAULT 'individual',
  remarks  TEXT,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  added_by TEXT
);

ALTER TABLE ofac_watchlist ENABLE ROW LEVEL SECURITY;

INSERT INTO ofac_watchlist (name, country, category, remarks) VALUES
  ('John T. Blackwood',    'US', 'individual', 'Suspected financial crimes — pending investigation'),
  ('Merchant Capital LLC', 'US', 'entity',     'Shell company — structuring investigation'),
  ('Carlos Mendez Rivera', 'MX', 'individual', 'Drug trafficking — OFAC SDN'),
  ('Global Finance Corp',  'RU', 'entity',     'Sanctions evasion — OFAC SDN'),
  ('Ahmed Al-Rashid',      'AE', 'individual', 'Terrorism financing — OFAC SDN')
ON CONFLICT DO NOTHING;


-- ============================================================
-- 17. OFAC SCREENINGS
--    Record of every name-screen performed by an admin.
-- ============================================================
CREATE TABLE IF NOT EXISTS ofac_screenings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  screened_name TEXT NOT NULL,
  match_score   SMALLINT NOT NULL DEFAULT 0,
  matched_entry TEXT,
  status        TEXT NOT NULL DEFAULT 'clear' CHECK (status IN ('clear','potential_match','confirmed_match','false_positive')),
  reviewed_by   TEXT,
  reviewed_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE ofac_screenings ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_ofac_screenings_user   ON ofac_screenings(user_id);
CREATE INDEX IF NOT EXISTS idx_ofac_screenings_status ON ofac_screenings(status);


-- ============================================================
-- 18. STATEMENTS
--    Admin-generated account statements. Customers can read
--    their own via RLS; service role has full access.
-- ============================================================
CREATE TABLE IF NOT EXISTS statements (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id        UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reference_id      TEXT UNIQUE NOT NULL,
  period_start      DATE NOT NULL,
  period_end        DATE NOT NULL,
  generated_by      TEXT NOT NULL,
  generated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  opening_balance   NUMERIC(15,2) NOT NULL DEFAULT 0,
  closing_balance   NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_credits     NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_debits      NUMERIC(15,2) NOT NULL DEFAULT 0,
  transaction_count INT          NOT NULL DEFAULT 0
);

ALTER TABLE statements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own statements" ON statements
  FOR SELECT USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_statements_user    ON statements(user_id);
CREATE INDEX IF NOT EXISTS idx_statements_account ON statements(account_id);
CREATE INDEX IF NOT EXISTS idx_statements_period  ON statements(period_start DESC, period_end DESC);
