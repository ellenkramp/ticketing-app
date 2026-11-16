# Kubernetes secrets

Secrets are not committed to this repository. Create them in your cluster before deploying.

## Local / Skaffold

```bash
kubectl create secret generic jwt-secret \
  --from-literal=JWT_KEY=dev-jwt-secret-change-me

kubectl create secret generic stripe-secret \
  --from-literal=STRIPE_KEY=sk_test_your_secret_key \
  --from-literal=STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

## Required keys

| Secret name     | Key                     | Used by                          |
|-----------------|-------------------------|----------------------------------|
| `jwt-secret`    | `JWT_KEY`               | auth, tickets, orders, payments  |
| `stripe-secret` | `STRIPE_KEY`            | payments (server)                |
| `stripe-secret` | `STRIPE_PUBLISHABLE_KEY`| client (optional; for checkout)  |

For production, prefer sealed-secrets, External Secrets Operator, or your cloud secret manager instead of literal kubectl creates.
