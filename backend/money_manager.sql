DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);

INSERT INTO users (email, username, password, created_at)
VALUES
('john.doe@gmail.com', 'johndoe', '12345678', '2022-02-22 10:30:00'),
('jane.smith@gmail.com', 'janesmith', 'password123', '2022-02-21 15:45:00');

DROP TABLE IF EXISTS transactions;

CREATE TABLE transactions (
  transaction_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id),
  method VARCHAR(100) NOT NULL,
  recipient VARCHAR(100) NOT NULL,
  date_of_transfer DATE NOT NULL,
  time_of_transfer TIME NOT NULL,
  amount VARCHAR(20) NOT NULL,
  account VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO transactions (user_id, method, recipient, date_of_transfer, time_of_transfer, amount, account)
VALUES (1, 'You have sent money via PayNow', 'EDWARD TAN', '2023-02-21', '19:25', 'SGD 15.90', 'FRANK Account (-779001) SGD');