const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://money_manager_admin:money_manager@localhost:5432/money_manager')

module.exports = db;