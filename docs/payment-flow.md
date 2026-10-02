# Mock payment flow

1. The frontend collects customer and transaction information (never card details).
2. It calls the local `POST /api/payments/create` endpoint.
3. The backend validates the request.
4. `PaymentService` coordinates the payment operation and creates a transaction ID.
5. `PaymentProvider` defines the provider-independent contract.
6. `MockPaymentProvider` simulates the gateway using deterministic demo results.
7. The frontend requests `GET /api/payments/status?id=<transactionId>` for the result.
8. The normalized status response is displayed in the payment summary.

The provider abstraction keeps the frontend independent of the PSP. A future provider adapter can implement `PaymentProvider` (for example, a real PSP integration) without changing the React payment flow. This POC uses an in-memory `Map`, so transactions disappear when the server restarts. Production would use persistent storage and appropriate operational controls.
