const db = require('../db/db');

const recurringTransactionsDB = {
    getRecurringTransactions: function(email, callback){
        db.many('SELECT * FROM recurring_transactions WHERE email = $1;', [email])
            .then(result => callback(null, result))
            .catch(err => callback(err, null));
    },

    addRecurringTransaction: function(transactionDetails, callback){
        if (!transactionDetails.start_date) {
            transactionDetails.start_date = new Date()
        }else if(!transactionDetails.end_date){
            transactionDetails.end_date = null;
        }
        db.none(
            'INSERT INTO recurring_transactions (email, amount, frequency, start_date, \
            end_date, method, recipient, account, category, transaction_type, recorded_with) \
            VALUES (${email}, ${amount}, ${frequency}, ${start_date}, ${end_date}, ${method}, \
            ${recipient}, ${account}, ${category}, ${transaction_type}, ${recorded_with})\
            ON CONFLICT (email, recipient) DO UPDATE SET amount=${amount}, frequency=${frequency},\
            start_date=${start_date}, end_date=${end_date}, method=${method}, recipient=${recipient},\
            account=${account}, category=${category}, transaction_type=${transaction_type}, \
            recorded_with=${recorded_with};'
            , transactionDetails
        )
            .then(() => callback(null, "Success"))
            .catch(err => callback(err, null));
    },

    getUserBudget: function(email, callback){
        db.one("SELECT * FROM recurring_transactions WHERE recipient = 'BUDGET' AND email = $1;", [email])
            .then(result => callback(null, result))
            .catch(err => callback(err, null));
    },

    syncRecurringToTransaction: function(email, callback){
        const dateInPast = function (firstDate, secondDate) {
            if (firstDate.setHours(0, 0, 0, 0) <= secondDate.setHours(0, 0, 0, 0)) {
                return true;
            }
            return false;
        };

        async function insertTransaction(userId, next_date, transaction){
            transaction["userId"] = userId;
            transaction["date_of_transfer"] = next_date;
            transaction["time_of_transfer"] = '00:00:00';
            return (await db.none(
                "INSERT INTO transactions(user_id, method, recipient, date_of_transfer, time_of_transfer, amount, account, category, transaction_type, recorded_with) \
                VALUES(${userId}, ${method}, ${recipient}, ${date_of_transfer}, ${time_of_transfer}, ${amount}, ${account}, ${category}, ${transaction_type}, ${recorded_with})\
                ON CONFLICT (user_id, recipient, date_of_transfer, time_of_transfer, amount) DO NOTHING;",
                transaction
            ))
        };
        
        db.many("SELECT * FROM recurring_transactions WHERE email = $1;", [email])
            .then(transactions => {
                let currentDate = new Date();
                db.one("SELECT user_id FROM users WHERE email = $1", [email])
                    .then(async(result) => {
                        const userId = result.user_id;
                        for(let transaction of transactions){
                            const start_date = new Date(transaction.start_date);
                            let end_date;
                            transaction.end_date ? end_date = new Date(transaction.end_date) : end_date = null;
                            switch(transaction.frequency){
                                case 'monthly':
                                    let iterations = 0;
                                    let next_date = start_date;
                                    while(next_date >= start_date && (end_date ? next_date <= end_date : true) && dateInPast(next_date, currentDate)){
                                        iterations += 1;
                                        await insertTransaction(userId, next_date, transaction);
                                        next_date.setMonth(next_date.getMonth()+1);
                                    }
                            }
                        }
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => callback(err, null));
    }
}

module.exports = recurringTransactionsDB;