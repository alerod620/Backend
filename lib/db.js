const mysql = require('mysql');

const connection = mysql.createConnection ({
    host: "localhost",
    user: "root",
    database: "eps",
    password: "1234"
})

connection.connect();
module.exports = connection;