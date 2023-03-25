const db = require('../db/db');
const gmailAPI = require('../gmailAPI/gmailAPI');
const pgp = require('pg-promise')(/* options */);

// This solves the issue of returned dates being one day behind time
pgp.pg.types.setTypeParser(1082, function (value) {
    return value
})

const transactionDb = {
    gmailUpdateTransactions: async function(userId, callback){
        const result = await gmailAPI.allTransactionDetails();
        if(result.response?.data.error){
            return callback(null, result.response.data.error.message);
        }else{
            db.tx(t => {
                const queries = result.map(l => {
                    l['userId'] = userId;
                    return t.none("INSERT INTO transactions(user_id, method, recipient, date_of_transfer, time_of_transfer, amount, account, transaction_type, recorded_with) \
                        VALUES(${userId}, ${Transaction_method}, ${Recipient}, ${Date_of_Transfer}, ${Time_of_Transfer}, ${Amount}, ${Account}, 'expense', 'GmailAPI')\
                        ON CONFLICT (user_id, recipient, date_of_transfer, time_of_transfer, amount) DO NOTHING;", l);
                });
                return t.batch(queries);
            })
                .then(data => {
                    if(data.every(element => element === null)) return callback(null, "Success");
                })
                .catch(error => {
                    return callback(error, null);
                });
        }
    },

    getTransactions: function(userId, period=null, callback){
        db.many(`
            SELECT *
            FROM transactions
            WHERE user_id = $1
            AND ($2 IS NULL OR to_char(date_of_transfer, 'MM-YYYY') = $2)
            ORDER BY date_of_transfer DESC, time_of_transfer DESC;`, 
        [parseInt(userId), period])
            .then(data => {
                callback(null, data)})
            .catch(error => callback(error, null));
    },

    getTransactionById: function(transactionId, callback){
        db.one('SELECT * FROM transactions WHERE transaction_id = $1', [transactionId])
            .then(data => callback(null, data))
            .catch(err => callback(err, null));
    },

    addTransaction: function(userId, transactionDetails, callback){
        transactionDetails["userId"] = userId;
        db.none(
            "INSERT INTO transactions(user_id, method, recipient, date_of_transfer, time_of_transfer, amount, account, category, transaction_type, recorded_with) \
            VALUES(${userId}, ${method}, ${recipient}, ${date_of_transfer}, ${time_of_transfer}, ${amount}, ${account}, ${category}, ${transaction_type}, ${recorded_with})\
            ON CONFLICT (user_id, recipient, date_of_transfer, time_of_transfer, amount) DO NOTHING;",
            transactionDetails
        )
            .then(data => data ? callback(null, "Unsuccessful") : callback(null, "Successful"))
            .catch(err => callback(err, null));
    },

    deleteTransaction: function(transactionId, email, callback){
        db.one('SELECT email, recorded_with FROM transactions, users WHERE transactions.user_id = users.user_id AND transaction_id = $1', [transactionId])
            .then(data => {
                if(data.email === email){
                    if(data.recorded_with === "MANUAL" || data.recorded_with === "RECURRING"){
                        db.none('DELETE FROM transactions WHERE transaction_id = $1;', [parseInt(transactionId)])
                            .then(() => callback(null, "Success"))
                            .catch(err => callback(err, null));
                    }else{
                        return callback("Forbidden", null);
                    }
                }else{
                    return callback("Unauthorized", null);
                }
            })
            .catch(err => callback(err, null));
    },

    updateCategory: function(transactionId, email, category, callback){
        db.one('SELECT email FROM transactions, users WHERE transactions.user_id = users.user_id AND transaction_id = $1', [transactionId])
            .then(data => {
                if(data.email === email){
                    db.none('UPDATE transactions SET category = $1 WHERE transaction_id = $2;', [category, transactionId])
                        .then(() => callback(null, "Success"))
                        .catch(err => callback(err, null));
                }else{
                    return callback("Unauthorized", null);
                }
            })
            .catch(err => callback(err, null));
    },

    getTransactions: function(userId, period=null, callback){
        db.many(`
            SELECT *
            FROM transactions
            WHERE user_id = $1
            AND ($2 IS NULL OR to_char(date_of_transfer, 'MM-YYYY') = $2)
            ORDER BY date_of_transfer DESC, time_of_transfer DESC;`, 
        [parseInt(userId), period])
            .then(data => {
                callback(null, data)})
            .catch(error => callback(error, null));
    },

    getExpenses: function(userId, callback, month=null, year=null){
        db.many(`
            SELECT COALESCE(SUM(NULLIF(regexp_replace(amount, '[^0-9.]*','','g'), '')::numeric), 0) AS total_expenses
            FROM transactions
            WHERE user_id = $1
            AND transaction_type = 'expense'
            AND ($2 IS NULL OR to_char(date_of_transfer, 'MM') = $2)
            AND ($3 IS NULL OR to_char(date_of_transfer, 'YYYY') = $3)
        ;`, 
        [parseInt(userId), month, year])
            .then(data => {
                callback(null, data)})
            .catch(error => callback(error, null));
    },

    getIncome: function(userId, callback, month=null, year=null){
        db.many(`
            SELECT COALESCE(SUM(NULLIF(regexp_replace(amount, '[^0-9.]*','','g'), '')::numeric), 0) AS total_income
            FROM transactions
            WHERE user_id = $1
            AND transaction_type = 'income'
            AND ($2 IS NULL OR to_char(date_of_transfer, 'MM') = $2)
            AND ($3 IS NULL OR to_char(date_of_transfer, 'YYYY') = $3)
        ;`, 
        [parseInt(userId), month, year])
            .then(data => {
                callback(null, data)})
            .catch(error => callback(error, null));
    }
}

module.exports = transactionDb;