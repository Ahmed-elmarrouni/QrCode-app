const { Client } = require('pg');

const client = new Client({
    user: 'postgres',         
    host: 'localhost',        
    database: 'pitch_booking', 
    password: '123456789',    
    port: 5432,               
});

client.connect();

module.exports = client;
