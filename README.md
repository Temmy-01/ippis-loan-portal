# IPPIS Loan Portal

Customer-facing web app for Dominion Merchants & Partners IPPIS loans, built from the
Figma file "IPPIS Loan Portal".

## Stack

- React 19 + Vite, TypeScript and plain JavaScript (`.tsx`, `.ts`, `.jsx`, `.js` all work)
- Tailwind CSS v4 for layout and styling, plain CSS for shared animations
- React Router for pages
- Poppins and Inter, bundled locally through Fontsource

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check and production build
npm run lint
```

## Structure

```
src/
  App.tsx                    routes
  styles/index.css           Tailwind import and Figma colour/font tokens (@theme)
  styles/animations.css      plain CSS keyframes and .anim-* classes
  components/auth/           auth-only pieces (background)
  components/layout/         signed-in layout: Sidebar, Header, AppLayout
  components/app/            signed-in pieces: PageHeader, ChangePasswordModal
  components/ui/             reusable UI (Button, TextField, Checkbox, OtpInput, Logo)
  pages/auth/                Login, SignUp, VerifyOtp
  pages/app/                 Dashboard, VerifyIdentity
  lib/                       helpers (cn.ts, validators.js)
  assets/auth/               images and icons exported from Figma
```

Import from `src` with the `@` alias, for example `import { Button } from '@/components/ui/Button'`.

## Design tokens

Colours from Figma are available as Tailwind classes and CSS variables:

| Token | Value | Tailwind |
|---|---|---|
| LMS Dark Purple | `#431967` | `bg-lms-dark-purple` |
| LMS Purple | `#7C2EBF` | `bg-lms-purple` |
| LMS Lilac | `#C87DFE` | `text-lms-lilac` |
| LMS Blue | `#CDEBF8` | `bg-lms-blue` |

In a `.css` file use `var(--color-lms-purple)` and so on.

## Screens

| Route | Figma frame |
|---|---|
| `/login` | LOGIN |
| `/signup` | SIGN UP |
| `/verify` | OTP |
| `/dashboard` | Dashboard |
| `/verify-identity` | Let's verify it's you (both states) and the "Verification completed" popup |
| Header menu, "Change password" | Change Password popup |

The signed-in pages share one layout (sidebar and header) in `src/components/layout/`.
Sample names and numbers live in `src/data/mockUser.ts`.

API calls are not wired yet. Look for `TODO` comments in the pages.
# ippis-loan-portal
