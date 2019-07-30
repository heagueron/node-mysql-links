const mysql = require('mysql');

// mysql does not support promises yet, only call backs. Let's promisify it
const { promisify } = require('util');

const { database } = require('./keys');

// Pool of connections
const pool = mysql.createPool( database );

// Get one connection
pool.getConnection((err, connection) => {
    if(err) {
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('DB Connection was closed');
        }
        if(err.code === 'ER_CON_COUNT_ERROR') {
            console.error('DB has too many connections');
        }
        if(err.code === 'ECONNREFUSED') {
            console.error('DB has refused the connection');
        }
    }
    if(connection) {
        connection.release();
        console.log('DB is Connected');
    }
    return;
});

// Promisify pool queries
pool.query = promisify(pool.query);

module.exports = pool;