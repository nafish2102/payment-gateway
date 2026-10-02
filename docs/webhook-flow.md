# Generic payment-gateway webhook simulation

A webhook is an asynchronous HTTP callback that a payment provider sends to an application after an event, such as a payment status change. It differs from the create-payment API response: the API response acknowledges the request, while a webhook communicates a later outcome.

This POC is a generic local payment-gateway webhook simulation, not a NeptunePay specification. A payment begins as `PROCESSING`; the Webhook Simulator posts an event to the local webhook endpoint, which validates the payload, looks up the transaction, updates its status, and returns an HTTP response.

Processed event IDs are held in an in-memory collection. Receiving the same `eventId` again returns a safe `alreadyProcessed` response rather than applying the status change twice. Production systems must persist idempotency records atomically.

## Troubleshooting

```text
Webhook sent
  ↓
Webhook endpoint
  ↓
Authentication/signature validation
  ↓
Payload validation
  ↓
Transaction lookup
  ↓
Status update
  ↓
Database/storage
  ↓
HTTP response
```

If a webhook is not received, check the provider delivery attempt, endpoint URL/reachability, request authentication or signature validation, and application logs. If it returns HTTP 500, check safe server logs, input parsing, transaction storage availability, and retry behavior. In a real integration, verify the provider's signing method and retry policy against its official documentation.
