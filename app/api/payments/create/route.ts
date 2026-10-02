import { MockPaymentProvider } from "@/services/payment/MockPaymentProvider";
import { PaymentService, PaymentValidationError } from "@/services/payment/PaymentService";
import type { CreatePaymentInput } from "@/types/payment";

const paymentService = new PaymentService(new MockPaymentProvider());

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreatePaymentInput;
    const payment = await paymentService.createPayment({
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      amount: Number(body.amount),
      currency: body.currency,
      demoResult: body.demoResult,
    });
    return Response.json(payment, { status: 201 });
  } catch (error) {
    if (error instanceof PaymentValidationError) return Response.json({ success: false, message: error.message }, { status: 400 });
    if (error instanceof SyntaxError) return Response.json({ success: false, message: "Invalid request body." }, { status: 400 });
    console.error("[PAYMENT_ERROR] Unable to create mock payment");
    return Response.json({ success: false, message: "Unable to create the payment. Please try again." }, { status: 500 });
  }
}
