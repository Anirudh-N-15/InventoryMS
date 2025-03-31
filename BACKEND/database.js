import mysql from "mysql2";

const db = mysql.createPool({
    host: 'localhost',    
    user: 'root',         
    password: 'vajrakosham',     
    database: 'ICMS'  
});

export default db;
