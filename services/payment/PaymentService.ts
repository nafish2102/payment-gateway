import { randomUUID } from "crypto";
import { demoResults, paymentStatuses, type CreatePaymentInput, type PaymentResponse, type PaymentStatus } from "@/types/payment";
import type { PaymentProvider } from "./PaymentProvider";

export class PaymentValidationError extends Error {}

export class PaymentService {
  constructor(private readonly provider: PaymentProvider) {}

  async createPayment(input: CreatePaymentInput): Promise<PaymentResponse> {
    this.validateInput(input);
    const transactionId = `TXN-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${randomUUID().slice(0, 8).toUpperCase()}`;

    console.info("[PAYMENT_REQUEST]", { transactionId, amount: input.amount, currency: input.currency });
    const response = await this.provider.createPayment({ ...input, transactionId });
    console.info("[PAYMENT_RESPONSE]", { transactionId: response.transactionId, status: response.status });
    return response;
  }

  async getPaymentStatus(transactionId: string): Promise<PaymentResponse | null> {
    if (!transactionId.trim()) throw new PaymentValidationError("A transaction ID is required.");
    const response = await this.provider.getPaymentStatus(transactionId);
    if (response) console.info("[PAYMENT_RESPONSE]", { transactionId: response.transactionId, status: response.status });
    return response;
  }

  async updatePaymentStatus(transactionId: string, status: PaymentStatus): Promise<PaymentResponse | null> {
    if (!transactionId.trim()) throw new PaymentValidationError("A transaction ID is required.");
    if (!paymentStatuses.includes(status)) throw new PaymentValidationError("Payment status is invalid.");
    return this.provider.updatePaymentStatus(transactionId, status);
  }

  private validateInput(input: CreatePaymentInput) {
    if (!input.customerName?.trim()) throw new PaymentValidationError("Customer name is required.");
    if (!/^\S+@\S+\.\S+$/.test(input.customerEmail)) throw new PaymentValidationError("Enter a valid email address.");
    if (!Number.isFinite(input.amount) || input.amount <= 0) throw new PaymentValidationError("Amount must be greater than 0.");
    if (!input.currency?.trim()) throw new PaymentValidationError("Currency is required.");
    if (!demoResults.includes(input.demoResult)) throw new PaymentValidationError("Demo payment result is invalid.");
  }
}
