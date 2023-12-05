require('dotenv').config();
// const pg = require('pg');
// const config = {
//     user: process.env.PG_USERNAME,
//     host: process.env.PG_HOST,
//     database: process.env.PG_DB,
//     password: process.env.PG_PASSWORD,
//     port: process.env.PG_PORT,
// }





// const poolConnection = new pg.Pool(config);
// module.exports = { pool: poolConnection };


const { Pool } = require('pg');
const pool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

module.exports = { pool };