import type { CreatePaymentInput, PaymentResponse, PaymentStatus, PaymentTransaction } from "@/types/payment";
import type { PaymentProvider } from "./PaymentProvider";

/**
 * Local POC storage only. A production gateway integration must use persistent
 * storage and must never store card data, CVV, secrets, or credentials here.
 */
const transactionStore = globalThis as typeof globalThis & {
  mockPaymentTransactions?: Map<string, PaymentTransaction>;
};
const transactions = transactionStore.mockPaymentTransactions ?? new Map<string, PaymentTransaction>();
transactionStore.mockPaymentTransactions = transactions;

function toResponse(transaction: PaymentTransaction): PaymentResponse {
  return {
    success: true,
    transactionId: transaction.transactionId,
    status: transaction.status,
    amount: transaction.amount,
    currency: transaction.currency,
  };
}

export class MockPaymentProvider implements PaymentProvider {
  async createPayment(input: CreatePaymentInput & { transactionId: string }): Promise<PaymentResponse> {
    const now = new Date().toISOString();
    const transaction: PaymentTransaction = {
      ...input,
      status: "PROCESSING",
      createdAt: now,
      updatedAt: now,
    };

    transactions.set(transaction.transactionId, transaction);
    return toResponse(transaction);
  }

  async getPaymentStatus(transactionId: string): Promise<PaymentResponse | null> {
    const transaction = transactions.get(transactionId);
    if (!transaction) return null;

    return toResponse(transaction);
  }

  async updatePaymentStatus(transactionId: string, status: PaymentStatus): Promise<PaymentResponse | null> {
    const transaction = transactions.get(transactionId);
    if (!transaction) return null;

    if (transaction.status !== status) {
      transaction.status = status;
      transaction.updatedAt = new Date().toISOString();
      transactions.set(transactionId, transaction);
    }
    return toResponse(transaction);
  }
}
