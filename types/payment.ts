export const demoResults = ["success", "failed", "processing"] as const;
export type DemoResult = (typeof demoResults)[number];

export const paymentStatuses = ["PROCESSING", "SUCCEEDED", "FAILED"] as const;
export type PaymentStatus = (typeof paymentStatuses)[number];

export type CreatePaymentInput = {
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  demoResult: DemoResult;
};

export type PaymentResponse = {
  success: true;
  transactionId: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
};

export type PaymentTransaction = CreatePaymentInput & {
  transactionId: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
};

export const webhookStatuses = ["PROCESSING", "SUCCEEDED", "FAILED"] as const;
export type WebhookStatus = (typeof webhookStatuses)[number];

export type PaymentWebhookInput = {
  eventId: string;
  eventType: "payment.status_changed";
  transactionId: string;
  status: WebhookStatus;
};

export type WebhookEvent = PaymentWebhookInput & {
  receivedAt: string;
};
