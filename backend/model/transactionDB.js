const db = require('../db/db');
const gmailAPI = require('../gmailAPI/gmailAPI')

const transactionDb = {
    updateTransactions: async function(userId, callback){
        const result = await gmailAPI.allTransactionDetails();
        if(result.response?.data.error){
            res.status(result.response.data.error.code).send(result.response.data.error.message);
        }else{
            console.log(result);
            
        }
    }
}

module.exports = transactionDb;