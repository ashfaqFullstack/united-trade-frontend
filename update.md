# United Trade — Complete Code (USD currency + customer rules + new business form)


---

# BACKEND

## 0. Pehle ye commands chalao

```bash
npm install country-to-currency i18n-iso-countries
npx prisma db push --force-reset
npx prisma generate
```

## Naye files (NEW)

#### `src/utils/money.js`  — **NEW**

````js
// All ledger values are USD with 6 decimal places (Decimal(18,6) in Postgres).
// Display values are rounded to the decimals of the viewer's currency.

const round = (value, digits) => {
    const factor = 10 ** digits;
    return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
};

const roundUsd = (value) => round(value, 6);

// Number of minor-unit digits for a currency (USD/PKR/EUR = 2, JPY = 0, KWD = 3 ...).
// Uses the runtime's ICU data, so no manual mapping is needed.
const decimalsCache = new Map();
const getCurrencyDecimals = (currencyCode) => {
    if (!decimalsCache.has(currencyCode)) {
        let digits = 2;
        try {
            digits = new Intl.NumberFormat('en', { style: 'currency', currency: currencyCode })
                .resolvedOptions().maximumFractionDigits;
        } catch (e) {
            digits = 2; // unknown code -> default to 2 decimals
        }
        decimalsCache.set(currencyCode, digits);
    }
    return decimalsCache.get(currencyCode);
};

const roundForCurrency = (value, currencyCode) => round(value, getCurrencyDecimals(currencyCode));

const formatMoney = (value, currencyCode) => {
    try {
        return new Intl.NumberFormat('en', { style: 'currency', currency: currencyCode }).format(Number(value));
    } catch (e) {
        return `${Number(value).toFixed(2)} ${currencyCode}`;
    }
};

module.exports = { round, roundUsd, getCurrencyDecimals, roundForCurrency, formatMoney };
````

## Existing files (REPLACE)

#### `prisma/schema.prisma`  — **REPLACE**

````prisma

// ==========================================================
// Barter Trading Platform — Prisma Schema (MVP)
// Prisma v7 — datasource URL lives in prisma.config.ts, NOT here.
// ==========================================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

// ----------------------------------------------------------
// ENUMS
// ----------------------------------------------------------

enum Role {
  CUSTOMER
  BUSINESS
  ADMIN
}

enum MembershipTier {
  STANDARD
  GOLD
  PLATINUM
}

enum ApprovalStatus {
  PENDING
  APPROVED
  REJECTED
  BLOCKED
}

enum ListingStatus {
  ACTIVE
  PAUSED
  TRADED
}

enum TransactionStatus {
  SUCCESS
  FAILED // e.g. insufficient balance / wrong PIN
}

enum FeeType {
  MONTHLY_FEE
  TRADE_COMMISSION
}

enum OrderStatus {
  ESCROW_HELD
  COMPLETED
  CANCELLED
}

enum BarterOfferStatus {
  PENDING
  ACCEPTED
  REJECTED
  CANCELLED
}

// ----------------------------------------------------------
// USER & AUTH
// ----------------------------------------------------------

enum TokenType {
  ACCESS
  REFRESH
  RESET_PASSWORD
  VERIFY_EMAIL
}

model Token {
  id          String    @id @default(uuid())
  token       String
  userId      String
  type        TokenType
  expires     DateTime
  blacklisted Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([token])
  @@map("tokens")
}

model PasswordResetOtp {
  id        String   @id @default(uuid())
  userId    String
  otp       String   // hashed
  expires   DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("password_reset_otps")
}



model CompanyFundingLog {
  id        String   @id @default(uuid())
  adminId   String
  amount    Decimal  @db.Decimal(18, 6) // USD
  createdAt DateTime @default(now())

  admin User @relation(fields: [adminId], references: [id])

  @@map("company_funding_logs")
}



model User {
  id        String         @id @default(uuid())
  name      String
  email     String         @unique
  password  String
  tokens Token[]
  role      Role           @default(CUSTOMER)
  passwordResetOtps PasswordResetOtp[]
  country   String? // used for currency display + filters
  status    ApprovalStatus @default(PENDING)
  rejectionReason  String?

  // Transaction PIN security (separate from login password)
  transactionPin   String? // bcrypt-hashed, set after approval
  pinSetAt         DateTime?
  failedPinAttempts Int      @default(0)
  pinLockedUntil   DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  businessProfile   BusinessProfile?
  customerProfile   CustomerProfile?
  wallet            Wallet?
  listings          Listing[]
  sentTransactions  Transaction[]     @relation("SenderTransactions")
  recvTransactions  Transaction[]     @relation("ReceiverTransactions")
  monthlyFeeLogs    MonthlyFeeLog[]
  pinResetTokens    PinResetToken[]


  companyFundingLogs CompanyFundingLog[]

  ordersAsBuyer  Order[] @relation("OrderBuyer")
  ordersAsSeller Order[] @relation("OrderSeller")
  barterOffersMade     BarterOffer[] @relation("BarterOfferer")
  barterOffersReceived BarterOffer[] @relation("BarterTargetOwner")
  profileUpdateRequests ProfileUpdateRequest[]
  pushSubscriptions PushSubscription[]

  @@map("users")
}

// Separate table so a business can have multiple documents without
// bloating the User row.
model BusinessProfile {
  id     String @id @default(uuid())
  userId String @unique

  // Business details
  businessName String?
  acn          String? // Australian Company Number (optional, digits/spaces only)
  abn          String? // Australian Business Number (optional, digits/spaces only)

  // Business address
  streetNumber String?
  streetName   String?
  city         String?
  state        String?
  postcode     String?
  country      String?

  // Contact
  phone       String? // business phone
  mobile      String? // cell / mobile number
  website     String?
  socialLinks String? // free text, one or more links

  // Business information
  category         String? // industry / category
  productsServices String? // products or services offered

  // Business verification
  yearsInBusiness Int?

  // Declaration
  declarationAccepted   Boolean   @default(false)
  declarationAcceptedAt DateTime?

  logoUrl String?

  // Requested membership tier — final creditLimit is still set by admin at approval
  membershipTier MembershipTier?

  verificationStatus ApprovalStatus @default(PENDING)
  verifiedAt         DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  documents BusinessDocument[]

  @@map("business_profiles")
}

model BusinessDocument {
  id                String   @id @default(uuid())
  businessProfileId String
  fileUrl           String
  publicId          String
  fileType          String
  uploadedAt        DateTime @default(now())

  businessProfile BusinessProfile @relation(fields: [businessProfileId], references: [id], onDelete: Cascade)

  @@map("business_documents")
}

// Customer completes this after signup — mirrors BusinessProfile
// so both roles have a dedicated "complete your profile" step.
model CustomerProfile {
  id             String   @id @default(uuid())
  userId         String   @unique
  phone          String?
  country        String?
  address        String?
  city           String?
  profilePicture String?
  membershipTier MembershipTier?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("customer_profiles")
}

// ----------------------------------------------------------
// WALLET (all money values are stored in USD — the platform base currency)
// ----------------------------------------------------------

model Wallet {
  id           String   @id @default(uuid())
  userId       String   @unique
  balance      Decimal  @default(0) @db.Decimal(18, 6) // USD
  creditLimit  Decimal  @default(0) @db.Decimal(18, 6) // USD (admin enters it in the user's own currency)
  updatedAt    DateTime @updatedAt
  createdAt    DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("wallets")
}

// Single-row ledger that collects all commission + monthly fees.
// Enforce single row at the application layer (e.g. fixed known id).
model CompanyAccount {
  id           String   @id @default(uuid())
  totalBalance Decimal  @default(0) @db.Decimal(18, 6) // USD
  updatedAt    DateTime @updatedAt

  @@map("company_account")
}

// ----------------------------------------------------------
// LISTINGS
// ----------------------------------------------------------

model Listing {
  id          String        @id @default(uuid())
  businessId  String
  title       String
  description String
  price       Decimal       @db.Decimal(18, 6) // USD
  category    String
  imageUrls   String[]      @default([])
  status      ListingStatus @default(ACTIVE)
  isPublic    Boolean       @default(true)
  isDeleted   Boolean       @default(false)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  ordersFor          Order[]
  barterOffersFrom   BarterOffer[] @relation("OffererListing")
  barterOffersTarget BarterOffer[] @relation("TargetListing")

  business User @relation(fields: [businessId], references: [id], onDelete: Cascade)

  @@index([category])
  @@index([businessId])
  @@map("listings")
}

// ----------------------------------------------------------
// TRANSACTIONS (USD ledger transfers via QR)
// ----------------------------------------------------------

model Transaction {
  id         String             @id @default(uuid())
  senderId   String
  receiverId String

  amount            Decimal  @db.Decimal(18, 6) // USD, amount before commission
  inputAmount       Decimal? @db.Decimal(18, 6) // what the sender typed, in the sender's currency (audit)
  inputCurrency     String? // sender's currency code at the time (audit)
  exchangeRate      Decimal? @db.Decimal(20, 8) // units of inputCurrency per 1 USD at the time (audit)
  commissionBuyer   Decimal  @db.Decimal(18, 6) // 5% deducted from buyer (USD)
  commissionSeller  Decimal  @db.Decimal(18, 6) // 5% deducted from seller (USD)
  netAmountToSeller Decimal  @db.Decimal(18, 6) // amount - commissionSeller (USD)

  status    TransactionStatus @default(SUCCESS)
  receiptId String            @unique @default(uuid())

  createdAt DateTime @default(now())

  sender   User @relation("SenderTransactions", references: [id], fields: [senderId])
  receiver User @relation("ReceiverTransactions", references: [id], fields: [receiverId])

  @@index([senderId])
  @@index([receiverId])
  @@map("transactions")
}

// Log of all deductions going into the CompanyAccount — monthly fees
// AND trade commissions — for audit/reporting.
model MonthlyFeeLog {
  id     String  @id @default(uuid())
  userId String
  amount Decimal @db.Decimal(18, 6) // USD
  type   FeeType @default(MONTHLY_FEE)

  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("fee_logs")
}

// ----------------------------------------------------------
// TRANSACTION PIN — forgot-PIN flow
// ----------------------------------------------------------

model PinResetToken {
  id        String   @id @default(uuid())
  userId    String
  token     String   @unique
  expires   DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("pin_reset_tokens")
}

// ----------------------------------------------------------
// LIVE EXCHANGE RATES (auto-refreshed from a free public API)
// rate = units of `currencyCode` per 1 USD
// ----------------------------------------------------------
model CurrencyRate {
  currencyCode String   @id
  rate         Decimal  @db.Decimal(20, 8)
  updatedAt    DateTime @updatedAt

  @@map("currency_rates")
}

model Order {
  id                String      @id @default(uuid())
  listingId         String
  buyerId           String
  sellerId          String
  amount            Decimal     @db.Decimal(18, 6) // USD (listing price at order time)
  buyerCurrency     String? // buyer's currency code at order time (audit)
  buyerRate         Decimal?    @db.Decimal(20, 8) // units of buyerCurrency per 1 USD at order time (audit)
  commissionBuyer   Decimal     @db.Decimal(18, 6)
  commissionSeller  Decimal     @db.Decimal(18, 6)
  netAmountToSeller Decimal     @db.Decimal(18, 6)
  status            OrderStatus @default(ESCROW_HELD)
  receiptId         String?     @unique

  createdAt   DateTime  @default(now())
  completedAt DateTime?
  cancelledAt DateTime?

  listing Listing @relation(fields: [listingId], references: [id])
  buyer   User    @relation("OrderBuyer", fields: [buyerId], references: [id])
  seller  User    @relation("OrderSeller", fields: [sellerId], references: [id])

  @@map("orders")
}

model BarterOffer {
  id               String            @id @default(uuid())
  offererListingId String
  offererId        String
  targetListingId  String
  targetOwnerId    String
  status           BarterOfferStatus @default(PENDING)

  createdAt   DateTime  @default(now())
  respondedAt DateTime?

  offererListing Listing @relation("OffererListing", fields: [offererListingId], references: [id])
  targetListing  Listing @relation("TargetListing", fields: [targetListingId], references: [id])
  offerer        User    @relation("BarterOfferer", fields: [offererId], references: [id])
  targetOwner    User    @relation("BarterTargetOwner", fields: [targetOwnerId], references: [id])

  @@map("barter_offers")
}

enum ProfileUpdateStatus {
  PENDING
  APPROVED
  REJECTED
}

model ProfileUpdateRequest {
  id                    String              @id @default(uuid())
  userId                String
  status                ProfileUpdateStatus @default(PENDING)
  proposedData          Json
  documentsToAdd        Json                @default("[]")
  documentIdsToRemove   String[]            @default([])
  rejectionReason       String?

  createdAt  DateTime  @default(now())
  reviewedAt DateTime?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("profile_update_requests")
}


model PushSubscription {
  id        String   @id @default(uuid())
  userId    String
  endpoint  String   @unique
  keys      Json
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("push_subscriptions")
}
````

#### `readme.md`  — **REPLACE**

````
====================================================================
 BARTER TRADING PLATFORM — PROJECT DOCUMENTATION
 (Reference: Bartercard.com.au style trade-dollar platform)
====================================================================

Purpose of this file:
This document explains the complete working of the platform, the
reasoning behind key decisions, and how the database schema maps to
the actual business flow. Any developer picking up this project
later should be able to read this file + schema.prisma and
understand the whole system without needing a separate handover call.

--------------------------------------------------------------------
1. PROJECT OVERVIEW
--------------------------------------------------------------------

This is a B2B/B2C barter trading platform where businesses and
customers trade goods/services using an internal ledger denominated
in REAL currencies (PKR, USD, CNY, EUR ...) instead of real cash.

Key principle (IMPORTANT — read this before touching any wallet
code):

  Balances are NOT real money. There is NO payment gateway,
  NO bank integration, and NO cash ever moves through this
  platform. Every balance, every transaction, every fee is just a
  number stored in the database (an internal ledger). The platform
  never touches real banking rails.

This decision was made deliberately by the client to avoid banking/
payment compliance overhead. Do not add Stripe/JazzCash/PayPal or
any payment gateway to this project unless explicitly instructed —
it goes against the core product decision.

--------------------------------------------------------------------
2. TECH STACK
--------------------------------------------------------------------

Frontend : Next.js, Tailwind CSS, Zustand (client state),
           TanStack Query (server state / API caching)

Backend  : Express.js, PostgreSQL, Prisma ORM (v7)

Deployment:
  - Frontend -> Vercel
  - Backend  -> Vercel (serverless, via api/index.js entry point)
               or Railway/Render if long-running cron jobs are
               needed (see section 8, Monthly Fee Job)
  - Database -> Managed Postgres (Neon / Supabase / Railway)

--------------------------------------------------------------------
3. USER ROLES
--------------------------------------------------------------------

Three roles exist (see `Role` enum in schema.prisma):

  CUSTOMER  - Can browse listings, trade (send/receive Trade
              Dollars), cannot list products/services.
  BUSINESS  - Can do everything a customer can, PLUS create
              listings. Must be verified (documents) by admin.
  ADMIN     - Manages users, approvals, wallet limits, currency
              rates, and views platform-wide reports.

--------------------------------------------------------------------
4. COMPLETE USER FLOW (STEP BY STEP)
--------------------------------------------------------------------

STEP 1 — Signup
  - User signs up as either CUSTOMER or BUSINESS.
  - Only basic info is captured at this stage: name, email,
    password (hashed), role, country.
  - `User.status` = PENDING by default.

STEP 2 — Profile Completion (happens right after signup)
  - CUSTOMER  -> fills `CustomerProfile` (phone, address, city,
                 profile picture).
  - BUSINESS  -> fills `BusinessProfile` (business name, category,
                 phone, address, city, logo) AND uploads documents
                 into `BusinessDocument` (business registration
                 proof etc.)
  - Both profiles are 1-to-1 with `User` (unique `userId`), so each
    user has at most one profile of their type.

STEP 3 — Admin Approval
  - Admin reviews pending users (and business documents) in the
    admin dashboard.
  - Admin approves or rejects.
  - On approval:
      a) `User.status` -> APPROVED
      b) (if business) `BusinessProfile.verificationStatus` ->
         APPROVED
      c) A `Wallet` row is created for the user with:
           - balance     = 0
           - creditLimit = admin-configured starting limit
                           (admin types it in the user's own currency,
                           it is stored internally as USD)
  - If rejected, `User.status` -> REJECTED (user is notified,
    cannot log in / trade).

STEP 4 — Set Transaction PIN
  - After approval, the user must set a 4-6 digit Transaction PIN
    before they can send any money.
  - This PIN is SEPARATE from the login password. It exists purely
    to authorize outgoing transactions (like a banking app PIN).
  - Stored hashed in `User.transactionPin` (bcrypt/argon2 — never
    plain text).
  - If the user forgets it, the `PinResetToken` model supports a
    "forgot PIN" flow (token emailed, user sets a new PIN).

STEP 5 — Business Listings
  - Approved BUSINESS users create `Listing` records: title,
    description, price (typed in the seller's own currency, stored as USD), category, image.
  - `Listing.status` can be ACTIVE or PAUSED (business can hide a
    listing without deleting it).
  - Any user (customer or business) can browse/search listings with
    filters: category, price range, country, keyword search, and
    sort (price asc/desc, newest).

STEP 6 — Trading (Send/Receive via QR — the core transaction flow)
  This is the most important flow in the whole system. Order of
  operations matters:

    1. Receiver opens their QR code screen (encodes their userId).
    2. Sender scans the QR code (identifies the receiver).
    3. Sender enters the amount to send.
    4. Sender enters their Transaction PIN.
    5. Backend verifies the PIN (bcrypt.compare against
       `User.transactionPin`).
         - If PIN wrong -> increment `failedPinAttempts`, reject
           transaction. After too many failed attempts, temporarily
           lock the account (`pinLockedUntil`).
         - If PIN correct -> reset `failedPinAttempts` to 0,
           proceed.
    6. Backend checks sender's wallet: does
       (balance - amount - commissionBuyer) stay within
       (0 - creditLimit)? i.e. sender is allowed to go negative up
       to their credit limit, but no further.
    7. If sender has sufficient allowance, run ALL of the following
       inside a SINGLE Prisma database transaction
       (`prisma.$transaction`) so it's all-or-nothing:
         a) Debit sender:   balance -= (amount + commissionBuyer)
         b) Credit receiver: balance += (amount - commissionSeller)
         c) Credit CompanyAccount: totalBalance +=
            (commissionBuyer + commissionSeller)
         d) Create a `Transaction` record (immutable log) with
            amount, commissionBuyer, commissionSeller,
            netAmountToSeller, receiptId, status = SUCCESS.
    8. If any step fails, the whole transaction rolls back —
       nobody's balance changes, and a FAILED transaction status
       may be logged.
    9. On success, both sender and receiver see an auto-generated
       receipt (using `Transaction.receiptId`).

  Commission rule (as given by client):
    - 5% of the trade amount is deducted from the BUYER (sender)
      IN ADDITION to the amount sent.
    - 5% of the trade amount is deducted from the SELLER (receiver)
      OUT OF the amount received.
    - Both 5% portions go to the CompanyAccount (internal, not a
      real bank account).

  Example: Buyer sends 100 (USD) to Seller.
    - Buyer's wallet is debited: 100 + 5 (buyer commission) = 105
    - Seller's wallet is credited: 100 - 5 (seller commission) = 95
    - CompanyAccount receives: 5 + 5 = 10

STEP 7 — Monthly Fee (Automated)
  - A scheduled job (cron) runs once a month.
  - For every APPROVED user with an active wallet, deduct a fixed
    $10 USD fee.
  - This deduction is logged in `MonthlyFeeLog` (type =
    MONTHLY_FEE) and credited to `CompanyAccount.totalBalance`.
  - Same table (`MonthlyFeeLog`) is also used to log trade
    commissions (type = TRADE_COMMISSION) for a unified audit trail
    of everything that has ever gone into the CompanyAccount.
  - IMPORTANT: If deploying the backend on Vercel serverless, cron
    jobs need Vercel Cron (or an external scheduler hitting a
    protected API route) since Vercel functions don't keep a
    process running. If using Railway/Render, `node-cron` running
    inside the app is fine.

STEP 8 — Multi-Currency (USD ledger + live rates)
  - Every financial value in the database is stored in USD
    (Decimal(18,6)). Nothing else is ever stored.
  - Every user has a `country`; it is mapped to a currency code with
    the `country-to-currency` + `i18n-iso-countries` npm packages
    (unknown/missing country falls back to USD).
  - Live rates come from https://open.er-api.com (free, no key, all
    currencies in one call) and are cached in the `currency_rates`
    table. They refresh via a 6-hourly cron AND lazily on demand when
    older than 12h (needed on Vercel serverless). If the API is down,
    the last saved rates are used and trading continues.
  - Senders type amounts in their own currency; the backend converts
    to USD at the live rate and records USD (plus the typed amount,
    currency and rate for audit). API responses keep the USD values
    and add a `display` block in the VIEWER's own currency.
  - Commission (5% buyer + 5% seller) is calculated on the USD amount.
  - Admin/report figures are always USD. There is no manual rate
    management any more.

STEP 9 — Admin Dashboard
  Admin can:
    - View/approve/reject pending users and business documents.
    - View/adjust any user's wallet creditLimit manually.
    - View all transactions and filter/search them.
    - View CompanyAccount total balance and fee/commission history
      (via MonthlyFeeLog).
    - Manage CountryCurrencyRate (add country, update rate).

--------------------------------------------------------------------
5. DATABASE SCHEMA MAP (schema.prisma -> business flow)
--------------------------------------------------------------------

  User                 -> Step 1 (signup), holds role/status/country
  CustomerProfile      -> Step 2 (customer profile completion)
  BusinessProfile      -> Step 2 (business profile completion)
  BusinessDocument     -> Step 2 (business verification documents)
  Wallet               -> Step 3 (created on approval), holds
                          balance + creditLimit
  CompanyAccount       -> Step 6/7 (single row, collects all fees)
  Listing              -> Step 5 (business product/service listings)
  Transaction          -> Step 6 (every trade, immutable log)
  MonthlyFeeLog        -> Step 6 & 7 (audit trail of all fees /
                          commissions credited to CompanyAccount)
  PinResetToken        -> Step 4 (forgot-PIN flow)
  CountryCurrencyRate  -> Step 8 (admin-controlled display rates)

--------------------------------------------------------------------
6. KEY BUSINESS RULES (do not break these)
--------------------------------------------------------------------

  1. All money fields use Prisma `Decimal`, never `Float`. Floats
     cause rounding errors in financial calculations.
  2. Every wallet debit/credit MUST happen inside a single
     `prisma.$transaction(...)` block. Never update sender and
     receiver balances in two separate, unguarded queries — this
     creates race conditions where concurrent transactions could
     corrupt balances.
  3. A user can go negative on their wallet balance, but only up to
     their `creditLimit`. This is not a bug — it's the intended
     "starting trade limit" feature from the client.
  4. The Transaction PIN is required for every outgoing transfer.
     No exceptions, no "remember me" bypass in MVP.
  5. Registration is completely FREE. No fee is charged at signup
     or approval — only the recurring monthly fee and per-trade
     commission apply, and both are deducted automatically in Trade
     Dollars, never cash.
  6. CompanyAccount is a single internal ledger row — never create
     a second row for it. All commission + monthly fees always flow
     into this same row.
  7. Currency conversion (Step 8) is read-only/display-only. Do not
     let it influence actual balance math anywhere in the backend.

--------------------------------------------------------------------
7. SECURITY NOTES
--------------------------------------------------------------------

  - Login password and Transaction PIN are two separate secrets,
    hashed separately, never interchangeable.
  - Rate-limit PIN attempts (lock account temporarily after ~5
    failed attempts) to prevent brute-forcing a 4-6 digit PIN.
  - Never log the transaction PIN, password, or full DATABASE_URL
    in application logs.
  - DATABASE_URL and all secrets must live in environment variables
    only (.env locally, Vercel/host environment variables in
    production) — never hardcoded in source files or committed to
    git.

