DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);

DROP TABLE IF EXISTS transactions CASCADE;

CREATE TABLE transactions (
  transaction_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id),
  method VARCHAR(100) NOT NULL,
  recipient VARCHAR(100) NOT NULL,
  date_of_transfer DATE NOT NULL,
  time_of_transfer TIME NOT NULL,
  amount VARCHAR(20) NOT NULL,
  account VARCHAR(100) NOT NULL,
  category VARCHAR(30),
  transaction_type VARCHAR(20) NOT NULL DEFAULT 'expense', --income or expense
  recorded_with VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_transaction UNIQUE (user_id, method, recipient, date_of_transfer, time_of_transfer, amount, account)
);

DROP TABLE IF EXISTS budget CASCADE;

CREATE TABLE budget (
  budget_id SERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL REFERENCES users(email),
  amount NUMERIC(10, 2) NOT NULL,
  frequency VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);