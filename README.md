<div align="center">
  <img src="public/logo.png" alt="MeroPrize Logo" width="280" />

  # 🏆 MeroPrize — Pay Bill • Win Everyday

  **An Unofficial IRD Bill Lottery Companion & Progressive Web App (PWA)**

  [![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-7.9-indigo?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![PWA Ready](https://img.shields.io/badge/PWA-Ready-success?style=for-the-badge&logo=pwa)](https://web.dev/progressive-web-apps/)
</div>

---

## 📌 Overview

**MeroPrize** is a modern, privacy-focused Progressive Web App designed for consumers in Nepal who enroll their purchase bills in the official **Inland Revenue Department (IRD)** prize draws. 

Instead of manually checking long published lists of winner numbers across multiple draws, users save their coupon numbers once on **MeroPrize**. The system automatically syncs with published IRD winner data and immediately alerts users if any of their coupons have won a prize!

---

## ✨ Key Features

- 🎟️ **Full Coupon CRUD**: Save, view, update, and delete coupons with optional bill numbers and photo uploads.
- ⚡ **Automated Result Matching**: Background worker syncs official IRD draw lists and automatically flags winning coupons.
- 🇳🇵 **Bikram Sambat (BS) Date Support**: Built-in AD to BS date conversion matching IRD eligibility windows.
- 🏆 **Winner Experience & Countdown**: Detailed modal views for winning entries showing rank (1st, 2nd, Bumper), fiscal year, and claim deadline countdowns.
- 📱 **Installable PWA**: Install directly onto iOS, Android, and Desktop with offline fallback support (`/offline`) and custom service worker caching.
- 🔑 **Secure Authentication**: Supports both **Google OAuth 2.0** and Email/Password auth with HTTP-only JWT sessions and password recovery.
- 🔔 **Toast Notifications**: Interactive feedback across all user actions powered by `react-toastify`.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Server Actions, Middleware/Proxy)
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Database & ORM**: PostgreSQL (Supabase) with Prisma ORM (`@prisma/adapter-pg`)
- **PWA & Offline**: Custom Service Worker (`sw.js`), Web App Manifest, ServiceWorkerRegister client
- **Email Service**: Nodemailer / Resend integration for transactional emails
- **State & Form Validation**: Zod validation, Formik/React Action States

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or higher)
- npm, yarn, or pnpm
- PostgreSQL database (e.g. Supabase PG instance)

### 1. Clone the Repository

```bash
git clone https://github.com/Anirudhchaudhary97/lotterey-result.git
cd lotterey-result
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="your_secure_jwt_secret"

# Optional Email & OAuth Credentials
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
SMTP_HOST="smtp.resend.com"
SMTP_PORT=587
SMTP_USER="resend"
SMTP_PASS="your_smtp_password"
SMTP_FROM="MeroPrize <onboarding@resend.dev>"
```

### 3. Install Dependencies & Set Up Prisma

```bash
npm install
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Folder Structure

```text
├── app/
│   ├── (auth)/         # Login, Register, Forgot Password, Reset Password
│   ├── api/            # IRD sync & Google Auth API routes
│   ├── dashboard/      # User dashboard (Overview, Coupons, Draws)
│   ├── offline/        # Offline fallback page
│   ├── layout.tsx      # Root layout with PWA Service Worker & Toast provider
│   ├── manifest.ts     # Dynamic PWA Web App Manifest
│   └── page.tsx        # MeroPrize Landing Page
├── components/
│   ├── dashboard/      # Sidebar, MobileHeader, CouponList, Modals
│   ├── BrandLogo.tsx   # Reusable MeroPrize branding component
│   └── PwaInstallPrompt.tsx # PWA install prompt banner
├── lib/
│   ├── actions/        # Server Actions (Auth, Coupon CRUD)
│   ├── ird/            # IRD API client, normalizer, and sync logic
│   └── prisma.ts       # Database client initialization
├── public/             # Branding assets, icons, and sw.js
└── prisma/             # Schema definitions & migrations
```

---

## 👨‍💻 Developer & Contact

Developed with ❤️ by **Anirudh Chaudhary**

- 💼 **LinkedIn**: [Anirudh Chaudhary](https://www.linkedin.com/in/anurudh-chaudhary-332897202/)
- 📧 **Email**: [anurudhchaudhay97@gmail.com](mailto:anurudhchaudhay97@gmail.com)
- 🐙 **GitHub**: [@Anirudhchaudhary97](https://github.com/Anirudhchaudhary97)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