--------------------------------------------------------------------
8. MVP SCOPE (what's IN vs OUT for v1 launch)
--------------------------------------------------------------------

  IN (MVP):
    - Signup + profile completion (customer & business)
    - Admin approval + document verification
    - Wallet with starting credit limit
    - QR-based trade with PIN verification
    - 5%/5% commission auto-deducted to CompanyAccount
    - Fixed $10 monthly fee (automated)
    - Business listings with category/price/country/keyword filters
      + sorting
    - Admin dashboard (users, transactions, company account,
      currency rates)
    - Multi-currency DISPLAY (admin-controlled manual rates)
    - Forgot-PIN flow

  OUT (Phase 2 / later — do not build unless asked):
    - Any real payment gateway / banking integration
    - Live exchange rate API
    - Ratings/reviews on businesses
    - Push notifications / SMS
    - In-app chat
    - Dispute resolution system
    - Multi-admin roles/permissions
    - Mobile app (native)
    - Referral/loyalty system

--------------------------------------------------------------------
9. SUGGESTED FOLDER STRUCTURE (backend)
--------------------------------------------------------------------

  src/
    config/          -> env config, prisma client, logger, passport
    controllers/      -> route handler functions
    services/          -> business logic (wallet, transaction, fee, etc.)
    routes/v1/          -> Express route definitions
    middlewares/      -> auth, PIN verification, error handling
    validations/      -> Joi/Zod schemas for request validation
    utils/           -> helpers (QR generation, receipt id, etc.)
  prisma/
    schema.prisma
    migrations/
  api/
    index.js         -> Vercel serverless entry (exports Express app)

--------------------------------------------------------------------
10. REQUIRED ENVIRONMENT VARIABLES
--------------------------------------------------------------------

  NODE_ENV
  PORT
  DATABASE_URL              (PostgreSQL connection string)
  JWT_SECRET
  JWT_ACCESS_EXPIRATION_MINUTES
  JWT_REFRESH_EXPIRATION_DAYS
  MONTHLY_FEE_AMOUNT         (default 10, keep configurable)
  TRADE_COMMISSION_PERCENT   (default 5, keep configurable per side)
  SMTP_* / RESEND_API_KEY    (for PIN reset emails, notifications)

--------------------------------------------------------------------
END OF DOCUMENT
--------------------------------------------------------------------
````

#### `src/config/roles.js`  — **REPLACE**

````js
// const allRoles = {
//     user: [],
//     admin: ['manageUsers', 'getUsers']
// }


// const roles = Object.keys(allRoles);
// const roleRights = new Map(Object.entries(allRoles));

// module.exports = {
//     roles,
//     roleRights
// }

const allRoles = {
    CUSTOMER: ['sendTrade', 'manageOwnWallet', 'manageOwnListings', 'viewDashboard'],
    BUSINESS: ['sendTrade', 'manageOwnWallet', 'manageOwnListings', 'viewDashboard'],
    ADMIN: [
        'manageUsers',
        'getUsers',
        'approveUsers',
        'manageWallets',
        'viewCompanyAccount',
    ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
    roles,
    roleRights,
};
````

#### `src/controllers/currency.controller.js`  — **REPLACE**

````js

const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');
const currencyService = require('../services/currency.service');

// Public, read-only: { base: 'USD', updatedAt, rates: { PKR: 280.1, ... } }
const getAllRates = catchAsync(async (req, res) => {
    res.send(await currencyService.getAllRates());
});

// The logged-in user's own currency: { currencyCode, rate }
const getMyCurrency = catchAsync(async (req, res) => {
    res.send(await currencyService.getUserCurrency(req.user.id));
});

// "Receiver will get ≈ X" preview for Send Money.
const previewConversion = catchAsync(async (req, res) => {
    const { receiverId, amount } = req.query;
    res.send(await currencyService.previewConversion(req.user.id, receiverId, amount, config.trade.commissionPercent));
});

module.exports = { getAllRates, getMyCurrency, previewConversion };
````

#### `src/controllers/listing.controller.js`  — **REPLACE**

````js

const httpStatus = require('http-status').default;
const catchAsync = require('../utils/catchAsync');
const listingService = require('../services/listing.service');
const cloudinaryService = require('../services/cloudinary.service');

const getUploadSignature = catchAsync(async (req, res) => {
    const data = cloudinaryService.generateListingUploadSignature();
    res.send(data);
});

const createListing = catchAsync(async (req, res) => {
    const listing = await listingService.createListing(req.user.id, req.body);
    res.status(httpStatus.CREATED).send(listing);
});

const updateListing = catchAsync(async (req, res) => {
    const listing = await listingService.updateListing(req.user.id, req.params.listingId, req.body);
    res.send(listing);
});

const deleteListing = catchAsync(async (req, res) => {
    const result = await listingService.deleteListing(req.user.id, req.params.listingId);
    if (result) {
        return res.send(result); // archived (paused) instead of deleted
    }
    res.status(httpStatus.NO_CONTENT).send();
});

const getListings = catchAsync(async (req, res) => {
    const result = await listingService.getListings(req.query, req.user?.id);
    res.send(result);
});

const getListing = catchAsync(async (req, res) => {
    const listing = await listingService.getListingById(req.params.listingId, req.user?.id);
    res.send(listing);
});

const getMyListings = catchAsync(async (req, res) => {
    const listings = await listingService.getMyListings(req.user.id);
    res.send(listings);
});

module.exports = { getUploadSignature, createListing, updateListing, deleteListing, getListings, getListing, getMyListings };
````

#### `src/job/currencyRate.job.js`  — **REPLACE**

````js

const cron = require('node-cron');
const logger = require('../config/logger');
const { exchangeRateService, currencyService } = require('../services');

// Every 6 hours.
// NOTE: on Vercel serverless this cron will not fire reliably — currencyService.getRates()
// also refreshes lazily whenever rates are older than 12h, so rates stay fresh either way.
cron.schedule('0 */6 * * *', async () => {
    try {
        await exchangeRateService.updateAllRates();
        currencyService.invalidateRateCache();
    } catch (err) {
        logger.error(`Currency rate update failed: ${err.message}`);
    }
});
````

#### `src/middlewares/auth.js`  — **REPLACE**

````js
const passport = require("passport");
const httpStatus = require('http-status').default
const ApiError = require("../utils/ApiError");
const { roleRights } = require("../config/roles");

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
    if (err || info || !user) {
        return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
    req.user = user;

    if (requiredRights.length) {
        const userRights = roleRights.get(user.role);
        const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
        if (!hasRequiredRights && req.params.userId !== user.id) {
            return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
        }
    }

    resolve();
};

const auth = (...requiredRights) => async (req, res, next) => {
    return new Promise((resolve, reject) => {
        passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
        .then(() => next())
        .catch((err) => next(err));
};

// For public routes that behave differently when the viewer happens to be logged in
// (e.g. the marketplace shows prices in the viewer's currency). Never rejects.
const optionalAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (!err && user) req.user = user;
        next();
    })(req, res, next);
};

module.exports = auth;
module.exports.optional = optionalAuth;
````

#### `src/routes/v1/currency.route.js`  — **REPLACE**

````js
const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { currencyValidation } = require('../../validations');
const { currencyController } = require('../../controllers');

const router = express.Router();

// Rates are 100% automatic (live API + background refresh) — read-only for everyone.
router.get('/', currencyController.getAllRates);
router.get('/me', auth(), currencyController.getMyCurrency);
router.get('/preview', auth(), validate(currencyValidation.previewConversion), currencyController.previewConversion);

module.exports = router;
````

#### `src/routes/v1/listing.route.js`  — **REPLACE**

````js
const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { listingController } = require('../../controllers');
const { listingValidation } = require('../../validations');

const router = express.Router();

// Specific routes BEFORE dynamic /:listingId (same rule as /users/me, /admin/users/pending)
router.get('/my-listings', auth('manageOwnListings'), listingController.getMyListings);
router.get('/upload-signature', auth('manageOwnListings'), listingController.getUploadSignature);

router.get('/', auth.optional, validate(listingValidation.getListings), listingController.getListings);
router.post('/', auth('manageOwnListings'), validate(listingValidation.createListing), listingController.createListing);

router.get('/:listingId', auth.optional, validate(listingValidation.getListing), listingController.getListing);
router.patch('/:listingId', auth('manageOwnListings'), validate(listingValidation.updateListing), listingController.updateListing);
router.delete('/:listingId', auth('manageOwnListings'), listingController.deleteListing);

module.exports = router;
````

#### `src/services/admin.service.js`  — **REPLACE**

````js
const { cloudinaryService, emailService } = require('.');
const config = require('../config/config');
const currencyService = require('./currency.service');
const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status').default;


const getPendingUsers = async (filter, options) => {
    const { role, limit = 10, page = 1 } = { ...filter, ...options };

    const where = {
        status: 'PENDING',
        AND: [
            { role: { not: 'ADMIN' } },
            ...(role ? [{ role }] : []),
        ],
    };

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                country: true,
                status: true,
                createdAt: true,
                businessProfile: { include: { documents: true } },
                customerProfile: true,
            },
            skip: (page - 1) * limit,
            take: Number(limit),
            orderBy: { createdAt: 'asc' },
        }),
        prisma.user.count({ where }),
    ]);

    return {
        results: users.map((u) => ({ ...u, currency: currencyService.getCurrencyCodeForCountry(u.country) })),
        page: Number(page),
        limit: Number(limit),
        totalResults: total,
        totalPages: Math.ceil(total / limit),
    };
};


const approveUser = async (userId, creditLimit) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (user.status !== 'PENDING') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Only pending users can be approved');
    }

    // Customers never get a trade limit: wallet starts at 0 balance / 0 credit limit,
    // whatever the admin sends. Only businesses get a limit.
    // For businesses the admin types the limit in the USER's own country currency
    // (e.g. PKR for a Pakistani user); it is stored as USD. The env default is treated as USD.
    let startingLimit = user.role === 'CUSTOMER' ? 0 : config.wallet.defaultCreditLimit;
    if (user.role !== 'CUSTOMER' && creditLimit !== undefined && creditLimit !== null) {
        const userCurrencyCode = await currencyService.getUserCurrencyCode(userId);
        startingLimit = await currencyService.toUsd(creditLimit, userCurrencyCode);
    }

    const updatedUser = await prisma.$transaction(async (tx) => {
        const updated = await tx.user.update({
            where: { id: userId },
            data: { status: 'APPROVED' },
        });

        await tx.wallet.create({
            data: { userId, balance: 0, creditLimit: startingLimit },
        });

        if (user.role === 'BUSINESS') {
            await tx.businessProfile.updateMany({
                where: { userId },
                data: { verificationStatus: 'APPROVED', verifiedAt: new Date() },
            });
        }

        return updated;
    });

    await emailService.sendApprovalEmail(updatedUser.email, updatedUser.name);

    return updatedUser;
};

const rejectUser = async (userId, reason) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (user.status !== 'PENDING') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Only pending users can be rejected');
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { status: 'REJECTED', rejectionReason: reason },
    });

    await emailService.sendRejectionEmail(updatedUser.email, updatedUser.name, reason);

    return updatedUser;
};


const getUserDetails = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            country: true,
            status: true,
            createdAt: true,
            businessProfile: { include: { documents: true } },
            customerProfile: true,
            rejectionReason: true
        },
    });

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // The currency the admin should enter this user's credit limit in.
    user.currency = currencyService.getCurrencyCodeForCountry(
        user.country || user.businessProfile?.country || user.customerProfile?.country,
    );

    if (user.businessProfile?.documents) {
        user.businessProfile.documents = user.businessProfile.documents.map((doc) => ({
            ...doc,
            viewUrl: cloudinaryService.generateSignedViewUrl(doc.publicId),
        }));
    }

    return user;
};
const getAllUsers = async (filters) => {
    const { role, status, search, page = 1, limit = 10 } = filters;

    const where = {
        AND: [
            { role: { not: 'ADMIN' } },
            ...(role ? [{ role }] : []),
        ],
        ...(status && { status }),
        ...(search && {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ],
        }),
    };

    const [results, total] = await Promise.all([
        prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                country: true,
                createdAt: true,
                businessProfile: { select: { businessName: true } },
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: Number(limit),
        }),
        prisma.user.count({ where }),
    ]);

    return {
        results,
        page: Number(page),
        limit: Number(limit),
        totalResults: total,
        totalPages: Math.ceil(total / limit),
    };
};

const blockUser = async (userId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    if (user.role === 'ADMIN') throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot block an admin account');
    if (user.status === 'BLOCKED') throw new ApiError(httpStatus.BAD_REQUEST, 'User is already blocked');

    // Blocking should also kill any active sessions immediately.
    await prisma.token.deleteMany({ where: { userId } });

    return prisma.user.update({ where: { id: userId }, data: { status: 'BLOCKED' } });
};

const unblockUser = async (userId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    if (user.status !== 'BLOCKED') throw new ApiError(httpStatus.BAD_REQUEST, 'User is not blocked');

    return prisma.user.update({ where: { id: userId }, data: { status: 'APPROVED' } });
};

const companyAccountService = require('./companyAccount.service');

const fundAdminWallet = async (adminId, amount) => {
    const companyAccount = await companyAccountService.getOrCreateCompanyAccount();

    if (Number(companyAccount.totalBalance) < amount) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient company account balance');
    }

    const updatedRequest = await prisma.$transaction(async (tx) => {
        await tx.companyAccount.update({
            where: { id: companyAccountService.ACCOUNT_ID },
            data: { totalBalance: { decrement: amount } },
        });

        const wallet = await tx.wallet.upsert({
            where: { userId: adminId },
            create: { userId: adminId, balance: amount, creditLimit: 0 },
            update: { balance: { increment: amount } },
        });

        await tx.companyFundingLog.create({
            data: { adminId, amount },
        });

        return wallet;
    });
};

const getProfileUpdateRequests = async (status = 'PENDING') => {
    return prisma.profileUpdateRequest.findMany({
        where: { status },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    businessProfile: { include: { documents: true } },
                    customerProfile: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
};

const getProfileUpdateRequestById = async (requestId) => {
    const request = await prisma.profileUpdateRequest.findUnique({
        where: { id: requestId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    businessProfile: { include: { documents: true } },
                    customerProfile: true,
                },
            },
        },
    });
    if (!request) throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
    return request;
};

const approveProfileUpdateRequest = async (requestId) => {
    const request = await prisma.profileUpdateRequest.findUnique({ where: { id: requestId }, include: { user: true } });

    if (!request) throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
    if (request.status !== 'PENDING') throw new ApiError(httpStatus.BAD_REQUEST, 'Request already reviewed');

    const isBusiness = request.user.role === 'BUSINESS';

    return prisma.$transaction(async (tx) => {
        if (isBusiness) {
            await tx.businessProfile.update({
                where: { userId: request.userId },
                data: request.proposedData,
            });

            if (request.documentIdsToRemove?.length) {
                await tx.businessDocument.deleteMany({
                    where: { id: { in: request.documentIdsToRemove } },
                });
            }

            if (request.documentsToAdd?.length) {
                const businessProfile = await tx.businessProfile.findUnique({ where: { userId: request.userId } });
                await tx.businessDocument.createMany({
                    data: request.documentsToAdd.map((doc) => ({
                        businessProfileId: businessProfile.id,
                        fileUrl: doc.url,
                        publicId: doc.publicId,
                        fileType: doc.fileType,
                    })),
                });
            }
        } else {
            await tx.customerProfile.update({
                where: { userId: request.userId },
                data: request.proposedData,
            });
        }

        return tx.profileUpdateRequest.update({
            where: { id: requestId },
            data: { status: 'APPROVED', reviewedAt: new Date() },
        });
    });

    await emailService.sendProfileUpdateApprovedEmail(request.user.email);
    return updatedRequest;
};

const rejectProfileUpdateRequest = async (requestId, reason) => {
    const request = await prisma.profileUpdateRequest.findUnique({ where: { id: requestId }, include: { user: true } });

    if (!request) throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
    if (request.status !== 'PENDING') throw new ApiError(httpStatus.BAD_REQUEST, 'Request already reviewed');

    const updatedRequest = await prisma.profileUpdateRequest.update({
        where: { id: requestId },
        data: { status: 'REJECTED', rejectionReason: reason, reviewedAt: new Date() },
    });

    await emailService.sendProfileUpdateRejectedEmail(request.user?.email, reason);
    return updatedRequest;
};


module.exports = {
    getPendingUsers,
    approveUser,
    rejectUser,
    getUserDetails,
    getAllUsers,
    blockUser,
    unblockUser,
    fundAdminWallet,
    getProfileUpdateRequests,
    getProfileUpdateRequestById,
    approveProfileUpdateRequest,
    rejectProfileUpdateRequest,
};
````

#### `src/services/barter.service.js`  — **REPLACE**

````js

const httpStatus = require('http-status').default;
const prisma = require('../config/prisma');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const emailService = require('./email.service');
const companyAccountService = require('./companyAccount.service');
const currencyService = require('./currency.service');
const { roundUsd } = require('../utils/money');

const createOffer = async (offererId, offererListingId, targetListingId) => {
    const [offererListing, targetListing] = await Promise.all([
        prisma.listing.findUnique({ where: { id: offererListingId } }),
        prisma.listing.findUnique({ where: { id: targetListingId } }),
    ]);

    if (!offererListing || offererListing.businessId !== offererId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You do not own the offered listing');
    }
    if (!targetListing || targetListing.status !== 'ACTIVE') {
        throw new ApiError(httpStatus.NOT_FOUND, 'Target listing not available');
    }
    if (targetListing.businessId === offererId) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'You cannot barter with your own listing');
    }
    if (offererListing.status !== 'ACTIVE') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Your listing must be active to make an offer');
    }

    const offer = await prisma.barterOffer.create({
        data: {
            offererListingId,
            offererId,
            targetListingId,
            targetOwnerId: targetListing.businessId,
        },
    });

    const [offerer, targetOwner] = await Promise.all([
        prisma.user.findUnique({ where: { id: offer.offererId }, select: { email: true } }),
        prisma.user.findUnique({ where: { id: offer.targetOwnerId }, select: { email: true } }),
    ]);
    await Promise.all([
        emailService.sendBarterOfferSentEmail(offerer.email),
        emailService.sendBarterOfferReceivedEmail(targetOwner.email),
    ]);

    return offer;
};

const acceptOffer = async (targetOwnerId, offerId) => {
    const offer = await prisma.barterOffer.findUnique({ where: { id: offerId } });

    if (!offer) throw new ApiError(httpStatus.NOT_FOUND, 'Offer not found');
    if (offer.targetOwnerId !== targetOwnerId) throw new ApiError(httpStatus.FORBIDDEN, 'This offer is not yours to accept');
    if (offer.status !== 'PENDING') throw new ApiError(httpStatus.BAD_REQUEST, 'Offer is no longer pending');

    return prisma.$transaction(async (tx) => {
        const [offererListing, targetListing, wallets] = await Promise.all([
            tx.listing.findUnique({ where: { id: offer.offererListingId } }),
            tx.listing.findUnique({ where: { id: offer.targetListingId } }),
            tx.wallet.findMany({ where: { userId: { in: [offer.offererId, offer.targetOwnerId] } } }),
        ]);

        if (!offererListing || !targetListing) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Barter listings are no longer available');
        }

        const commissionPercent = config.trade.commissionPercent;
        const commissionBuyer = roundUsd((Number(offererListing.price) * commissionPercent) / 100);
        const commissionSeller = roundUsd((Number(targetListing.price) * commissionPercent) / 100);
        const offererWallet = wallets.find((wallet) => wallet.userId === offer.offererId);
        const targetOwnerWallet = wallets.find((wallet) => wallet.userId === offer.targetOwnerId);

        if (!offererWallet || !targetOwnerWallet) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Both users must have a wallet to accept a barter offer');
        }
        if (Number(offererWallet.balance) - commissionBuyer < -Number(offererWallet.creditLimit)
            || Number(targetOwnerWallet.balance) - commissionSeller < -Number(targetOwnerWallet.creditLimit)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient balance / credit limit for barter commission');
        }

        await Promise.all([
            tx.wallet.update({
                where: { userId: offer.offererId },
                data: { balance: { decrement: commissionBuyer } },
            }),
            tx.wallet.update({
                where: { userId: offer.targetOwnerId },
                data: { balance: { decrement: commissionSeller } },
            }),
        ]);
        await companyAccountService.creditCompanyAccount(tx, roundUsd(commissionBuyer + commissionSeller));
        await tx.monthlyFeeLog.createMany({
            data: [
                { userId: offer.offererId, amount: commissionBuyer, type: 'TRADE_COMMISSION' },
                { userId: offer.targetOwnerId, amount: commissionSeller, type: 'TRADE_COMMISSION' },
            ],
        });

        await tx.listing.update({ where: { id: offer.offererListingId }, data: { status: 'TRADED' } });
        await tx.listing.update({ where: { id: offer.targetListingId }, data: { status: 'TRADED' } });

        return tx.barterOffer.update({
            where: { id: offerId },
            data: { status: 'ACCEPTED', respondedAt: new Date() },
        });
    });
};

const rejectOffer = async (targetOwnerId, offerId) => {
    const offer = await prisma.barterOffer.findUnique({ where: { id: offerId } });

    if (!offer) throw new ApiError(httpStatus.NOT_FOUND, 'Offer not found');
    if (offer.targetOwnerId !== targetOwnerId) throw new ApiError(httpStatus.FORBIDDEN, 'This offer is not yours to reject');
    if (offer.status !== 'PENDING') throw new ApiError(httpStatus.BAD_REQUEST, 'Offer is no longer pending');

    return prisma.barterOffer.update({
        where: { id: offerId },
        data: { status: 'REJECTED', respondedAt: new Date() },
    });
};

const cancelOffer = async (offererId, offerId) => {
    const offer = await prisma.barterOffer.findUnique({ where: { id: offerId } });

    if (!offer) throw new ApiError(httpStatus.NOT_FOUND, 'Offer not found');
    if (offer.offererId !== offererId) throw new ApiError(httpStatus.FORBIDDEN, 'This offer is not yours to cancel');
    if (offer.status !== 'PENDING') throw new ApiError(httpStatus.BAD_REQUEST, 'Offer is no longer pending');

    return prisma.barterOffer.update({
        where: { id: offerId },
        data: { status: 'CANCELLED', respondedAt: new Date() },
    });
};

// Listing prices inside an offer are shown in the viewer's own currency.
const withOfferDisplay = (offer, viewerCurrency) => ({
    ...offer,
    offererListing: offer.offererListing
        ? currencyService.attachDisplay(offer.offererListing, ['price'], viewerCurrency)
        : offer.offererListing,
    targetListing: offer.targetListing
        ? currencyService.attachDisplay(offer.targetListing, ['price'], viewerCurrency)
        : offer.targetListing,
});

const getMyOffers = async (offererId) => {
    const [offers, viewerCurrency] = await Promise.all([
        prisma.barterOffer.findMany({
            where: { offererId },
            include: { offererListing: true, targetListing: true },
            orderBy: { createdAt: 'desc' },
        }),
        currencyService.getUserCurrency(offererId),
    ]);
    return offers.map((offer) => withOfferDisplay(offer, viewerCurrency));
};

const getReceivedOffers = async (targetOwnerId) => {
    const [offers, viewerCurrency] = await Promise.all([
        prisma.barterOffer.findMany({
            where: { targetOwnerId },
            include: { offererListing: true, targetListing: true },
            orderBy: { createdAt: 'desc' },
        }),
        currencyService.getUserCurrency(targetOwnerId),
    ]);
    return offers.map((offer) => withOfferDisplay(offer, viewerCurrency));
};

const profileSelect = {
    select: {
        id: true,
        name: true,
        role: true,
        businessProfile: { select: { businessName: true, streetNumber: true, streetName: true, city: true, state: true, postcode: true } },
        customerProfile: { select: { city: true, address: true } },
    },
};

const getOfferById = async (userId, offerId) => {
    const offer = await prisma.barterOffer.findUnique({
        where: { id: offerId },
        include: {
            offererListing: true,
            targetListing: true,
            offerer: profileSelect,
            targetOwner: profileSelect,
        },
    });

    if (!offer) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Offer not found');
    }
    if (offer.offererId !== userId && offer.targetOwnerId !== userId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You do not have access to this offer');
    }

    const viewerCurrency = await currencyService.getUserCurrency(userId);
    return withOfferDisplay(offer, viewerCurrency);
};

module.exports = { createOffer, acceptOffer, rejectOffer, cancelOffer, getMyOffers, getReceivedOffers, getOfferById };
````

#### `src/services/business.service.js`  — **REPLACE**

````js

const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status').default;
const cloudinaryService = require('./cloudinary.service');

const getUploadSignature = () => cloudinaryService.generateUploadSignature();

const completeBusinessProfile = async (userId, data) => {
    const payload = { ...data };
    if (payload.declarationAccepted === true) {
        payload.declarationAcceptedAt = new Date();
    }
    return prisma.businessProfile.upsert({
        where: { userId },
        create: { userId, ...payload },
        update: payload,
    });
};


const saveBusinessDocuments = async (userId, documents) => {
    const businessProfile = await prisma.businessProfile.findUnique({ where: { userId } });
    if (!businessProfile) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Complete your business profile first');
    }

    return prisma.$transaction(
        documents.map((doc) =>
            prisma.businessDocument.create({
                data: {
                    businessProfileId: businessProfile.id,
                    fileUrl: doc.url,
                    publicId: doc.publicId,
                    fileType: doc.fileType,
                },
            })
        )
    );
};

const getMyBusinessProfile = async (userId) => {
    const profile = await prisma.businessProfile.findUnique({
        where: { userId },
        include: { documents: true },
    });
    if (!profile) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Business profile not found');
    }
    return profile;
};

module.exports = { completeBusinessProfile, saveBusinessDocuments, getUploadSignature, getMyBusinessProfile };
````

#### `src/services/currency.service.js`  — **REPLACE**

````js
const httpStatus = require('http-status').default;
const countryToCurrency = require('country-to-currency');
const isoCountries = require('i18n-iso-countries');
const prisma = require('../config/prisma');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');
const { roundUsd, roundForCurrency, getCurrencyDecimals } = require('../utils/money');

isoCountries.registerLocale(require('i18n-iso-countries/langs/en.json'));

const COUNTRY_TO_CURRENCY = countryToCurrency.default || countryToCurrency; // { PK: 'PKR', US: 'USD', ... }
const BASE_CURRENCY = 'USD';
const COUNTRY_ALIASES = { UK: 'GB', UAE: 'AE', USA: 'US', 'U.S.A.': 'US', 'U.S.': 'US', 'U.K.': 'GB', KOREA: 'KR', RUSSIA: 'RU', TURKEY: 'TR' };
const STALE_AFTER_MS = 12 * 60 * 60 * 1000; // lazily refresh if rates are older than this

// ---------------------------------------------------------------
// Country name  ->  currency code
// ---------------------------------------------------------------
// Users type their country as free text, so first resolve it to an ISO code
// (handles "USA", "UK", "United States of America" ...), then to a currency.
const getCurrencyCodeForCountry = (country) => {
    if (!country || typeof country !== 'string') return BASE_CURRENCY;
    const name = country.trim();
    const upper = name.toUpperCase();
    // "UK" is not an ISO code (GB is), so alias the common informal names first.
    const alpha2 = COUNTRY_ALIASES[upper]
        || (name.length === 2 && isoCountries.isValid(upper) ? upper : isoCountries.getAlpha2Code(name, 'en'));
    return (alpha2 && COUNTRY_TO_CURRENCY[alpha2]) || BASE_CURRENCY;
};

// ---------------------------------------------------------------
// Live rate cache (in memory, backed by the currency_rates table)
// ---------------------------------------------------------------
let rateCache = { rates: null, loadedAt: 0 };
let refreshPromise = null;

const loadFromDb = async () => {
    const rows = await prisma.currencyRate.findMany();
    if (!rows.length) return null;
    const rates = {};
    rows.forEach((row) => { rates[row.currencyCode] = Number(row.rate); });
    const newest = rows.reduce((max, row) => Math.max(max, row.updatedAt.getTime()), 0);
    rateCache = { rates, loadedAt: newest };
    return rates;
};

const refreshRates = async () => {
    // lazy require to avoid a circular import with exchangeRate.service
    const exchangeRateService = require('./exchangeRate.service');
    if (!refreshPromise) {
        refreshPromise = exchangeRateService.updateAllRates()
            .then(() => loadFromDb())
            .finally(() => { refreshPromise = null; });
    }
    return refreshPromise;
};

// Returns { CODE: unitsPerUSD }. Never throws if we have ANY previously saved rates —
// a failed refresh just keeps using the last known ones.
const getRates = async () => {
    const now = Date.now();
    if (rateCache.rates && now - rateCache.loadedAt < STALE_AFTER_MS) return rateCache.rates;

    if (!rateCache.rates) await loadFromDb();
    if (rateCache.rates && now - rateCache.loadedAt < STALE_AFTER_MS) return rateCache.rates;

    try {
        await refreshRates();
    } catch (err) {
        logger.error(`Live rate refresh failed, using last known rates: ${err.message}`);
    }

    if (!rateCache.rates) {
        throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, 'Exchange rates are not available yet, please try again shortly');
    }
    return rateCache.rates;
};

const invalidateRateCache = () => { rateCache = { rates: null, loadedAt: 0 }; };

const getRate = async (currencyCode) => {
    if (currencyCode === BASE_CURRENCY) return 1;
    const rates = await getRates();
    const rate = rates[currencyCode];
    if (!rate) throw new ApiError(httpStatus.BAD_REQUEST, `No live exchange rate available for ${currencyCode}`);
    return rate;
};

// ---------------------------------------------------------------
// Conversion helpers (reusable everywhere)
// ---------------------------------------------------------------
// Local currency -> USD (used to store what a user typed). Result keeps 6 decimals.
const toUsd = async (amount, fromCurrencyCode) => {
    const rate = await getRate(fromCurrencyCode);
    return roundUsd(Number(amount) / rate);
};

// USD -> target currency (used for display). Rounded to that currency's decimals.
const convert = async (amountInUSD, targetCurrencyCode) => {
    const rate = await getRate(targetCurrencyCode);
    return roundForCurrency(Number(amountInUSD) * rate, targetCurrencyCode);
};

// Same as convert() but with an already-fetched rate (no async, for loops/lists).
const convertWithRate = (amountInUSD, rate, targetCurrencyCode) =>
    roundForCurrency(Number(amountInUSD) * rate, targetCurrencyCode);

// ---------------------------------------------------------------
// Who is the user, and what currency do they trade in?
// ---------------------------------------------------------------
const getUserCurrencyCode = async (userId, client = prisma) => {
    if (!userId) return BASE_CURRENCY;
    const user = await client.user.findUnique({
        where: { id: userId },
        select: {
            country: true,
            businessProfile: { select: { country: true } },
            customerProfile: { select: { country: true } },
        },
    });
    const country = user?.country || user?.businessProfile?.country || user?.customerProfile?.country;
    return getCurrencyCodeForCountry(country);
};

// { currencyCode, rate } — rate is units of that currency per 1 USD.
const getUserCurrency = async (userId, client = prisma) => {
    const currencyCode = await getUserCurrencyCode(userId, client);
    return { currencyCode, rate: await getRate(currencyCode) };
};

// ---------------------------------------------------------------
// Response shaping: keep the real USD fields and add a `display` block
// ---------------------------------------------------------------
// attachDisplay(order, ['amount','commissionBuyer'], { currencyCode, rate })
// -> order.display = { currency:'PKR', amount: 1000, commissionBuyer: 50 }
const attachDisplay = (record, fields, { currencyCode, rate }) => {
    if (!record) return record;
    const plain = typeof record.toJSON === 'function' ? record.toJSON() : record;
    const display = { currency: currencyCode };
    fields.forEach((field) => {
        if (plain[field] !== undefined && plain[field] !== null) {
            display[field] = convertWithRate(plain[field], rate, currencyCode);
        }
    });
    return { ...plain, display };
};

