const db = require('../db/db');

const budgetDB = {
    getCurrentBudget: function(email, callback){
        db.one('SELECT * FROM budget WHERE email = $1 ORDER BY budget_id DESC LIMIT 1', [email])
            .then(result => callback(null, result))
            .catch(err => callback(err, null));
    },

    getBudgetByMonth: function(email, callback, month=null, year=null){
        db.many(`
            SELECT amount as monthly_budget
            FROM budget
            WHERE email = $1
            AND ($2 IS NULL OR to_char(created_at::date, 'MM') = $2)
            AND ($3 IS NULL OR to_char(created_at::date, 'YYYY') = $3)
            ;`, 
            [email, month, year]
        )
            .then(data => callback(null, data))
            .catch(error => callback(error, null));
    },

    addBudget: function(budgetDetails, callback){
        db.none('INSERT INTO budget (email, amount, frequency) VALUES (${email}, ${amount}, ${frequency});', budgetDetails)
            .then(() => callback(null, "Success"))
            .catch(err => callback(err, null));
    }
}

module.exports = budgetDB;