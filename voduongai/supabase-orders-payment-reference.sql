-- Adds a column to record the bank reference code from SePay webhook auto-confirmations.
alter table orders add column if not exists payment_reference text;
