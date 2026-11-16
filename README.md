# GitTix

Microservices ticket marketplace: create tickets, reserve orders with timed expiration, and pay with Stripe.

## Services

| Service     | Role                                      |
|-------------|-------------------------------------------|
| auth        | Signup / signin / JWT cookie session      |
| tickets     | Ticket CRUD + reservation locks           |
| orders      | Order create / cancel / list              |
| payments    | Stripe charges                            |
| expiration  | Delayed order expiration (Bull + Redis)   |
| client      | Next.js frontend                          |
| common      | Shared errors, middleware, event types    |

## Prerequisites

- Docker Desktop / local Kubernetes
- [Skaffold](https://skaffold.dev/)
- ingress-nginx installed in the cluster
- `/etc/hosts` entry: `127.0.0.1 ticketing.dev`

## Secrets

See [infra/k8s/docs/secrets.md](infra/k8s/docs/secrets.md). Create `jwt-secret` and `stripe-secret` before the first deploy.

## Local development

```bash
skaffold dev
```

Skaffold builds images and deploys the **dev** Kustomize overlay (`infra/k8s/overlays/dev`).

Prod-style deploy (more replicas, example host):

```bash
kubectl apply -k infra/k8s/overlays/prod
```

## Stripe

- Server secret key → `stripe-secret` / `STRIPE_KEY`
- Publishable key → `NEXT_PUBLIC_STRIPE_KEY` (client env) or `stripe-secret` / `STRIPE_PUBLISHABLE_KEY`

## Tests

```bash
cd auth && npm run test:ci
cd tickets && npm run test:ci
cd orders && npm run test:ci
cd payments && npm run test:ci
cd expiration && npm run test:ci
```

## Workspace

This repo uses npm workspaces. From the root:

```bash
npm install
npm run build:common
```

Local `@ekramp/common` is linked via the workspace; rebuild common after changes with `npm run build:common`.

## Messaging

Services use **NATS JetStream** (not NATS Streaming). The shared Listener/Publisher abstractions live in `@ekramp/common`.

## E2E

```bash
cd e2e && npm install && npx playwright install
E2E_BASE_URL=https://ticketing.dev npm test
```
