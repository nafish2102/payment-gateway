"use client";

import { useState } from "react";
import type { IntegrationEvent } from "./IntegrationActivity";

type WebhookStatus = "SUCCEEDED" | "FAILED";
type WebhookSimulatorProps = { transactionId: string; onWebhookSent: (event: IntegrationEvent) => void; onRefreshStatus: () => void; isRefreshing: boolean };

function createEventId() {
  return `evt-${globalThis.crypto.randomUUID().replaceAll("-", "").slice(0, 12)}`;
}

export default function WebhookSimulator({ transactionId, onWebhookSent, onRefreshStatus, isRefreshing }: WebhookSimulatorProps) {
  const [status, setStatus] = useState<WebhookStatus>("SUCCEEDED");
  const [eventId, setEventId] = useState(createEventId);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  async function sendWebhook() {
    setIsSending(true);
    setErrorMessage(undefined);
    try {
      const response = await fetch("/api/webhooks/payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ eventId, eventType: "payment.status_changed", transactionId, status }) });
      const data = await response.json() as { message?: string; alreadyProcessed: boolean; event: IntegrationEvent };
      if (!response.ok) throw new Error(data.message || "Unable to send the simulated webhook.");
      onWebhookSent({ ...data.event, alreadyProcessed: data.alreadyProcessed });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to send the simulated webhook.");
    } finally {
      setIsSending(false);
    }
  }

  function changeStatus(nextStatus: WebhookStatus) {
    setStatus(nextStatus);
    setEventId(createEventId());
  }

  return <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"><div><h2 className="font-semibold text-slate-950">Webhook Simulator</h2><p className="mt-1 text-sm text-slate-500">Send a local provider callback to update this transaction asynchronously.</p></div><div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm"><p className="text-slate-500">Transaction ID</p><p className="mt-1 break-all font-mono text-xs font-semibold text-slate-800">{transactionId}</p></div><label htmlFor="webhookStatus" className="mt-5 block text-sm font-medium text-slate-700">Webhook Status</label><select id="webhookStatus" value={status} onChange={(event) => changeStatus(event.target.value as WebhookStatus)} disabled={isSending} className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50"><option value="SUCCEEDED">SUCCEEDED</option><option value="FAILED">FAILED</option></select><p className="mt-3 text-xs text-slate-500">Event ID: <span className="font-mono text-slate-700">{eventId}</span></p>{errorMessage && <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</p>}<div className="mt-5 grid gap-3 sm:grid-cols-2"><button type="button" onClick={sendWebhook} disabled={isSending} className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:bg-slate-400">{isSending ? "Sending webhook…" : "Send Webhook"}</button><button type="button" onClick={onRefreshStatus} disabled={isRefreshing} className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:bg-slate-100">{isRefreshing ? "Refreshing…" : "Refresh Status"}</button></div><p className="mt-4 text-xs leading-5 text-slate-500">Send the same event twice to demonstrate idempotency. Change the status to generate a new event ID.</p></section>;
}
