import mysql from "mysql2";

const db = mysql.createPool({
    host: 'localhost',    
    user: 'root',         
    password: 'yourpassword',     
    database: 'ICMS'  
});

export default db;
