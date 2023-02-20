const express = require('express')
const gmailAPI = require('../gmailAPI/gmailAPI')

const app = express();

app.get('/allTransactionDetails', async (req, res) => {
    const result = await gmailAPI.allTransactionDetails();
    if(result.response?.data.error){
        res.status(result.response.data.error.code).send(result.response.data.error.message);
    }else{
        res.status(200).send(result);
    }
})

module.exports = app;
