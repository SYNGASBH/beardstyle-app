-- Migration: User Subscription Fields
-- Version: 1.3.2
-- Description: Adds subscription tier support for regular users (Academy premium access)

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(50) DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_expires TIMESTAMP;

COMMENT ON COLUMN users.subscription_tier IS 'free, premium — controls Academy access';
COMMENT ON COLUMN users.subscription_expires IS 'NULL = never expires (lifetime), otherwise check date';
