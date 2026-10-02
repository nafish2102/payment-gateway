export type DemoResult = "success" | "failed" | "processing";
export type PaymentStatus = "not-started" | "processing" | "success" | "failed" | "error";

export type PaymentDetails = {
  customerName: string;
  customerEmail: string;
  amount: string;
  currency: string;
  demoResult: DemoResult;
};
