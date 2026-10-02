import { paymentStatuses, type PaymentWebhookInput, type WebhookEvent } from "@/types/payment";
import { PaymentService, PaymentValidationError } from "./PaymentService";

type WebhookResult = {
  alreadyProcessed: boolean;
  event: WebhookEvent;
};

/**
 * Local POC event storage only. Production should persist processed event IDs
 * atomically so webhook retries cannot apply an event more than once.
 */
const eventStore = globalThis as typeof globalThis & { mockWebhookEvents?: Map<string, WebhookEvent> };
const processedEvents = eventStore.mockWebhookEvents ?? new Map<string, WebhookEvent>();
eventStore.mockWebhookEvents = processedEvents;

export class WebhookService {
  constructor(private readonly paymentService: PaymentService) {}

  async processPaymentWebhook(input: PaymentWebhookInput): Promise<WebhookResult | null> {
    this.validate(input);
    const existingEvent = processedEvents.get(input.eventId);
    if (existingEvent) return { alreadyProcessed: true, event: existingEvent };

    const payment = await this.paymentService.updatePaymentStatus(input.transactionId, input.status);
    if (!payment) return null;

    const event: WebhookEvent = { ...input, receivedAt: new Date().toISOString() };
    processedEvents.set(event.eventId, event);
    console.info("[WEBHOOK_RECEIVED]", { eventId: event.eventId, eventType: event.eventType, transactionId: event.transactionId, status: event.status });
    return { alreadyProcessed: false, event };
  }

  private validate(input: PaymentWebhookInput) {
    if (!input.eventId?.trim()) throw new PaymentValidationError("Webhook event ID is required.");
    if (input.eventType !== "payment.status_changed") throw new PaymentValidationError("Webhook event type is invalid.");
    if (!input.transactionId?.trim()) throw new PaymentValidationError("Webhook transaction ID is required.");
    if (!paymentStatuses.includes(input.status)) throw new PaymentValidationError("Webhook status is invalid.");
  }
}
