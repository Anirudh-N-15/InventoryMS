
import express from "express"
import cors from "cors"
import mysql from "mysql2"
// const express = require('express');
// const cors = require('cors');
// const path = require('path');
import bodyParser from "body-parser"
// const mysql = require('mysql2');

const app = express();
app.use(cors());

// app.use(express.static(path.join(__dirname, "/public/html")));
// app.use(express.static(path.join(__dirname, "/public/css")));

app.use(express.static('public'));


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

const db = mysql.createPool({
    host: 'localhost',    
    user: 'root',         
    password: 'Lukman$786',     
    database: 'LoginDB'  
});

app.post('/login', (req, res) => {
    console.log("Received data:", req.body);

    const { username, role, password } = req.body;

    if (!username || !role || !password) {
        return res.status(400).send('Missing username or password');
    }

    let query = "";
    if(role === "manager"){
        query=`
                SELECT U.User_name, U.Mail, U.Phone_No, U.Password 
                FROM User U
                LEFT JOIN Manager M ON U.User_name = M.User_Name 
                WHERE (U.User_Name = ? OR U.Mail = ?) AND U.Password = ?
            `;
    }else if( role === "client" ){
        query=`
                SELECT U.User_name, U.Mail, U.Phone_No, U.Password 
                FROM User U
                LEFT JOIN Client C ON U.User_Name = C.User_Name 
                WHERE (U.User_Name = ? OR U.Mail = ?) AND U.Password = ?
            `;
    }else {
        return res.status(400).send('Invalid role');
    }

    db.query(query, [username, username, password], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).send('Database error');
        }

        if (results.length > 0) {
            res.status(200).send('Login successful');  // User found
        } else {
            res.render('login', { 
                error: 'Invalid username or password' 
            });
        }
    }); 
});

app.post('/sign-up', (req, res) => {
    console.log("Received data:", req.body);

    const { firstname, lastname, username, email, phone, role, password } = req.body;

    const query1 = `
        INSERT INTO User (User_Name, Fname, Lname, Mail, Phone_No, Password)
        VALUES (?, ?, ?, ?, ?, ?);
    `;

    db.query(query1, [username, firstname, lastname, email, phone, password], (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                console.error(`Duplicate entry for username: ${username}`);
                // Redirect to the login page with a message
                return res.status(409).render('login', { message: 'User already exists! Please log in.' });
            }
            console.error('Error querying database:', err);
            return res.status(500).send('Database error');
        }

        if (results.affectedRows > 0) {
            console.log("User inserted successfully");
            let query2 = "";
            let values = [];

            if (role === "manager") {
                query2 = `
                    INSERT INTO Manager (User_Name, DOJ)
                    VALUES (?, NULL);
                `;
                values = [username];
            } else if (role === "client") {
                query2 = `
                    INSERT INTO Client (User_Name)
                    VALUES (?);
                `;
                values = [username];
            } else {
                return res.status(400).send('Invalid role');
            }

            db.query(query2, values, (err, roleResults) => {
                if (err) {
                    console.error(`Error inserting into ${role}:`, err);
                    return res.status(500).send(`Database error while inserting into ${role}`);
                }

                if (roleResults.affectedRows > 0) {
                    res.status(200).send(`Sign-Up successful as ${role}`);
                } else {
                    res.status(500).send(`Failed to insert into ${role}`);
                }
            });

        } else {
            res.status(500).send('Failed to insert user');
        }
    });
});

app.get('/orders',(req,res)=>{
    const query = `
        SELECT 
            o.Order_ID, 
            c.Client_ID, 
            c.User_Name AS Client_Name, 
            i.Item_ID, 
            i.Name AS Item_Name, 
            s.Stock_ID, 
            o.Amount_Payed, 
            o.Quantity, 
            o.Date, 
            o.Payment_Method
        FROM \`Order\` o
        JOIN Client c ON o.Client_ID = c.Client_ID
        JOIN Stock s ON o.Stock_ID = s.Stock_ID
        JOIN Item i ON o.Item_ID = i.Item_ID;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).json({ error: 'Failed to fetch orders' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        console.log(results);

        res.status(200).json({
            success: true,
            message: 'Orders fetched successfully',
            data: results
        });
    });
});

app.get('/orders/:id', (req, res) => {
    const orderId = req.params.id;
    console.log("/orders/:id working...");

    const query = `
        SELECT 
            o.Order_ID,
            c.User_Name AS Client_Name,
            o.Date,
            o.Payment_Method,
            o.Quantity,
            o.Amount_Payed,
            i.Name AS Item_Name,
            i.Description AS Item_Description,
            i.Price,
            u.Phone_No
        FROM \`Order\` o
        JOIN Client c ON o.Client_ID = c.Client_ID
        JOIN Stock s ON o.Stock_ID = s.Stock_ID
        JOIN Item i ON o.Item_ID = i.Item_ID
        JOIN User u ON c.User_Name = u.User_Name
        WHERE o.Order_ID = ?`;

    db.query(query, [orderId], (err, result) => {
        console.log(result);
        if (err) {
            console.error('Error fetching order details:', err);
            res.status(500).json({ error: 'Failed to fetch order details' });
        } else if (result.length === 0) {
            res.status(404).json({ message: 'Order not found' });
        } else {
            res.json(result[0]);
        }
    });
});

app.listen(8080, () => {
    console.log('Server started on port 8080');
});

