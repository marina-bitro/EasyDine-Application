//Βιβλιοθηκη mysql2, βοηθαει στην MVC αρχιτεκτονικη (model- view - controller)
const mysql = require('mysql2/promise');

//pool κάνει ευκολότερη την πρόσβαση όταν πολύ χρήστες κάνουν είσοδο στην εφαρμογή, για να μην κολλήσει.
const pool = mysql.createPool({
    
host: 'localhost',
user: 'root',
password: '',
database: 'restaurant' ,
timezone: 'Z'

});

module.exports = pool; 