// ---------------------------------------------------------------
// Read-only info for the frontend
// ---------------------------------------------------------------
const getAllRates = async () => {
    const rates = await getRates();
    return {
        base: BASE_CURRENCY,
        updatedAt: new Date(rateCache.loadedAt).toISOString(),
        rates,
    };
};

// Powers "Receiver will get ≈ X" under the amount input.
const previewConversion = async (senderId, receiverId, amount, commissionPercent) => {
    const [sender, receiver] = await Promise.all([getUserCurrency(senderId), getUserCurrency(receiverId)]);
    const usdAmount = roundUsd(Number(amount) / sender.rate);
    const netUsd = roundUsd(usdAmount - (usdAmount * commissionPercent) / 100);
    return {
        senderCurrency: sender.currencyCode,
        receiverCurrency: receiver.currencyCode,
        senderAmount: Number(amount),
        usdAmount,
        receiverAmount: convertWithRate(usdAmount, receiver.rate, receiver.currencyCode),
        receiverNetAmount: convertWithRate(netUsd, receiver.rate, receiver.currencyCode),
        decimals: getCurrencyDecimals(receiver.currencyCode),
    };
};

module.exports = {
    BASE_CURRENCY,
    getCurrencyCodeForCountry,
    getRates,
    getRate,
    invalidateRateCache,
    toUsd,
    convert,
    convertWithRate,
    getUserCurrencyCode,
    getUserCurrency,
    attachDisplay,
    getAllRates,
    previewConversion,
};
````

#### `src/services/dashboard.service.js`  — **REPLACE**

````js
const httpStatus = require('http-status').default;
const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const currencyService = require('./currency.service');

const VALID_PERIODS = [7, 30, 90];

const normalizePeriod = (period) => {
    const normalizedPeriod = period === undefined ? 7 : Number(period);

    if (!Number.isInteger(normalizedPeriod) || !VALID_PERIODS.includes(normalizedPeriod)) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            'Period must be one of 7, 30, or 90'
        );
    }

    return normalizedPeriod;
};

const toDateKey = (date) => date.toISOString().slice(0, 10);

const getStartDate = (period) => {
    const startDate = new Date();
    startDate.setUTCHours(0, 0, 0, 0);
    startDate.setUTCDate(startDate.getUTCDate() - (period - 1));
    return startDate;
};

const buildSalesChart = (orders, startDate, period, dateField) => {
    const buckets = new Map();

    for (let index = 0; index < period; index += 1) {
        const date = new Date(startDate);
        date.setUTCDate(date.getUTCDate() + index);
        buckets.set(toDateKey(date), { date: toDateKey(date), amount: 0, orders: 0 });
    }

    orders.forEach((order) => {
        const date = toDateKey(order[dateField]);
        const bucket = buckets.get(date);
        if (!bucket) return;

        bucket.amount += Number(order.amount);
        bucket.orders += 1;
    });

    return Array.from(buckets.values()).map((bucket) => ({
        ...bucket,
        amount: Number(bucket.amount.toFixed(2)),
    }));
};

const createDashboardService = (client = prisma) => ({
    async getSummary(user) {
        if (!['CUSTOMER', 'BUSINESS'].includes(user.role)) {
            throw new ApiError(httpStatus.FORBIDDEN, 'Dashboard is only available to customers and businesses');
        }



        const orderWhere = user.role === 'BUSINESS' ? { sellerId: user.id } : { buyerId: user.id };
        const barterWhere = { OR: [{ offererId: user.id }, { targetOwnerId: user.id }] };

        const [totalOrders, totalBarterOffers, totalListings, sales] = await Promise.all([
            client.order.count({ where: orderWhere }),
            client.barterOffer.count({ where: barterWhere }),
            client.listing.count({ where: { businessId: user.id } }),
            user.role === 'BUSINESS'
                ? client.order.aggregate({
                    where: { sellerId: user.id, status: 'COMPLETED' },
                    _sum: { amount: true },
                })
                : Promise.resolve({ _sum: { amount: null } }),
        ]);

        const summary = { totalOrders, totalBarterOffers, totalListings };
        if (user.role === 'BUSINESS') {
            // Ledger is USD; show total sales in the business's own currency.
            const viewerCurrency = await currencyService.getUserCurrency(user.id, client);
            summary.totalSales = currencyService.convertWithRate(
                Number(sales._sum.amount || 0),
                viewerCurrency.rate,
                viewerCurrency.currencyCode,
            );
            summary.currency = viewerCurrency.currencyCode;
        }

        return summary;
    },

    async getSalesChart(user, period = 7) {
        if (!['CUSTOMER', 'BUSINESS'].includes(user.role)) {
            throw new ApiError(
                httpStatus.FORBIDDEN,
                'Dashboard is only available to customers and businesses'
            );
        }

        const normalizedPeriod = normalizePeriod(period);
        const startDate = getStartDate(normalizedPeriod);
        const dateField = user.role === 'BUSINESS' ? 'completedAt' : 'createdAt';

        const where = user.role === 'BUSINESS'
            ? {
                sellerId: user.id,
                status: 'COMPLETED',
                completedAt: { gte: startDate },
            }
            : {
                buyerId: user.id,
                createdAt: { gte: startDate },
            };

        const [orders, viewerCurrency] = await Promise.all([
            client.order.findMany({
                where,
                select: {
                    amount: true,
                    [dateField]: true,
                },
            }),
            currencyService.getUserCurrency(user.id, client),
        ]);

        // Convert each USD order amount into the viewer's currency before bucketing per day.
        const converted = orders.map((order) => ({
            ...order,
            amount: Number(order.amount) * viewerCurrency.rate,
        }));

        return {
            period: normalizedPeriod,
            currency: viewerCurrency.currencyCode,
            data: buildSalesChart(
                converted,
                startDate,
                normalizedPeriod,
                dateField
            ),
        };
    }
});

const dashboardService = createDashboardService();

module.exports = {
    ...dashboardService,
    createDashboardService,
    buildSalesChart,
    getStartDate,
    normalizePeriod,
    VALID_PERIODS,
};
````

#### `src/services/exchangeRate.service.js`  — **REPLACE**

````js
const axios = require('axios');
const prisma = require('../config/prisma');
const logger = require('../config/logger');

const API_URL = 'https://open.er-api.com/v6/latest/USD'; // free, no API key, all currencies in one call

// Fetches every currency in ONE call and upserts them all into currency_rates.
// rate = units of currency per 1 USD.
const updateAllRates = async () => {
    const { data } = await axios.get(API_URL, { timeout: 10000 });

    if (data?.result !== 'success' || !data.rates) {
        throw new Error('Unexpected response from exchange rate API');
    }

    const entries = Object.entries(data.rates).filter(([, rate]) => Number(rate) > 0);

    // One transaction so readers never see a half-updated table.
    await prisma.$transaction(
        entries.map(([currencyCode, rate]) =>
            prisma.currencyRate.upsert({
                where: { currencyCode },
                create: { currencyCode, rate },
                update: { rate },
            })
        )
    );

    logger.info(`Currency rates updated from live API (${entries.length} currencies)`);
    return entries.length;
};

module.exports = { updateAllRates };
````

#### `src/services/listing.service.js`  — **REPLACE**

````js
const httpStatus = require('http-status').default;
const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const emailService = require('./email.service');
const currencyService = require('./currency.service');


// Price arrives in the SELLER's own currency and is stored as USD.
// Any listing returned to a viewer gets a `display` block in the viewer's currency.
const withDisplay = (listing, viewerCurrency) =>
    currencyService.attachDisplay(listing, ['price'], viewerCurrency);

const createListing = async (userId, data) => {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true, email: true } });

    const isPublic = data.isPublic !== undefined ? data.isPublic : user.role === 'BUSINESS';
    const sellerCurrency = await currencyService.getUserCurrency(userId);
    const priceUsd = await currencyService.toUsd(data.price, sellerCurrency.currencyCode);

    const listing = await prisma.listing.create({
        data: { businessId: userId, ...data, price: priceUsd, isPublic },
    });

    await emailService.sendListingAddedEmail(user.email, listing.title);
    return withDisplay(listing, sellerCurrency);
};


const updateListing = async (businessId, listingId, data) => {
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });

    if (!listing) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Listing not found');
    }
    if (listing.businessId !== businessId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You do not own this listing');
    }

    const sellerCurrency = await currencyService.getUserCurrency(businessId);
    const updateData = { ...data };
    if (data.price !== undefined) {
        updateData.price = await currencyService.toUsd(data.price, sellerCurrency.currencyCode);
    }

    const updated = await prisma.listing.update({ where: { id: listingId }, data: updateData });
    return withDisplay(updated, sellerCurrency);
};

const deleteListing = async (businessId, listingId) => {
    const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        include: { _count: { select: { barterOffersFrom: true, barterOffersTarget: true, ordersFor: true } } },
    });

    if (!listing) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Listing not found');
    }
    if (listing.businessId !== businessId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You do not own this listing');
    }

    const hasHistory =
        listing._count.barterOffersFrom > 0 || listing._count.barterOffersTarget > 0 || listing._count.ordersFor > 0;

    if (hasHistory) {
        // Can't hard-delete a listing with trade/offer history — soft-delete it
        // (isDeleted: true) so existing orders/offers keep a valid reference,
        // but hide it from the owner's "My Listings" and public browse.
        return prisma.listing.update({
            where: { id: listingId },
            data: { status: 'PAUSED', isDeleted: true },
        });
    }

    await prisma.listing.delete({ where: { id: listingId } });
};

const getListings = async (filters, viewerId) => {
    const { category, country, search, sort, page = 1, limit = 12 } = filters;
    let { minPrice, maxPrice } = filters;

    // The viewer types min/max in THEIR currency; listings are stored in USD.
    const viewerCurrency = await currencyService.getUserCurrency(viewerId);
    if (minPrice != null) minPrice = await currencyService.toUsd(minPrice, viewerCurrency.currencyCode);
    if (maxPrice != null) maxPrice = await currencyService.toUsd(maxPrice, viewerCurrency.currencyCode);

    const where = {
        status: 'ACTIVE',
        isPublic: true,
        isDeleted: false,
        ...(category && { category }),
        ...(country && { business: { businessProfile: { country } } }),
        ...(minPrice != null || maxPrice != null
            ? {
                price: {
                    ...(minPrice != null && { gte: minPrice }),
                    ...(maxPrice != null && { lte: maxPrice }),
                },
            }
            : {}),
        ...(search && {
            OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ],
        }),
    };

    const orderBy =
        sort === 'priceAsc' ? { price: 'asc' } : sort === 'priceDesc' ? { price: 'desc' } : { createdAt: 'desc' };

    const [results, total] = await Promise.all([
        prisma.listing.findMany({
            where,
            include: {
                business: {
                    select: {
                        id: true,
                        name: true,
                        businessProfile: { select: { businessName: true, country: true, city: true } },
                    },
                },
            },
            orderBy,
            skip: (page - 1) * limit,
            take: Number(limit),
        }),
        prisma.listing.count({ where }),
    ]);

    return {
        results: results.map((listing) => withDisplay(listing, viewerCurrency)),
        currency: viewerCurrency.currencyCode,
        page: Number(page),
        limit: Number(limit),
        totalResults: total,
        totalPages: Math.ceil(total / limit),
    };
};

const getListingById = async (listingId, viewerId) => {
    const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        include: {
            business: {
                select: {
                    id: true,
                    name: true,
                    businessProfile: { select: { businessName: true, country: true, city: true, phone: true } },
                },
            },
        },
    });

    if (!listing) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Listing not found');
    }
    const viewerCurrency = await currencyService.getUserCurrency(viewerId);
    return withDisplay(listing, viewerCurrency);
};

const getMyListings = async (businessId) => {
    const [listings, viewerCurrency] = await Promise.all([
        prisma.listing.findMany({
            where: { businessId, isDeleted: false },
            orderBy: { createdAt: 'desc' },
        }),
        currencyService.getUserCurrency(businessId),
    ]);
    return listings.map((listing) => withDisplay(listing, viewerCurrency));
};

module.exports = { createListing, updateListing, deleteListing, getListings, getListingById, getMyListings };
````

#### `src/services/order.service.js`  — **REPLACE**

````js


const httpStatus = require('http-status').default;
const prisma = require('../config/prisma');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const walletService = require('./wallet.service');
const companyAccountService = require('./companyAccount.service');
const emailService = require('./email.service');
const currencyService = require('./currency.service');
const { roundUsd } = require('../utils/money');

const ORDER_DISPLAY_FIELDS = ['amount', 'commissionBuyer', 'commissionSeller', 'netAmountToSeller'];

const createOrder = async (buyerId, listingId, pin) => {
    const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        include: { business: { select: { id: true } } },
    });

    if (!listing || listing.status !== 'ACTIVE') {
        throw new ApiError(httpStatus.NOT_FOUND, 'Listing not available');
    }
    if (listing.businessId === buyerId) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'You cannot order your own listing');
    }

    await walletService.verifyPin(buyerId, pin);

    const buyerWallet = await prisma.wallet.findUnique({ where: { userId: buyerId } });
    if (!buyerWallet) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Your wallet is not set up yet');
    }

    const buyerCurrency = await currencyService.getUserCurrency(buyerId);

    // Listing price is already USD — the buyer just sees it converted, the ledger uses USD.
    const amount = Number(listing.price);
    const commissionPercent = config.trade.commissionPercent;
    const commissionBuyer = roundUsd((amount * commissionPercent) / 100);
    const commissionSeller = roundUsd((amount * commissionPercent) / 100);
    const netAmountToSeller = roundUsd(amount - commissionSeller);
    const totalDebit = roundUsd(amount + commissionBuyer);

    const projectedBalance = Number(buyerWallet.balance) - totalDebit;
    if (projectedBalance < -Number(buyerWallet.creditLimit)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient balance / credit limit for this order');
    }

    const order = await prisma.$transaction(async (tx) => {
        // Debit buyer now — funds are "held" (not yet credited to seller/company)
        await tx.wallet.update({
            where: { userId: buyerId },
            data: { balance: { decrement: totalDebit } },
        });

        // Prevent double-ordering the same item while it's in escrow
        await tx.listing.update({ where: { id: listingId }, data: { status: 'PAUSED' } });

        return tx.order.create({
            data: {
                listingId,
                buyerId,
                sellerId: listing.businessId,
                amount,
                buyerCurrency: buyerCurrency.currencyCode,
                buyerRate: buyerCurrency.rate,
                commissionBuyer,
                commissionSeller,
                netAmountToSeller,
                status: 'ESCROW_HELD',
            },
        });
    });

    const [buyer, seller] = await Promise.all([
        prisma.user.findUnique({ where: { id: order.buyerId }, select: { email: true } }),
        prisma.user.findUnique({ where: { id: order.sellerId }, select: { email: true } }),
    ]);
    await Promise.all([
        emailService.sendOrderPlacedEmail(buyer.email),
        emailService.sendNewOrderReceivedEmail(seller.email),
    ]);

    return currencyService.attachDisplay(order, ORDER_DISPLAY_FIELDS, buyerCurrency);
};

const completeOrder = async (buyerId, orderId) => {
    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order) throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    if (order.buyerId !== buyerId) throw new ApiError(httpStatus.FORBIDDEN, 'You do not own this order');
    if (order.status !== 'ESCROW_HELD') throw new ApiError(httpStatus.BAD_REQUEST, 'Order is not in escrow');

    const completed = await prisma.$transaction(async (tx) => {
        await tx.wallet.update({
            where: { userId: order.sellerId },
            data: { balance: { increment: order.netAmountToSeller } },
        });

        // Company ledger is always USD.
        await companyAccountService.creditCompanyAccount(
            tx,
            roundUsd(Number(order.commissionBuyer) + Number(order.commissionSeller)),
        );

        const transaction = await tx.transaction.create({
            data: {
                senderId: order.buyerId,
                receiverId: order.sellerId,
                amount: order.amount,
                inputCurrency: order.buyerCurrency,
                exchangeRate: order.buyerRate,
                commissionBuyer: order.commissionBuyer,
                commissionSeller: order.commissionSeller,
                netAmountToSeller: order.netAmountToSeller,
                status: 'SUCCESS',
            },
        });

        await tx.monthlyFeeLog.createMany({
            data: [
                { userId: order.buyerId, amount: order.commissionBuyer, type: 'TRADE_COMMISSION' },
                { userId: order.sellerId, amount: order.commissionSeller, type: 'TRADE_COMMISSION' },
            ],
        });

        await tx.listing.update({ where: { id: order.listingId }, data: { status: 'TRADED' } });

        return tx.order.update({
            where: { id: orderId },
            data: { status: 'COMPLETED', completedAt: new Date(), receiptId: transaction.receiptId },
        });
    });

    const viewerCurrency = await currencyService.getUserCurrency(buyerId);
    return currencyService.attachDisplay(completed, ORDER_DISPLAY_FIELDS, viewerCurrency);
};

const cancelOrder = async (userId, orderId) => {
    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order) throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    if (order.buyerId !== userId && order.sellerId !== userId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You are not part of this order');
    }
    if (order.status !== 'ESCROW_HELD') throw new ApiError(httpStatus.BAD_REQUEST, 'Order cannot be cancelled');

    const refundAmount = roundUsd(Number(order.amount) + Number(order.commissionBuyer));

    return prisma.$transaction(async (tx) => {
        await tx.wallet.update({
            where: { userId: order.buyerId },
            data: { balance: { increment: refundAmount } },
        });

        await tx.listing.update({ where: { id: order.listingId }, data: { status: 'ACTIVE' } });

        return tx.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED', cancelledAt: new Date() },
        });
    }).then(async (cancelled) => {
        const viewerCurrency = await currencyService.getUserCurrency(userId);
        return currencyService.attachDisplay(cancelled, ORDER_DISPLAY_FIELDS, viewerCurrency);
    });
};
const profileSelect = {
    select: {
        id: true,
        name: true,
        role: true,
        businessProfile: { select: { businessName: true, streetNumber: true, streetName: true, city: true, state: true, postcode: true } },
        customerProfile: { select: { city: true, address: true } },
    },
};

// Every order/listing amount is shown in the VIEWER's own currency (buyer or seller).
const withViewerDisplay = async (userId, orders) => {
    const viewerCurrency = await currencyService.getUserCurrency(userId);
    return orders.map((order) => ({
        ...currencyService.attachDisplay(order, ORDER_DISPLAY_FIELDS, viewerCurrency),
        listing: order.listing ? currencyService.attachDisplay(order.listing, ['price'], viewerCurrency) : order.listing,
    }));
};

const getMyOrders = async (buyerId) => {
    const orders = await prisma.order.findMany({
        where: { buyerId },
        include: { listing: true, seller: profileSelect },
        orderBy: { createdAt: 'desc' },
    });
    return withViewerDisplay(buyerId, orders);
};

const getReceivedOrders = async (sellerId) => {
    const orders = await prisma.order.findMany({
        where: { sellerId },
        include: { listing: true, buyer: profileSelect },
        orderBy: { createdAt: 'desc' },
    });
    return withViewerDisplay(sellerId, orders);
};

module.exports = { createOrder, completeOrder, cancelOrder, getMyOrders, getReceivedOrders };
````

#### `src/services/report.service.js`  — **REPLACE**

````js
const prisma = require('../config/prisma');
const companyAccountService = require('./companyAccount.service');

const getCompanyAccount = async () => {
    return companyAccountService.getOrCreateCompanyAccount();
};

const getAllTransactions = async ({ page = 1, limit = 10 }) => {
    const [results, total] = await Promise.all([
        prisma.transaction.findMany({
            include: {
                sender: { select: { id: true, name: true, email: true } },
                receiver: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: Number(limit),
        }),
        prisma.transaction.count(),
    ]);

    return { results, page: Number(page), limit: Number(limit), totalResults: total, totalPages: Math.ceil(total / limit) };
};

const getFeeLogs = async ({ type, page = 1, limit = 10 }) => {
    const where = type ? { type } : {};

    const [results, total] = await Promise.all([
        prisma.monthlyFeeLog.findMany({
            where,
            include: { user: { select: { id: true, name: true, email: true } } },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: Number(limit),
        }),
        prisma.monthlyFeeLog.count({ where }),
    ]);

    return { results, page: Number(page), limit: Number(limit), totalResults: total, totalPages: Math.ceil(total / limit) };
};

const getDashboardStats = async () => {
    const [totalUsers, pendingUsers, totalTransactions, totalListings, companyAccount] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { status: 'PENDING' } }),
        prisma.transaction.count(),
        prisma.listing.count(),
        companyAccountService.getOrCreateCompanyAccount(),
    ]);

    return {
        currency: 'USD', // platform-wide figures are always USD
        totalUsers,
        pendingUsers,
        totalTransactions,
        totalListings,
        companyBalance: companyAccount.totalBalance,
    };
};

const getSalesChart = async (days = 7) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);

    const transactions = await prisma.transaction.findMany({
        where: { createdAt: { gte: startDate }, status: 'SUCCESS' },
        select: { amount: true, commissionBuyer: true, commissionSeller: true, createdAt: true },
    });

    // Build one bucket per day so days with zero trades still show up
    const buckets = [];
    for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        buckets.push({
            date: d.toISOString().slice(0, 10),
            label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            volume: 0,
            revenue: 0,
            trades: 0,
        });
    }

    transactions.forEach((t) => {
        const key = t.createdAt.toISOString().slice(0, 10);
        const bucket = buckets.find((b) => b.date === key);
        if (!bucket) return;
        bucket.volume += Number(t.amount);
        bucket.revenue += Number(t.commissionBuyer) + Number(t.commissionSeller);
        bucket.trades += 1;
    });

    return buckets;
};

module.exports = { getCompanyAccount, getAllTransactions, getFeeLogs, getDashboardStats, getSalesChart };
````

#### `src/services/transaction.service.js`  — **REPLACE**

````js
const httpStatus = require('http-status').default;
const prisma = require('../config/prisma');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const walletService = require('./wallet.service');
const companyAccountService = require('./companyAccount.service');
const currencyService = require('./currency.service');
const notificationService = require('./notification.service');
const logger = require('../config/logger');
const { roundUsd, formatMoney } = require('../utils/money');

const TX_DISPLAY_FIELDS = ['amount', 'commissionBuyer', 'commissionSeller', 'netAmountToSeller'];

// `amount` is what the SENDER typed, in the sender's own currency.
// Everything is converted to USD once (live rate) and the ledger only ever sees USD.
const sendTransaction = async (senderId, receiverId, amount, pin) => {
    if (senderId === receiverId) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'You cannot send money to yourself');
    }

    // 1. Verify PIN first — before touching any balance.
    await walletService.verifyPin(senderId, pin);

    const [senderWallet, receiverWallet, senderCurrency] = await Promise.all([
        prisma.wallet.findUnique({ where: { userId: senderId } }),
        prisma.wallet.findUnique({ where: { userId: receiverId } }),
        currencyService.getUserCurrency(senderId),
    ]);

    if (!senderWallet) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Your wallet is not set up yet');
    }
    if (!receiverWallet) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Receiver wallet not found');
    }

    // Sender's typed amount (e.g. 280 PKR) -> USD base, using the live rate right now.
    const usdAmount = roundUsd(Number(amount) / senderCurrency.rate);
    if (usdAmount <= 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Amount is too small');
    }

    const commissionPercent = config.trade.commissionPercent;
    const commissionBuyer = roundUsd((usdAmount * commissionPercent) / 100);
    const commissionSeller = roundUsd((usdAmount * commissionPercent) / 100);
    const netAmountToSeller = roundUsd(usdAmount - commissionSeller);
    const totalDebit = roundUsd(usdAmount + commissionBuyer);

    const projectedBalance = Number(senderWallet.balance) - totalDebit;
    const creditLimit = Number(senderWallet.creditLimit);

    if (projectedBalance < -creditLimit) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient balance / credit limit for this transaction');
    }

    const transaction = await prisma.$transaction(async (tx) => {
        await tx.wallet.update({
            where: { userId: senderId },
            data: { balance: { decrement: totalDebit } },
        });

        await tx.wallet.update({
            where: { userId: receiverId },
            data: { balance: { increment: netAmountToSeller } },
        });

        // Company ledger is always USD.
        await companyAccountService.creditCompanyAccount(tx, roundUsd(commissionBuyer + commissionSeller));

        const created = await tx.transaction.create({
            data: {
                senderId,
                receiverId,
                amount: usdAmount,
                inputAmount: amount,
                inputCurrency: senderCurrency.currencyCode,
                exchangeRate: senderCurrency.rate,
                commissionBuyer,
                commissionSeller,
                netAmountToSeller,
                status: 'SUCCESS',
            },
        });

        // Audit trail — commission portions logged per side.
        await tx.monthlyFeeLog.createMany({
            data: [
                { userId: senderId, amount: commissionBuyer, type: 'TRADE_COMMISSION' },
                { userId: receiverId, amount: commissionSeller, type: 'TRADE_COMMISSION' },
            ],
        });

        return created;
    });

    // Notifications show each person's amount in THEIR OWN currency.
    const receiverCurrency = await currencyService.getUserCurrency(receiverId);
    const receivedText = formatMoney(
        currencyService.convertWithRate(transaction.netAmountToSeller, receiverCurrency.rate, receiverCurrency.currencyCode),
        receiverCurrency.currencyCode,
    );
    const sentText = formatMoney(amount, senderCurrency.currencyCode);

    const notificationResults = await Promise.allSettled([
        notificationService.sendPushToUser(receiverId, {
            title: 'Payment Received',
            body: `You received ${receivedText}.`,
            url: '/dashboard/wallet/history',
        }),
        notificationService.sendPushToUser(senderId, {
            title: 'Payment Sent',
            body: `You sent ${sentText}.`,
            url: '/dashboard/wallet/history',
        }),
    ]);

    for (const result of notificationResults) {
        if (result.status === 'rejected') {
            logger.error(`Trade notification failed: ${result.reason.message}`);
        }
    }

    return currencyService.attachDisplay(transaction, TX_DISPLAY_FIELDS, senderCurrency);
};

const getReceipt = async (userId, receiptId) => {
    const transaction = await prisma.transaction.findUnique({
        where: { receiptId },
        include: {
            sender: { select: { id: true, name: true, email: true } },
            receiver: { select: { id: true, name: true, email: true } },
        },
    });

    if (!transaction) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Receipt not found');
    }
    if (transaction.senderId !== userId && transaction.receiverId !== userId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You do not have access to this receipt');
    }

    const viewerCurrency = await currencyService.getUserCurrency(userId);
    return currencyService.attachDisplay(transaction, TX_DISPLAY_FIELDS, viewerCurrency);
};

const getMyTransactions = async (userId, { page = 1, limit = 10 }) => {
    const where = { OR: [{ senderId: userId }, { receiverId: userId }] };
    const viewerCurrency = await currencyService.getUserCurrency(userId);

    const [results, total] = await Promise.all([
        prisma.transaction.findMany({
            where,
            include: {
                sender: { select: { id: true, name: true } },
                receiver: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: Number(limit),
        }),
        prisma.transaction.count({ where }),
    ]);

    return {
        results: results.map((t) => currencyService.attachDisplay(t, TX_DISPLAY_FIELDS, viewerCurrency)),
        page: Number(page),
        limit: Number(limit),
        totalResults: total,
        totalPages: Math.ceil(total / limit),
    };
};

module.exports = { sendTransaction, getReceipt, getMyTransactions };
````

#### `src/services/wallet.service.js`  — **REPLACE**

````js
const bcrypt = require('bcrypt');
const httpStatus = require('http-status').default;
const prisma = require('../config/prisma');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const emailService = require('./email.service');
const currencyService = require('./currency.service');

const getMyWallet = async (userId) => {
    const [wallet, user] = await Promise.all([
        prisma.wallet.findUnique({ where: { userId } }),
        prisma.user.findUnique({ where: { id: userId }, select: { transactionPin: true } }),
    ]);

    if (!wallet) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found — your account may not be approved yet');
    }

    // balance / creditLimit stay in USD (the ledger); `display` is in the user's own currency.
    const viewerCurrency = await currencyService.getUserCurrency(userId);
    const withDisplay = currencyService.attachDisplay(wallet, ['balance', 'creditLimit'], viewerCurrency);
    const availableBalance = currencyService.convertWithRate(
        Number(wallet.balance) + Number(wallet.creditLimit),
        viewerCurrency.rate,
        viewerCurrency.currencyCode,
    );

    return {
        ...withDisplay,
        display: { ...withDisplay.display, availableBalance },
        hasPin: !!user.transactionPin,
    };
};

