"use client";

import { type FormEvent, useState } from "react";
import type { PaymentDetails } from "./payment-types";

type FormErrors = Partial<Record<keyof PaymentDetails, string>>;
type PaymentFormProps = {
  payment: PaymentDetails;
  isProcessing: boolean;
  errorMessage?: string;
  onChange: (payment: PaymentDetails) => void;
  onSubmit: () => void;
};

export default function PaymentForm({ payment, isProcessing, errorMessage, onChange, onSubmit }: PaymentFormProps) {
  const [errors, setErrors] = useState<FormErrors>({});
  const inputClass = (hasError: boolean) => `mt-2 block w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 ${hasError ? "border-rose-400" : "border-slate-300"}`;

  function updateField(field: keyof PaymentDetails, value: string) {
    onChange({ ...payment, [field]: value });
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FormErrors = {};
    if (!payment.customerName.trim()) nextErrors.customerName = "Customer name is required.";
    if (!/^\S+@\S+\.\S+$/.test(payment.customerEmail)) nextErrors.customerEmail = "Enter a valid email address.";
    if (!payment.amount || Number(payment.amount) <= 0) nextErrors.amount = "Enter an amount greater than 0.";
    if (!payment.currency) nextErrors.currency = "Select a currency.";
    if (!payment.demoResult) nextErrors.demoResult = "Select a demo payment result.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <div><h2 className="font-semibold text-slate-950">Payment details</h2><p className="mt-1 text-sm text-slate-500">Enter the customer and transaction information below.</p></div>
      <div className="mt-7 space-y-5">
        <Field label="Customer name" error={errors.customerName} htmlFor="customerName"><input id="customerName" type="text" autoComplete="name" value={payment.customerName} onChange={(e) => updateField("customerName", e.target.value)} aria-invalid={Boolean(errors.customerName)} className={inputClass(Boolean(errors.customerName))} placeholder="Alex Morgan" disabled={isProcessing} /></Field>
        <Field label="Customer email" error={errors.customerEmail} htmlFor="customerEmail"><input id="customerEmail" type="email" autoComplete="email" value={payment.customerEmail} onChange={(e) => updateField("customerEmail", e.target.value)} aria-invalid={Boolean(errors.customerEmail)} className={inputClass(Boolean(errors.customerEmail))} placeholder="alex@company.com" disabled={isProcessing} /></Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Amount" error={errors.amount} htmlFor="amount"><input id="amount" type="number" inputMode="decimal" min="0.01" step="0.01" value={payment.amount} onChange={(e) => updateField("amount", e.target.value)} aria-invalid={Boolean(errors.amount)} className={inputClass(Boolean(errors.amount))} placeholder="0.00" disabled={isProcessing} /></Field>
          <Field label="Currency" error={errors.currency} htmlFor="currency"><select id="currency" value={payment.currency} onChange={(e) => updateField("currency", e.target.value)} aria-invalid={Boolean(errors.currency)} className={inputClass(Boolean(errors.currency))} disabled={isProcessing}><option value="">Select currency</option><option value="USD">USD — US Dollar</option><option value="EUR">EUR — Euro</option><option value="GBP">GBP — British Pound</option><option value="INR">INR — Indian Rupee</option></select></Field>
        </div>
        <Field label="Demo Payment Result" error={errors.demoResult} htmlFor="demoResult"><select id="demoResult" value={payment.demoResult} onChange={(e) => updateField("demoResult", e.target.value)} aria-invalid={Boolean(errors.demoResult)} className={inputClass(Boolean(errors.demoResult))} disabled={isProcessing}><option value="success">Success</option><option value="failed">Failed</option><option value="processing">Processing</option></select><p className="mt-1.5 text-xs text-slate-500">Local test input retained from Phase 2. In this webhook demo, final status is set by the Webhook Simulator.</p></Field>
      </div>
      {errorMessage && <p role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</p>}
      <button type="submit" disabled={isProcessing} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:cursor-not-allowed disabled:bg-slate-400">{isProcessing && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}{isProcessing ? "Processing payment…" : "Pay securely"}</button>
      <p className="mt-4 text-center text-xs leading-5 text-slate-500">Local mock gateway only. No payment data is sent to a real payment provider.</p>
    </form>
  );
}

function Field({ children, error, htmlFor, label }: { children: React.ReactNode; error?: string; htmlFor: string; label: string }) {
  return <div><label htmlFor={htmlFor} className="text-sm font-medium text-slate-700">{label}</label>{children}{error && <p id={`${htmlFor}-error`} className="mt-1.5 text-sm text-rose-600">{error}</p>}</div>;
}
