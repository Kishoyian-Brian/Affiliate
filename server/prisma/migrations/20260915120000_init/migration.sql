-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'restricted');

-- CreateEnum
CREATE TYPE "BotAccessStatus" AS ENUM ('unknown', 'ok', 'failed');

-- CreateEnum
CREATE TYPE "CampaignType" AS ENUM ('subscribe', 'referral');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('draft', 'active', 'paused', 'ended');

-- CreateEnum
CREATE TYPE "CompletionStatus" AS ENUM ('awaiting_verification', 'verified_pending', 'completed', 'failed', 'cancelled');

-- CreateEnum
CREATE TYPE "VerificationMethod" AS ENUM ('telegram_membership');

-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('attributed', 'verified', 'invalid');

-- CreateEnum
CREATE TYPE "LedgerEntryType" AS ENUM ('held', 'released', 'revoked', 'withdrawal_reserve', 'withdrawal_paid', 'withdrawal_rejected');

-- CreateEnum
CREATE TYPE "WithdrawalMethod" AS ENUM ('ton', 'usdt', 'telegram_stars');

-- CreateEnum
CREATE TYPE "WithdrawalStatus" AS ENUM ('pending', 'processing', 'completed', 'rejected');

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "telegram_id" BIGINT NOT NULL,
    "username" TEXT,
    "display_name" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channels" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "telegram_chat_id" BIGINT,
    "member_count" INTEGER NOT NULL DEFAULT 0,
    "bot_access" "BotAccessStatus" NOT NULL DEFAULT 'unknown',
    "last_checked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "short_description" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "CampaignType" NOT NULL,
    "sponsor_name" TEXT NOT NULL,
    "reward_amount" DECIMAL(12,2) NOT NULL,
    "reward_currency" TEXT NOT NULL DEFAULT 'USD',
    "hold_hours" INTEGER NOT NULL,
    "slots_total" INTEGER NOT NULL,
    "referral_target" INTEGER,
    "requirements" JSONB NOT NULL,
    "rules" TEXT[],
    "status" "CampaignStatus" NOT NULL DEFAULT 'draft',
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "completions" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "CompletionStatus" NOT NULL DEFAULT 'awaiting_verification',
    "verification_method" "VerificationMethod",
    "telegram_status_raw" TEXT,
    "verified_at" TIMESTAMP(3),
    "hold_release_at" TIMESTAMP(3),
    "reward_amount" DECIMAL(12,2) NOT NULL,
    "reward_currency" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "completions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referrals" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "referrer_id" TEXT NOT NULL,
    "referred_user_id" TEXT NOT NULL,
    "referred_completion_id" TEXT,
    "status" "ReferralStatus" NOT NULL DEFAULT 'attributed',
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ledger_entries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "LedgerEntryType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "completion_id" TEXT,
    "withdrawal_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ledger_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "withdrawals" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "fee" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "method" "WithdrawalMethod" NOT NULL,
    "destination" TEXT NOT NULL,
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'pending',
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "withdrawals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_telegram_id_key" ON "users"("telegram_id");

-- CreateIndex
CREATE UNIQUE INDEX "channels_username_key" ON "channels"("username");

-- CreateIndex
CREATE UNIQUE INDEX "channels_telegram_chat_id_key" ON "channels"("telegram_chat_id");

-- CreateIndex
CREATE INDEX "campaigns_status_start_at_end_at_idx" ON "campaigns"("status", "start_at", "end_at");

-- CreateIndex
CREATE INDEX "completions_status_hold_release_at_idx" ON "completions"("status", "hold_release_at");

-- CreateIndex
CREATE UNIQUE INDEX "completions_campaign_id_user_id_key" ON "completions"("campaign_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "referrals_referred_completion_id_key" ON "referrals"("referred_completion_id");

-- CreateIndex
CREATE INDEX "referrals_campaign_id_referrer_id_status_idx" ON "referrals"("campaign_id", "referrer_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "referrals_campaign_id_referred_user_id_key" ON "referrals"("campaign_id", "referred_user_id");

-- CreateIndex
CREATE INDEX "ledger_entries_user_id_type_idx" ON "ledger_entries"("user_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "ledger_entries_completion_id_type_key" ON "ledger_entries"("completion_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "ledger_entries_withdrawal_id_type_key" ON "ledger_entries"("withdrawal_id", "type");

-- CreateIndex
CREATE INDEX "withdrawals_status_requested_at_idx" ON "withdrawals"("status", "requested_at");

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "completions" ADD CONSTRAINT "completions_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "completions" ADD CONSTRAINT "completions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrer_id_fkey" FOREIGN KEY ("referrer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referred_user_id_fkey" FOREIGN KEY ("referred_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referred_completion_id_fkey" FOREIGN KEY ("referred_completion_id") REFERENCES "completions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_completion_id_fkey" FOREIGN KEY ("completion_id") REFERENCES "completions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_withdrawal_id_fkey" FOREIGN KEY ("withdrawal_id") REFERENCES "withdrawals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
