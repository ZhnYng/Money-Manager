const express = require('express');
const gmailAPI = require('../gmailAPI/gmailAPI');
const transactionDb = require('../model/transactionDB');
const userDb = require('../model/userDB');
const cors = require('cors');
const budgetDB = require('../model/budgetDB');
const gmailAuthorization = require('../gmailAPI/authorization')
const base64url = require('base64url');
const authorization = require('../gmailAPI/authorization');
const authenticateJWT = require('../middleware/authentication');
var path = require('path');
const recurringTransactionsDB = require('../model/recurringTransactionsDB');

const app = express();

app.use(
    cors({
        origin: ["http://localhost:3000", "https://moneymanagerclient.netlify.app"]
    })
)
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Listening");
})

app.get('/login', (req, res) => {
    res.sendFile(path.resolve('pages/login.html'));
})

// This was the API used to import the js file into 'login.html'
app.get('/gmailAPI/authorization.js', (req, res) => {
    res.sendFile(path.resolve('gmailAPI/authorization.js'));
})

app.post('/getAuthorization', async (req, res) => {
    const code = req.body;
    authorization.getToken(code, (err, result) => {
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).send(result);
        }
    })
})

app.get('/getAllThreads', async (req, res) => {
    console.log("HERE")
    await axios.get('https://gmail.googleapis.com/gmail/v1/users/me/threads', 
        {headers: {Authorization: `Bearer ${req.headers.Authorization}`}})
        .then(result => {
            res.status(200).send(result)
        })
        .catch(err => {
            res.status(500).send(err)
        })
})

app.post('/authCode', (req, res) => {
    const code = req.body.code;
    gmailAPI.getAuthToken(code, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send(err);
        }else{
            res.status(200).send(result);
        }
    })
})

app.get('/allTransactionDetails', async (req, res) => {
    const result = await gmailAPI.allTransactionDetails(req.headers.authorization.split(' ')[1]);
    console.log(result)
    if(result.response?.data.error){
        res.status(result.response.data.error.code).send(result.response.data.error.message);
    }else{
        res.status(200).send(result);
    }
})

app.get('/getDetails/:id/:email', async (req, res) => {
    const result = await gmailAPI.getDetails(req.params.id, req.params.email);
    
    // for(const message of result.data.messages){
    //     const decoded = decodeBase64Url(message.payload.parts[0].body.data)
    //     res.status(200).send(decoded);
    // }
    res.status(200).send(result);
})

app.put('/gmailUpdateTransactions/:userId/:email', (req, res) => {
    transactionDb.gmailUpdateTransactions(req.params.userId, req.params.email, (err, result) => {
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

app.delete('/deleteTransaction/:transaction_id', authenticateJWT, (req, res) => {
    transactionDb.deleteTransaction(req.params.transaction_id, req.user.email, (err, result) => {
        if(err === "Unauthorized"){
            res.status(401).send();
        }else if(err === "Forbidden"){
            res.status(403).send();
        }else if(err){
            console.log(err);
            res.status(500).send();
        }else{
            res.status(204).send(result)
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

app.get('/getCurrentBudget/:email', (req, res) => {
    budgetDB.getCurrentBudget(req.params.email, (err, result) => {
        if(err?.message === "No data returned from the query."){
            res.status(200).send("Email not in database")
        }else if(err){
            console.log(err);
            res.status(500).send();
        }else{
            res.status(200).send(result)
        }
    })
})

app.get('/getBudgetByMonth/:email', (req, res) => {
    budgetDB.getBudgetByMonth(req.params.email, (err, result) => {
        if(err?.message === "No data returned from the query."){
            res.status(200).send("No record found")
        }else if(err){
            console.log(err);
            res.status(500).send();
        }else{
            res.status(200).send(result);
        }
    }, req.query.month, req.query.year)
})

app.post('/addBudget', authenticateJWT, (req, res) => {
    req.body = {...req.body, email: req.user.email}
    budgetDB.addBudget(req.body, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send("Error");
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

app.get('/getExpenses/:userId', (req, res) => {
    transactionDb.getExpenses(req.params.userId, (err, result) => {
        if(err?.message === "No data returned from the query."){
            res.status(200).send("No expenses");
        }else if(err){
            console.log(err);
            res.status(500).send();
        }else{
            res.status(200).send(result);
        }
    }, req.query.month, req.query.year)
})

app.get('/getIncome/:userId', (req, res) => {
    transactionDb.getIncome(req.params.userId, (err, result) => {
        if(err?.message === "No data returned from the query."){
            res.status(200).send("No income");
        }else if(err){
            console.log(err);
            res.status(500).send();
        }else{
            res.status(200).send(result);
        }
    }, req.query.month, req.query.year)
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

app.get('/getRecurringTransaction/:email', (req, res) => {
    recurringTransactionsDB.getRecurringTransactions(req.params.email, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send(err);
        }else{
            res.status(200).send(result);
        }
    })
})

app.post('/addRecurringTransaction', authenticateJWT, (req, res) => {
    req.body = {email: req.user.email, ...req.body};
    if(!req.body.amount){
        res.status(400).send("Amount is empty");
    }else{
        recurringTransactionsDB.addRecurringTransaction(req.body, (err, result) => {
            if(err){
                console.log(err);
                res.status(500).send(err);
            }else{
                res.status(201).send(result);
            }
        })
    }
})

app.get('/getUserBudget/:email', (req, res) => {
    recurringTransactionsDB.getUserBudget(req.params.email, (err, result) => {
        if(err?.message === "No data returned from the query."){
            res.status(400).send("No existing records")
        }else if(err){
            console.log(err);
            res.status(500).send(err);
        }else{
            res.status(200).send(result);
        }
    })
})

app.post('/syncRecurringToTransaction/:email', (req, res) => {
    recurringTransactionsDB.syncRecurringToTransaction(req.params.email, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send();
        }else{
            res.status(201).send();
        }
    })
})

module.exports = app;
