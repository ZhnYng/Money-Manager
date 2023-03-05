const express = require('express');
const gmailAPI = require('../gmailAPI/gmailAPI');
const transactionDb = require('../model/transactionDB');
const userDb = require('../model/userDB');
const cors = require('cors');
const budgetDB = require('../model/budgetDB');
const base64url = require('base64url');
const authenticateJWT = require('../middleware/authentication');

const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
    })
)
app.use(express.json())

app.get('/allTransactionDetails', async (req, res) => {
    const result = await gmailAPI.allTransactionDetails();
    if(result.response?.data.error){
        res.status(result.response.data.error.code).send(result.response.data.error.message);
    }else{
        res.status(200).send(result);
    }
})

// app.get('/getDetails/:id', async (req, res) => {
//     const result = await gmailAPI.getDetails(req.params.id);
//     function decodeBase64Url(str) {
//         let buffer = Buffer.from(base64url.toBase64(str), 'base64');
//         buffer = buffer.toString('utf-8');
//         return buffer
//     }
//     for(const message of result.data.messages){
//         const decoded = decodeBase64Url(message.payload.body.data)
//         res.status(200).send(decoded);
//     }
// })

app.put('/updateTransactions/:userId', (req, res) => {
    transactionDb.updateTransactions(req.params.userId, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send();
        }else{
            res.status(200).send(result);
        }
    })
})

app.post('/addTransaction', authenticateJWT, (req, res) => {
    userDb.getIdByUser(req.user.email, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send();
        }else{
            transactionDb.addTransaction(result.user_id, req.body, (err, result) => {
                if(err){
                    console.log(err);
                    res.status(500).send();
                }else{
                    res.status(201).send(result);
                }
            })
        }
    })
})

app.get('/getTransactions/:userId', (req, res) => {
    transactionDb.getTransactions(req.params.userId, req.query.period, (err, result) => {
        if(err?.message === "No data returned from the query."){
            res.status(400).send();
        }else if(err){
            console.log(err);
            res.status(500).send();
        }else{
            console.log(result)
            res.status(200).send(result);
        }
    })
})

app.get('/getIdByUser/:email', (req, res) => {
    userDb.getIdByUser(req.params.email, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send();
        }else{
            res.status(200).send(result);
        }
    })
})

app.post('/addUser', (req, res) => {
    userDb.addUser(req.body, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send();
        }else{
            res.status(200).send(result)
        }
    })
})

app.get('/getUserBudget/:email', (req, res) => {
    budgetDB.getUserBudget(req.params.email, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send();
        }else{
            res.status(200).send(result)
        }
    })
})

app.post('/addBudget', authenticateJWT, (req, res) => {
    req.body = {...req.body, email: req.user.email}
    budgetDB.addBudget(req.body, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send();
        }else{
            res.status(201).send(result)
        }
    })
})

app.get('/getTransactionById/:transactionId', authenticateJWT, (req, res) => {
    transactionDb.getTransactionById(req.params.transactionId, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send();
        }else{
            res.status(200).send(result);
        }
    })
})

app.put('/updateCategory/:transactionId/:category', authenticateJWT, (req, res) => {
    transactionDb.updateCategory(req.params.transactionId, req.user.email, req.params.category, (err, result) => {
        if(err === "Unauthorized"){
            res.status(401).send(err);
        }else if(err){
            console.log(err);
            res.status(500).send();
        }else{
            res.status(200).send(result);
        }
    })
})

module.exports = app;
