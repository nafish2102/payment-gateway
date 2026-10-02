import type { CreatePaymentInput, PaymentResponse, PaymentStatus } from "@/types/payment";

/** Provider-independent contract for any payment service provider adapter. */
export interface PaymentProvider {
  createPayment(input: CreatePaymentInput & { transactionId: string }): Promise<PaymentResponse>;
  getPaymentStatus(transactionId: string): Promise<PaymentResponse | null>;
  updatePaymentStatus(transactionId: string, status: PaymentStatus): Promise<PaymentResponse | null>;
}
