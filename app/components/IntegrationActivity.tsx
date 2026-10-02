"use client";

export type IntegrationEvent = {
  eventId: string;
  eventType: string;
  transactionId: string;
  status: string;
  receivedAt: string;
  alreadyProcessed: boolean;
};

export default function IntegrationActivity({ events }: { events: IntegrationEvent[] }) {
  return <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"><div><h2 className="font-semibold text-slate-950">Integration activity</h2><p className="mt-1 text-sm text-slate-500">Webhook events received by this local mock backend.</p></div>{events.length === 0 ? <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">No webhook events received yet.</p> : <div className="mt-5 space-y-3">{events.map((event) => <div key={`${event.eventId}-${event.receivedAt}`} className="rounded-xl border border-slate-200 p-4 text-sm"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-mono text-xs font-semibold text-slate-800">{event.eventId}</p><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${event.alreadyProcessed ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{event.alreadyProcessed ? "Duplicate ignored" : "Received"}</span></div><dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2"><div><dt className="text-slate-500">Event type</dt><dd className="mt-0.5 font-medium text-slate-700">{event.eventType}</dd></div><div><dt className="text-slate-500">Status</dt><dd className="mt-0.5 font-medium text-slate-700">{event.status}</dd></div><div><dt className="text-slate-500">Transaction ID</dt><dd className="mt-0.5 break-all font-mono text-slate-700">{event.transactionId}</dd></div><div><dt className="text-slate-500">Received at</dt><dd className="mt-0.5 font-medium text-slate-700">{new Date(event.receivedAt).toLocaleString()}</dd></div></dl></div>)}</div>}</section>;
}
