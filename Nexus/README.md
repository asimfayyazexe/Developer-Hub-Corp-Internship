# Business Nexus

Business Nexus is a Vite, React, and TypeScript prototype for investor and entrepreneur collaboration. The app uses local mock data for authentication, investor/startup discovery, messaging, documents, meetings, payments, and deal workflows so it can be demoed without a backend.

## Run locally

```bash
npm install
npm run dev
```

Build verification:

```bash
npm run build
npm run lint
```

## Architecture

- `src/App.tsx` defines the route map and wraps protected pages in `DashboardLayout`.
- `src/context/AuthContext.tsx` stores the signed-in mock user in local storage and exposes auth/profile actions.
- `src/components/layout` contains the responsive navigation shell.
- `src/components/ui` contains shared Tailwind UI primitives used across feature pages.
- `src/data` holds mock users, collaboration requests, meetings, document chamber records, wallet balances, transactions, and funding deals.
- `src/pages` is organized by product area: auth, dashboards, profiles, discovery, documents, deals, scheduling, video calling, payments, chat, settings, and support.

## Collaboration features

- Scheduling calendar: availability slots, meeting request creation, accept/decline actions, and confirmed meetings.
- Video calling: WebRTC-style local camera/audio controls with screen-share fallback states for demo environments.
- Document Chamber: upload, preview, deal status labels, and e-signature mock signing flow.
- Payments: wallet balance, deposit/withdraw/transfer simulation, transaction history, and investor-to-entrepreneur funding flow.
- Security: password strength meter, role-based navigation, and a mock OTP step during login.
- Demo prep: guided walkthrough prompts are available inside the authenticated dashboard shell.