const setPin = async (userId, pin) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user.transactionPin) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'PIN already set — use change PIN instead');
    }

    const hashedPin = await bcrypt.hash(pin, 8);
    return prisma.user.update({
        where: { id: userId },
        data: { transactionPin: hashedPin, pinSetAt: new Date(), failedPinAttempts: 0, pinLockedUntil: null },
    });
};

// Shared helper — will be reused by the trade-transaction flow later.
const verifyPin = async (userId, pin) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user.transactionPin) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No PIN set on this account');
    }

    if (user.pinLockedUntil && user.pinLockedUntil > new Date()) {
        const minutesLeft = Math.ceil((user.pinLockedUntil - new Date()) / 60000);
        throw new ApiError(httpStatus.FORBIDDEN, `PIN locked. Try again in ${minutesLeft} minute(s)`);
    }

    const isMatch = await bcrypt.compare(pin, user.transactionPin);

    if (!isMatch) {
        const attempts = user.failedPinAttempts + 1;
        const data = { failedPinAttempts: attempts };

        if (attempts >= config.pin.maxAttempts) {
            data.pinLockedUntil = new Date(Date.now() + config.pin.lockMinutes * 60 * 1000);
            data.failedPinAttempts = 0;
        }

        await prisma.user.update({ where: { id: userId }, data });

        if (data.pinLockedUntil) {
            throw new ApiError(httpStatus.FORBIDDEN, `Too many failed attempts. PIN locked for ${config.pin.lockMinutes} minutes`);
        }
        throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect PIN');
    }

    // correct PIN — reset failed attempts
    if (user.failedPinAttempts > 0) {
        await prisma.user.update({ where: { id: userId }, data: { failedPinAttempts: 0 } });
    }

    return true;
};

const changePin = async (userId, oldPin, newPin) => {
    await verifyPin(userId, oldPin);
    const hashedPin = await bcrypt.hash(newPin, 8);
    return prisma.user.update({ where: { id: userId }, data: { transactionPin: hashedPin } });
};

const forgotPin = async (userId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 8);

    await prisma.pinResetToken.create({
        data: {
            userId,
            token: hashedOtp,
            expires: new Date(Date.now() + 10 * 60 * 1000),
        },
    });

    await emailService.sendPinResetOtpEmail(user.email, otp);
};

const resetPin = async (userId, otp, newPin) => {
    const record = await prisma.pinResetToken.findFirst({
        where: { userId, used: false, expires: { gt: new Date() } },
        orderBy: { createdAt: 'desc' },
    });

    if (!record || !(await bcrypt.compare(otp, record.token))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or expired OTP');
    }

    const hashedPin = await bcrypt.hash(newPin, 8);

    await prisma.$transaction([
        prisma.user.update({
            where: { id: userId },
            data: { transactionPin: hashedPin, failedPinAttempts: 0, pinLockedUntil: null },
        }),
        prisma.pinResetToken.update({ where: { id: record.id }, data: { used: true } }),
    ]);
};

module.exports = { getMyWallet, setPin, verifyPin, changePin, forgotPin, resetPin };
````

#### `src/validations/business.validation.js`  — **REPLACE**

````js

const Joi = require('joi');

const digitsAndSpaces = Joi.string().pattern(/^[0-9 ]*$/).allow('').messages({
    'string.pattern.base': 'Only digits and spaces are allowed',
});

const saveStep = {
    body: Joi.object().keys({
        // Step 1: Business Details
        businessName: Joi.string(),
        acn: digitsAndSpaces,
        abn: digitsAndSpaces,
        streetNumber: Joi.string(),
        streetName: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        postcode: Joi.string(),
        country: Joi.string(),
        phone: Joi.string(),
        mobile: Joi.string(),
        website: Joi.string().uri().allow(''),
        socialLinks: Joi.string().max(1000).allow(''),

        // Step 2: Business Information + Verification
        category: Joi.string(),
        productsServices: Joi.string().max(2000),
        yearsInBusiness: Joi.number().integer().min(0).max(200),

        // Step 3: Membership
        membershipTier: Joi.string().valid('STANDARD', 'GOLD', 'PLATINUM'),

        // Step 5: Declaration (must be ticked)
        declarationAccepted: Joi.boolean().valid(true),
    }),
};

const saveDocuments = {
    body: Joi.object().keys({
        documents: Joi.array()
            .items(
                Joi.object().keys({
                    url: Joi.string().required(),
                    publicId: Joi.string().required(),
                    fileType: Joi.string().valid('PHOTO_ID', 'PROOF_OF_ADDRESS', 'BUSINESS_LICENCE').required(),
                })
            )
            .min(1)
            .required(),
    }),
};

module.exports = { saveStep, saveDocuments };
````

#### `src/validations/currency.validation.js`  — **REPLACE**

````js
const Joi = require('joi');

const previewConversion = {
    query: Joi.object().keys({
        receiverId: Joi.string().uuid().required(),
        amount: Joi.number().positive().required(),
    }),
};

module.exports = { previewConversion };
````

#### `src/validations/customer.validation.js`  — **REPLACE**

````js
const Joi = require('joi');

const completeProfile = {
    body: Joi.object().keys({
        phone: Joi.string(),
        address: Joi.string(),
        city: Joi.string(),
        profilePicture: Joi.string(),
        country: Joi.string(),
    }),
};

module.exports = { completeProfile };
````

#### `src/validations/profileUpdate.validation.js`  — **REPLACE**

````js

const Joi = require('joi');

const createRequest = {
    body: Joi.object().keys({
        // Whitelist: only editable profile fields (no membership tier / declaration / verification status).
        proposedData: Joi.object()
            .keys({
                // customer + business
                phone: Joi.string().allow(''),
                country: Joi.string(),
                city: Joi.string(),
                address: Joi.string().allow(''), // customer only
                // business
                businessName: Joi.string(),
                acn: Joi.string().pattern(/^[0-9 ]*$/).allow(''),
                abn: Joi.string().pattern(/^[0-9 ]*$/).allow(''),
                streetNumber: Joi.string().allow(''),
                streetName: Joi.string().allow(''),
                state: Joi.string().allow(''),
                postcode: Joi.string().allow(''),
                mobile: Joi.string().allow(''),
                website: Joi.string().allow(''),
                socialLinks: Joi.string().max(1000).allow(''),
                category: Joi.string(),
                productsServices: Joi.string().max(2000).allow(''),
                yearsInBusiness: Joi.number().integer().min(0).max(200),
            })
            .required(),
        documentsToAdd: Joi.array().items(
            Joi.object().keys({
                url: Joi.string().required(),
                publicId: Joi.string().required(),
                fileType: Joi.string().valid('PHOTO_ID', 'PROOF_OF_ADDRESS', 'BUSINESS_LICENCE').required(),
            })
        ).default([]),
        documentIdsToRemove: Joi.array().items(Joi.string().uuid()).default([]),
    }),
};

const requestIdParam = {
    params: Joi.object().keys({
        requestId: Joi.string().uuid().required(),
    }),
};

module.exports = { createRequest, requestIdParam };
````


---

# FRONTEND

## Files DELETE karni hain

- `src/app/(dashboard)/dashboard/admin/currency/page.jsx`
- `src/components/Dashboard/Admin/currency/CurrencyRateForm.jsx`
- `src/components/Dashboard/Admin/currency/CurrencyRateTable.jsx`
- `src/components/onboarding/steps/ContactDetailsStep.jsx`
- `src/components/onboarding/steps/CustomerMemberShipStep.jsx`
- `src/components/wallet/CurrencyConversion.jsx`

## Naye files (NEW)

#### `src/components/onboarding/steps/BusinessInfoStep.jsx`  — **NEW**

````jsx

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LuArrowRight, LuLoaderCircle } from 'react-icons/lu';
import { toast } from 'sonner';

import TextInput from '../../ui/TextInput';
import SelectInput from '../../ui/SelectInput';
import { useCompleteBusinessProfile } from '@/hooks/useBusiness';
import { BUSINESS_CATEGORIES } from '@/const/const';

const schema = z.object({
    category: z.string().min(1, 'Please select an industry / category'),
    productsServices: z.string().min(1, 'Please describe the products or services you offer'),
    yearsInBusiness: z.coerce
        .number({ invalid_type_error: 'Enter the number of years' })
        .int('Enter a whole number')
        .min(0, 'Cannot be negative')
        .max(200, 'Please enter a valid number'),
});

