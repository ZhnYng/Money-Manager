const db = require('../db/db');

const budgetDB = {
    getUserBudget: function(email, callback){
        db.one('SELECT budget FROM budget WHERE email = $1 ORDER BY budget_id DESC LIMIT 1', [email])
            .then(result => callback(null, result))
            .catch(err => callback(err, null));
    },

    addBudget: function(budgetDetails, callback){
        db.none('INSERT INTO budget (email, budget, frequency) VALUES (${email}, ${budget}, ${frequency});', budgetDetails)
            .then(() => callback(null, "Success"))
            .catch(err => callback(err, null));
    }
}

module.exports = budgetDB;