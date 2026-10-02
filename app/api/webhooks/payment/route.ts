import { MockPaymentProvider } from "@/services/payment/MockPaymentProvider";
import { PaymentService, PaymentValidationError } from "@/services/payment/PaymentService";
import { WebhookService } from "@/services/payment/WebhookService";
import type { PaymentWebhookInput } from "@/types/payment";

const webhookService = new WebhookService(new PaymentService(new MockPaymentProvider()));

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PaymentWebhookInput;
    const result = await webhookService.processPaymentWebhook(body);
    if (!result) return Response.json({ success: false, message: "Transaction not found." }, { status: 404 });
    return Response.json({ success: true, alreadyProcessed: result.alreadyProcessed, event: result.event });
  } catch (error) {
    if (error instanceof PaymentValidationError) return Response.json({ success: false, message: error.message }, { status: 400 });
    if (error instanceof SyntaxError) return Response.json({ success: false, message: "Invalid request body." }, { status: 400 });
    console.error("[WEBHOOK_ERROR] Unable to process mock webhook");
    return Response.json({ success: false, message: "Unable to process the webhook. Please try again." }, { status: 500 });
  }
}
