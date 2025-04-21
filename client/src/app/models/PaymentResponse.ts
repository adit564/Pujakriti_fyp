export interface PaymentResponse {
    paymentId: number;
    orderId: number;
    userId: number;
    transactionId?: string;
    amount: number;
    status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
    paymentDate: string;
  }