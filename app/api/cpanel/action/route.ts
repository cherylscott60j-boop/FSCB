import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { CREDIT } from "@/lib/bankConstants";
import { logAction } from "@/lib/audit";

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if ((profile as Record<string, string> | null)?.role !== "admin") return null;
  return user;
}

export async function POST(request: Request) {
  const admin_user = await verifyAdmin();
  if (!admin_user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { action } = body;
  const admin = createAdminClient();

  if (action === "freezeToggle") {
    const { acctId, nowFrozen } = body;
    const { error } = await admin.from("accounts").update({ status: nowFrozen ? "frozen" : "active" }).eq("id", acctId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    logAction({ adminId: admin_user.id, adminEmail: admin_user.email ?? "", action: nowFrozen ? "account.freeze" : "account.unfreeze", entityType: "account", entityId: acctId, details: { acctId } });
    return NextResponse.json({ success: true });
  }

  if (action === "rejectApplication") {
    const { applicationId } = body;
    const { error } = await admin.from("applications").update({ status: "rejected" }).eq("id", applicationId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    logAction({ adminId: admin_user.id, adminEmail: admin_user.email ?? "", action: "application.reject", entityType: "application", entityId: applicationId });
    return NextResponse.json({ success: true });
  }

  if (action === "approveTransaction") {
    const { txId, accountId, amount, date } = body;

    const { data: tx, error: fetchErr } = await admin
      .from("transactions")
      .select("transaction_type, user_id, submitted_at")
      .eq("id", txId)
      .single();
    if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 500 });

    const { error: txErr } = await admin.from("transactions").update({ status: "posted", posted_at: date }).eq("id", txId);
    if (txErr) return NextResponse.json({ error: txErr.message }, { status: 500 });

    const { data: acct } = await admin.from("accounts").select("balance, account_type, credit_limit").eq("id", accountId).single();
    if (acct) {
      const a = acct as Record<string, unknown>;
      const newBal = Number(a.balance) + amount;
      const updates: Record<string, unknown> = { balance: newBal };
      if (a.account_type === "credit_card") {
        updates.available_balance = Number(a.credit_limit) + newBal;
      }
      await admin.from("accounts").update(updates).eq("id", accountId);
    }

    // Auto-approve the paired credit/debit for internal transfers
    let pairedTxId: string | null = null;
    const txRecord = tx as Record<string, unknown>;
    if (txRecord.transaction_type === "transfer") {
      const { data: pair } = await admin
        .from("transactions")
        .select("id, account_id, amount")
        .eq("user_id", txRecord.user_id as string)
        .eq("submitted_at", txRecord.submitted_at as string)
        .eq("transaction_type", "transfer")
        .eq("status", "pending")
        .neq("id", txId)
        .maybeSingle();
      if (pair) {
        const p = pair as { id: string; account_id: string; amount: number };
        await admin.from("transactions").update({ status: "posted", posted_at: date }).eq("id", p.id);
        const { data: pAcct } = await admin.from("accounts").select("balance").eq("id", p.account_id).single();
        if (pAcct) {
          await admin.from("accounts")
            .update({ balance: (pAcct as Record<string, number>).balance + p.amount })
            .eq("id", p.account_id);
        }
        pairedTxId = p.id;
      }
    }

    logAction({ adminId: admin_user.id, adminEmail: admin_user.email ?? "", action: "transaction.approve", entityType: "transaction", entityId: txId, details: { accountId, amount, date, pairedTxId } });
    return NextResponse.json({ success: true, pairedTxId });
  }

  if (action === "rejectTransaction") {
    const { txId } = body;

    const { data: tx } = await admin
      .from("transactions")
      .select("transaction_type, user_id, submitted_at")
      .eq("id", txId)
      .single();

    const { error } = await admin.from("transactions").update({ status: "rejected" }).eq("id", txId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Auto-reject the paired credit/debit for internal transfers
    let pairedTxId: string | null = null;
    if (tx) {
      const txRecord = tx as Record<string, unknown>;
      if (txRecord.transaction_type === "transfer") {
        const { data: pair } = await admin
          .from("transactions")
          .select("id")
          .eq("user_id", txRecord.user_id as string)
          .eq("submitted_at", txRecord.submitted_at as string)
          .eq("transaction_type", "transfer")
          .eq("status", "pending")
          .neq("id", txId)
          .maybeSingle();
        if (pair) {
          await admin.from("transactions").update({ status: "rejected" }).eq("id", (pair as { id: string }).id);
          pairedTxId = (pair as { id: string }).id;
        }
      }
    }

    logAction({ adminId: admin_user.id, adminEmail: admin_user.email ?? "", action: "transaction.reject", entityType: "transaction", entityId: txId, details: { pairedTxId } });
    return NextResponse.json({ success: true, pairedTxId });
  }

  if (action === "manualTransaction") {
    const { accountId, userId, amount, merchant, category, date } = body;
    const { error: txErr } = await admin.from("transactions").insert({
      account_id:       accountId,
      user_id:          userId,
      merchant,
      category,
      amount,
      transaction_type: amount >= 0 ? "credit" : "debit",
      status:           "posted",
      posted_at:        date,
    });
    if (txErr) return NextResponse.json({ error: txErr.message }, { status: 500 });
    const { data: acct } = await admin.from("accounts").select("balance, account_type, credit_limit").eq("id", accountId).single();
    if (acct) {
      const a = acct as Record<string, unknown>;
      const newBal = Number(a.balance) + amount;
      const updates: Record<string, unknown> = { balance: newBal };
      if (a.account_type === "credit_card") {
        updates.available_balance = Number(a.credit_limit) + newBal;
      }
      await admin.from("accounts").update(updates).eq("id", accountId);
    }
    logAction({ adminId: admin_user.id, adminEmail: admin_user.email ?? "", action: "transaction.manual_post", entityType: "transaction", entityId: accountId, details: { amount, merchant, category, date, userId } });
    return NextResponse.json({ success: true });
  }

  if (action === "kycUpdate") {
    const { userId, kycStatus } = body;
    const { error } = await admin.from("profiles").update({ kyc_status: kycStatus, kyc_updated_at: new Date().toISOString() }).eq("id", userId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    logAction({ adminId: admin_user.id, adminEmail: admin_user.email ?? "", action: "kyc.update", entityType: "kyc", entityId: userId, details: { newStatus: kycStatus } });
    return NextResponse.json({ success: true });
  }

  if (action === "setCreditLimit") {
    const { acctId, limit } = body;
    const limitNum = Number(limit);
    if (!Number.isFinite(limitNum) || limitNum < 0)
      return NextResponse.json({ error: "Invalid limit amount." }, { status: 400 });
    if (limitNum > CREDIT.maxLimit)
      return NextResponse.json({ error: `Limit cannot exceed ${new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(CREDIT.maxLimit)}.` }, { status: 400 });
    const { data: acct } = await admin.from("accounts").select("balance, account_type, credit_limit").eq("id", acctId).single();
    if (!acct || (acct as Record<string,unknown>).account_type !== "credit_card")
      return NextResponse.json({ error: "Account not found or not a credit card." }, { status: 400 });
    const balance = Number((acct as Record<string,number>).balance);
    const outstanding = balance < 0 ? Math.abs(balance) : 0;
    if (limitNum < outstanding)
      return NextResponse.json({ error: `Limit cannot be less than the outstanding balance of ${new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(outstanding)}.` }, { status: 400 });
    const { error } = await admin.from("accounts").update({ credit_limit: limitNum, available_balance: limitNum + balance }).eq("id", acctId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    logAction({ adminId: admin_user.id, adminEmail: admin_user.email ?? "", action: "account.credit_limit_set", entityType: "account", entityId: acctId, details: { oldLimit: Number((acct as Record<string,number>).credit_limit), newLimit: limitNum } });
    return NextResponse.json({ success: true });
  }

  /* ── Disputes ── */
  if (action === "openDispute") {
    const { userId, accountId, transactionId, disputeType, amount, merchant, description } = body;
    const refId = "DSP-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    const { error } = await admin.from("disputes").insert({
      user_id:        userId,
      account_id:     accountId,
      transaction_id: transactionId || null,
      reference_id:   refId,
      dispute_type:   disputeType,
      amount:         Number(amount),
      merchant:       String(merchant),
      description:    String(description),
      status:         "open",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    logAction({ adminId: admin_user.id, adminEmail: admin_user.email ?? "", action: "dispute.open", entityType: "dispute", entityId: refId, details: { disputeType, amount, merchant, userId, accountId } });
    return NextResponse.json({ success: true, refId });
  }

  if (action === "approveDispute") {
    const { disputeId, accountId, userId, amount, merchant } = body;
    const now = new Date().toISOString();

    // Post credit transaction
    const { data: txData, error: txErr } = await admin.from("transactions").insert({
      account_id:       accountId,
      user_id:          userId,
      merchant:         `Dispute Credit — ${merchant}`,
      category:         "Refund",
      amount:           Math.abs(Number(amount)),
      transaction_type: "credit",
      status:           "posted",
      posted_at:        now,
    }).select("id").single();
    if (txErr) return NextResponse.json({ error: txErr.message }, { status: 500 });

    // Update account balance
    const { data: acct } = await admin.from("accounts").select("balance, account_type, credit_limit").eq("id", accountId).single();
    if (acct) {
      const a = acct as Record<string, unknown>;
      const newBal = Number(a.balance) + Math.abs(Number(amount));
      const updates: Record<string, unknown> = { balance: newBal };
      if (a.account_type === "credit_card") updates.available_balance = Number(a.credit_limit) + newBal;
      await admin.from("accounts").update(updates).eq("id", accountId);
    }

    // Resolve dispute
    const creditTxId = (txData as Record<string, string>).id;
    const { error: dErr } = await admin.from("disputes").update({
      status:       "approved",
      credit_tx_id: creditTxId,
      resolved_at:  now,
      resolved_by:  admin_user.id,
    }).eq("id", disputeId);
    if (dErr) return NextResponse.json({ error: dErr.message }, { status: 500 });

    logAction({ adminId: admin_user.id, adminEmail: admin_user.email ?? "", action: "dispute.approve", entityType: "dispute", entityId: disputeId, details: { amount, merchant, accountId, creditTxId } });
    return NextResponse.json({ success: true, creditTxId, newBalance: acct ? Number((acct as Record<string,number>).balance) + Math.abs(Number(amount)) : null });
  }

  if (action === "denyDispute") {
    const { disputeId, adminNotes } = body;
    const { error } = await admin.from("disputes").update({
      status:      "denied",
      admin_notes: adminNotes || null,
      resolved_at: new Date().toISOString(),
      resolved_by: admin_user.id,
    }).eq("id", disputeId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    logAction({ adminId: admin_user.id, adminEmail: admin_user.email ?? "", action: "dispute.deny", entityType: "dispute", entityId: disputeId, details: { adminNotes } });
    return NextResponse.json({ success: true });
  }

  if (action === "requestDisputeInfo") {
    const { disputeId, adminNotes } = body;
    const { error } = await admin.from("disputes").update({
      status:      "more_info_needed",
      admin_notes: adminNotes || null,
    }).eq("id", disputeId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    logAction({ adminId: admin_user.id, adminEmail: admin_user.email ?? "", action: "dispute.request_info", entityType: "dispute", entityId: disputeId, details: { adminNotes } });
    return NextResponse.json({ success: true });
  }

  if (action === "reviewDispute") {
    const { disputeId } = body;
    const { error } = await admin.from("disputes").update({ status: "under_review" }).eq("id", disputeId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    logAction({ adminId: admin_user.id, adminEmail: admin_user.email ?? "", action: "dispute.mark_review", entityType: "dispute", entityId: disputeId });
    return NextResponse.json({ success: true });
  }

  if (action === "dismissFraudAlert") {
    const { alertId } = body;
    const { error } = await admin
      .from("fraud_alerts")
      .update({ status: "dismissed", reviewed_at: new Date().toISOString(), reviewed_by: admin_user.id })
      .eq("id", alertId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    logAction({ adminId: admin_user.id, adminEmail: admin_user.email ?? "", action: "fraud.alert_dismiss", entityType: "fraud", entityId: alertId });
    return NextResponse.json({ success: true });
  }

  if (action === "freezeFromFraud") {
    const { alertId, acctId } = body;
    const [{ error: freezeErr }, { error: alertErr }] = await Promise.all([
      admin.from("accounts").update({ status: "frozen" }).eq("id", acctId),
      admin.from("fraud_alerts").update({ status: "actioned", reviewed_at: new Date().toISOString(), reviewed_by: admin_user.id }).eq("id", alertId),
    ]);
    if (freezeErr) return NextResponse.json({ error: freezeErr.message }, { status: 500 });
    if (alertErr)  return NextResponse.json({ error: alertErr.message  }, { status: 500 });
    logAction({ adminId: admin_user.id, adminEmail: admin_user.email ?? "", action: "fraud.account_freeze", entityType: "fraud", entityId: alertId, details: { acctId } });
    return NextResponse.json({ success: true });
  }

  /* ── Rates & Fees ── */
  if (action === "updateRate") {
    const { key, value } = body;
    const v = Number(value);
    if (!Number.isFinite(v) || v < 0 || v > 100)
      return NextResponse.json({ error: "Rate must be between 0 and 100." }, { status: 400 });
    const { error } = await admin.from("rate_config").update({ value: v, updated_at: new Date().toISOString(), updated_by: admin_user.email }).eq("key", key);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    logAction({ adminId: admin_user.id, adminEmail: admin_user.email ?? "", action: "rate.update", entityType: "rate_config", entityId: key, details: { value: v } });
    return NextResponse.json({ success: true });
  }

  if (action === "updateFee") {
    const { key, amount } = body;
    const a = Number(amount);
    if (!Number.isFinite(a) || a < 0)
      return NextResponse.json({ error: "Fee amount must be 0 or greater." }, { status: 400 });
    const { error } = await admin.from("fee_schedule").update({ amount: a, updated_at: new Date().toISOString(), updated_by: admin_user.email }).eq("key", key);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    logAction({ adminId: admin_user.id, adminEmail: admin_user.email ?? "", action: "fee.update", entityType: "fee_schedule", entityId: key, details: { amount: a } });
    return NextResponse.json({ success: true });
  }

  if (action === "applyFee") {
    const { accountId, userId, amount, feeLabel } = body;
    const feeAmount = -Math.abs(Number(amount));
    if (!Number.isFinite(feeAmount) || feeAmount === 0)
      return NextResponse.json({ error: "Invalid fee amount." }, { status: 400 });
    const { error: txErr } = await admin.from("transactions").insert({
      account_id:       accountId,
      user_id:          userId,
      merchant:         `Fee — ${feeLabel}`,
      category:         "Fee",
      amount:           feeAmount,
      transaction_type: "debit",
      status:           "posted",
      posted_at:        new Date().toISOString(),
    });
    if (txErr) return NextResponse.json({ error: txErr.message }, { status: 500 });
    const { data: acct } = await admin.from("accounts").select("balance, account_type, credit_limit").eq("id", accountId).single();
    if (acct) {
      const a = acct as Record<string, unknown>;
      const newBal = Number(a.balance) + feeAmount;
      const updates: Record<string, unknown> = { balance: newBal };
      if (a.account_type === "credit_card") updates.available_balance = Number(a.credit_limit) + newBal;
      await admin.from("accounts").update(updates).eq("id", accountId);
    }
    logAction({ adminId: admin_user.id, adminEmail: admin_user.email ?? "", action: "fee.apply", entityType: "account", entityId: accountId, details: { amount: feeAmount, feeLabel } });
    return NextResponse.json({ success: true });
  }

  if (action === "applyInterest") {
    const { accountId, userId, amount, rateLabel } = body;
    const intAmount = Math.abs(Number(amount));
    if (!Number.isFinite(intAmount) || intAmount <= 0)
      return NextResponse.json({ error: "Invalid interest amount." }, { status: 400 });
    const { error: txErr } = await admin.from("transactions").insert({
      account_id:       accountId,
      user_id:          userId,
      merchant:         `Interest — ${rateLabel}`,
      category:         "Interest",
      amount:           intAmount,
      transaction_type: "credit",
      status:           "posted",
      posted_at:        new Date().toISOString(),
    });
    if (txErr) return NextResponse.json({ error: txErr.message }, { status: 500 });
    const { data: acct } = await admin.from("accounts").select("balance").eq("id", accountId).single();
    if (acct) {
      await admin.from("accounts").update({ balance: Number((acct as Record<string, number>).balance) + intAmount }).eq("id", accountId);
    }
    logAction({ adminId: admin_user.id, adminEmail: admin_user.email ?? "", action: "interest.apply", entityType: "account", entityId: accountId, details: { amount: intAmount, rateLabel } });
    return NextResponse.json({ success: true });
  }

  /* ── Compliance ── */
  if (action === "fileSAR") {
    const { userId, accountId, transactionId, subjectName, amount, description } = body;
    if (!subjectName?.trim() || !description?.trim())
      return NextResponse.json({ error: "Subject name and description are required." }, { status: 400 });
    const refId = "SAR-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    const { error } = await admin.from("compliance_reports").insert({
      report_type: "SAR", reference_id: refId,
      user_id: userId || null, account_id: accountId || null, transaction_id: transactionId || null,
      subject_name: String(subjectName).trim(), amount: amount ? Number(amount) : null,
      description: String(description).trim(), status: "draft",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    logAction({ adminId: admin_user.id, adminEmail: admin_user.email ?? "", action: "compliance.sar_file", entityType: "compliance", entityId: refId, details: { subjectName, amount: amount || null } });
    return NextResponse.json({ success: true, refId });
  }

  if (action === "fileCTR") {
    const { userId, accountId, transactionId, subjectName, amount, description } = body;
    if (!subjectName?.trim() || !description?.trim())
      return NextResponse.json({ error: "Subject name and description are required." }, { status: 400 });
    const refId = "CTR-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    const now = new Date().toISOString();
    const { error } = await admin.from("compliance_reports").insert({
      report_type: "CTR", reference_id: refId,
      user_id: userId || null, account_id: accountId || null, transaction_id: transactionId || null,
      subject_name: String(subjectName).trim(), amount: amount ? Number(amount) : null,
      description: String(description).trim(), status: "filed",
      filed_at: now, filed_by: admin_user.email,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    logAction({ adminId: admin_user.id, adminEmail: admin_user.email ?? "", action: "compliance.ctr_file", entityType: "compliance", entityId: refId, details: { subjectName, amount: amount || null, transactionId: transactionId || null } });
    return NextResponse.json({ success: true, refId });
  }

  if (action === "updateComplianceStatus") {
    const { reportId, status } = body;
    const updates: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
    if (status === "filed" || status === "submitted") { updates.filed_at = new Date().toISOString(); updates.filed_by = admin_user.email; }
    const { error } = await admin.from("compliance_reports").update(updates).eq("id", reportId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    logAction({ adminId: admin_user.id, adminEmail: admin_user.email ?? "", action: "compliance.status_update", entityType: "compliance", entityId: reportId, details: { status } });
    return NextResponse.json({ success: true });
  }

  if (action === "updateOfacScreening") {
    const { screeningId, status } = body;
    const { error } = await admin.from("ofac_screenings").update({ status, reviewed_by: admin_user.email, reviewed_at: new Date().toISOString() }).eq("id", screeningId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    logAction({ adminId: admin_user.id, adminEmail: admin_user.email ?? "", action: "compliance.ofac_review", entityType: "compliance", entityId: screeningId, details: { status } });
    return NextResponse.json({ success: true });
  }

  if (action === "unfreezeUser") {
    const { userId, notes } = body;

    // Unfreeze all accounts that were frozen by the transfer_hold process
    const { error } = await admin
      .from("accounts")
      .update({ status: "active", freeze_reason: null })
      .eq("user_id", userId)
      .eq("freeze_reason", "transfer_hold");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Notify the user that their account is restored
    await admin.from("notifications").insert({
      user_id: userId,
      type: "success",
      title: "Account Restored",
      message: "Your account and pending transactions have been reviewed and restored by our team. Your funds are now fully available.",
    });

    logAction({
      adminId: admin_user.id, adminEmail: admin_user.email ?? "",
      action: "account.unfreeze", entityType: "account", entityId: userId,
      details: { userId, notes: notes || null, reason: "transfer_hold_resolved" },
    });
    return NextResponse.json({ success: true });
  }

  if (action === "syncCreditAvailableBalances") {
    const { data: cards } = await admin
      .from("accounts")
      .select("id, balance, credit_limit, available_balance")
      .eq("account_type", "credit_card")
      .gt("credit_limit", 0);
    if (cards) {
      const stale = (cards as Array<{ id: string; balance: number; credit_limit: number; available_balance: number }>)
        .filter(a => a.available_balance !== a.credit_limit + a.balance);
      await Promise.all(
        stale.map(a => admin.from("accounts").update({ available_balance: a.credit_limit + a.balance }).eq("id", a.id))
      );
    }
    return NextResponse.json({ success: true });
  }

  if (action === "fetchExternalAccounts") {
    const { userId } = body;

    // Saved external accounts (user stored them)
    const { data: saved } = await admin
      .from("external_accounts")
      .select("id, nickname, bank_name, routing_number, account_number, account_type, holder_name")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    // External transfer transactions — bank details live in memo JSON
    const { data: txs } = await admin
      .from("transactions")
      .select("id, memo, posted_at, amount")
      .eq("user_id", userId)
      .not("memo", "is", null)
      .order("posted_at", { ascending: false })
      .limit(200);

    type ExtOption = { id:string; nickname:string|null; bank_name:string|null; routing_number:string; account_number:string; account_type:string; holder_name:string; source:"saved"|"transaction"; posted_at?:string; amount?:number; };
    const seen = new Set<string>();
    const result: ExtOption[] = [];

    for (const a of (saved || []) as Array<{id:string;nickname:string|null;bank_name:string|null;routing_number:string;account_number:string;account_type:string;holder_name:string}>) {
      const key = `${a.routing_number}-${a.account_number}`;
      if (!seen.has(key)) { seen.add(key); result.push({ ...a, source: "saved" }); }
    }

    for (const tx of (txs || []) as Array<{id:string;memo:string;posted_at:string;amount:number}>) {
      try {
        const memo = JSON.parse(tx.memo);
        if (memo.type === "external_transfer" && memo.routingNumber && memo.accountNumber) {
          const key = `${memo.routingNumber}-${memo.accountNumber}`;
          if (!seen.has(key)) {
            seen.add(key);
            result.push({ id:`tx-${tx.id}`, nickname:null, bank_name:memo.bankName||null, routing_number:memo.routingNumber, account_number:memo.accountNumber, account_type:memo.accountType||"checking", holder_name:memo.holderName||"", source:"transaction", posted_at:tx.posted_at, amount:tx.amount });
          }
        }
      } catch { /* skip malformed */ }
    }

    return NextResponse.json({ accounts: result });
  }

  if (action === "manualInternalTransfer") {
    const { userId, fromAccountId, toAccountId, amount, date, memo } = body;
    const parsedAmt = Math.abs(Number(amount));
    if (!Number.isFinite(parsedAmt) || parsedAmt <= 0)
      return NextResponse.json({ error: "Invalid amount." }, { status: 400 });
    if (fromAccountId === toAccountId)
      return NextResponse.json({ error: "From and To accounts must be different." }, { status: 400 });

    const { data: acctNames } = await admin.from("accounts").select("id, account_name").in("id", [fromAccountId, toAccountId]);
    const nameMap = Object.fromEntries(((acctNames as Array<{id:string;account_name:string}>)||[]).map(a=>[a.id,a.account_name]));
    const fromName = nameMap[fromAccountId] || "Account";
    const toName   = nameMap[toAccountId]   || "Account";

    const now = new Date().toISOString();
    const { error: txErr } = await admin.from("transactions").insert([
      { account_id:fromAccountId, user_id:userId, merchant:`Transfer → ${toName}`,   category:"Transfer", amount:-parsedAmt, transaction_type:"transfer", status:"posted", posted_at:date, submitted_at:now, memo:memo||null },
      { account_id:toAccountId,   user_id:userId, merchant:`Transfer ← ${fromName}`, category:"Transfer", amount:+parsedAmt, transaction_type:"transfer", status:"posted", posted_at:date, submitted_at:now, memo:memo||null },
    ]);
    if (txErr) return NextResponse.json({ error: txErr.message }, { status: 500 });

    const [{ data: fromAcct }, { data: toAcct }] = await Promise.all([
      admin.from("accounts").select("balance, account_type, credit_limit").eq("id", fromAccountId).single(),
      admin.from("accounts").select("balance, account_type, credit_limit").eq("id", toAccountId).single(),
    ]);
    if (fromAcct) {
      const a = fromAcct as Record<string,unknown>;
      const nb = Number(a.balance) - parsedAmt;
      const upd: Record<string,unknown> = { balance: nb };
      if (a.account_type === "credit_card") upd.available_balance = Number(a.credit_limit) + nb;
      await admin.from("accounts").update(upd).eq("id", fromAccountId);
    }
    if (toAcct) {
      const a = toAcct as Record<string,unknown>;
      const nb = Number(a.balance) + parsedAmt;
      const upd: Record<string,unknown> = { balance: nb };
      if (a.account_type === "credit_card") upd.available_balance = Number(a.credit_limit) + nb;
      await admin.from("accounts").update(upd).eq("id", toAccountId);
    }

    logAction({ adminId:admin_user.id, adminEmail:admin_user.email??"", action:"transaction.manual_internal_transfer", entityType:"transaction", entityId:fromAccountId, details:{ fromAccountId, toAccountId, amount:parsedAmt, date, userId } });
    return NextResponse.json({ success: true });
  }

  if (action === "manualExternalTransfer") {
    const { userId, accountId, amount, date, bankName, routingNumber, accountNumber, accountType, holderName, note } = body;
    const parsedAmt = Math.abs(Number(amount));
    if (!Number.isFinite(parsedAmt) || parsedAmt <= 0)
      return NextResponse.json({ error: "Invalid amount." }, { status: 400 });

    const memoPayload = JSON.stringify({
      type:"external_transfer", extAccountId:null,
      bankName: bankName||"External Bank", routingNumber, accountNumber,
      accountType: accountType||"checking", holderName, note:note||null,
    });
    const { error: txErr } = await admin.from("transactions").insert({
      account_id:accountId, user_id:userId,
      merchant:`External Transfer → ${bankName||"External Bank"}`,
      category:"Transfer", amount:-parsedAmt, transaction_type:"transfer",
      status:"posted", posted_at:date, submitted_at:new Date().toISOString(),
      memo:memoPayload,
    });
    if (txErr) return NextResponse.json({ error: txErr.message }, { status: 500 });

    const { data: acct } = await admin.from("accounts").select("balance, account_type, credit_limit").eq("id", accountId).single();
    if (acct) {
      const a = acct as Record<string,unknown>;
      const nb = Number(a.balance) - parsedAmt;
      const upd: Record<string,unknown> = { balance: nb };
      if (a.account_type === "credit_card") upd.available_balance = Number(a.credit_limit) + nb;
      await admin.from("accounts").update(upd).eq("id", accountId);
    }

    logAction({ adminId:admin_user.id, adminEmail:admin_user.email??"", action:"transaction.manual_external_transfer", entityType:"transaction", entityId:accountId, details:{ accountId, amount:parsedAmt, date, bankName, holderName, userId } });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
