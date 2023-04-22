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
  method VARCHAR(100),
  recipient VARCHAR(100) NOT NULL,
  date_of_transfer DATE NOT NULL,
  time_of_transfer TIME NOT NULL,
  amount VARCHAR(20) NOT NULL,
  sender VARCHAR(100),
  category VARCHAR(30),
  transaction_type VARCHAR(20) NOT NULL DEFAULT 'expense', --income or expense
  recorded_with VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_transaction UNIQUE (user_id, recipient, date_of_transfer, time_of_transfer, amount)
);

DROP TABLE IF EXISTS recurring_transactions CASCADE;

CREATE TABLE recurring_transactions (
  recurring_transactions_id SERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL REFERENCES users(email),
  amount VARCHAR(20) NOT NULL,
  frequency VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  method VARCHAR(100),
  recipient VARCHAR(100) NOT NULL,
  sender VARCHAR(100),
  category VARCHAR(30),
  transaction_type VARCHAR(20) NOT NULL DEFAULT 'expense', --income or expense
  recorded_with VARCHAR(20) NOT NULL DEFAULT 'RECURRING',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_recurring UNIQUE (email, recipient)
);