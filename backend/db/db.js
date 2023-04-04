const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://money_manager_admin:money_manager@localhost:5432/money_manager') //Local
// const db = pgp('postgres://money_manager_admin:c3PaaP9l8cnnGH8mdxP5gbf55YAeaVtX@dpg-cgf9miseoogqfc44q2d0-a/money_manager_x0zs') //locally On Render
// const db = pgp('postgres://money_manager_admin:c3PaaP9l8cnnGH8mdxP5gbf55YAeaVtX@dpg-cgf9miseoogqfc44q2d0-a.singapore-postgres.render.com/money_manager_x0zs?ssl=true') //externally from Render
// Append the following to the above to prevent the error "SSL/TLS required" ?ssl=true

module.exports = db;

// To edit postgresql DB
// Server [localhost]: dpg-cgf9miseoogqfc44q2d0-a.singapore-postgres.render.com
// Database [postgres]: money_manager_x0zs
// Port [5432]: 
// Username [postgres]: money_manager_admin
// Password for user money_manager_admin: c3PaaP9l8cnnGH8mdxP5gbf55YAeaVtX

// postgres://USER:PASSWORD@EXTERNAL_HOST:PORT/DATABASE