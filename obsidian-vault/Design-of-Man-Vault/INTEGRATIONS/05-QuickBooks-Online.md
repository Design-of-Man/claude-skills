---
type: integration
status: live
tags: [design-of-man, integration]
updated: 2026-08-18
---

# QuickBooks Online — Financial Data

QBO is the system of record for money. Invoicing, payroll, and receivables all live here,
and [[../BUSINESS/01-Financials]] reads from it rather than maintaining a parallel set of
numbers.

**Layer**: Business
**Status**: Live
**Access**: Nick and Cam only — see the access note below
**Feeds**: [[../BUSINESS/01-Financials]], [[../DASHBOARD/01-Live-Metrics]]

---

## What Comes Out of It

| Area | What we use | Cadence |
|---|---|---|
| **Invoicing** | Create, send, and track invoices; recurring invoices for monthly site management; payment links | Monthly billing run, ad hoc for builds |
| **Receivables (AR)** | AR aging summary and detail — who owes what and how late | Weekly glance, monthly follow-up |
| **Payables (AP)** | AP aging — recurring subscriptions and vendor costs | Monthly, feeds [[../BUSINESS/03-Expenses]] |
| **Payroll** | Employee records, pay schedules, payslips, payroll readiness | Per pay period |
| **Reporting** | P&L, balance sheet, sales by customer | Monthly and quarterly ([[../BUSINESS/Quarterly/Q3-2026-Review]]) |
| **Customers** | Customer records matched to vault client notes | On new client onboarding |

**Sales by customer** is the one report that does double duty: it is the finance number *and*
the honest answer to "which clients are actually worth the hours," which feeds
[[../BUSINESS/06-Capacity-Planning]].

---

## Read vs. Write

This distinction matters more here than anywhere else in the stack, because QBO writes are
externally visible and hard to undo.

| Operation | Who |
|---|---|
| Read reports (P&L, AR/AP aging, sales summaries, payroll details) | Agents may read freely |
| Draft an invoice or estimate | Agent may prepare |
| **Send** an invoice, estimate, reminder, or payment link | **Human only** |
| Create or modify recurring invoices | **Human only** |
| Anything payroll-writing (employee records, compensation, contracts) | **Human only** |
| Delete an invoice or estimate | **Human only** |

An automated invoice sent to the wrong client, at the wrong amount, is a client-relationship
event, not a data-entry mistake. There is no urgency in billing that justifies removing the
human step.

---

## The Monthly Rhythm

1. **Early month** — invoice run for monthly site management (recurring invoices do most of
   this), plus any build milestones that landed.
2. **Mid month** — AR aging check. Anything past 30 days gets a reminder; anything past 60
   gets a conversation, not another reminder.
3. **Month end** — pull P&L and sales-by-customer into [[../BUSINESS/01-Financials]];
   reconcile subscription costs against [[../BUSINESS/03-Expenses]].
4. **Quarter end** — the numbers roll up into the quarterly review.

Dollar figures live in QBO and in the business notes, not in this integration note.

---

## Access and Sensitivity

QBO carries payroll and full revenue detail. Per the vault's security notes, access is
restricted to Nick and Cam. Client-facing reports never include agency P&L data — a client
report contains that client's numbers only.

Credentials follow the standard rule: OAuth connection, nothing stored in this vault. See
`Credentials/README-DO-NOT-SYNC-PLAINTEXT.md`.

---

## Failure Modes

| Symptom | Cause | Response |
|---|---|---|
| QBO unavailable | Intuit incident | Low urgency. Billing slips a day; nothing client-visible. |
| Numbers disagree with the vault | Vault note is stale | QBO is authoritative. Correct the vault, never the other way. |
| Duplicate customer records | Client onboarded twice under slightly different names | Search customers before creating; match the vault client note name exactly |
| Invoice sent twice | Recurring invoice plus a manual one for the same period | Check recurring invoice schedule before manual billing |

---

## Related

- [[../BUSINESS/01-Financials]] — the primary consumer
- [[../BUSINESS/03-Expenses]] — recurring subscription costs
- [[../BUSINESS/04-KPIs]]
- [[../DASHBOARD/01-Live-Metrics]]
- [[00-Integration-Overview]]
