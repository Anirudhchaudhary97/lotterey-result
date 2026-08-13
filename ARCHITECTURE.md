# PrizeTrack — IRD Prize Tracker Architecture & Specification

## 1. System Overview

PrizeTrack is an unofficial companion web app and PWA for tracking Inland Revenue Department (IRD) Nepal bill lottery entries. It eliminates the manual effort of searching through published PDF/API winner archives.

```
+------------------+         +--------------------------+
|  Official IRD    |         |  User Personal Coupons   |
|  Winner Endpoint |         | (Coupon #, Bill #, Date) |
+--------+---------+         +------------+-------------+
         |                                |
         v                                v
+------------------+         +--------------------------+
| IRD Sync Service |         |  Coupon Matching Engine  |
|  (/api/ird/sync) | ------> | Compare Coupon vs Winner |
+------------------+         +------------+-------------+
                                          |
                                          v
                             +--------------------------+
                             | Status: WINNER / CHECKED |
                             | & Dynamic Claim Countdown|
                             +--------------------------+
```

---

## 2. Real IRD Data Model & Relational Database Schema

The database mirrors the official IRD API response payload structure while maintaining personal user coupon mappings:

### Entity-Relationship Diagram

```
User (1) <----> (*) Coupon (*) <---- (0..1) Draw (1) <----> (*) Winner (0..1) <----> (0..1) Coupon
```

### Prisma Schema Definition (`prisma/schema.prisma`)

```prisma
model User {
  id           String   @id @default(uuid())
  name         String?
  email        String   @unique
  passwordHash String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @default(now()) @updatedAt
  coupons      Coupon[]
}

model Coupon {
  id             String   @id @default(uuid())
  userId         String
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  couponNumber   String
  billNumber     String
  purchaseDate   DateTime
  purchaseDateBS String?
  billPhotoUrl   String?
  status         String   @default("PENDING") // PENDING, CHECKED, WINNER
  drawId         String?
  draw           Draw?    @relation(fields: [drawId], references: [id])
  winnerId       String?  @unique
  winner         Winner?  @relation(fields: [winnerId], references: [id])
  createdAt      DateTime @default(now())
  updatedAt      DateTime @default(now()) @updatedAt

  @@unique([userId, couponNumber, billNumber])
}

model Draw {
  id              String   @id @default(uuid())
  irdDrawId       String?  @unique
  categoryId      String?
  categoryTitleEn String   @default("General")
  categoryTitleNe String?
  drawType        String?  // BUMPER, DAILY
  titleEn         String
  titleNe         String?
  eligibleFrom    DateTime
  eligibleTo      DateTime
  publishedAt     DateTime @default(now())
  claimDeadline   DateTime
  claimOpen       Boolean  @default(true)
  syncedAt        DateTime @default(now())
  coupons         Coupon[]
  winners         Winner[]
  createdAt       DateTime @default(now())
  updatedAt      DateTime @default(now()) @updatedAt
}

model Winner {
  id           String   @id @default(uuid())
  drawId       String
  draw         Draw     @relation(fields: [drawId], references: [id], onDelete: Cascade)
  rank         Int
  fiscalYear   String?
  couponNumber String
  coupon       Coupon?
  createdAt    DateTime @default(now())
}
```

---

## 3. Matching Algorithm & IRD Sync Engine

1. **Draw Paging & Flat-Mapping**:
   The IRD API returns paginated `draws`, each containing an array of `winners`.
   ```ts
   const winners = response.draws.flatMap(draw => draw.winners);
   ```
2. **Coupon Number Normalization**:
   Strips spaces and non-alphanumeric characters for clean string comparison.
3. **Date Eligibility Window Assignment**:
   Coupons are assigned to draws by matching `purchaseDate` against `[eligibleFrom, eligibleTo]`.
4. **Status Transitions**:
   - `PENDING`: Saved coupon awaiting published IRD draw results for its purchase window.
   - `CHECKED`: Draw published and coupon was not selected in the winner list.
   - `WINNER`: Coupon match found in winner list; links `winnerId`, `rank`, and displays claim countdown.

---

## 4. Product Roadmap & Phased Implementation Plan

| Phase | Title | Key Deliverables | Status |
|---|---|---|---|
| **Phase 1** | Marketing Shell | Landing page, Hero, Ticket Stub UI, Features, FAQ, Footer | ✅ Completed |
| **Phase 2** | Coupon Tracker Dashboard | Dashboard grid, Add Coupon modal, Coupon filtering, BS Date conversion | ✅ Completed |
| **Phase 3** | Real IRD API Sync Engine | IRD API client, Sync service (`/api/ird/sync`), Draw & Winner persistence, Automatic matching | ✅ Completed |
| **Phase 4** | Winner Experience | Winner modal with rank details, Dynamic claim countdown timer, Claim instructions | ✅ Completed |
| **Phase 5** | PWA & Production Readiness | Web app manifest, PWA metadata, Error handling, SQLite/PostgreSQL adapter | ✅ Completed |

---

## 5. Security Guidelines

- **No Hardcoded Session Cookies**: Public IRD endpoints are consumed without storing user session cookies.
- **Data Privacy**: Personal user coupons and bill details are stored privately in your PostgreSQL/SQLite database and never sent out to third parties.
