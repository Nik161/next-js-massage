This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page_old_version.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## API

All reads and writes are available as a JSON API under `/api`, used by the
web app and meant for the mobile app too. See [docs/API.md](docs/API.md) for
authentication (session cookie or Bearer token), roles and every endpoint.

## Testing

### Unit and component tests (Vitest)

```bash
pnpm test           # watch mode
pnpm test:unit      # single run
pnpm test:coverage  # with a coverage report in ./coverage
```

Tests live in `tests/unit`: business logic (`lib`), the API route handlers (`api`)
and client components (`ui`, rendered with React Testing Library in jsdom).
The database, Auth.js and Resend are mocked, so no services are needed.

### End-to-end tests (Playwright)

```bash
pnpm test:e2e
```

Builds the app, starts it on port 3100 (`E2E_PORT`) and runs `tests/e2e` in a
desktop and a mobile Chrome. It uses the locally installed Chrome; to use
Playwright's own browser run `npx playwright install chromium` and remove
`channel` from `playwright.config.ts`. Set `E2E_BASE_URL` to test an already
running deployment instead.

The suite talks to the database from `.env`. Tests for signed-in users run
only when credentials are provided, and booking creation needs an explicit
opt-in; the created booking is deleted afterwards:

```bash
E2E_USER_EMAIL=user@example.com E2E_USER_PASSWORD=secret pnpm test:e2e
E2E_ALLOW_WRITES=1 E2E_USER_EMAIL=... E2E_USER_PASSWORD=... pnpm test:e2e
```
