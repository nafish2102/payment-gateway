import type { PaymentStatus as PaymentStatusType } from "./payment-types";

type PaymentStatusProps = { status: PaymentStatusType };

const statusContent: Record<PaymentStatusType, { label: string; description: string; className: string }> = {
  "not-started": { label: "Not Started", description: "Ready for a test payment.", className: "border-slate-200 bg-slate-50 text-slate-700" },
  processing: { label: "Processing", description: "Your test payment is being prepared.", className: "border-blue-200 bg-blue-50 text-blue-700" },
  success: { label: "Success", description: "The demo payment completed successfully.", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  failed: { label: "Failed", description: "The payment could not be completed.", className: "border-amber-200 bg-amber-50 text-amber-700" },
  error: { label: "Error", description: "An unexpected payment error occurred.", className: "border-rose-200 bg-rose-50 text-rose-700" },
};

export default function PaymentStatus({ status }: PaymentStatusProps) {
  const content = statusContent[status];
  return <div className={`rounded-xl border px-4 py-3 ${content.className}`} aria-live="polite"><div className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full bg-current ${status === "processing" ? "animate-pulse" : ""}`} aria-hidden="true" /><p className="text-sm font-semibold">{content.label}</p></div><p className="mt-1 text-sm opacity-80">{content.description}</p></div>;
}
