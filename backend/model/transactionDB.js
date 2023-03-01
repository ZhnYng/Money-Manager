const db = require('../db/db');
const gmailAPI = require('../gmailAPI/gmailAPI');
const pgp = require('pg-promise')(/* options */);

pgp.pg.types.setTypeParser(1082, function (value) {
    return value
})

const transactionDb = {
    updateTransactions: async function(userId, callback){
        const result = await gmailAPI.allTransactionDetails();
        if(result.response?.data.error){
            return callback(null, result.response.data.error.message);
        }else{
            db.tx(t => {
                const queries = result.map(l => {
                    l['userId'] = userId;
                    return t.none('INSERT INTO transactions(user_id, method, recipient, date_of_transfer, time_of_transfer, amount, account) \
                        VALUES(${userId}, ${Transaction_method}, ${Recipient}, ${Date_of_Transfer}, ${Time_of_Transfer}, ${Amount}, ${Account})\
                        ON CONFLICT (user_id, method, recipient, date_of_transfer, time_of_transfer, amount, account) DO NOTHING;', l);
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
            ORDER BY date_of_transfer DESC;`, 
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
    }
}

module.exports = transactionDb;