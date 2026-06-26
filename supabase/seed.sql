-- ============================================================
-- FSCB Banking App — Demo Seed Data
--
-- HOW TO USE:
--   1. Create a user in Supabase Auth:
--      Dashboard → Authentication → Users → "Add user"
--      Email: alex.johnson@example.com  (any password)
--   2. Run this file in Supabase SQL Editor — no edits needed.
--
-- This recreates the mock data the dashboard currently renders
-- from constants, so you can swap constants for real queries
-- and verify the UI stays identical.
-- ============================================================

DO $$
DECLARE
  -- ── CONFIG ────────────────────────────────────────────────
  -- Set this to the email you created in Supabase Auth.
  -- Dashboard → Authentication → Users → Add user
  seed_email CONSTANT TEXT := 'alex.johnson@example.com';
  -- ─────────────────────────────────────────────────────────

  uid     UUID;
  chk_id  UUID;
  sav_id  UUID;
  cc_id   UUID;
BEGIN
  SELECT id INTO uid FROM auth.users WHERE email = seed_email LIMIT 1;

  IF uid IS NULL THEN
    RAISE EXCEPTION
      'User "%" not found in auth.users. Go to Supabase Dashboard → Authentication → Users → Add user and create that email first, then re-run this script.',
      seed_email;
  END IF;

-- ── Profile ───────────────────────────────────────────────────
INSERT INTO profiles (id, email, first_name, last_name, phone, member_since)
VALUES (
  uid,
  seed_email,
  'Alex',
  'Johnson',
  '(555) 867-5309',
  '2019-03-15'
)
ON CONFLICT (id) DO UPDATE
  SET first_name   = EXCLUDED.first_name,
      last_name    = EXCLUDED.last_name,
      phone        = EXCLUDED.phone,
      member_since = EXCLUDED.member_since;


-- ── Accounts ─────────────────────────────────────────────────
-- Delete existing demo accounts first so re-running is safe
DELETE FROM accounts WHERE user_id = uid;

INSERT INTO accounts (user_id, account_type, account_name, account_number_last4,
                      balance, available_balance, interest_rate, status)
VALUES
  (uid, 'checking',    'FSCB Free Checking',   '4821',  4821.43,  4821.43, 0.0000, 'active'),
  (uid, 'savings',     'FSCB Regular Savings', '7309', 12540.00, 12540.00, 0.0425, 'active'),
  (uid, 'credit_card', 'FSCB Rewards Card',    '2214',  -342.18,  4657.82, 0.2199, 'active');

-- Capture the individual IDs for transaction inserts
SELECT id INTO chk_id FROM accounts WHERE user_id = uid AND account_type = 'checking'    LIMIT 1;
SELECT id INTO sav_id FROM accounts WHERE user_id = uid AND account_type = 'savings'      LIMIT 1;
SELECT id INTO cc_id  FROM accounts WHERE user_id = uid AND account_type = 'credit_card'  LIMIT 1;

-- ── Transactions ──────────────────────────────────────────────
DELETE FROM transactions WHERE user_id = uid;

INSERT INTO transactions (account_id, user_id, merchant, category, amount, transaction_type, posted_at)
VALUES
  -- checking account
  (chk_id, uid, 'Whole Foods Market',        'Groceries',     -87.43,   'debit',    NOW() - INTERVAL '1 day'),
  (chk_id, uid, 'Direct Deposit — Employer', 'Income',       +2350.00,  'credit',   NOW() - INTERVAL '1 day'),
  (chk_id, uid, 'Shell Gas Station',         'Auto & Gas',    -45.20,   'debit',    NOW() - INTERVAL '2 days'),
  (chk_id, uid, 'Netflix',                   'Entertainment', -15.99,   'debit',    NOW() - INTERVAL '3 days'),
  (chk_id, uid, 'FSCB Savings Transfer',     'Transfer',     -500.00,   'transfer', NOW() - INTERVAL '3 days'),
  (chk_id, uid, 'Chipotle Mexican Grill',    'Dining',        -14.75,   'debit',    NOW() - INTERVAL '4 days'),
  (chk_id, uid, 'Amazon.com',                'Shopping',      -63.18,   'debit',    NOW() - INTERVAL '5 days'),
  (chk_id, uid, 'ACH — Rent Payment',        'Housing',     -1200.00,   'payment',  NOW() - INTERVAL '6 days'),
  -- savings account (transfer in)
  (sav_id, uid, 'FSCB Checking Transfer',    'Transfer',     +500.00,   'transfer', NOW() - INTERVAL '3 days');


-- ── Budgets (current month) ────────────────────────────────────
INSERT INTO budgets (user_id, category, amount, month, year)
VALUES
  (uid, 'Housing',       1400.00, EXTRACT(MONTH FROM NOW())::SMALLINT, EXTRACT(YEAR FROM NOW())::SMALLINT),
  (uid, 'Groceries',      400.00, EXTRACT(MONTH FROM NOW())::SMALLINT, EXTRACT(YEAR FROM NOW())::SMALLINT),
  (uid, 'Dining',         200.00, EXTRACT(MONTH FROM NOW())::SMALLINT, EXTRACT(YEAR FROM NOW())::SMALLINT),
  (uid, 'Shopping',       250.00, EXTRACT(MONTH FROM NOW())::SMALLINT, EXTRACT(YEAR FROM NOW())::SMALLINT),
  (uid, 'Auto & Gas',     150.00, EXTRACT(MONTH FROM NOW())::SMALLINT, EXTRACT(YEAR FROM NOW())::SMALLINT),
  (uid, 'Entertainment',   80.00, EXTRACT(MONTH FROM NOW())::SMALLINT, EXTRACT(YEAR FROM NOW())::SMALLINT)
ON CONFLICT (user_id, category, month, year) DO NOTHING;


-- ── Notifications ─────────────────────────────────────────────
DELETE FROM notifications WHERE user_id = uid;

INSERT INTO notifications (user_id, type, title, message, action_url)
VALUES
  (uid, 'success', 'Direct deposit received',  'Your payroll deposit of $2,350.00 has been posted.', NULL),
  (uid, 'warning', 'Shopping budget at 79%',   'You''ve spent $198 of your $250 Shopping budget this month.', NULL),
  (uid, 'info',    'Statement ready',           'Your June statement is ready to view.', '/dashboard');

END $$;
