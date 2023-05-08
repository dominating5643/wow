const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    password: 'eaglevasasql',
    host: 'localhost',
    port: 5432,
    database: 'wow'
});

module.exports = pool;