const pgp = require('pg-promise')(/* options */)
const dotenv = require('dotenv');
dotenv.config(); 
var lk = process.env.LOCAL_KEY
var er = process.env.EXTERNAL_RENDER;
var lr = process.env.LOCAL_RENDER

const db = pgp(lr)

module.exports = db;

