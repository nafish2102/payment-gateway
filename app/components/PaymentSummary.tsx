import PaymentStatus from "./PaymentStatus";
import type { PaymentDetails, PaymentStatus as PaymentStatusType } from "./payment-types";

type PaymentSummaryProps = { payment: PaymentDetails; status: PaymentStatusType; transactionId?: string };

function formatAmount(amount: string, currency: string) {
  const numericAmount = Number(amount);
  if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency || "USD" }).format(numericAmount);
}

export default function PaymentSummary({ payment, status, transactionId }: PaymentSummaryProps) {
  return <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">PG</div><div><h2 className="font-semibold text-slate-950">Payment summary</h2><p className="text-sm text-slate-500">Live preview of this demo payment</p></div></div><dl className="mt-7 space-y-4 text-sm"><div className="flex items-start justify-between gap-5 border-b border-slate-100 pb-4"><dt className="text-slate-500">Customer</dt><dd className="max-w-48 text-right font-medium text-slate-800">{payment.customerName || "Not provided"}{payment.customerEmail && <span className="mt-0.5 block break-all text-xs font-normal text-slate-500">{payment.customerEmail}</span>}</dd></div><div className="flex items-center justify-between gap-5 border-b border-slate-100 pb-4"><dt className="text-slate-500">Amount</dt><dd className="font-semibold text-slate-950">{formatAmount(payment.amount, payment.currency)}</dd></div><div className="flex items-center justify-between gap-5 border-b border-slate-100 pb-4"><dt className="text-slate-500">Currency</dt><dd className="font-medium text-slate-800">{payment.currency || "Not selected"}</dd></div><div className="flex items-start justify-between gap-5"><dt className="text-slate-500">Transaction ID</dt><dd className="max-w-48 break-all text-right font-mono text-xs font-medium text-slate-800">{transactionId || "Not started"}</dd></div></dl><div className="mt-7"><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Payment status</p><PaymentStatus status={status} /></div></aside>;
}
