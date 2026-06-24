-- Adds customer contact fields collected on the checkout form.
alter table orders add column if not exists customer_name text;
alter table orders add column if not exists customer_phone text;
