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
        db.one("SELECT * FROM recurring_transactions WHERE recipient = 'budget' AND email = $1;", [email])
            .then(result => callback(null, result))
            .catch(err => callback(err, null));
    },

    syncRecurringToTransaction: function(email, callback){
        db.many("SELECT * FROM recurring_transactions WHERE email = $1;")
            .then(result => {
                console.log(new Date())
                console.log(result)
            })
            .catch(err => callback(err, null));
    }
}

module.exports = recurringTransactionsDB;