"use client";

import { useState } from "react";
import IntegrationActivity, { type IntegrationEvent } from "./components/IntegrationActivity";
import PaymentForm from "./components/PaymentForm";
import PaymentSummary from "./components/PaymentSummary";
import WebhookSimulator from "./components/WebhookSimulator";
import type { PaymentDetails, PaymentStatus } from "./components/payment-types";

type ApiPayment = { transactionId: string; status: "PROCESSING" | "SUCCEEDED" | "FAILED"; amount: number; currency: string };
const initialPayment: PaymentDetails = { customerName: "", customerEmail: "", amount: "", currency: "", demoResult: "processing" };
const statusMap: Record<ApiPayment["status"], PaymentStatus> = { PROCESSING: "processing", SUCCEEDED: "success", FAILED: "failed" };

export default function Home() {
  const [payment, setPayment] = useState<PaymentDetails>(initialPayment);
  const [status, setStatus] = useState<PaymentStatus>("not-started");
  const [transactionId, setTransactionId] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [events, setEvents] = useState<IntegrationEvent[]>([]);

  async function getResponse(response: Response) {
    const data = await response.json() as ApiPayment & { message?: string };
    if (!response.ok) throw new Error(data.message || "The mock payment gateway could not process your request.");
    return data;
  }

  async function refreshStatus() {
    if (!transactionId) return;
    setIsRefreshing(true);
    setErrorMessage(undefined);
    try {
      const latest = await getResponse(await fetch(`/api/payments/status?id=${encodeURIComponent(transactionId)}`));
      setStatus(statusMap[latest.status]);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unable to retrieve payment status.");
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setStatus("processing");
    setErrorMessage(undefined);
    setTransactionId(undefined);
    try {
      const created = await getResponse(await fetch("/api/payments/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payment, amount: Number(payment.amount) }) }));
      setTransactionId(created.transactionId);
      setStatus(statusMap[created.status]);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleWebhookSent(event: IntegrationEvent) {
    setEvents((currentEvents) => [event, ...currentEvents]);
    void refreshStatus();
  }

  return <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:py-16"><div className="mx-auto max-w-5xl"><div className="mb-8 max-w-2xl lg:mb-10"><p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">Integration demo</p><h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Payment Gateway POC</h1><p className="mt-3 text-base leading-7 text-slate-600">Test payment integration using a secure payment gateway.</p></div><div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)] lg:gap-8"><div><PaymentForm payment={payment} onChange={setPayment} onSubmit={handleSubmit} isProcessing={isSubmitting} errorMessage={errorMessage} />{transactionId && <WebhookSimulator key={transactionId} transactionId={transactionId} onWebhookSent={handleWebhookSent} onRefreshStatus={refreshStatus} isRefreshing={isRefreshing} />}</div><PaymentSummary payment={payment} status={status} transactionId={transactionId} /></div><IntegrationActivity events={events} /></div></main>;
}