export default function BusinessInfoStep({ onNext }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(schema) });

    const { mutate: saveStep, isPending } = useCompleteBusinessProfile();

    const onSubmit = (data) => {
        saveStep(data, {
            onSuccess: () => onNext(),
            onError: (error) => toast.error(error.response?.data?.message || 'Something went wrong'),
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <SelectInput label="Industry / Category" required options={BUSINESS_CATEGORIES} error={errors.category?.message} {...register('category')} />
            <TextInput label="Products or Services Offered" required textarea placeholder="Describe what your business offers" error={errors.productsServices?.message} {...register('productsServices')} />

            <div className="border-t border-slate-100 pt-4">
                <p className="mb-3 text-sm font-semibold text-slate-700">Business Verification</p>
                <TextInput label="Years in Business" required type="number" min="0" placeholder="5" error={errors.yearsInBusiness?.message} {...register('yearsInBusiness')} />
            </div>

            <button type="submit" disabled={isPending} className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60">
                {isPending ?
                    <LuLoaderCircle className="h-5 w-5 animate-spin" />
                    : 'Continue'}
                {!isPending && <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
        </form>
    );
}
````

#### `src/components/wallet/ReceiverPreview.jsx`  — **NEW**

````jsx
'use client';

import { useEffect, useState } from 'react';
import { useConversionPreview } from '@/hooks/useCurrency';
import { formatMoney } from '@/lib/currency';

// Shows, live under the amount input: "Receiver will get ≈ $1.00 USD"
export default function ReceiverPreview({ receiverId, amount }) {
    // small debounce so we don't hit the API on every keystroke
    const [debounced, setDebounced] = useState(amount);
    useEffect(() => {
        const id = setTimeout(() => setDebounced(amount), 300);
        return () => clearTimeout(id);
    }, [amount]);

    const { data, isFetching } = useConversionPreview({ receiverId, amount: debounced }, Number(amount) > 0);

    if (!data || !(Number(amount) > 0)) return null;

    return (
        <p className={`mt-3 text-center text-sm text-slate-500 transition ${isFetching ? 'opacity-60' : ''}`}>
            Receiver will get ≈{' '}
            <span className="font-semibold text-slate-800">
                {formatMoney(data.receiverAmount, data.receiverCurrency)} {data.receiverCurrency}
            </span>
        </p>
    );
}
````

#### `src/lib/currency.js`  — **NEW**

````js
// Amounts from the API come in two shapes:
//   record.price / record.amount / wallet.balance ...  -> USD (the ledger value)
//   record.display = { currency: 'PKR', price: 1000 }  -> same value in the VIEWER's own currency
// Always show `display` to users; only admin/report screens show raw USD.

export function formatMoney(amount, currency = 'USD') {
    try {
        // Intl picks the right decimals + symbol per currency (USD 2, JPY 0, KWD 3 ...).
        return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(Number(amount || 0));
    } catch {
        return `${Number(amount || 0).toLocaleString()} ${currency}`;
    }
}

// formatDisplay(listing, 'price')  ->  "PKR 1,000.00" in the viewer's currency
export function formatDisplay(record, field) {
    if (!record) return formatMoney(0, 'USD');
    const display = record.display;
    if (display && display[field] !== undefined) {
        return formatMoney(display[field], display.currency);
    }
    return formatMoney(record[field], 'USD'); // fallback: raw USD (e.g. logged-out visitor)
}

export function getCurrencySymbol(currency = 'USD') {
    try {
        return (
            new Intl.NumberFormat(undefined, { style: 'currency', currency })
                .formatToParts(0)
                .find((part) => part.type === 'currency')?.value || currency
        );
    } catch {
        return currency;
    }
}
````

## Existing files (REPLACE)

#### `src/app/(dashboard)/dashboard/barter-offers/[offerId]/page.jsx`  — **REPLACE**

````jsx
'use client';

import { formatDisplay } from '@/lib/currency';
import Link from 'next/link';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiCalendar, FiCheckCircle, FiPackage, FiUser } from 'react-icons/fi';
import Loading from '@/components/ui/Loading';
import StatusBadge from '@/components/ui/StatusBadge';
import { useAcceptBarterOffer, useCancelBarterOffer, useBarterOfferDetail, useRejectBarterOffer } from '@/hooks/useBarter';
import BackButton from '@/components/ui/BackButton';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { useAuthStore } from '@/store/useAuthStore';
import { formatAddress } from '@/lib/formatAddress';

function ListingPanel({ label, listing }) {
    const image = listing?.imageUrls?.[0];

    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
            <div className="flex gap-4">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-200">
                    {image ? <img src={image} alt={listing?.title || ''} className="h-full w-full object-cover" /> : (
                        <div className="flex h-full items-center justify-center text-slate-400"><FiPackage className="h-6 w-6" /></div>
                    )}
                </div>
                <div className="min-w-0">
                    <h2 className="truncate text-base font-bold text-slate-900">{listing?.title || 'Listing unavailable'}</h2>
                    <p className="mt-1 text-lg font-bold text-blue-600">{formatDisplay(listing, 'price')}</p>
                    {listing?.description && <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">{listing.description}</p>}
                </div>
            </div>
        </div>
    );
}

function Person({ label, person }) {
    const name = person?.businessProfile?.businessName || person?.name || person?.username || 'Trade member';
    const address = formatAddress(person);

    return (
        <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                {name.slice(0, 2).toUpperCase()}
            </span>
            <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-900">{name}</p>
                {address && <p className="text-xs text-slate-400">📍 {address}</p>}
            </div>
        </div>
    );
}

export default function BarterOfferDetailPage() {
    const { offerId } = useParams();
    const router = useRouter();
    const { data: offer, isLoading } = useBarterOfferDetail(offerId);
    const [confirmation, setConfirmation] = useState(null);
    const { mutate: acceptOffer, isPending: accepting } = useAcceptBarterOffer();
    const { mutate: rejectOffer, isPending: rejecting } = useRejectBarterOffer();
    const { mutate: cancelOffer, isPending: cancelling } = useCancelBarterOffer();
    const currentUser = useAuthStore((state) => state.user);
    const isReceivedPending = offer?.status === 'PENDING' && offer?.targetOwnerId === currentUser?.id;
    const isSentPending = offer?.status === 'PENDING' && offer?.offererId === currentUser?.id;

    const confirmAction = () => {
        const mutation = confirmation === 'accept'
            ? acceptOffer
            : confirmation === 'reject'
                ? rejectOffer
                : cancelOffer;
        mutation(offer.id, { onSuccess: () => setConfirmation(null) });
    };

    if (isLoading) return <Loading />;

    if (!offer) {
        return (
            <div className="py-16 text-center">
                <h1 className="text-lg font-bold text-slate-900">Offer not found</h1>
                <p className="mt-1 text-sm text-slate-500">This offer may have been removed or is no longer available.</p>
                <Link href="/dashboard/barter-offers" className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Back to offers</Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <div className='flex items-end justify-end' >
                <BackButton handleBack={() => router.back()} title="Back to offers" />
            </div>

            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Barter offer</p>
                    <h1 className="mt-1 text-2xl font-bold text-slate-900">Offer details</h1>
                    <p className="mt-1 text-sm text-slate-500">Review the items and activity for this exchange.</p>
                </div>
                <StatusBadge status={offer.status} />
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
                <ListingPanel label="Offered item" listing={offer.offererListing} />
                <div className="flex h-10 w-10 items-center justify-center self-center rounded-full bg-blue-600 text-white lg:mx-1">
                    <FiCheckCircle className="h-5 w-5" />
                </div>
                <ListingPanel label="Requested item" listing={offer.targetListing} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <section className="rounded-2xl border border-slate-100 bg-white p-5">
                    <h2 className="mb-4 text-sm font-bold text-slate-900">People involved</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Person label="Offer sent by" person={offer.offerer || offer.sender} />
                        <Person label="Offer sent to" person={offer.targetOwner || offer.receiver} />
                    </div>
                </section>
                <section className="rounded-2xl border border-slate-100 bg-white p-5">
                    <h2 className="mb-4 text-sm font-bold text-slate-900">Offer information</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between gap-4 text-slate-500"><span className="flex items-center gap-2"><FiCalendar /> Created</span><strong className="text-slate-800">{new Date(offer.createdAt).toLocaleDateString()}</strong></div>
                        {/* <div className="flex items-center justify-between gap-4 text-slate-500"><span className="flex items-center gap-2"><FiUser /> Offer ID</span><strong className="max-w-48 truncate text-slate-800">{offer.id}</strong></div> */}
                    </div>
                </section>
            </div>

            {offer.message && (
                <section className="rounded-2xl border border-slate-100 bg-white p-5">
                    <h2 className="mb-2 text-sm font-bold text-slate-900">Message from the trader</h2>
                    <p className="text-sm leading-relaxed text-slate-600">{offer.message}</p>
                </section>
            )}

            {isReceivedPending && (
                <div className="flex flex-wrap justify-end gap-3">
                    <button type="button" onClick={() => setConfirmation('reject')} className="cursor-pointer rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50">Reject Offer</button>
                    <button type="button" onClick={() => setConfirmation('accept')} className="cursor-pointer rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700">Accept Offer</button>
                </div>
            )}

            {isSentPending && (
                <div className="flex justify-end">
                    <button type="button" onClick={() => setConfirmation('cancel')} className="cursor-pointer rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50">Cancel Offer</button>
                </div>
            )}

            <ConfirmationModal
                isOpen={Boolean(confirmation)}
                onClose={() => setConfirmation(null)}
                onConfirm={confirmAction}
                type={confirmation || 'accept'}
                listingTitle={offer.targetListing?.title || 'this listing'}
                isLoading={accepting || rejecting || cancelling}
            />
        </div>
    );
}
````

#### `src/app/(dashboard)/dashboard/orders/[orderId]/page.jsx`  — **REPLACE**

````jsx
'use client';

import { formatDisplay } from '@/lib/currency';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiCheck } from 'react-icons/fi';
import { LuLoaderCircle } from 'react-icons/lu';
import Loading from '@/components/ui/Loading';
import StatusBadge from '@/components/ui/StatusBadge';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { useMyOrders, useReceivedOrders, useCompleteOrder, useCancelOrder } from '@/hooks/useOrder';
import BackButton from '@/components/ui/BackButton';
import { formatAddress } from '@/lib/formatAddress';

const STEPS = ['ESCROW_HELD', 'COMPLETED'];

export default function OrderDetailPage() {
    const { orderId } = useParams();
    const router = useRouter();
    const { data: orders, isLoading } = useMyOrders();
    const { data: receivedOrders, isLoading: receivedOrdersLoading } = useReceivedOrders();
    const { mutate: complete, isPending: completing } = useCompleteOrder();
    const { mutate: cancel, isPending: cancelling } = useCancelOrder();
    const [confirmAction, setConfirmAction] = useState(null);

    if (isLoading || receivedOrdersLoading) return <Loading />;

    const order = [...(orders || []), ...(receivedOrders || [])].find((o) => o.id === orderId);
    if (!order) return <p className="p-8 text-center text-sm text-slate-400">Order not found.</p>;

    const isCancelled = order.status === 'CANCELLED';
    const activeStepIndex = isCancelled ? -1 : STEPS.indexOf(order.status);

    const submitConfirm = () => {
        if (!confirmAction) return;

        if (confirmAction === 'complete') {
            complete(order.id);
        }

        if (confirmAction === 'cancel') {
            cancel(order.id);
        }

        setConfirmAction(null);
    };

    return (
        <div className="mx-auto max-w-3xl space-y-5">
            <BackButton handleBack={() => router.back()} title="Back" />

            <div className="rounded-2xl border border-slate-100 bg-white p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-14 w-14 overflow-hidden rounded-xl bg-slate-100">
                            {order.listing?.imageUrls?.[0] && (
                                <img src={order.listing.imageUrls[0]} alt="" className="h-full w-full object-cover" />
                            )}
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">{order.listing?.title}</p>
                            <p className="text-sm text-slate-400">{formatDisplay(order, 'amount')} Total</p>
                        </div>
                    </div>
                    <StatusBadge status={order.status} />
                </div>

                {order.status === 'ESCROW_HELD' && (
                    <div className="mt-5 flex gap-3">
                        {/* <button
                            type="button"
                            onClick={() => setConfirmAction('complete')}
                            disabled={completing || cancelling}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                        >
                            {completing ? <LuLoaderCircle className="h-5 w-5 animate-spin" /> : <FiCheck className="h-4 w-4" />}
                            Mark as Complete
                        </button> */}
                        <button
                            type="button"
                            onClick={() => setConfirmAction('cancel')}
                            disabled={completing || cancelling}
                            className="flex flex-1 items-center cursor-pointer justify-center gap-2 rounded-xl border border-red-200 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-60"
                        >
                            {cancelling && <LuLoaderCircle className="h-5 w-5 animate-spin" />}
                            Cancel Order
                        </button>
                    </div>
                )}
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6">
                <h3 className="mb-4 text-sm font-bold text-slate-900">Order Timeline</h3>
                <div className="flex items-center">
                    {['Ordered', 'Escrow Held', isCancelled ? 'Cancelled' : 'Completed'].map((label, i) => {
                        const stepDone = isCancelled ? i === 2 : i <= activeStepIndex + 1;
                        return (
                            <div key={label} className="flex flex-1 items-center">
                                <div className="flex flex-col items-center gap-1.5">
                                    <span
                                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${stepDone
                                            ? isCancelled && i === 2
                                                ? 'bg-red-500 text-white'
                                                : 'bg-blue-600 text-white'
                                            : 'bg-slate-100 text-slate-400'
                                            }`}
                                    >
                                        {i + 1}
                                    </span>
                                    <span className="text-center text-[11px] font-medium text-slate-500">{label}</span>
                                </div>
                                {i < 2 && <div className={`mx-2 h-0.5 flex-1 ${stepDone ? 'bg-blue-600' : 'bg-slate-100'}`} />}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6">
                <h3 className="mb-4 text-sm font-bold text-slate-900">Order Information</h3>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <dt className="text-xs text-slate-400">Buyer</dt>
                        <dd className="font-medium text-slate-800">{order.buyer?.name || 'You'}</dd>
                        {formatAddress(order.buyer) && <dd className="text-xs text-slate-400">{formatAddress(order.buyer)}</dd>}
                    </div>
                    <div>
                        <dt className="text-xs text-slate-400">Seller</dt>
                        <dd className="font-medium text-slate-800">{order.seller?.name}</dd>
                        {formatAddress(order.seller) && <dd className="text-xs text-slate-400">{formatAddress(order.seller)}</dd>}
                    </div>
                    <div>
                        <dt className="text-xs text-slate-400">Total Amount</dt>
                        <dd className="font-medium text-slate-800">{formatDisplay(order, 'amount')}</dd>
                    </div>
                    <div>
                        <dt className="text-xs text-slate-400">Date</dt>
                        <dd className="font-medium text-slate-800">{new Date(order.createdAt).toLocaleString()}</dd>
                    </div>
                </dl>

            </div>

            <ConfirmationModal
                isOpen={Boolean(confirmAction)}
                type={confirmAction === 'complete' ? 'complete' : 'cancel'}
                listingTitle={order.listing?.title || 'this order'}
                onClose={() => setConfirmAction(null)}
                onConfirm={submitConfirm}
                isLoading={confirmAction === 'complete' ? completing : cancelling}
            />
        </div>
    );
}
````

#### `src/components/Dashboard/Admin/AdminOverview.jsx`  — **REPLACE**

````jsx
'use client';

import { formatMoney } from '@/lib/currency';
import Link from 'next/link';
import { FiUsers, FiTag, FiRepeat, FiDollarSign, FiArrowRight, FiClock } from 'react-icons/fi';
import { useDashboardStats } from '@/hooks/useReports';
import { usePendingUsers } from '@/hooks/useAdmin';
import Loading from '@/components/ui/Loading';
import PlatformGrowthChart from './PlarformGrowthChart';

const STAT_CARDS = [
    { key: 'totalUsers', label: 'Total Users', icon: FiUsers, color: 'bg-blue-50 text-blue-600' },
    { key: 'totalListings', label: 'Total Listings', icon: FiTag, color: 'bg-purple-50 text-purple-600' },
    { key: 'totalTransactions', label: 'Total Transactions', icon: FiRepeat, color: 'bg-amber-50 text-amber-600' },
    { key: 'companyBalance', label: 'Company Balance', icon: FiDollarSign, color: 'bg-emerald-50 text-emerald-600', isCurrency: true },
];

const QUICK_ACTIONS = [
    { label: 'Manage Users', href: '/dashboard/admin/users', icon: FiUsers },
    // { label: 'Manage Listings', href: '/listings', icon: FiTag },
    { label: 'View Transactions', href: '/dashboard/admin/reports', icon: FiRepeat },
    // { label: 'View Barter Offers', href: '/dashboard/barter-offers/received', icon: FiRepeat },
];

export default function AdminOverview() {
    const { data: stats, isLoading: statsLoading } = useDashboardStats();
    const { data: pending, isLoading: pendingLoading } = usePendingUsers({ page: 1, limit: 5 });

    if (statsLoading) return <Loading />;

    return (
        <div className="space-y-6">
            <PlatformGrowthChart />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {STAT_CARDS.map((card) => (
                    <div key={card.key} className="rounded-2xl border border-slate-100 bg-white p-5">
                        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}>
                            <card.icon className="h-4.5 w-4.5" />
                        </span>
                        <p className="mt-3 text-xl font-bold text-slate-900">
                            {card.isCurrency
                                ? formatMoney(stats?.[card.key] ?? 0, 'USD')
                                : Number(stats?.[card.key] ?? 0).toLocaleString()}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">{card.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-100 bg-white p-5 lg:col-span-2">
                    <h3 className="mb-4 text-sm font-bold text-slate-900">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {QUICK_ACTIONS.map((action) => (
                            <Link
                                key={action.label}
                                href={action.href}
                                className="flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 transition hover:border-blue-200 hover:bg-blue-50/50"
                            >
                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                    <action.icon className="h-4 w-4" />
                                </span>
                                <span className="text-sm font-medium text-slate-700">{action.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                            <FiClock className="h-4 w-4 text-amber-500" />
                            Pending Approvals
                        </h3>
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-600">
                            {stats?.pendingUsers ?? 0}
                        </span>
                    </div>

                    {pendingLoading ? (
                        <p className="text-xs text-slate-400">Loading...</p>
                    ) : !pending?.results?.length ? (
                        <p className="text-xs text-slate-400">No pending approvals right now.</p>
                    ) : (
                        <div className="space-y-3">
                            {pending.results.map((u) => (
                                <Link
                                    key={u.id}
                                    href={`/dashboard/admin/users/${u.id}`}
                                    className="flex items-center justify-between rounded-xl px-2 py-1.5 text-sm transition hover:bg-slate-50"
                                >
                                    <span className="truncate font-medium text-slate-700">
                                        {u.businessProfile?.businessName || u.name}
                                    </span>
                                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                                        {u.role}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}

                    <Link
                        href="/dashboard/admin/users"
                        className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                        View All
                        <FiArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
````

#### `src/components/Dashboard/Admin/PlarformGrowthChart.jsx`  — **REPLACE**

````jsx
'use client';

import { formatMoney } from '@/lib/currency';
import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSalesChart } from '@/hooks/useReports';
import Loading from '@/components/ui/Loading';

const RANGES = [
    { label: '7 Days', value: 7 },
    { label: '30 Days', value: 30 },
];

export default function PlatformGrowthChart() {
    const [days, setDays] = useState(7);
    const { data, isLoading } = useSalesChart(days);

    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-slate-900">Platform Growth</h3>
                    <p className="text-xs text-slate-400">Revenue &amp; trade volume over time</p>
                </div>
                <div className="flex gap-1 rounded-full bg-slate-100 p-1">
                    {RANGES.map((r) => (
                        <button
                            key={r.value}
                            type="button"
                            onClick={() => setDays(r.value)}
                            className={`rounded-full px-3 cursor-pointer py-1 text-xs font-semibold transition ${days === r.value ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
                                }`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <Loading />
            ) : (
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: 12, border: '1px solid #f1f5f9', fontSize: 12 }}
                                formatter={(value, name) => [formatMoney(value, 'USD'), name === 'revenue' ? 'Revenue' : 'Trade Volume']}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fill="url(#revenueGradient)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
````

#### `src/components/Dashboard/Admin/reports/AllTransactionsTable.jsx`  — **REPLACE**

````jsx
'use client';

import { formatMoney } from '@/lib/currency';
import { useState } from 'react';
import { useAllTransactions } from '@/hooks/useReports';
import Pagination from '@/components/layout/Pagination';
import Loading from '@/components/ui/Loading';

export default function AllTransactionsTable() {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useAllTransactions({ page, limit: 10 });

    if (isLoading) return <Loading />;

    const transactions = data?.results || [];

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
            <div className="border-b border-slate-100 px-6 py-4">
                <h3 className="text-sm font-bold text-slate-900">All Transactions ({data?.totalResults ?? 0})</h3>
            </div>

            {!transactions.length ? (
                <p className="py-10 text-center text-sm text-slate-400">No transactions yet.</p>
            ) : (
                <>
                    <div className="hidden grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr] gap-4 border-b border-slate-100 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 sm:grid">
                        <span>Sender</span>
                        <span>Receiver</span>
                        <span>Amount</span>
                        <span>Commission</span>
                        <span>Date</span>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {transactions.map((t) => (
                            <div
                                key={t.id}
                                className="grid grid-cols-2 gap-3 px-6 py-3.5 text-sm sm:grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr]"
                            >
                                <div className="min-w-0">
                                    <p className="truncate font-medium text-slate-900">{t.sender?.name}</p>
                                    <p className="truncate text-xs text-slate-400">{t.sender?.email}</p>
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate font-medium text-slate-900">{t.receiver?.name}</p>
                                    <p className="truncate text-xs text-slate-400">{t.receiver?.email}</p>
                                </div>
                                <span className="font-semibold text-slate-800">{formatMoney(t.amount, 'USD')}</span>
                                <span className="text-slate-500">
                                    {formatMoney(Number(t.commissionBuyer) + Number(t.commissionSeller), 'USD')}
                                </span>
                                <span className="hidden text-slate-400 sm:block">
                                    {new Date(t.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>

                    <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
                </>
            )}
        </div>
    );
}
````

#### `src/components/Dashboard/Admin/reports/CompanyAccountCard.jsx`  — **REPLACE**

````jsx
'use client';

import { formatMoney } from '@/lib/currency';
import { useState } from 'react';
import { FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { useCompanyAccount } from '@/hooks/useReports';
import FundWalletModal from './FundWalletModal';
import Loading from '@/components/ui/Loading';

export default function CompanyAccountCard() {
    const { data: account, isLoading } = useCompanyAccount();
    const [fundModalOpen, setFundModalOpen] = useState(false);

    if (isLoading) return <Loading />;

    return (
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-white/70">
                    <FiDollarSign className="h-4 w-4" />
                    Company Account Balance
                </div>
                <button
                    type="button"
                    onClick={() => setFundModalOpen(true)}
                    className="rounded-lg bg-white/15 cursor-pointer px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/25"
                >
                    Fund My Wallet
                </button>
            </div>
            <p className="mt-3 text-3xl font-bold">{formatMoney(account?.totalBalance ?? 0, 'USD')}</p>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-white/70">
                <FiTrendingUp className="h-3.5 w-3.5" />
                Accumulated from trade commissions and membership fees
            </p>

            <FundWalletModal
                open={fundModalOpen}
                onClose={() => setFundModalOpen(false)}
                companyBalance={account?.totalBalance}
            />
        </div>
    );
}
````

#### `src/components/Dashboard/Admin/reports/FeeLogsTable.jsx`  — **REPLACE**

````jsx
'use client';

import { formatMoney } from '@/lib/currency';
import { useState } from 'react';
import { useFeeLogs } from '@/hooks/useReports';
import Loading from '@/components/ui/Loading';
import Pagination from '@/components/layout/Pagination';

const TABS = [
    { key: '', label: 'All' },
    { key: 'TRADE_COMMISSION', label: 'Trade Commission' },
    { key: 'MONTHLY_FEE', label: 'Monthly Fee' },
];

const TYPE_STYLES = {
    TRADE_COMMISSION: 'bg-blue-50 text-blue-600',
    MONTHLY_FEE: 'bg-purple-50 text-purple-600',
};

const TYPE_LABELS = {
    TRADE_COMMISSION: 'Trade Commission',
    MONTHLY_FEE: 'Monthly Fee',
};

export default function FeeLogsTable() {
    const [type, setType] = useState('');
    const [page, setPage] = useState(1);
    const { data, isLoading } = useFeeLogs({ type: type || undefined, page, limit: 10 });

    const logs = data?.results || [];

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
                <h3 className="text-sm font-bold text-slate-900">Fee & Commission Logs ({data?.totalResults ?? 0})</h3>

                <div className="flex gap-1 rounded-full bg-slate-100 p-1">
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => {
                                setType(t.key);
                                setPage(1);
                            }}
                            className={`whitespace-nowrap cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${type === t.key ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <Loading />
            ) : !logs.length ? (
                <p className="py-10 text-center text-sm text-slate-400">No logs found.</p>
            ) : (
                <>
                    <div className="hidden grid-cols-[2fr_1fr_1fr_1fr] gap-4 border-b border-slate-100 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 sm:grid">
                        <span>User</span>
                        <span>Type</span>
                        <span>Amount</span>
                        <span>Date</span>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {logs.map((log) => (
                            <div key={log.id} className="grid grid-cols-2 gap-3 px-6 py-3.5 text-sm sm:grid-cols-[2fr_1fr_1fr_1fr]">
                                <div className="min-w-0">
                                    <p className="truncate font-medium text-slate-900">{log.user?.name}</p>
                                    <p className="truncate text-xs text-slate-400">{log.user?.email}</p>
                                </div>
                                <span
                                    className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold ${TYPE_STYLES[log.type]}`}
                                >
                                    {TYPE_LABELS[log.type]}
                                </span>
                                <span className="font-semibold text-slate-800">{formatMoney(log.amount, 'USD')}</span>
                                <span className="hidden text-slate-400 sm:block">{new Date(log.createdAt).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>

                    <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
                </>
            )}
        </div>
    );
}
````

#### `src/components/Dashboard/Admin/reports/FundWalletModal.jsx`  — **REPLACE**

````jsx
'use client';

import { formatMoney } from '@/lib/currency';
import { useState } from 'react';
import { LuLoaderCircle } from 'react-icons/lu';
import { useFundAdminWallet } from '@/hooks/useAdmin';
import Modal from '@/components/ui/Modal';

export default function FundWalletModal({ open, onClose, companyBalance }) {
    const [amount, setAmount] = useState('');
    const { mutate: fundWallet, isPending } = useFundAdminWallet();

    const handleClose = () => {
        setAmount('');
        onClose();
    };

    const handleSubmit = () => {
        const value = Number(amount);
        if (!value || value <= 0) return;
        fundWallet(value, { onSuccess: handleClose });
    };

    return (
        <Modal open={open} onClose={handleClose} title="Fund My Wallet">
            <p className="text-sm text-slate-500">
                Transfer funds (USD) from the Company Account into your personal wallet, so you can purchase
                listings on the marketplace.
            </p>

            <div className="mt-4">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Amount (USD)</label>
                <input
                    type="number"
                    placeholder="e.g. 500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-xl border text-black border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <p className="mt-1 text-xs text-slate-400">
                    Available in Company Account: {formatMoney(companyBalance ?? 0, 'USD')}
                </p>
            </div>

            <div className="mt-6 flex gap-3">
                <button type="button" onClick={handleClose} className="cursor-pointer flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isPending || !amount}
                    className="flex flex-1 items-center justify-center gap-2 cursor-pointer rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                    {isPending && <LuLoaderCircle className="h-4 w-4 animate-spin" />}
                    Confirm Transfer
                </button>
            </div>
        </Modal>
    );
}
````

#### `src/components/Dashboard/Admin/users/UserDetailsView.jsx`  — **REPLACE**

````jsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    FiMail,
    FiGlobe,
    FiCheck,
    FiX,
    FiPhone,
    FiMapPin,
    FiGlobe as FiWebsite,
    FiHash,
    FiUser,
    FiAward,
    FiShield,
} from 'react-icons/fi';
import { useUserDetails, useApproveUser, useRejectUser } from '@/hooks/useAdmin';
import ApproveModal from '@/components/ui/ApprovalModal';
import ImageModal from '@/components/ui/ImageModal';
import BackButton from '@/components/ui/BackButton';
import Loading from '@/components/ui/Loading';
import DetailItem from '@/components/ui/DetailItem';
import { DOCUMENT_LABELS, TIER_META } from '@/const/const';
import RejectModal from '../Modals/RejectModal';
import { formatBusinessAddress } from '@/lib/formatAddress';

export default function UserDetailView({ userId }) {
    const router = useRouter();
    const [approveModalOpen, setApproveModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);

    const { data: user, isLoading } = useUserDetails(userId);
    const { mutate: approve, isPending: approving } = useApproveUser();
    const { mutate: reject, isPending: rejecting } = useRejectUser();

    if (isLoading) {
        return <Loading />;
    }

    if (!user) {
        return <div className="p-8 text-center text-sm text-slate-400">User not found.</div>;
    }

    const isBusiness = user.role === 'BUSINESS';
    const profile = isBusiness ? user.businessProfile : user.customerProfile;
    const tier = profile?.membershipTier ? TIER_META[profile.membershipTier] : null;
    const documents = profile?.documents || [];
    const hasPhotoId = documents.some((d) => d.fileType === 'PHOTO_ID');
    const hasProofOfAddress = documents.some((d) => d.fileType === 'PROOF_OF_ADDRESS');

    const handleApprove = (creditLimit) => {
        approve(
            { userId: user.id, creditLimit },
            {
                onSuccess: () => {
                    setApproveModalOpen(false);
                    router.push('/dashboard/admin/users');
                },
            }
        );
    };

    const handleReject = (reason) => {
        reject(
            { userId: user.id, reason },
            {
                onSuccess: () => {
                    setRejectModalOpen(false);
                    router.push('/dashboard/admin/users');
                },
            }
        );
    };

    const displayName = profile?.businessName || user.name;
    const initials = displayName?.slice(0, 2)?.toUpperCase() || '?';

    return (
        <div className="mx-auto max-w-4xl">
            <BackButton handleBack={() => router.back()} title="Back" />

            {/* Header / identity card */}
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white">
                            {initials}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-slate-900">{displayName}</h2>
                                <span
                                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${isBusiness ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'
                                        }`}
                                >
                                    {user.role}
                                </span>
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                                <span className="flex items-center gap-1.5">
                                    <FiMail className="h-3.5 w-3.5" />
                                    {user.email}
                                </span>
                                {user.country && (
                                    <span className="flex items-center gap-1.5">
                                        <FiGlobe className="h-3.5 w-3.5" />
                                        {user.country}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {user.status === 'PENDING' && (
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setRejectModalOpen(true)}
                                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                            >
                                <FiX className="h-4 w-4" />
                                Reject
                            </button>
                            <button
                                type="button"
                                onClick={() => setApproveModalOpen(true)}
                                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 transition hover:shadow-md"
                            >
                                <FiCheck className="h-4 w-4" />
                                Approve
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
                {/* Left: business + contact info */}
                <div className="space-y-5 lg:col-span-2">
                    {profile && (
                        <div className="rounded-2xl border border-slate-100 bg-white p-6">
                            <h3 className="mb-4 text-sm font-bold text-slate-900">
                                {isBusiness ? 'Business Details' : 'Personal Details'}
                            </h3>
                            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {isBusiness ? (
                                    <>
                                        <DetailItem icon={FiUser} label="Full Name" value={user.name} />
                                        <DetailItem icon={FiMail} label="Email" value={user.email} />
                                        <DetailItem icon={FiHash} label="ACN" value={profile.acn} />
                                        <DetailItem icon={FiHash} label="ABN" value={profile.abn} />
                                        <DetailItem icon={FiWebsite} label="Industry / Category" value={profile.category} />
                                        <DetailItem icon={FiUser} label="Years in Business" value={profile.yearsInBusiness != null ? `${profile.yearsInBusiness}` : ''} />
                                        <DetailItem icon={FiWebsite} label="Website" value={profile.website} />
                                        <DetailItem icon={FiPhone} label="Business Phone" value={profile.phone} />
                                        <DetailItem icon={FiPhone} label="Cell / Mobile" value={profile.mobile} />
                                        <DetailItem icon={FiGlobe} label="Country" value={profile.country} />
                                        <DetailItem icon={FiMapPin} label="Business Address" value={formatBusinessAddress(profile)} />
                                        <DetailItem icon={FiGlobe} label="Social Media" value={profile.socialLinks} />
                                        <DetailItem icon={FiShield} label="Declaration" value={profile.declarationAccepted ? `Accepted on ${new Date(profile.declarationAcceptedAt).toLocaleDateString()}` : 'Not accepted'} />
                                    </>
                                ) : (
                                    <>
                                        <DetailItem icon={FiPhone} label="Phone" value={profile.phone} />
                                        <DetailItem icon={FiGlobe} label="Country" value={profile.country} />
                                        <DetailItem icon={FiMapPin} label="Location" value={[profile.city, profile.address].filter(Boolean).join(', ')} />
                                    </>
                                )}
                            </dl>

                            {isBusiness && profile.productsServices && (
                                <div className="mt-5 border-t border-slate-100 pt-5">
                                    <p className="mb-2 text-xs font-semibold text-slate-400">Products or Services Offered</p>
                                    <p className="whitespace-pre-line text-sm text-slate-700">{profile.productsServices}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {isBusiness && (
                        <div className="rounded-2xl border border-slate-100 bg-white p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                    <FiShield className="h-4 w-4 text-slate-400" />
                                    Identification & Verification
                                </h3>
                                <span className="text-xs font-medium text-slate-400">
                                    {[hasPhotoId, hasProofOfAddress].filter(Boolean).length}/2 provided
                                </span>
                            </div>

                            {documents.length > 0 ? (
                                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                                    {documents.map((doc) => (
                                        <button
                                            key={doc.id}
                                            type="button"
                                            onClick={() => setSelectedDoc(doc)}
                                            className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 text-left transition hover:border-blue-300"
                                        >
                                            <img src={doc.viewUrl} alt={doc.fileType} className="h-24 w-full object-cover" />
                                            <p className="truncate border-t border-slate-100 bg-slate-50 px-2 py-1.5 text-[11px] font-medium text-slate-600 group-hover:text-blue-600">
                                                {DOCUMENT_LABELS[doc.fileType] || doc.fileType}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400">No documents uploaded yet.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Right: membership tier, kept visually separate */}
                <div className="space-y-5">
                    {tier && (
                        <div className={`overflow-hidden rounded-2xl bg-gradient-to-br ${tier.accent} p-6 text-white`}>
                            <div className="flex items-center gap-2 text-xs font-medium text-white/70">
                                <FiAward className="h-4 w-4" />
                                Requested Membership
                            </div>
                            <p className="mt-3 text-2xl font-bold">{tier.label}</p>
                            <p className="mt-1 text-sm text-white/80">Trade limit: {tier.range}</p>
                            <p className="mt-4 border-t border-white/20 pt-3 text-xs text-white/70">
                                Final credit limit is confirmed by you at approval — it can differ from this request.
                            </p>
                        </div>
                    )}

                    <div className="rounded-2xl border border-slate-100 bg-white p-6">
                        <h3 className="mb-3 text-sm font-bold text-slate-900">Application Status</h3>
                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${user.status === 'PENDING'
                                ? 'bg-amber-50 text-amber-600'
                                : user.status === 'APPROVED'
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : 'bg-red-50 text-red-600'
                                }`}
                        >
                            {user.status}
                        </span>
                        <p className="mt-3 text-xs text-slate-400">
                            Applied on {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            <ApproveModal
                open={approveModalOpen}
                onClose={() => setApproveModalOpen(false)}
                onConfirm={handleApprove}
                isPending={approving}
                currency={user?.currency || 'USD'}
                role={user?.role}
            />

            <ImageModal
                open={!!selectedDoc}
                onClose={() => setSelectedDoc(null)}
                imageUrl={selectedDoc?.viewUrl}
                title={DOCUMENT_LABELS[selectedDoc?.fileType] || selectedDoc?.fileType}
            />

            <RejectModal
                open={rejectModalOpen}
                onClose={() => setRejectModalOpen(false)}
                onConfirm={handleReject}
                isPending={rejecting}
            />

        </div>
    );
}
````

#### `src/components/Dashboard/Admin/users/profileUpdates/ProfileFieldDiff.jsx`  — **REPLACE**

````jsx

import { FiArrowRight } from 'react-icons/fi';

const FIELD_LABELS = {
    businessName: 'Business Name',
    acn: 'ACN',
    abn: 'ABN',
    streetNumber: 'Street Number',
    streetName: 'Street Name',
    city: 'City',
    state: 'State',
    postcode: 'Post/Zip Code',
    country: 'Country',
    phone: 'Business Phone',
    mobile: 'Cell/Mobile',
    website: 'Website',
    socialLinks: 'Social Media Links',
    category: 'Industry / Category',
    productsServices: 'Products or Services',
    yearsInBusiness: 'Years in Business',
    address: 'Address',
};

export default function ProfileFieldDiff({ currentProfile, proposedData }) {
    const changedFields = Object.keys(proposedData || {}).filter(
        (key) => String(currentProfile?.[key] ?? '') !== String(proposedData[key] ?? '')
    );

    if (!changedFields.length) {
        return <p className="text-sm text-slate-400">No field changes — only documents were updated.</p>;
    }

    return (
        <div className="space-y-3">
            {changedFields.map((key) => (
                <div key={key} className="grid grid-cols-1 gap-2 rounded-xl border border-slate-100 p-3 sm:grid-cols-[140px_1fr_auto_1fr]">
                    <span className="text-xs font-semibold text-slate-500">{FIELD_LABELS[key] || key}</span>
                    <span className="truncate text-sm text-slate-400 line-through">{currentProfile?.[key] || '—'}</span>
                    <FiArrowRight className="hidden h-4 w-4 self-center text-slate-300 sm:block" />
                    <span className="truncate text-sm font-semibold text-emerald-600">{proposedData[key] || '—'}</span>
                </div>
            ))}
        </div>
    );
}
````

#### `src/components/Dashboard/ProfileSummaryCard.jsx`  — **REPLACE**

````jsx

'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useBusinessProfile } from '@/hooks/useBusiness';
import { useCustomerProfile } from '@/hooks/useCustomer';

export default function ProfileSummaryCard() {
    const user = useAuthStore((state) => state.user);
    const isBusiness = user?.role === 'BUSINESS';

    const { data: business } = useBusinessProfile(isBusiness);
    const { data: customer } = useCustomerProfile(!isBusiness);

    const profile = isBusiness ? business : customer;
    if (!profile) return null;

    const fields = isBusiness
        ? [
            ['Business Name', profile.businessName],
            ['Industry / Category', profile.category],
            ['City', profile.city],
            ['Business Phone', profile.phone],
            ['Mobile', profile.mobile],
            ['Years in Business', profile.yearsInBusiness],
        ]
        : [
            ['Phone', profile.phone],
            ['City', profile.city],
            ['Address', profile.address],
        ];

    return (
        <div className='w-full' >
            <div className="rounded-2xl border border-slate-100 bg-white p-6">
                <h3 className="text-base font-bold text-slate-900">Your Profile</h3>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {fields.map(([label, value]) => (
                        <div key={label}>
                            <p className="text-xs font-medium text-slate-400">{label}</p>
                            <p className="mt-1 text-sm font-semibold text-slate-800">{value || '—'}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
````

#### `src/components/Dashboard/profile/BusinessDocumentManager.jsx`  — **REPLACE**

````jsx

'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { LuCamera, LuX } from 'react-icons/lu';
import { useUploadSignature } from '@/hooks/useBusiness';
import { uploadToCloudinary } from '@/services/business.service';

const SLOTS = [
    { key: 'PHOTO_ID', label: 'Photo ID' },
    { key: 'PROOF_OF_ADDRESS', label: 'Proof of Address' },
    { key: 'BUSINESS_LICENCE', label: 'Business Licence (optional)' },
];

export default function BusinessDocumentsManager({ existingDocuments, onChange }) {
    const [removedIds, setRemovedIds] = useState([]);
    const [newFiles, setNewFiles] = useState([]); // { previewUrl, uploading, url, publicId, fileType }
    const inputRefs = useRef({});

    const { mutateAsync: getSignature } = useUploadSignature();

    const emit = (nextRemoved, nextNewFiles) => {
        onChange({
            documentIdsToRemove: nextRemoved,
            documentsToAdd: nextNewFiles.filter((f) => f.url).map(({ url, publicId, fileType }) => ({ url, publicId, fileType })),
        });
    };

    const handleRemoveExisting = (id) => {
        const next = [...removedIds, id];
        setRemovedIds(next);
        emit(next, newFiles);
    };

    const handleFileSelect = async (slotKey, e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        const entry = { previewUrl, uploading: true, fileType: slotKey };
        const withNew = [...newFiles, entry];
        setNewFiles(withNew);

        try {
            const signatureData = await getSignature();
            const result = await uploadToCloudinary({ file, signatureData });
            if (result.error) throw new Error(result.error.message);

            const updated = withNew.map((f) =>
                f.previewUrl === previewUrl
                    ? { ...f, uploading: false, url: result.secure_url, publicId: result.public_id }
                    : f
            );
            setNewFiles(updated);
            emit(removedIds, updated);
        } catch {
            toast.error('Failed to upload document');
            const filtered = withNew.filter((f) => f.previewUrl !== previewUrl);
            setNewFiles(filtered);
        }
    };

    const removeNewFile = (previewUrl) => {
        const next = newFiles.filter((f) => f.previewUrl !== previewUrl);
        setNewFiles(next);
        emit(removedIds, next);
    };

    return (
        <div className="space-y-5">
            <p className="text-sm font-medium text-slate-700">Verification Documents</p>

            {SLOTS.map((slot) => {
                const existingForSlot = (existingDocuments || []).filter(
                    (d) => d.fileType === slot.key && !removedIds.includes(d.id)
                );
                const newForSlot = newFiles.filter((f) => f.fileType === slot.key);

                return (
                    <div key={slot.key}>
                        <p className="mb-2 text-xs font-semibold text-slate-500">{slot.label}</p>
                        <div className="grid grid-cols-4 gap-2">
                            {existingForSlot.map((doc) => (
                                <div key={doc.id} className="relative aspect-square overflow-hidden rounded-xl border border-slate-200">
                                    <img src={doc.viewUrl || doc.fileUrl || doc.url} alt={slot.label} className="h-full w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveExisting(doc.id)}
                                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                                    >
                                        <LuX className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}

                            {newForSlot.map((f) => (
                                <div key={f.previewUrl} className="relative aspect-square overflow-hidden rounded-xl border border-blue-300">
                                    <img src={f.previewUrl} alt="" className="h-full w-full object-cover" />
                                    {f.uploading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-[10px]">
                                            Uploading...
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeNewFile(f.previewUrl)}
                                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                                    >
                                        <LuX className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => inputRefs.current[slot.key]?.click()}
                                className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-blue-300"
                            >
                                <LuCamera className="h-4 w-4" />
                                <span className="text-[10px]">Add</span>
                            </button>
                        </div>
                        <input
                            ref={(el) => (inputRefs.current[slot.key] = el)}
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileSelect(slot.key, e)}
                            className="hidden"
                        />
                    </div>
                );
            })}
        </div>
    );
}
````

#### `src/components/Dashboard/profile/BusinessProfileEditForm.jsx`  — **REPLACE**

````jsx

'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LuLoaderCircle } from 'react-icons/lu';
import { useBusinessProfile, useCompleteBusinessProfile } from '@/hooks/useBusiness';
import { BUSINESS_CATEGORIES } from '@/const/const';
import SelectInput from '@/components/ui/SelectInput';
import TextInput from '@/components/ui/TextInput';
import Loading from '@/components/ui/Loading';
import { useSubmitProfileUpdate } from '@/hooks/useProfileUpdate';
import BusinessDocumentsManager from './BusinessDocumentManager';

const digitsOnly = z.string().regex(/^[0-9 ]*$/, 'Only digits and spaces are allowed').optional();

const schema = z.object({
    businessName: z.string().min(1, 'Business name is required'),
    acn: digitsOnly,
    abn: digitsOnly,
    streetNumber: z.string().min(1, 'Number is required'),
    streetName: z.string().min(1, 'Street name is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postcode: z.string().min(1, 'Post/Zip code is required'),
    country: z.string().min(1, 'Country is required'),
    phone: z.string().min(1, 'Business phone is required'),
    mobile: z.string().min(1, 'Mobile number is required'),
    website: z
        .string()
        .optional()
        .refine((v) => !v || /^https?:\/\//i.test(v), 'Enter a full URL starting with http:// or https://'),
    socialLinks: z.string().optional(),
    category: z.string().min(1, 'Please select an industry / category'),
    productsServices: z.string().min(1, 'Please describe the products or services you offer'),
    yearsInBusiness: z.coerce.number().int('Enter a whole number').min(0, 'Cannot be negative').max(200),
});

export default function BusinessProfileEditForm({ onCancel, onSaved }) {
    const { data: profile, isLoading } = useBusinessProfile();
    // const { mutate: saveProfile, isPending } = useCompleteBusinessProfile();
    const { mutate: submitUpdate, isPending } = useSubmitProfileUpdate();
    const [documentChanges, setDocumentChanges] = useState({
        documentsToAdd: [],
        documentIdsToRemove: [],
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ resolver: zodResolver(schema) });

    useEffect(() => {
        if (profile) reset(profile);
    }, [profile, reset]);

    if (isLoading) return <Loading />;

    const onSubmit = (data) => {
        submitUpdate({ proposedData: data, ...documentChanges }, { onSuccess: () => onSaved?.() });
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <TextInput label="Business Name" required error={errors.businessName?.message} {...register('businessName')} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextInput label="ACN" error={errors.acn?.message} {...register('acn')} />
                <TextInput label="ABN" error={errors.abn?.message} {...register('abn')} />
            </div>

            <div className="border-t border-slate-100 pt-4">
                <p className="mb-3 text-xs font-semibold text-slate-400">Business Address</p>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <TextInput label="Number" required error={errors.streetNumber?.message} {...register('streetNumber')} />
                        <div className="sm:col-span-2">
                            <TextInput label="Street Name" required error={errors.streetName?.message} {...register('streetName')} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <TextInput label="City" required error={errors.city?.message} {...register('city')} />
                        <TextInput label="State" required error={errors.state?.message} {...register('state')} />
                        <TextInput label="Post/Zip Code" required error={errors.postcode?.message} {...register('postcode')} />
                    </div>
                </div>
            </div>

            <TextInput label="Country" required error={errors.country?.message} {...register('country')} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextInput label="Business Phone" required error={errors.phone?.message} {...register('phone')} />
                <TextInput label="Cell/Mobile Number" required error={errors.mobile?.message} {...register('mobile')} />
            </div>
            <TextInput label="Website" error={errors.website?.message} {...register('website')} />
            <TextInput label="Social Media Links" textarea {...register('socialLinks')} />

            <div className="border-t border-slate-100 pt-4">
                <p className="mb-3 text-xs font-semibold text-slate-400">Business Information</p>
                <div className="space-y-4">
                    <SelectInput label="Industry / Category" required options={BUSINESS_CATEGORIES} error={errors.category?.message} {...register('category')} />
                    <TextInput label="Products or Services Offered" required textarea error={errors.productsServices?.message} {...register('productsServices')} />
                    <TextInput label="Years in Business" required type="number" min="0" error={errors.yearsInBusiness?.message} {...register('yearsInBusiness')} />
                </div>
            </div>

            <BusinessDocumentsManager existingDocuments={profile?.documents} onChange={setDocumentChanges} />

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                    {isPending && <LuLoaderCircle className="h-4 w-4 animate-spin" />}
                    Submit for Review
                </button>
            </div>
        </form>
    );
}
````

#### `src/components/Dashboard/profile/ProfileOverview.jsx`  — **REPLACE**

````jsx

'use client';

import { useState } from 'react';
import {
    FiBriefcase,
    FiEdit2,
    FiGlobe,
    FiHash,
    FiMail,
    FiMapPin,
    FiPhone,
    FiShield,
    FiUser,
} from 'react-icons/fi';
import { DOCUMENT_LABELS, TIER_META } from '@/const/const';
import ImageModal from '@/components/ui/ImageModal';
import Image from 'next/image';
import { formatBusinessAddress } from '@/lib/formatAddress';

function InfoItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
            <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400">{label}</p>
                <p className="mt-1 wrap-break-word text-sm font-semibold text-slate-800">{value || 'Not provided'}</p>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const isApproved = status === 'APPROVED';

    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${isApproved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
            {status || 'ACTIVE'}
        </span>
    );
}

export default function ProfileOverview({ user, profile, onEdit }) {
    const [selectedDocument, setSelectedDocument] = useState(null);
    const isBusiness = user.role === 'BUSINESS';
    const documents = profile?.documents || [];
    const tier = profile?.membershipTier ? TIER_META[profile.membershipTier] : null;
    const displayName = isBusiness ? profile?.businessName : user.name;
    const initials = (displayName || user.email || '?').slice(0, 2).toUpperCase();

    return (
        <div className="space-y-5">
            <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                <div className="bg-linear-to-r from-blue-600 to-indigo-700 px-6 py-7 text-white sm:px-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold ring-1 ring-white/25">
                                {initials}
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">{isBusiness ? 'Business profile' : 'Member profile'}</p>
                                <h2 className="mt-1 text-2xl font-bold">{displayName || 'Your profile'}</h2>
                                <p className="mt-1 flex items-center gap-1.5 text-sm text-blue-100">
                                    <FiMail className="h-3.5 w-3.5" />
                                    {user.email}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onEdit}
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
                        >
                            <FiEdit2 className="h-4 w-4" />
                            Edit profile
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-6 py-4 sm:px-8">
                    <StatusBadge status={user.status} />
                    {isBusiness && profile?.category && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{profile.category}</span>
                    )}
                    {tier && <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">{tier.label} membership</span>}
                </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8">
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        {isBusiness ? <FiBriefcase className="h-4 w-4" /> : <FiUser className="h-4 w-4" />}
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900">{isBusiness ? 'Business details' : 'Personal details'}</h3>
                        <p className="text-xs text-slate-400">Information visible on your member profile</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                    {isBusiness && <InfoItem icon={FiHash} label="ACN" value={profile?.acn} />}
                    {isBusiness && <InfoItem icon={FiHash} label="ABN" value={profile?.abn} />}
                    {isBusiness && <InfoItem icon={FiBriefcase} label="Industry / Category" value={profile?.category} />}
                    {isBusiness && <InfoItem icon={FiBriefcase} label="Years in business" value={profile?.yearsInBusiness != null ? `${profile.yearsInBusiness}` : ''} />}
                    {isBusiness && <InfoItem icon={FiGlobe} label="Website" value={profile?.website} />}
                    <InfoItem icon={FiPhone} label={isBusiness ? 'Business phone' : 'Phone'} value={profile?.phone} />
                    {isBusiness && <InfoItem icon={FiPhone} label="Cell / Mobile" value={profile?.mobile} />}
                    <InfoItem icon={FiGlobe} label="Country" value={profile?.country} />
                    <InfoItem
                        icon={FiMapPin}
                        label={isBusiness ? 'Business address' : 'Location'}
                        value={isBusiness ? formatBusinessAddress(profile) : [profile?.city, profile?.address].filter(Boolean).join(', ')}
                    />
                    {isBusiness && <InfoItem icon={FiGlobe} label="Social media" value={profile?.socialLinks} />}
                </div>

                {isBusiness && profile?.productsServices && (
                    <div className="mt-7 border-t border-slate-100 pt-6">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Products or services offered</p>
                        <p className="whitespace-pre-line text-sm text-slate-700">{profile.productsServices}</p>
                    </div>
                )}
            </section>

            {isBusiness && (
                <section className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <FiShield className="h-4 w-4" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Verification documents</h3>
                                <p className="text-xs text-slate-400">Your uploaded identification and address documents</p>
                            </div>
                        </div>
                        <span className="text-xs font-semibold text-slate-400">{documents.length} uploaded</span>
                    </div>

                    {documents.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {documents.map((document, index) => {
                                const imageUrl = document.fileUrl || document.url;
                                return (
                                    <button
                                        key={document.id || document.publicId || `${document.fileType}-${index}`}
                                        type="button"
                                        onClick={() => setSelectedDocument({ ...document, imageUrl })}
                                        className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 text-left transition hover:border-blue-400 hover:shadow-sm"
                                    >
                                        <Image src={imageUrl} height={200} width={200} alt={DOCUMENT_LABELS[document.fileType] || 'Uploaded document'} className="h-28 w-full object-cover transition group-hover:scale-105" />
                                        <p className="truncate border-t border-slate-100 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 group-hover:text-blue-600">
                                            {DOCUMENT_LABELS[document.fileType] || document.fileType || 'Document'}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="rounded-xl bg-slate-50 px-4 py-5 text-center text-sm text-slate-400">No documents uploaded yet.</p>
                    )}
                </section>
            )}

            <ImageModal
                open={!!selectedDocument}
                onClose={() => setSelectedDocument(null)}
                imageUrl={selectedDocument?.imageUrl}
                title={DOCUMENT_LABELS[selectedDocument?.fileType] || 'Document'}
            />
        </div>
    );
}
````

#### `src/components/barter/BarteOfferCard.jsx`  — **REPLACE**

````jsx
'use client';

import { formatDisplay } from '@/lib/currency';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import StatusBadge from '@/components/ui/StatusBadge';

function ListingThumb({ listing }) {
    return (
        <div className="flex items-center gap-2">
            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                {listing?.imageUrls?.[0] && <img src={listing.imageUrls[0]} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-800">{listing?.title}</p>
                <p className="text-[11px] text-slate-400">{formatDisplay(listing, 'price')}</p>
            </div>
        </div>
    );
}

export default function BarterOfferCard({ offer, mode = 'sent' }) {
    const detailHref = `/dashboard/barter-offers/${offer.id}${mode === 'received' ? '?from=received' : ''}`;

    return (
        <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-0">
            <ListingThumb listing={offer.offererListing} />
            <FiArrowRight className="h-4 w-4 shrink-0 text-slate-300" />
            <ListingThumb listing={offer.targetListing} />

            <div className="ml-auto flex items-center gap-3">
                <div className="text-right">
                    <StatusBadge status={offer.status} />
                    <p className="mt-1 text-[11px] text-slate-400">{new Date(offer.createdAt).toLocaleDateString()}</p>
                </div>

                <Link href={detailHref} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                    View Details
                </Link>
            </div>
        </div>
    );
}
````

#### `src/components/layout/DashboardLayout.jsx`  — **REPLACE**

````jsx
'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import DashboardSidebar from '../Dashboard/Sidebar';
import DashboardHeader from '../Dashboard/Header';
import DashboardHero from '../Dashboard/Hero';
import DashboardStats from '../Dashboard/Stats';
import { getDashboardRoutes } from '@/const/dashboardConfig';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';
import { usePendingUsers } from '@/hooks/useAdmin';
import PendingApprovalCard from '@/components/onboarding/PendingApproval';
import { useState } from 'react';
import { useMyWallet } from '@/hooks/useWallet';

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const user = useAuthStore((state) => state.user);
    const isAdmin = user?.role === 'ADMIN';
    const { data: wallet } = useMyWallet(!isAdmin);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { isComplete: isProfileComplete } = useProfileCompletion(!isAdmin);
    const { data: pendingData } = usePendingUsers({ page: 1, limit: 1 }, isAdmin);

    if (!isAdmin && user && user.status !== 'APPROVED') {
        return <PendingApprovalCard />;
    }

    const dashboardRoutes = getDashboardRoutes({
        userName: user?.name,
        isProfileComplete,
        isAdmin,
        pendingCount: pendingData?.totalResults ?? 0,
        walletBalance: wallet?.display?.balance ?? wallet?.balance ?? 0,
        creditLimit: wallet?.display?.creditLimit ?? wallet?.creditLimit ?? 0,
        availableBalance: wallet?.display?.availableBalance,
        currency: wallet?.display?.currency || 'USD',
    });

    const routeKey = dashboardRoutes[pathname] ? pathname : '/dashboard';
    const pageData = dashboardRoutes[routeKey];

    return (
        <div className="min-h-screen w-full bg-[#f8fafc] lg:grid lg:grid-cols-[280px_1fr]">
            <DashboardSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                isAdmin={isAdmin}
            />

            {/* Mobile backdrop */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 z-[55] bg-slate-900/40 lg:hidden"
                />
            )}

            <div className="flex min-h-screen min-w-0 flex-col">
                <DashboardHeader
                    isSidebarOpen={isSidebarOpen}
                    onMenuClick={() => setIsSidebarOpen((prev) => !prev)}
                />

                <main className="w-full flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
                    {pathname === '/dashboard' && <DashboardHero key={routeKey} data={pageData} />}

                    <motion.div
                        key={`content-${routeKey}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.15, ease: 'easeOut' }}
                        className="mt-6"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
````

#### `src/components/listings/BarterSwapModal.jsx`  — **REPLACE**

````jsx
'use client';

import { formatDisplay } from '@/lib/currency';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LuLoaderCircle } from 'react-icons/lu';
import Modal from '@/components/ui/Modal';
import { useMyListings } from '@/hooks/useListing';
import { useCreateBarterOffer } from '@/hooks/useBarter';

export default function BarterSwapModal({ open, onClose, targetListing }) {
    const [selectedId, setSelectedId] = useState(null);
    const [sent, setSent] = useState(false);
    const { data: myListings, isLoading } = useMyListings();
    const { mutate: sendOffer, isPending } = useCreateBarterOffer();
    const router = useRouter();

    const activeListings = (myListings || []).filter((l) => l.status === 'ACTIVE');

    const handleClose = () => {
        setSelectedId(null);
        setSent(false);
        onClose();
    };

    const handleSend = () => {
        sendOffer(
            { offererListingId: selectedId, targetListingId: targetListing.id },
            { onSuccess: () => setSent(true) }
        );
    };

    return (
        <Modal open={open} onClose={handleClose} title={sent ? undefined : 'Select Your Listing to Offer'}>
            {sent ? (
                <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600">✓</div>
                    <h3 className="mt-4 text-lg font-bold text-slate-900">Barter Offer Sent!</h3>
                    <p className="mt-1 text-sm text-slate-500">Your offer has been sent to the seller. You'll be notified once they respond.</p>
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/barter-offers')}
                        className="mt-5 w-full cursor-pointer rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        View My Offers
                    </button>
                </div>
            ) : (
                <>
                    {isLoading ? (
                        <p className="py-6 text-center text-sm text-slate-400">Loading your listings...</p>
                    ) : !activeListings.length ? (
                        <p className="py-6 text-center text-sm text-slate-400">
                            You need an active listing to make a barter offer.
                        </p>
                    ) : (
                        <div className="grid max-h-80 grid-cols-3 gap-3 overflow-y-auto">
                            {activeListings.map((listing) => (
                                <button
                                    key={listing.id}
                                    type="button"
                                    onClick={() => setSelectedId(listing.id)}
                                    className={`overflow-hidden cursor-pointer rounded-xl border-2 text-left transition ${selectedId === listing.id ? 'border-blue-600' : 'border-transparent'
                                        }`}
                                >
                                    <div className="aspect-square bg-slate-100">
                                        {listing.imageUrls?.[0] && (
                                            <img src={listing.imageUrls[0]} alt="" className="h-full w-full object-cover" />
                                        )}
                                    </div>
                                    <div className="p-1.5">
                                        <p className="truncate text-[11px] font-semibold text-slate-800">{listing.title}</p>
                                        <p className="text-[10px] text-slate-400">{formatDisplay(listing, 'price')}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="mt-5 flex gap-3">
                        <button type="button" onClick={handleClose} className="flex-1 cursor-pointer rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={!selectedId || isPending}
                            className="flex flex-1 items-center cursor-pointer justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            {isPending && <LuLoaderCircle className="h-4 w-4 animate-spin" />}
                            Send Offer
                        </button>
                    </div>
                </>
            )}
        </Modal>
    );
}
````

#### `src/components/listings/ListingCard.jsx`  — **REPLACE**

````jsx
'use client';

import { formatDisplay } from '@/lib/currency';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
    FiEdit2,
    FiPause,
    FiPlay,
    FiTrash2,
    FiMapPin,
    FiArrowUpRight,
    FiMoreVertical,
} from 'react-icons/fi';

export default function ListingCard({
    listing,
    mode = 'public',
    onPauseToggle,
    onDelete,
}) {
    const image = listing.imageUrls?.[0];

    const [confirmation, setConfirmation] = useState({
        isOpen: false,
        type: null,
    });

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuRef = useRef(null);
    const router = useRouter();

    const sellerName =
        listing.business?.businessProfile?.businessName ||
        listing.business?.name;

    const location = [
        listing.business?.businessProfile?.city,
        listing.business?.businessProfile?.country,
    ]
        .filter(Boolean)
        .join(', ');

    const isActive = listing.status === 'ACTIVE';

    const detailsHref = mode === 'public'
        ? `/marketplace/${listing.id}`
        : null;
    const editHref = `/dashboard/listings/${listing.id}/edit`;
    const CardWrapper = detailsHref ? Link : 'div';
    const cardLinkProps = detailsHref ? { href: detailsHref } : {};

    // Close mobile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );
        };
    }, []);

    const openConfirmation = (type) => {
        setIsMenuOpen(false);

        setConfirmation({
            isOpen: true,
            type,
        });
    };

    const closeConfirmation = () => {
        setConfirmation({
            isOpen: false,
            type: null,
        });
    };

    const handleConfirm = () => {
        if (confirmation.type === 'edit') {
            router.push(editHref);
        } else if (confirmation.type === 'delete') {
            onDelete?.(listing);
        } else {
            onPauseToggle?.(listing);
        }

        closeConfirmation();
    };

    return (
        // <article className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-[0_18px_45px_rgba(15,23,42,0.11)]">
        <article className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:border-indigo-100 hover:shadow-[0_18px_45px_rgba(15,23,42,0.11)]">
            {/* Image */}
            <CardWrapper {...cardLinkProps} className="block">
                <div className="relative aspect-[4/3] bg-slate-100">

                    {image ? (
                        <img
                            src={image}
                            alt={listing.title}
                            className="h-full w-full object-cover transition-transform duration-700 ease-out"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                            <span className="rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-400 shadow-sm">
                                No image available
                            </span>
                        </div>
                    )}

                    {/* Image gradient */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Status */}
                    <div className="absolute flex w-full justify-between ml-3 top-3">
                        {(mode === 'owner' && !listing.isPublic) ?
                            <span className="absolute left-2 top-2 rounded-full bg-slate-700 px-2 py-0.5 text-[10px] font-semibold text-white">
                                Private
                            </span> :
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-semibold shadow-sm backdrop-blur-md ${isActive
                                    ? 'border-emerald-200/80 bg-white/90 text-emerald-700'
                                    : 'border-slate-200/80 bg-white/90 text-slate-500'
                                    }`}
                            >
                                <span
                                    className={`h-1.5 w-1.5 rounded-full ${isActive
                                        ? 'bg-emerald-500'
                                        : 'bg-slate-400'
                                        }`}
                                />

                                {isActive ? 'Active' : 'Paused'}
                            </span>
                        }
                    </div>

                    {/* Public view icon */}
                    {mode === 'public' && (
                        <div className="absolute right-3 top-3 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-white/90 text-slate-700 opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            <FiArrowUpRight className="h-4 w-4" />
                        </div>
                    )}

                    {/* Mobile Owner Menu */}
                    {mode === 'owner' && (
                        <div
                            ref={menuRef}
                            className="absolute right-3 top-3 sm:hidden"
                        >
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    setIsMenuOpen((prev) => !prev);
                                }}
                                className="flex h-10 cursor-pointer w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-700 shadow-lg backdrop-blur-md transition-all duration-200 hover:bg-white active:scale-95"
                                aria-label="Listing actions"
                                aria-expanded={isMenuOpen}
                            >
                                <FiMoreVertical className="h-5 w-5" />
                            </button>

                            {/* Dropdown */}
                            {isMenuOpen && (
                                <div
                                    className="absolute right-0 top-12 z-50 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_18px_45px_rgba(15,23,42,0.16)]"
                                    onClick={(event) =>
                                        event.stopPropagation()
                                    }
                                >
                                    {/* Edit */}
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            openConfirmation('edit');
                                        }}
                                        className="flex cursor-pointer w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                                    >
                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                            <FiEdit2 className="h-4 w-4" />
                                        </span>

                                        <span>Edit</span>
                                    </button>

                                    {/* Status */}

                                    {mode === 'owner' && listing.isPublic && (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                openConfirmation(
                                                    isActive
                                                        ? 'pause'
                                                        : 'resume'
                                                )
                                            }
                                            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-amber-50 hover:text-amber-600"
                                        >
                                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                                                {isActive ? (
                                                    <FiPause className="h-4 w-4" />
                                                ) : (
                                                    <FiPlay className="h-4 w-4" />
                                                )}
                                            </span>

                                            <span>
                                                {isActive
                                                    ? 'Pause'
                                                    : 'Resume'}
                                            </span>
                                        </button>
                                    )}

                                    {/* Divider */}
                                    <div className="my-1.5 h-px bg-slate-100" />

                                    {/* Delete */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openConfirmation('delete')
                                        }
                                        className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                                    >
                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500">
                                            <FiTrash2 className="h-4 w-4" />
                                        </span>

                                        <span>Delete</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </CardWrapper>

            {/* Content */}
            <div className="p-4 sm:p-5">

                {/* Category */}
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-500">
                    {listing.category}
                </p>

                {/* Title */}
                <CardWrapper {...cardLinkProps} className="block">
                    <h3 className="line-clamp-2 min-h-[40px] text-[15px] font-bold leading-5 text-slate-900 transition-colors duration-200 group-hover:text-indigo-600 sm:text-base">
                        {listing.title}
                    </h3>
                </CardWrapper>

                {/* Price */}
                <div className="mt-3 flex items-end justify-between gap-3">
                    <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                            Trading Value
                        </p>

                        <p className="mt-0.5 text-lg font-extrabold tracking-tight text-indigo-600 sm:text-xl">
                            {formatDisplay(listing, 'price')}
                        </p>
                    </div>

                    {mode === 'public' && (
                        <Link
                            href={detailsHref}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                            aria-label={`View ${listing.title}`}
                        >
                            <FiArrowUpRight className="h-4 w-4" />
                        </Link>
                    )}
                </div>

                {/* Seller */}
                {mode === 'public' && sellerName && (
                    <div className="mt-3 flex items-start gap-2.5 border-t border-slate-100 pt-3">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                            <FiMapPin className="h-3.5 w-3.5" />
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-slate-700">
                                {sellerName}
                            </p>

                            {location && (
                                <p className="mt-0.5 truncate text-[9px] text-slate-400">
                                    {location}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Desktop Owner Actions */}
                {mode === 'owner' && (
                    <div className=" mt-4 hidden items-center gap-2 border-t border-slate-100 pt-3 sm:flex">

                        {/* Edit */}
                        <button
                            type="button"
                            onClick={() => openConfirmation('edit')}
                            className="group/action cursor-pointer flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2 py-2.5 text-[11px] font-semibold text-slate-600 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 sm:text-xs"
                        >
                            <FiEdit2 className="h-3.5 w-3.5 shrink-0 transition-transform group-hover/action:scale-110" />
                            <span className="truncate">Edit</span>
                        </button>

                        {
                            mode === 'owner' && listing.isPublic && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        openConfirmation(
                                            isActive ? 'pause' : 'resume'
                                        )
                                    }
                                    className="group/action flex min-w-0 cursor-pointer flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2 py-2.5 text-[11px] font-semibold text-slate-600 transition-all duration-200 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600 sm:text-xs"
                                >
                                    {isActive ? (
                                        <FiPause className="h-3.5 w-3.5 shrink-0 transition-transform group-hover/action:scale-110" />
                                    ) : (
                                        <FiPlay className="h-3.5 w-3.5 shrink-0 transition-transform group-hover/action:scale-110" />
                                    )}

                                    <span className="truncate">
                                        {isActive ? 'Pause' : 'Resume'}
                                    </span>
                                </button>
                            )}

                        {/* Delete */}
                        <button
                            type="button"
                            onClick={() =>
                                openConfirmation('delete')
                            }
                            className="group/action flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-red-100 bg-red-50/60 px-2 py-2.5 text-[11px] font-semibold text-red-500 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:text-xs"
                        >
                            <FiTrash2 className="h-3.5 w-3.5 shrink-0 transition-transform group-hover/action:scale-110" />
                            <span className="truncate">Delete</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmation.isOpen}
                type={confirmation.type}
                listingTitle={listing.title}
                onClose={closeConfirmation}
                onConfirm={handleConfirm}
            />
        </article >
    );
}
````

#### `src/components/listings/ListingDetail.jsx`  — **REPLACE**

````jsx
'use client';

import { formatDisplay } from '@/lib/currency';
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FiArrowLeft, FiMapPin, FiUsers } from 'react-icons/fi';
import { useListingDetail } from '@/hooks/useListing';
import Loading from '@/components/ui/Loading';
import BackButton from '@/components/ui/BackButton';
import { useRouter } from 'next/navigation';
import TradeNowModal from './TradeNowModal';
import BarterSwapModal from './BarterSwapModal';

export default function ListingDetail() {
    const { listingId } = useParams();
    const router = useRouter()
    const { data: listing, isLoading } = useListingDetail(listingId);
    const [activeImage, setActiveImage] = useState(0);
    const [tradeModalOpen, setTradeModalOpen] = useState(false);
    const [barterModalOpen, setBarterModalOpen] = useState(false);

    if (isLoading) return <div className='min-h-[65vh] flex items-center justify-center'>
        <Loading />
    </div>
    if (!listing) return <p className="p-10 text-center text-sm text-slate-400">Listing not found.</p>;

    const images = listing.imageUrls?.length ? listing.imageUrls : [];
    const sellerName = listing.business?.businessProfile?.businessName || listing.business?.name;
    const location = [listing.business?.businessProfile?.city, listing.business?.businessProfile?.country]
        .filter(Boolean)
        .join(', ');

    return (
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
            <div className='flex w-full items-end justify-end' >
                <BackButton handleBack={() => router.push('/marketplace')} title="Back to Marketplace" />
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div>
                    <div className="aspect-square overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                        {images[activeImage] ? (
                            <img src={images[activeImage]} alt={listing.title} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-slate-300">No image</div>
                        )}
                    </div>
                    {images.length > 1 && (
                        <div className="mt-3 flex gap-2">
                            {images.map((img, i) => (
                                <button
                                    key={img}
                                    type="button"
                                    onClick={() => setActiveImage(i)}
                                    className={`h-16 w-16 overflow-hidden cursor-pointer rounded-xl border-2 ${activeImage === i ? 'border-blue-600' : 'border-transparent'
                                        }`}
                                >
                                    <img src={img} alt="" className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-slate-900">{listing.title}</h1>
                        <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${listing.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                }`}
                        >
                            {listing.status === 'ACTIVE' ? 'Active' : 'Paused'}
                        </span>
                    </div>
                    <p className="mt-2 text-3xl font-bold text-blue-600">{formatDisplay(listing, 'price')}</p>

                    <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5">
                        <h3 className="mb-2 text-sm font-bold text-slate-900">Description</h3>
                        <p className="text-sm leading-relaxed text-slate-600">{listing.description}</p>
                    </div>

                    <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-5">
                        <h3 className="mb-3 text-sm font-bold text-slate-900">Seller Information</h3>
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
                                {sellerName?.slice(0, 2)?.toUpperCase()}
                            </span>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">{sellerName}</p>
                                {location && (
                                    <p className="flex items-center gap-1 text-xs text-slate-400">
                                        <FiMapPin className="h-3 w-3" />
                                        {location}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={() => setTradeModalOpen(true)}
                                className="flex cursor-pointer w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                Trade Now
                            </button>
                            <button
                                type="button"
                                onClick={() => setBarterModalOpen(true)}
                                className="flex cursor-pointer w-full items-center justify-center gap-2 rounded-xl border border-blue-600 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                            >
                                Offer a Barter Swap
                            </button>
                        </div>

                        <TradeNowModal open={tradeModalOpen} onClose={() => setTradeModalOpen(false)} listing={listing} />
                        <BarterSwapModal open={barterModalOpen} onClose={() => setBarterModalOpen(false)} targetListing={listing} />
                    </div>
                </div>
            </div>
        </div>
    );
}
````

#### `src/components/listings/ListingForm.jsx`  — **REPLACE**

````jsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { LuArrowRight, LuLoaderCircle } from 'react-icons/lu';
import ListingImageUploader from './ListingImageUploader';
import TextInput from '@/components/ui/TextInput';
import SelectInput from '@/components/ui/SelectInput';
import { BUSINESS_CATEGORIES } from '@/const/const';
import { useAuthStore } from '@/store/useAuthStore';
import { useMyCurrency } from '@/hooks/useCurrency';
import { formatMoney } from '@/lib/currency';

const schema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.coerce.number().positive('Enter a valid price'),
    category: z.string().min(1, 'Please select a category'),
});

export default function ListingForm({ defaultValues, onSubmit, isPending, submitLabel = 'Publish Listing' }) {
    const [imageUrls, setImageUrls] = useState(defaultValues?.imageUrls || []);
    const user = useAuthStore((state) => state.user);
    const [isPublic, setIsPublic] = useState(defaultValues?.isPublic ?? (user?.role === 'BUSINESS'));
    const { data: myCurrency } = useMyCurrency();
    const currencyCode = myCurrency?.currencyCode || 'USD';

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            title: defaultValues?.title || '',
            description: defaultValues?.description || '',
            price: defaultValues?.display?.price ?? defaultValues?.price ?? '',
            category: defaultValues?.category || '',
        },
    });

    const price = Number(watch('price')) || 0;
    const usdPreview = myCurrency?.rate ? price / Number(myCurrency.rate) : 0;

    const handleFormSubmit = (data) => {
        onSubmit({ ...data, price: Number(data.price), imageUrls, isPublic });
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <TextInput label="Title" required placeholder="e.g. MacBook Pro 2021" error={errors.title?.message} {...register('title')} />
            <TextInput
                label="Description"
                required
                textarea
                placeholder="Describe your item, its condition, and any important details..."
                error={errors.description?.message}
                {...register('description')}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SelectInput
                    label="Category"
                    required
                    options={BUSINESS_CATEGORIES}
                    error={errors.category?.message}
                    {...register('category')}
                />
                <div>
                    {price > 0 && currencyCode !== 'USD' && (
                        <div className="mb-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
                            <p className="font-semibold">
                                {formatMoney(price, currencyCode)} ≈ {formatMoney(usdPreview, 'USD')} USD
                            </p>
                        </div>
                    )}
                    <TextInput
                        label={`Price (${currencyCode})`}
                        required
                        type="number"
                        placeholder="e.g. 250"
                        error={errors.price?.message}
                        {...register('price')}
                    />
                </div>
            </div>

            <ListingImageUploader value={imageUrls} onChange={setImageUrls} />

            {user?.role === 'CUSTOMER' && (
                <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                    <div>
                        <p className="text-sm font-medium text-slate-700">Make this listing public</p>
                        <p className="text-xs text-slate-400">
                            Public listings appear in the marketplace for everyone. Private listings are only visible to you (until someone offers a barter swap on it).
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsPublic((prev) => !prev)}
                        className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition ${isPublic ? 'bg-blue-600' : 'bg-slate-200'}`}
                    >
                        <span
                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${isPublic ? 'left-5' : 'left-0.5'}`}
                        />
                    </button>
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
            >
                {isPending ?
                    <LuLoaderCircle className="h-5 w-5 animate-spin" />
                    : submitLabel}
                {!isPending && <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
        </form>
    );
}
````

#### `src/components/listings/MarketFilters.jsx`  — **REPLACE**

````jsx
'use client';

import { useMyCurrency } from '@/hooks/useCurrency';
import { BUSINESS_CATEGORIES } from '@/const/const';
import { useState } from 'react';

export default function MarketplaceFilters({ onApply }) {
    const [category, setCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [country, setCountry] = useState('');
    const { data: myCurrency } = useMyCurrency();

    const apply = () => {
        onApply({
            category: category || undefined,
            minPrice: minPrice || undefined,
            maxPrice: maxPrice || undefined,
            country: country || undefined,
        });
    };

    const clear = () => {
        setCategory('');
        setMinPrice('');
        setMaxPrice('');
        setCountry('');
        onApply({});
    };

    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <h3 className="mb-4 text-sm font-bold text-slate-900">Filters</h3>

            <div className="space-y-4">
                <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-xl border cursor-pointer border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    >
                        <option value="">All</option>
                        {BUSINESS_CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">Price Range ({myCurrency?.currencyCode || 'USD'})</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                        <span className="text-slate-300">–</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">Country</label>
                    <input
                        type="text"
                        placeholder="All Countries"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            <button
                type="button"
                onClick={apply}
                className="mt-5 w-full cursor-pointer rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
                Apply Filters
            </button>
            <button
                type="button"
                onClick={clear}
                className="mt-2 w-full cursor-pointer rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50"
            >
                Clear All
            </button>
        </div>
    );
}
````

#### `src/components/listings/TradeNowModal.jsx`  — **REPLACE**

````jsx
'use client';

import { formatDisplay, formatMoney } from '@/lib/currency';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modal';
import { useMyWallet } from '@/hooks/useWallet';
import { useCreateOrder } from '@/hooks/useOrder';
import PinKeypad from '@/components/wallet/PinKeypad';

export default function TradeNowModal({ open, onClose, listing }) {
    const [step, setStep] = useState('confirm'); // confirm | pin | success
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const { data: wallet } = useMyWallet(open);
    const { mutate: createOrder, isPending } = useCreateOrder();
    const router = useRouter();

    const handleClose = () => {
        setStep('confirm');
        setPin('');
        setError('');
        onClose();
    };

    return (
        <Modal open={open} onClose={handleClose} title={step === 'confirm' ? 'Confirm Trade Purchase' : undefined}>
            {step === 'confirm' && (
                <div>
                    <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                        <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100">
                            {listing?.imageUrls?.[0] && <img src={listing.imageUrls[0]} alt="" className="h-full w-full object-cover" />}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">{listing?.title}</p>
                            <p className="text-xs text-slate-400">{formatDisplay(listing, 'price')}</p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Amount</label>
                        <input
                            type="text"
                            value={formatDisplay(listing, 'price')}
                            readOnly
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700"
                        />
                        <p className="mt-1 text-xs text-slate-400">
                            Available Balance: {formatMoney(wallet?.display?.availableBalance ?? 0, wallet?.display?.currency)}
                        </p>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <button type="button" onClick={handleClose} className="flex-1 rounded-xl border cursor-pointer border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                            Cancel
                        </button>
                        <button type="button" onClick={() => setStep('pin')} className="flex-1 rounded-xl cursor-pointer bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                            Proceed
                        </button>
                    </div>
                </div>
            )}

            {step === 'pin' && (
                <PinKeypad
                    length={4}
                    value={pin}
                    onChange={(nextPin) => {
                        setPin(nextPin);
                        setError('');
                    }}
                    error={error}
                    title="Enter Wallet PIN"
                    onSubmit={(pin) =>
                        createOrder(
                            { listingId: listing.id, pin },
                            {
                                onSuccess: () => setStep('success'),
                                onError: (err) => setError(err.response?.data?.message || 'Payment failed'),
                            }
                        )
                    }
                    isSubmitting={isPending}
                    submitLabel="Proceed"
                />
            )}

            {step === 'success' && (
                <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600">✓</div>
                    <h3 className="mt-4 text-lg font-bold text-slate-900">Payment Successful!</h3>
                    <p className="mt-1 text-sm text-slate-500">Your trade purchase has been completed successfully.</p>
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/orders')}
                        className="mt-5 w-full cursor-pointer rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        View Order
                    </button>
                </div>
            )}
        </Modal>
    );
}
````

#### `src/components/onboarding/BusinessOnboarding.jsx`  — **REPLACE**

````jsx

'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import OnboardingLayout from '../layout/OnboardingLayout';
import BusinessDetailsStep from './steps/BusinessDetailsStep';
import BusinessInfoStep from './steps/BusinessInfoStep';
import MembershipStep from './steps/MembershipStep';
import BusinessDocumentsStep from './steps/BusinessDocumentStep';
import SuccessStep from './SuccessStep';

const steps = [
    { title: 'Business Details', subtitle: 'Tell us about your business so others can find and trust you.' },
    { title: 'Business Information', subtitle: 'What does your business do, and how long has it been running?' },
    { title: 'Membership Package', subtitle: 'Choose the trade limit tier you\'d like to apply for.' },
    { title: 'Verification & Declaration', subtitle: 'Upload documents so we can verify and approve your business.' },
    { title: "You're All Set!", subtitle: null },
];

export default function BusinessOnboarding() {
    const [step, setStep] = useState(1);

    return (
        <OnboardingLayout
            step={step}
            totalSteps={steps.length}
            title={steps[step - 1].title}
            subtitle={steps[step - 1].subtitle}
            onBack={step > 1 && step < steps.length ? () => setStep((s) => s - 1) : null}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                >
                    {step === 1 && <BusinessDetailsStep onNext={() => setStep(2)} />}
                    {step === 2 && <BusinessInfoStep onNext={() => setStep(3)} />}
                    {step === 3 && <MembershipStep onNext={() => setStep(4)} />}
                    {step === 4 && <BusinessDocumentsStep onNext={() => setStep(5)} />}
                    {step === 5 && <SuccessStep />}
                </motion.div>
            </AnimatePresence>
        </OnboardingLayout>
    );
}
````

#### `src/components/onboarding/CustomerOnbaording.jsx`  — **REPLACE**

````jsx
'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import OnboardingLayout from '../layout/OnboardingLayout';
import CustomerDetailsStep from './steps/CustomerDetailsStep';
import SuccessStep from './SuccessStep';
import { steps } from '@/const/const';

export default function CustomerOnboarding() {
    const [step, setStep] = useState(1);

    return (
        <OnboardingLayout
            step={step}
            totalSteps={steps.length}
            title={steps[step - 1].title}
            subtitle={steps[step - 1].subtitle}
            onBack={step > 1 && step < steps.length ? () => setStep((s) => s - 1) : null}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                >
                    {step === 1 && <CustomerDetailsStep onNext={() => setStep(2)} />}
                    {step === 2 && <SuccessStep />}
                </motion.div>
            </AnimatePresence>
        </OnboardingLayout>
    );
}
````

#### `src/components/onboarding/steps/BusinessDetailsStep.jsx`  — **REPLACE**

````jsx

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LuArrowRight, LuLoaderCircle } from 'react-icons/lu';
import { toast } from 'sonner';

import TextInput from '../../ui/TextInput';
import { useCompleteBusinessProfile } from '@/hooks/useBusiness';
import { useAuthStore } from '@/store/useAuthStore';

const digitsOnly = z.string().regex(/^[0-9 ]*$/, 'Only digits and spaces are allowed').optional();

const schema = z.object({
    businessName: z.string().min(1, 'Business name is required'),
    acn: digitsOnly,
    abn: digitsOnly,
    streetNumber: z.string().min(1, 'Number is required'),
    streetName: z.string().min(1, 'Street name is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postcode: z.string().min(1, 'Post/Zip code is required'),
    country: z.string().min(1, 'Country is required'),
    phone: z.string().min(1, 'Business phone is required'),
    mobile: z.string().min(1, 'Mobile number is required'),
    website: z
        .string()
        .optional()
        .refine((v) => !v || /^https?:\/\//i.test(v), 'Enter a full URL starting with http:// or https://'),
    socialLinks: z.string().optional(),
});

export default function BusinessDetailsStep({ onNext }) {
    const user = useAuthStore((state) => state.user);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(schema) });

    const { mutate: saveStep, isPending } = useCompleteBusinessProfile();

    const onSubmit = (data) => {
        saveStep(data, {
            onSuccess: () => onNext(),
            onError: (error) => toast.error(error.response?.data?.message || 'Something went wrong'),
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* From the account — not editable here */}
            <TextInput label="Full Name" value={user?.name || ''} readOnly disabled />

            <TextInput label="Business Name" required placeholder="Example Company" error={errors.businessName?.message} {...register('businessName')} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextInput label="ACN" placeholder="9 digits (optional)" error={errors.acn?.message} {...register('acn')} />
                <TextInput label="ABN" placeholder="11 digits (optional)" error={errors.abn?.message} {...register('abn')} />
            </div>

            <div className="border-t border-slate-100 pt-4">
                <p className="mb-3 text-sm font-semibold text-slate-700">Business Address</p>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <TextInput label="Number" required placeholder="12" error={errors.streetNumber?.message} {...register('streetNumber')} />
                        <div className="sm:col-span-2">
                            <TextInput label="Street Name" required placeholder="Main Street" error={errors.streetName?.message} {...register('streetName')} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <TextInput label="City" required placeholder="Sydney" error={errors.city?.message} {...register('city')} />
                        <TextInput label="State" required placeholder="NSW" error={errors.state?.message} {...register('state')} />
                        <TextInput label="Post/Zip Code" required placeholder="2000" error={errors.postcode?.message} {...register('postcode')} />
                    </div>
                </div>
            </div>

            <TextInput label="Country" required placeholder="Australia" error={errors.country?.message} {...register('country')} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextInput label="Business Phone" required placeholder="02 1234 5678" error={errors.phone?.message} {...register('phone')} />
                <TextInput label="Cell/Mobile Number" required placeholder="0400 000 000" error={errors.mobile?.message} {...register('mobile')} />
            </div>
            <TextInput label="Email" value={user?.email || ''} readOnly disabled />
            <TextInput label="Website" placeholder="https://yourbusiness.com" error={errors.website?.message} {...register('website')} />
            <TextInput label="Social Media Links" textarea placeholder="Facebook, Instagram, LinkedIn... (one per line)" {...register('socialLinks')} />

            <button type="submit" disabled={isPending} className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60">
                {isPending ?
                    <LuLoaderCircle className="h-5 w-5 animate-spin" />
                    : 'Continue'}
                {!isPending && <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
        </form>
    );
}
````

#### `src/components/onboarding/steps/BusinessDocumentStep.jsx`  — **REPLACE**

````jsx

'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { LuCamera, LuX, LuArrowRight, LuCheck, LuPlus, LuLoaderCircle } from 'react-icons/lu';

import { useUploadSignature, useSaveBusinessDocuments, useCompleteBusinessProfile } from '@/hooks/useBusiness';
import { uploadToCloudinary } from '@/services/business.service';

const SLOTS = [
    { key: 'PHOTO_ID', label: 'Photo ID', hint: 'Driver Licence, Passport, or Photo Card' },
    { key: 'PROOF_OF_ADDRESS', label: 'Proof of Address', hint: 'Utility Bill, Bank Statement, or Lease Agreement' },
    { key: 'BUSINESS_LICENCE', label: 'Business Licence (if applicable)', hint: 'Optional — upload your business licence if you have one', optional: true },
];

const DECLARATION_TEXT =
    'I confirm that the information provided is true and accurate. I agree to follow the trading rules and guidelines of United Trade card and understand that all trade transactions must comply with the exchange\u2019s policies.';

export default function BusinessDocumentsStep({ onNext }) {
    const [files, setFiles] = useState({ PHOTO_ID: [], PROOF_OF_ADDRESS: [], BUSINESS_LICENCE: [] });
    const [declared, setDeclared] = useState(false);
    const inputRefs = useRef({});

    const { mutateAsync: getSignature } = useUploadSignature();
    const { mutate: saveDocuments, isPending: savingDocs } = useSaveBusinessDocuments();
    const { mutate: saveDeclaration, isPending: savingDeclaration } = useCompleteBusinessProfile();
    const saving = savingDocs || savingDeclaration;

    const handleFileSelect = async (slotKey, e) => {
        const selected = Array.from(e.target.files || []);
        if (!selected.length) return;

        for (const file of selected) {
            const previewUrl = URL.createObjectURL(file);
            const entry = { previewUrl, uploading: true };

            setFiles((prev) => ({ ...prev, [slotKey]: [...prev[slotKey], entry] }));

            try {
                const signatureData = await getSignature();
                const result = await uploadToCloudinary({ file, signatureData });
                if (result.error) throw new Error(result.error.message);

                setFiles((prev) => ({
                    ...prev,
                    [slotKey]: prev[slotKey].map((f) =>
                        f.previewUrl === previewUrl
                            ? { ...f, uploading: false, url: result.secure_url, publicId: result.public_id, fileType: slotKey }
                            : f
                    ),
                }));
            } catch {
                toast.error(`Failed to upload a file for ${SLOTS.find((x) => x.key === slotKey)?.label}`);
                setFiles((prev) => ({
                    ...prev,
                    [slotKey]: prev[slotKey].filter((f) => f.previewUrl !== previewUrl),
                }));
            }
        }
    };

    const removeFile = (slotKey, previewUrl) => {
        setFiles((prev) => ({
            ...prev,
            [slotKey]: prev[slotKey].filter((f) => f.previewUrl !== previewUrl),
        }));
    };

    const allFiles = Object.values(files).flat();

    const handleContinue = () => {
        const hasBoth = files.PHOTO_ID.some((f) => f.url) && files.PROOF_OF_ADDRESS.some((f) => f.url);

        if (!hasBoth) {
            toast.error('Please upload at least one Photo ID and one Proof of Address');
            return;
        }
        if (!declared) {
            toast.error('Please accept the declaration to continue');
            return;
        }

        const uploaded = allFiles.filter((f) => f.url).map(({ url, publicId, fileType }) => ({ url, publicId, fileType }));
        const onError = (error) => toast.error(error.response?.data?.message || 'Something went wrong');

        // 1) record the declaration, 2) save the documents
        saveDeclaration(
            { declarationAccepted: true },
            {
                onSuccess: () => saveDocuments({ documents: uploaded }, { onSuccess: () => onNext(), onError }),
                onError,
            }
        );
    };

    const isUploading = allFiles.some((f) => f.uploading);

    return (
        <div className="space-y-5">
            {SLOTS.map((slot) => (
                <div key={slot.key}>
                    <p className="mb-1.5 text-sm font-medium text-slate-700">
                        {slot.label} {!slot.optional && <span className="text-red-500">*</span>}
                    </p>
                    <p className="mb-2 text-xs text-slate-400">{slot.hint}</p>

                    <div className="grid grid-cols-4 gap-2">
                        {files[slot.key].map((f) => (
                            <div key={f.previewUrl} className="relative aspect-square overflow-hidden rounded-xl border border-slate-200">
                                <img src={f.previewUrl} alt={slot.label} className="h-full w-full object-cover" />
                                {f.uploading ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-[10px] font-medium text-slate-600">
                                        <LuLoaderCircle className="h-5 w-5 animate-spin" />
                                    </div>
                                ) : (
                                    <span className="absolute bottom-1 left-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white">
                                        <LuCheck className="h-2.5 w-2.5" />
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeFile(slot.key, f.previewUrl)}
                                    className="absolute right-1 top-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white"
                                >
                                    <LuX className="h-3 w-3" />
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={() => inputRefs.current[slot.key]?.click()}
                            className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 transition hover:border-indigo-300 hover:bg-indigo-50/40"
                        >
                            {files[slot.key].length === 0 ? (
                                <>
                                    <LuCamera className="h-5 w-5" />
                                    <span className="text-[10px] font-medium">Upload</span>
                                </>
                            ) : (
                                <LuPlus className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    <input
                        ref={(el) => (inputRefs.current[slot.key] = el)}
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileSelect(slot.key, e)}
                        className="hidden"
                    />
                </div>
            ))}

            <div className="border-t border-slate-100 pt-4">
                <p className="mb-2 text-sm font-semibold text-slate-700">Declaration</p>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3">
                    <input
                        type="checkbox"
                        checked={declared}
                        onChange={(e) => setDeclared(e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-indigo-600"
                    />
                    <span className="text-xs leading-relaxed text-slate-600">{DECLARATION_TEXT}</span>
                </label>
            </div>

            <button
                type="button"
                onClick={handleContinue}
                disabled={saving || isUploading || !declared}
                className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
            >
                {saving ?
                    <LuLoaderCircle className="h-5 w-5 animate-spin" />
                    : 'Continue'}
                {!saving && <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
        </div>
    );
}
````

#### `src/components/orders/OrderCard.jsx`  — **REPLACE**

````jsx
'use client';

import { formatDisplay } from '@/lib/currency';
import { useState } from 'react';
import Link from 'next/link';
import { LuLoaderCircle } from 'react-icons/lu';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import StatusBadge from '@/components/ui/StatusBadge';
// import { formatAddress } from '@/lib/formatAddress';

export default function OrderCard({ order, mode = 'buyer', onComplete, onCancel, isCompleting, isCancelling }) {
    const counterpart = mode === 'buyer' ? order.seller : order.buyer;
    const image = order.listing?.imageUrls?.[0];
    const [confirmAction, setConfirmAction] = useState(null);

    const openConfirm = (type) => setConfirmAction(type);
    const closeConfirm = () => setConfirmAction(null);

    const handleConfirm = () => {
        if (!confirmAction) return;

        if (confirmAction === 'complete') {
            onComplete?.(order.id);
        }

        if (confirmAction === 'cancel') {
            onCancel?.(order.id);
        }

        closeConfirm();
    };

    return (
        <>
            <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-0">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    {image ? (
                        <img src={image} alt={order.listing?.title} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-slate-300">No image</div>
                    )}
                </div>

                <div className="min-w-[160px] flex-1">
                    <p className="text-sm font-semibold text-slate-900">{order.listing?.title}</p>
                    <p className="text-xs text-slate-400">
                        {mode === 'buyer' ? 'Seller' : 'Buyer'}: {counterpart?.name}
                    </p>
                    <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleString()}</p>
                </div>

                {/* <div className="min-w-[160px] flex-1">
                    <p className="text-sm font-semibold text-slate-900">{order.listing?.title}</p>
                    <p className="text-xs text-slate-400">
                        {mode === 'buyer' ? 'Seller' : 'Buyer'}: {counterpart?.name}
                    </p>
                    {formatAddress(counterpart) && (
                        <p className="text-xs text-slate-400">📍 {formatAddress(counterpart)}</p>
                    )}
                    <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleString()}</p>
                </div> */}

                <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{formatDisplay(order, 'amount')}</p>
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">Trade Value</p>
                </div>

                <StatusBadge status={order.status} />

                {mode === 'buyer' && order.status === 'ESCROW_HELD' ? (
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => openConfirm('complete')}
                            disabled={isCompleting || isCancelling}
                            className="flex items-center cursor-pointer gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                        >
                            {isCompleting && <LuLoaderCircle className="h-3.5 w-3.5 animate-spin" />}
                            Mark as Complete
                        </button>
                        <button
                            type="button"
                            onClick={() => openConfirm('cancel')}
                            disabled={isCompleting || isCancelling}
                            className="flex items-center cursor-pointer gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-60"
                        >
                            {isCancelling && <LuLoaderCircle className="h-3.5 w-3.5 animate-spin" />}
                            Cancel Order
                        </button>
                    </div>
                ) : (
                    <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                        View Details
                    </Link>
                )}
            </div>

            <ConfirmationModal
                isOpen={Boolean(confirmAction)}
                type={confirmAction === 'complete' ? 'complete' : 'cancel'}
                listingTitle={order.listing?.title || 'this order'}
                onClose={closeConfirm}
                onConfirm={handleConfirm}
                isLoading={confirmAction === 'complete' ? isCompleting : isCancelling}
            />
        </>
    );
}
````

#### `src/components/ui/ApprovalModal.jsx`  — **REPLACE**

````jsx
'use client';

import Modal from '@/components/ui/Modal';
import { useState } from 'react';
import { LuLoaderCircle } from 'react-icons/lu';

export default function ApproveModal({ open, onClose, onConfirm, isPending, currency = 'USD', role }) {
    const isCustomer = role === 'CUSTOMER';
    const [creditLimit, setCreditLimit] = useState('');

    return (
        <Modal open={open} onClose={onClose} title="Approve this user?">
            {isCustomer ? (
                <p className="text-sm text-slate-500">
                    This will activate the customer account and create a wallet with 0 balance and no trade limit.
                </p>
            ) : (
                <>
                    <p className="text-sm text-slate-500">
                        This will activate their account and create a wallet with a starting credit limit.
                    </p>

                    <div className="mt-4">
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Starting Credit Limit ({currency})
                        </label>
                        <input
                            type="number"
                            placeholder={`Amount in ${currency} (leave empty for default)`}
                            value={creditLimit}
                            onChange={(e) => setCreditLimit(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                        <p className="mt-1 text-xs text-slate-400">
                            Enter the limit in this user's country currency ({currency}). It is stored internally in USD.
                        </p>
                    </div>
                </>
            )}

            <div className="mt-6 flex gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 cursor-pointer rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    disabled={isPending}
                    onClick={() => onConfirm(!isCustomer && creditLimit ? Number(creditLimit) : undefined)}
                    className="flex-1 items-center justify-center text-center cursor-pointer rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                >
                    {isPending ?
                        <span className='flex items-center justify-center gap-1' >
                            <LuLoaderCircle className="h-5 w-5 animate-spin" />
                            Confirm Approve
                        </span>
                        : 'Confirm Approve'}
                </button>
            </div>
        </Modal>
    );
}
````

#### `src/components/wallet/SendTransaction.jsx`  — **REPLACE**

````jsx
'use client';

import ReceiverPreview from './ReceiverPreview';
import { formatMoney } from '@/lib/currency';
import { useMyCurrency } from '@/hooks/useCurrency';
import { useState } from 'react';
import { toast } from 'sonner';
import { useSendTransaction } from '@/hooks/useTransaction';
import QrScanner from './qr/QrScanner';
import PinKeypad from './PinKeypad';
export default function SendTransactionCard({ initialReceiverId }) {
    const [step, setStep] = useState(initialReceiverId ? 'amount' : 'scan');
    const [receiverId, setReceiverId] = useState(initialReceiverId || '');
    const [amount, setAmount] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    const { mutate: send, isPending } = useSendTransaction();
    const { data: myCurrency } = useMyCurrency();
    const currencyCode = myCurrency?.currencyCode || 'USD';

    const handleScan = (userId) => {
        setReceiverId(userId);
        setStep('amount');
        toast.success('Recipient detected — enter amount to continue');
    };

    const handleAmountNext = () => {
        if (!amount || Number(amount) <= 0) {
            toast.error('Enter a valid amount');
            return;
        }
        setStep('pin');
    };

    const reset = () => {
        setStep('scan');
        setReceiverId('');
        setAmount('');
        setPin('');
        setError('');
        setResult(null);
    };

    if (result) {
        return (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600">
                    ✓
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">Transaction Successful</h3>
                <p className="mt-1 text-sm text-slate-500">Receipt ID: {result.receiptId}</p>
                <button
                    type="button"
                    onClick={reset}
                    className="mt-5 w-full cursor-pointer rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                    Send Another
                </button>
            </div>
        );
    }

    if (step === 'pin') {
        return (
            <div className="rounded-2xl border border-slate-100 bg-white p-6">
                <PinKeypad
                    length={4}
                    value={pin}
                    onChange={setPin}
                    error={error}
                    title="Enter Your Wallet PIN"
                    subtitle={`Confirm sending ${formatMoney(amount, currencyCode)}`}
                    onSubmit={(val) =>
                        send(
                            { receiverId, amount: Number(amount), pin: val },
                            {
                                onSuccess: (data) => setResult(data),
                                onError: (err) => {
                                    setError(err.response?.data?.message || 'Transaction failed');
                                    setPin('');
                                },
                            }
                        )
                    }
                    isSubmitting={isPending}
                    submitLabel="Confirm & Send"
                />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-md space-y-5">
            <h2 className="text-center text-lg font-bold text-slate-900">Send Money</h2>
            <p className="text-center text-sm text-slate-500">Scan the recipient's QR code to continue</p>

            <div className="rounded-2xl border border-slate-100 bg-white p-5">
                {step === 'scan' && (
                    <>
                        <p className="mb-4 text-center text-sm font-semibold text-slate-700">Scan QR Code</p>
                        <QrScanner onScan={handleScan} />
                    </>
                )}

                {step === 'amount' && (
                    <>
                        <p className="text-center text-sm font-semibold text-slate-700">Enter Amount</p>
                        <p className="mt-1 text-center text-xs text-slate-400">
                            Enter the amount in your currency ({currencyCode}). A 5% fee applies from both sides.
                        </p>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            autoFocus
                            className="mt-5 w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-2xl font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                        <ReceiverPreview receiverId={receiverId} amount={amount} />
                        <button
                            type="button"
                            onClick={handleAmountNext}
                            className="mt-5 w-full cursor-pointer rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Continue
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
````

#### `src/components/wallet/TransactionHistory.jsx`  — **REPLACE**

````jsx
'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useMyTransactions } from '@/hooks/useTransaction';
import Pagination from '../layout/Pagination';
import TransactionListItem from './TransactionListItem';
import Loading from '../ui/Loading';

const TABS = [
    { key: 'all', label: 'All' },
    { key: 'received', label: 'Received' },
    { key: 'sent', label: 'Sent' },
    { key: 'topup', label: 'Top Up', disabled: true },
    { key: 'withdraw', label: 'Withdraw', disabled: true },
];

export default function TransactionHistory() {
    const [tab, setTab] = useState('all');
    const [page, setPage] = useState(1);
    const user = useAuthStore((state) => state.user);
    const { data, isLoading } = useMyTransactions({ page, limit: 10 });

    const transactions = (data?.results || []).filter((t) => {
        if (tab === 'all') return true;
        const isSender = t.senderId === user?.id;
        if (tab === 'received') return !isSender;
        if (tab === 'sent') return isSender;
        return false;
    });

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Transaction History</h2>

            <div className="flex gap-2 overflow-x-auto rounded-full bg-slate-100 p-1">
                {TABS.map((t) => (
                    <button
                        key={t.key}
                        type="button"
                        disabled={t.disabled}
                        onClick={() => setTab(t.key)}
                        className={`whitespace-nowrap cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${tab === t.key ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white px-4">
                {isLoading ? (
                    <Loading />
                ) : !transactions.length ? (
                    <p className="py-8 text-center text-sm text-slate-400">No transactions found.</p>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {transactions.map((t) => {
                            const isSender = t.senderId === user?.id;
                            return (
                                <TransactionListItem
                                    key={t.id}
                                    type={isSender ? 'sent' : 'received'}
                                    title={isSender ? 'Money Sent' : 'Money Received'}
                                    subtitle={isSender ? `To ${t.receiver.name}` : `From ${t.sender.name}`}
                                    amount={t.display?.amount ?? t.amount}
                                currency={t.display?.currency}
                                    date={new Date(t.createdAt).toLocaleDateString()}
                                />
                            );
                        })}
                    </div>
                )}
                {data && <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />}
            </div>
        </div>
    );
}
````

#### `src/components/wallet/TransactionHistoryPreview.jsx`  — **REPLACE**

````jsx
'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useMyTransactions } from '@/hooks/useTransaction';
import TransactionListItem from './TransactionListItem';
import Loading from '../ui/Loading';

export default function TransactionHistoryPreview({ limit = 3 }) {
    const user = useAuthStore((state) => state.user);
    const { data, isLoading } = useMyTransactions({ page: 1, limit });

    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Recent Transactions</h3>
            </div>

            {isLoading ? (
                <Loading />
            ) : !data?.results?.length ? (
                <p className="py-4 text-center text-xs text-slate-400">No transactions yet.</p>
            ) : (
                <div className="divide-y divide-slate-100">
                    {data.results.map((t) => {
                        const isSender = t.senderId === user?.id;
                        return (
                            <TransactionListItem
                                key={t.id}
                                type={isSender ? 'sent' : 'received'}
                                title={isSender ? `Money Sent` : `Money Received`}
                                subtitle={isSender ? `To ${t.receiver.name}` : `From ${t.sender.name}`}
                                amount={t.display?.amount ?? t.amount}
                                currency={t.display?.currency}
                                date={new Date(t.createdAt).toLocaleDateString()}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
````

#### `src/components/wallet/TransactionListItem.jsx`  — **REPLACE**

````jsx
import { formatMoney } from '@/lib/currency';
import { FiArrowDownLeft, FiArrowUpRight, FiRefreshCw } from 'react-icons/fi';

const TYPE_META = {
    received: { icon: FiArrowDownLeft, color: 'bg-emerald-50 text-emerald-600', sign: '+' },
    sent: { icon: FiArrowUpRight, color: 'bg-red-50 text-red-600', sign: '-' },
    topup: { icon: FiRefreshCw, color: 'bg-blue-50 text-blue-600', sign: '+' },
};

export default function TransactionListItem({ type, title, subtitle, amount, currency, date }) {
    const meta = TYPE_META[type] || TYPE_META.sent;
    const Icon = meta.icon;

    return (
        <div className="flex items-center justify-between px-1 py-3">
            <div className="flex items-center gap-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${meta.color}`}>
                    <Icon className="h-4 w-4" />
                </span>
                <div>
                    <p className="text-sm font-semibold text-slate-900">{title}</p>
                    <p className="text-xs text-slate-400">{subtitle}</p>
                </div>
            </div>
            <div className="text-right">
                <p className={`text-sm font-bold ${meta.sign === '+' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {meta.sign}{formatMoney(amount, currency)}
                </p>
                <p className="text-xs text-slate-400">{date}</p>
            </div>
        </div>
    );
}
````

#### `src/components/wallet/WalletOverview.jsx`  — **REPLACE**

````jsx
'use client';

import { formatMoney } from '@/lib/currency';
import { useRouter } from 'next/navigation';
import { FiEye, FiSend, FiCamera as FiScanQr, FiUsers, FiPlusCircle } from 'react-icons/fi';
import { useMyWallet } from '@/hooks/useWallet';
import { useAuthStore } from '@/store/useAuthStore';
import TransactionHistoryPreview from './TransactionHistoryPreview';
import Loading from '../ui/Loading';
import SetPinCard from './SetPinCard';
import QuickActionButton from './QuickActionButton';
import { TIER_META } from '@/const/const';
import { useBusinessProfile } from '@/hooks/useBusiness';
import { useCustomerProfile } from '@/hooks/useCustomer';

export default function WalletOverview() {
    const { data: wallet, isLoading } = useMyWallet();
    const user = useAuthStore((state) => state.user);
    const router = useRouter();
    const isBusiness = user?.role === 'BUSINESS';
    const { data: profile } = isBusiness ? useBusinessProfile(isBusiness) : useCustomerProfile(isBusiness);

    if (isLoading) {
        return <Loading />;
    }
    if (!wallet) {
        return <div className="p-8 text-center text-sm text-slate-400">Wallet not available.</div>;
    }

    if (!wallet.hasPin) {
        return <SetPinCard onSuccess={() => window.location.reload()} />;
    }

    const tier = profile?.membershipTier ? TIER_META[profile.membershipTier] : TIER_META.STANDARD;

    const currency = wallet.display?.currency || 'USD';
    const balance = wallet.display?.balance ?? wallet.balance;
    const creditLimit = wallet.display?.creditLimit ?? wallet.creditLimit;
    const available = wallet.display?.availableBalance ?? Number(balance) + Number(creditLimit);

    return (
        <div className="space-y-5">
            <h2 className="text-lg font-bold text-slate-900">My Wallet</h2>

            <div className={`rounded-2xl bg-gradient-to-br ${tier.accent} p-6 text-white`}>
                <div className="flex items-center gap-2 text-xs font-medium text-white/70">
                    Total Balance
                    <FiEye className="h-3.5 w-3.5" />
                </div>
                <p className="mt-2 text-3xl font-bold">{formatMoney(balance, currency)}</p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/10 p-3">
                        <p className="text-[11px] text-white/70">Available Balance</p>
                        <p className="mt-1 text-lg font-bold">{formatMoney(available, currency)}</p>
                    </div>
                    <div className="rounded-xl bg-white/10 p-3">
                        <p className="text-[11px] text-white/70">Credit Limit</p>
                        <p className="mt-1 text-lg font-bold">{formatMoney(creditLimit, currency)}</p>
                    </div>
                </div>
            </div>

            {/* <div className="grid grid-cols-4 gap-2 rounded-2xl border border-slate-100 bg-white p-3">
                <QuickActionButton icon={FiSend} label="Send Money" color="blue" onClick={() => router.push('/dashboard/wallet/send')} />
                <QuickActionButton icon={FiScanQr} label="Scan QR" color="purple" onClick={() => router.push('/dashboard/wallet/qr')} />
                <QuickActionButton icon={FiUsers} label="Request Money" color="emerald" disabled />
                <QuickActionButton icon={FiPlusCircle} label="Add Money" color="amber" disabled />
            </div> */}

            <TransactionHistoryPreview />
        </div>
    );
}
````

#### `src/const/const.js`  — **REPLACE**

````js

import {
    BsFacebook,
    BsInstagram,
    BsLinkedin,
    BsTwitterX,
    BsYoutube,
} from 'react-icons/bs';
import { FaHandshake, FaSearch, FaSuitcaseRolling } from 'react-icons/fa';

import {
    FiShield,
    FiStar,
    FiMessageCircle,
    FiLock,
    FiClock,
    FiTool,
    FiCamera,
    FiPenTool,
    FiCode,
    FiBookOpen,
    FiScissors,
} from 'react-icons/fi';


export const bubbles = [
    {
        icon: '/assets/laptop.png',
        position:
            'left-[14%] top-[8%] sm:left-[12%] md:left-[8%] lg:left-[13%]',
        size: 'h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20',
        iconSize: 'h-6 w-6 md:h-8 md:w-8',
        bg: 'bg-blue-100/80',
        delay: 0,
    },
    {
        icon: '/assets/book.png',
        position:
            'left-[42%] top-[-2%] sm:left-[42%] md:left-[39%] lg:left-[42%]',
        size: 'h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20',
        iconSize: 'h-6 w-6 md:h-8 md:w-8',
        bg: 'bg-emerald-100/80',
        delay: 0.4,
    },
    {
        icon: '/assets/camera.png',
        position:
            'left-[4%] top-[40%] sm:left-[4%] md:left-[2%] lg:left-[5%]',
        size: 'h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20',
        iconSize: 'h-6 w-6 md:h-8 md:w-8',
        bg: 'bg-indigo-100/80',
        delay: 0.8,
    },
    {
        icon: '/assets/headphone.png',
        position:
            'left-[22%] top-[50%] sm:left-[22%] md:left-[20%] lg:left-[23%]',
        size: 'h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20',
        iconSize: 'h-6 w-6 md:h-8 md:w-8',
        bg: 'bg-violet-100/80',
        delay: 1.2,
    },
    {
        icon: '/assets/plant.png',
        position:
            'right-[3%] top-[27%] sm:right-[3%] md:right-[2%] lg:right-[5%]',
        size: 'h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20',
        iconSize: 'h-6 w-6 md:h-8 md:w-8',
        bg: 'bg-orange-100/80',
        delay: 0.6,
    },
    {
        icon: '/assets/iphone.png',
        position:
            'right-[14%] top-[56%] sm:right-[14%] md:right-[13%] lg:right-[16%]',
        size: 'h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20',
        iconSize: 'h-6 w-6 md:h-8 md:w-8',
        bg: 'bg-purple-100/80',
        delay: 1,
    },
    {
        icon: '/assets/bike.png',
        position:
            'left-[30%] bottom-[7%] sm:left-[30%] md:left-[28%] lg:left-[31%]',
        size: 'h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20',
        iconSize: 'h-6 w-6 md:h-8 md:w-8',
        bg: 'bg-green-100/80',
        delay: 1.4,
    },
    {
        icon: '/assets/piano.png',
        position:
            'left-[52%] bottom-[-2%] sm:left-[52%] md:left-[51%] lg:left-[53%]',
        size: 'h-12 w-12 sm:h-14 sm:w-14 md:h-[68px] md:w-[68px]',
        iconSize: 'h-5 w-5 md:h-7 md:w-7',
        bg: 'bg-violet-100/80',
        delay: 1.8,
    },
];

export const footerLinks = [
    { label: 'Home', href: '/' },
    { label: 'Why Barter', href: '/why-barter' },
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'FAQ', href: '/faq' },
];

export const socialLinks = [
    {
        icon: BsFacebook,
        href: '#',
        label: 'Facebook',
    },
    {
        icon: BsTwitterX,
        href: '#',
        label: 'X',
    },
    {
        icon: BsInstagram,
        href: '#',
        label: 'Instagram',
    },
    {
        icon: BsLinkedin,
        href: '#',
        label: 'LinkedIn',
    },
    {
        icon: BsYoutube,
        href: '#',
        label: 'YouTube',
    },
];

export const Work_steps = [
    {
        number: "01",
        numberColor: "text-blue-600",
        iconBg: "bg-blue-100",
        icon: <FaSuitcaseRolling className="h-6 w-6 text-blue-600" />,
        title: "Tell Us What You Have",
        description: "Add the item, skill, or service you're willing to trade.",
    },
    {
        number: "02",
        numberColor: "text-emerald-600",
        iconBg: "bg-emerald-100",
        icon: <FaSearch className="h-6 w-6 text-emerald-600" />,
        title: "Tell Us What You Want",
        description: "Let people know what you're looking for.",
    },
    {
        number: "03",
        numberColor: "text-purple-600",
        iconBg: "bg-purple-100",
        icon: <FaHandshake className="h-6 w-6 text-purple-600" />,
        title: "Connect & Trade",
        description: "Find a suitable match, make an offer and complete your trade.",
    },
];


export
    const trustCards = [
        {
            icon: FiShield,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-500',
            title: 'Verified Profiles',
            description: 'Real people, real identities.',
        },
        {
            icon: FiStar,
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-500',
            title: 'Ratings & Reviews',
            description: 'Build trust through community feedback.',
        },
        {
            icon: FiLock,
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-500',
            title: 'Trade Protection',
            description: 'Trade with confidence through a safer platform.',
        },
        {
            icon: FiClock,
            iconBg: 'bg-cyan-100',
            iconColor: 'text-cyan-500',
            title: 'Trade History',
            description: 'See past trades and build your reputation.',
        },
    ];

export const people = [
    {
        src: '/assets/person-1.png',
        position: 'left-[2%] top-[8%]',
    },
    {
        src: '/assets/person-2.png',
        position: 'right-[7%] top-[10%]',
    },
    {
        src: '/assets/person-3.png',
        position: 'left-[9%] bottom-[8%]',
    },
    {
        src: '/assets/person-4.png',
        position: 'right-[7%] bottom-[9%]',
    },
];

export const features = [
    {
        icon: '/assets/icons/wallet-icon.png',
        iconBg: "bg-blue-100/70",
        title: "Spend Less",
        description: "Get what you need without always reaching for your wallet.",
    },
    {
        icon: '/assets/icons/leaf-icon.png',
        iconBg: "bg-emerald-100/50",
        title: "Give More Value",
        description: "Turn unused things into something useful.",
    },
    {
        icon: '/assets/icons/users-icon.png',
        iconBg: "bg-purple-100/50",
        title: "Trade Directly",
        description: "Connect with people and exchange value directly.",
    },
];


export const productPairs = [
    {
        have: {
            name: "Laptop",
            image: "/assets/laptop.png",
        },
        want: {
            name: "Camera",
            image: "/assets/camera.png",
        },
    },
    {
        have: {
            name: "Piano",
            image: "/assets/piano.png",
        },
        want: {
            name: "Bike",
            image: "/assets/bike.png",
        },
    },
    {
        have: {
            name: "Iphone",
            image: "/assets/iphone.png",
        },
        want: {
            name: "Camera",
            image: "/assets/camera.png",
        },
    },
    {
        have: {
            name: "Bike",
            image: "/assets/bike.png",
        },
        want: {
            name: "Piano",
            image: "/assets/piano.png",
        },
    },
];

export const BUSINESS_CATEGORIES = [
    'Electronics',
    'Fashion',
    'Home & Living',
    'Food & Grocery',
    'Health & Beauty',
    'Automotive',
    'Sports',
    'Books',
    'Toys',
    'Services',
];

export const DOCUMENT_LABELS = {
    PHOTO_ID: 'Photo ID',
    PROOF_OF_ADDRESS: 'Proof of Address',
    BUSINESS_LICENCE: 'Business Licence',
};

export const steps = [
    { title: 'Your Details', subtitle: 'Tell us a little about yourself so others can connect with you.' },
    { title: "You're All Set!", subtitle: null },
];

export const TIER_META = {
    STANDARD: { label: 'Standard', range: '$2,000 – $3,000', accent: 'from-indigo-500 to-purple-700' },
    GOLD: { label: 'Gold', range: '$10,000 – $15,000', accent: 'from-amber-500 to-orange-600' },
    PLATINUM: { label: 'Platinum', range: '$25,000 – $50,000', accent: 'from-slate-600 to-slate-400' },
};

export const serviceImages = [
    '/assets/services/service.png',
    '/assets/services/services.png',
];

export const SIDEBAR_FEATURES = {
    CURRENCY_RATES: false,
};
````

#### `src/const/dashboardConfig.js`  — **REPLACE**

````js
import { formatMoney } from '@/lib/currency';
import {
    FiHome,
    FiRepeat,
    FiMessageSquare,
    FiUser,
    FiSettings,
    FiShield,
    FiTrendingUp,
    FiUsers,
    FiCheckCircle,
    FiArrowRight,
    FiCreditCard,
    FiSend,
    FiCamera,
    FiClock,
    FiTag,
    FiPackage,
    FiFileText,
    FiEdit3,
} from 'react-icons/fi';

export const sidebarItems = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: FiHome,
    },
    { label: 'Users', href: '/dashboard/admin/users', icon: FiUsers },
    { label: 'Reports', href: '/dashboard/admin/reports', icon: FiFileText },
    { label: 'My Profile', href: '/dashboard/profile', icon: FiUser },
    { label: 'Profile Updates', href: '/dashboard/admin/profile-updates', icon: FiEdit3 },
    {
        label: 'My Wallet',
        href: '/dashboard/wallet',
        icon: FiRepeat,
    },
    {
        label: 'My Listings',
        href: '/dashboard/listings',
        icon: FiTag,
    },
    { label: 'My Orders', href: '/dashboard/orders', icon: FiPackage },
    { label: 'Received Orders', href: '/dashboard/orders/received', icon: FiPackage },
    { label: 'My Barter Offers', href: '/dashboard/barter-offers', icon: FiRepeat },
    { label: 'Received Offers', href: '/dashboard/barter-offers/received', icon: FiRepeat },
];

const adminSidebarHrefs = new Set([
    '/dashboard',
    '/dashboard/admin/users',
    '/dashboard/wallet',
    '/dashboard/admin/reports',
    '/dashboard/orders',
    '/dashboard/admin/profile-updates'
]);

const adminOnlySidebarHrefs = new Set([
    '/dashboard/admin/users',
    '/dashboard/admin/reports',
    '/dashboard/admin/profile-updates'
]);

export const getSidebarItems = (isAdmin = false) => (
    isAdmin
        ? sidebarItems.filter((item) => adminSidebarHrefs.has(item.href))
        : sidebarItems.filter((item) => !adminOnlySidebarHrefs.has(item.href))
);

export const getDashboardRoutes = ({
    userName,
    isProfileComplete,
    isAdmin,
    pendingCount,
    walletBalance = 0,
    creditLimit = 0,
    availableBalance: availableFromApi,
    currency = 'USD',
}) => {
    // walletBalance / creditLimit / availableBalance arrive already converted to the user's currency.
    const availableBalance = availableFromApi ?? Number(walletBalance) + Number(creditLimit);
    const money = (value) => formatMoney(value, currency);

    return {
        '/dashboard': {
            eyebrow: isAdmin ? 'Admin overview' : 'Your barter overview',
            title: `Welcome back, ${userName || 'there'}`,
            description: isAdmin
                ? 'Review pending user approvals and manage the platform.'
                : 'Discover new opportunities, manage your trades and grow your barter network.',
            icon: FiTrendingUp,
            iconBg: 'from-blue-500 to-indigo-600',
            badge: isAdmin ? `${pendingCount} Pending Approvals` : 'Dashboard',
            badgeIcon: FiTrendingUp,

            stats: isAdmin
                ? [{ label: 'Pending Approvals', value: String(pendingCount), icon: FiUsers }]
                : [
                    { label: 'Wallet Balance', value: money(walletBalance), icon: FiCreditCard },
                    { label: 'Available Credit', value: money(availableBalance), icon: FiTrendingUp },
                    { label: 'Profile Strength', value: isProfileComplete ? '100%' : '50%', icon: FiUser },
                ],

            action: isAdmin ? null : { label: 'Go to Wallet', href: '/dashboard/wallet', icon: FiArrowRight },
        },

        '/dashboard/wallet': {
            eyebrow: 'Manage your balance',
            title: 'My Wallet',
            description: 'View your balance, send money, and track every transaction in one place.',
            icon: FiCreditCard,
            iconBg: 'from-blue-500 to-blue-700',
            badge: `${money(walletBalance)} Balance`,
            badgeIcon: FiCreditCard,

            stats: [
                { label: 'Wallet Balance', value: money(walletBalance), icon: FiCreditCard },
                { label: 'Credit Limit', value: money(creditLimit), icon: FiTrendingUp },
                { label: 'Available Balance', value: money(availableBalance), icon: FiCheckCircle },
            ],

        },

        '/dashboard/wallet/send': {
            eyebrow: 'Payments, instantly',
            title: 'Send Money',
            description: 'Scan a QR code or enter recipient details to transfer money securely.',
            icon: FiSend,
            iconBg: 'from-indigo-500 to-purple-600',
            badge: 'Send',
            badgeIcon: FiSend,
            stats: [],
            action: null,
        },

        '/dashboard/wallet/qr': {
            eyebrow: 'Receive payments',
            title: 'Your QR Code',
            description: "Share your QR code so others can scan it and send you money directly.",
            icon: FiCamera,
            iconBg: 'from-cyan-500 to-blue-600',
            badge: 'Receive',
            badgeIcon: FiCamera,
            stats: [],
            action: null,
        },

        '/dashboard/wallet/history': {
            eyebrow: 'Your activity',
            title: 'Transaction History',
            description: 'Track every payment you\'ve sent and received on the platform.',
            icon: FiClock,
            iconBg: 'from-slate-600 to-slate-800',
            badge: 'History',
            badgeIcon: FiClock,
            stats: [],
            action: null,
        },

        '/dashboard/trades': {
            eyebrow: 'Trade marketplace',
            title: 'Find Your Next Trade',
            description:
                'Browse relevant barter opportunities and connect with people who have what you need.',
            icon: FiRepeat,
            iconBg: 'from-cyan-500 to-blue-600',
            badge: '12 Active Trades',
            badgeIcon: FiRepeat,

            stats: [
                { label: 'Available Matches', value: '24', icon: FiTrendingUp },
                { label: 'Pending Trades', value: '5', icon: FiRepeat },
                { label: 'Completed', value: '18', icon: FiCheckCircle },
            ],

            action: {
                label: 'Browse Trades',
                href: '/dashboard/trades',
                icon: FiArrowRight,
            },
        },

        '/dashboard/messages': {
            eyebrow: 'Stay connected',
            title: 'Your Conversations',
            description:
                'Keep your trade discussions organized and communicate securely with your partners.',
            icon: FiMessageSquare,
            iconBg: 'from-violet-500 to-purple-600',
            badge: '3 New Messages',
            badgeIcon: FiMessageSquare,

            stats: [
                { label: 'Unread', value: '3', icon: FiMessageSquare },
                { label: 'Active Chats', value: '8', icon: FiUsers },
                { label: 'Trade Discussions', value: '6', icon: FiRepeat },
            ],

            action: {
                label: 'View Messages',
                href: '/dashboard/messages',
                icon: FiArrowRight,
            },
        },

        '/dashboard/profile': {
            eyebrow: 'Build trust',
            title: isProfileComplete ? 'Your Profile' : 'Complete Your Profile',
            description: isProfileComplete
                ? 'Your profile is complete — this builds trust and helps you find better trade matches.'
                : 'A complete profile builds trust and helps you find better trade matches.',
            icon: FiUser,
            iconBg: 'from-blue-500 to-indigo-600',
            badge: isProfileComplete ? 'Profile Complete' : 'Incomplete',
            badgeIcon: FiCheckCircle,

            progress: isProfileComplete ? 100 : 50,

            stats: [
                { label: 'Trust Score', value: isProfileComplete ? '82%' : '—', icon: FiShield },
            ],

            action: isProfileComplete
                ? null
                : { label: 'Complete Profile', href: '/onboarding', icon: FiArrowRight },
        },

        '/dashboard/settings': {
            eyebrow: 'Account preferences',
            title: 'Manage Your Settings',
            description:
                'Control your account preferences, notifications and privacy settings from one place.',
            icon: FiSettings,
            iconBg: 'from-slate-600 to-slate-800',
            badge: 'Account Settings',
            badgeIcon: FiSettings,

            stats: [
                { label: 'Account Status', value: 'Active', icon: FiCheckCircle },
                { label: 'Security', value: 'Strong', icon: FiShield },
                { label: 'Notifications', value: 'On', icon: FiSettings },
            ],

            action: {
                label: 'Manage Settings',
                href: '/dashboard/settings',
                icon: FiArrowRight,
            },
        },
    };
};
````

#### `src/hooks/useCurrency.js`  — **REPLACE**

````js
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getConversionPreview, getCurrencyRates, getMyCurrency } from '@/services/currency.service';

export const useCurrencyRates = (enabled = true) => {
    return useQuery({
        queryKey: ['currencyRates'],
        queryFn: getCurrencyRates,
        enabled,
        staleTime: 10 * 60 * 1000,
    });
};

export const useMyCurrency = (enabled = true) => {
    return useQuery({
        queryKey: ['myCurrency'],
        queryFn: getMyCurrency,
        enabled,
        staleTime: 10 * 60 * 1000,
    });
};

// Powers "Receiver will get ≈ X" under the amount input.
export const useConversionPreview = ({ receiverId, amount }, enabled = true) => {
    const numeric = Number(amount);
    return useQuery({
        queryKey: ['conversionPreview', receiverId, numeric],
        queryFn: () => getConversionPreview({ receiverId, amount: numeric }),
        enabled: enabled && !!receiverId && numeric > 0,
        placeholderData: keepPreviousData,
        staleTime: 60 * 1000,
    });
};
````

#### `src/hooks/useProfileCompletion.js`  — **REPLACE**

````js

import { useAuthStore } from "@/store/useAuthStore";
import { useBusinessProfile } from "./useBusiness";
import { useCustomerProfile } from "./useCustomer";

export const useProfileCompletion = (enabled = true) => {
    const user = useAuthStore((state) => state.user);
    const isBusiness = user?.role === 'BUSINESS';
    const isCustomer = user?.role === 'CUSTOMER';
    const isAdmin = user?.role === 'ADMIN';

    const businessQuery = useBusinessProfile(enabled && !!user && isBusiness);
    const customerQuery = useCustomerProfile(enabled && !!user && isCustomer);

    if (!enabled || !user || isAdmin) {
        return { isComplete: isAdmin, isLoading: false };
    }

    if (isBusiness) {
        const hasProfile = !!businessQuery.data;
        const docs = businessQuery.data?.documents || [];
        const hasBothDocs = docs.some((d) => d.fileType === 'PHOTO_ID') && docs.some((d) => d.fileType === 'PROOF_OF_ADDRESS');
        const hasTier = !!businessQuery.data?.membershipTier;
        const hasDeclared = !!businessQuery.data?.declarationAccepted;
        return {
            isComplete: hasProfile && hasBothDocs && hasTier && hasDeclared,
            isLoading: businessQuery.isLoading,
        };
    }

    return {
        isComplete: !!customerQuery.data,
        isLoading: customerQuery.isLoading,
    };
};
````

#### `src/hooks/useTransaction.js`  — **REPLACE**

````js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getMyQrCode, sendTransaction, getReceipt, getMyTransactions } from '@/services/transaction.service';

export const useMyQrCode = () => {
    return useQuery({
        queryKey: ['myQrCode'],
        queryFn: getMyQrCode,
    });
};

export const useSendTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: sendTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
            queryClient.invalidateQueries({ queryKey: ['myTransactions'] });
            toast.success('Payment sent successfully!');
        },
    });
};

export const useReceipt = (receiptId) => {
    return useQuery({
        queryKey: ['receipt', receiptId],
        queryFn: () => getReceipt(receiptId),
        enabled: !!receiptId,
    });
};

export const useMyTransactions = (params) => {
    return useQuery({
        queryKey: ['myTransactions', params],
        queryFn: () => getMyTransactions(params),
    });
};
````

#### `src/lib/formatAddress.js`  — **REPLACE**

````js

// "12 Main Street, Sydney, NSW, 2000"
export const formatBusinessAddress = (profile) =>
    [
        [profile?.streetNumber, profile?.streetName].filter(Boolean).join(' '),
        profile?.city,
        profile?.state,
        profile?.postcode,
    ]
        .filter(Boolean)
        .join(', ');

export const formatAddress = (person) => {
    if (person?.role === 'BUSINESS') return formatBusinessAddress(person?.businessProfile);
    const profile = person?.customerProfile;
    return [profile?.city, profile?.address].filter(Boolean).join(', ');
};
````

#### `src/services/currency.service.js`  — **REPLACE**

````js

import api from '@/lib/axios';

// Read-only. Rates are refreshed automatically by the backend — nothing to add/edit.
export const getCurrencyRates = async () => {
    const res = await api.get('/currency-rates');
    return res.data; // { base: 'USD', updatedAt, rates: { PKR: 280.1, ... } }
};

export const getMyCurrency = async () => {
    const res = await api.get('/currency-rates/me');
    return res.data; // { currencyCode: 'PKR', rate: 280.1 }
};

export const getConversionPreview = async ({ receiverId, amount }) => {
    const res = await api.get('/currency-rates/preview', { params: { receiverId, amount } });
    return res.data;
};
````