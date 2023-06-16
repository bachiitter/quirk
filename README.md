# Quirk

An opinionated open-source template for building full-stack web apps using React and Cloudflare Pages/Functions.

> **Warning**
> This template is still a work-in-progress and some of the packages are experimental. Use at your own risk.

## Stack

- React/Vite - framework
- TypeScript - language
- TailwindCSS - css
- shadcn/ui - ui
- Lucia - auth
- Stripe - subscriptions
- tRPC - api
- kysely - query builder
- prisma - schema management tool

## Getting Started

You can use the `npx degit` CLI to bootstrap your project using this template:

```bash
npx degit bachiitter/quirk my-app
```

## About

This project is inspired by T3 Stack and Shadcn's Taxonomy for building full-stack web apps using Cloudflare. The front-end React app is deployed on Cloudflare Pages, while the API is deployed on Pages Functions, which is powered by Cloudflare Workers.

## FAQ

### Why Planetscale?

Mainly because Workers currently doesn't support TCP connections, Cloudflare D1 is still in alpha and Planetscale is only provider that allows http connections.

### Why Cloudflare for hosting?

Free CDN, SSL, Web Application Firewall, Analytics, [Unlimited Bandwidth](https://twitter.com/nealagarwal/status/1645491148981510146)

### Why Workers for API?

Pay per requests cheaper than Lambda functions (Free 100k Requests/day)

## License

Copyright © 2023 Bachitter. Licenced under the MIT licence.

## References

- [create-t3-app](https://github.com/t3-oss/create-t3-app)
- [shadcn/taxonomy](https://github.com/shadcn/taxonomy)
