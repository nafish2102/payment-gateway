import { MockPaymentProvider } from "@/services/payment/MockPaymentProvider";
import { PaymentService, PaymentValidationError } from "@/services/payment/PaymentService";

const paymentService = new PaymentService(new MockPaymentProvider());

export async function GET(request: Request) {
  try {
    const transactionId = new URL(request.url).searchParams.get("id") ?? "";
    const payment = await paymentService.getPaymentStatus(transactionId);
    if (!payment) return Response.json({ success: false, message: "Transaction not found." }, { status: 404 });
    return Response.json(payment);
  } catch (error) {
    if (error instanceof PaymentValidationError) return Response.json({ success: false, message: error.message }, { status: 400 });
    console.error("[PAYMENT_ERROR] Unable to retrieve mock payment status");
    return Response.json({ success: false, message: "Unable to retrieve payment status. Please try again." }, { status: 500 });
  }
}
