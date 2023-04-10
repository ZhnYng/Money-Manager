const db = require('../db/db');

const userDb = {
    addUser: function(userDetails, callback){
        const {email} = userDetails;
        db.none('INSERT INTO users(email) VALUES ($1) ON CONFLICT (email) DO NOTHING;', [email])
            .then(() => {
                return callback(null, "User added to DB");
            })
            .catch(error => {
                return callback(error, null);
            });
    },

    getUserById: function(userId, callback){
        db.one('SELECT email, username FROM users WHERE user_id = $1', [userId])
            .then(data => callback(null, data))
            .catch(err => callback(err, null));
    },

    getIdByUser: function(email, callback){
        db.one('SELECT user_id FROM users WHERE email = $1', [email])
            .then(data => callback(null, data))
            .catch(err => callback(err, null));
    }
}

module.exports = userDb;