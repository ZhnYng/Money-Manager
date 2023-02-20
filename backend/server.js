const app = require('./control/app');

app.listen(5000, (err) => {
    if(err) console.log(err);
    else console.log("Listening on 5000")
})