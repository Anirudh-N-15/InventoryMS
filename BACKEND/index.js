
import express from "express"
import cors from "cors"
import mysql from "mysql2"
// const express = require('express');
// const cors = require('cors');
import path from "path";
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
                SELECT U.User_name, U.Mail, U.Phone_No, U.Password, C.Client_ID
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
            // res.status(200).send('Login successful');  // User found
            if (role === "client") {
                // Redirect with Client ID as a query parameter
                res.redirect(`/html/clientLanding.html?clientID=${results[0].Client_ID}`);
                console.log(results);

            }
            
            else{
                 res.status(200).redirect('/html/managerdash.html');
                 
            }
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

app.get('/client/product',(req,res)=>{
    console.log("request recieved...");
    const query = `
            SELECT * FROM Item;    
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

app.get('/client/product/orders/:id',(req,res)=>{

    const clientId = req.params.id;
    const query = `
        SELECT o.Order_ID, i.Name, o.Quantity, o.Amount_Payed, o.Date
        FROM \`Order\` o
        JOIN  Item i ON o.Item_ID = i.Item_ID
        JOIN Client c ON o.Client_ID = c.Client_ID
        WHERE c.Client_ID = ?; `

        db.query(query, [clientId], (err, result) => {
            console.log(result);
            if (err) {
                console.error('Error fetching orders details:', err);
                res.status(500).json({ error: 'Failed to fetch order details' });
            } else if (result.length === 0) {
                res.status(404).json({ message: 'Order not found' });
            } 
            console.log(result);
            res.status(200).json({
                success: true,
                message: 'Orders fetched successfully',
                data: result
            });
        });

});

app.get('/client/product/buynow/:productid',(req,res)=>{
    const product_id = req.params.productid;
    const query = `
        SELECT * FROM Item WHERE Item.Item_ID = ?;
    `;
    db.query(query,[product_id],(err, result)=>{
        console.log(result);
        if (err) {
            console.error('Error fetching product details:', err);
            res.status(500).json({ error: 'Failed to fetch order details' });
        } else if(result.length === 0){
            res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({
            success: true,
            message: 'product fetched successfully',
            data: result
        });
        
    })

});

const runQuery = (query, params) => {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};



// app.post('/client/product/buynow', async (req, res) => {
//     const order = req.body;
//     console.log("Received order:", order);

//     if (!order || !order.productId) {
//         return res.status(400).send('Invalid request: Missing productId');
//     }


//     let stock_id;
//     try {

//         const query1 = `
//         SELECT Stock_ID
//         FROM Stock
//         WHERE Item_ID = ?
//         ORDER BY EXP_Date ASC
//         LIMIT 1;
//         `;

//         const result1 = await runQuery(query1, [order.productId]);

//         if (result1.length === 0) {
//             console.log('No stock found for this product');
//             return res.status(404).send('Stock not found');
//         }

//         stock_id = result1[0].Stock_ID;
//         console.log('Stock ID:', stock_id);

//         // Use stock_id here
//         // res.status(200).json({ stockId: stock_id });
//         console.log(stock_id);
//         if (currentStock < quantity) {
//             await connection.rollback();
//             return res.status(400).send('Insufficient stock');
//         }

//         const updateQuery = `
//             UPDATE Stock
//             SET Stock_Quantity = Stock_Quantity - ?
//             WHERE Stock_ID = ?;
//         `;

//         const result2 = await db.promise().query(updateQuery, [order.quantity, stock_id]);

//         if (result2.affectedRows > 0) {
//             console.log('Stock updated successfully');
//             // res.status(200).send('Order placed and stock updated');
//         } else {
//             console.log("Failed to update stock");
//             // res.status(500).send('Failed to update stock');
//         }

//         const updateItemQuery = `
//             UPDATE Item
//             SET Quantity = Quantity - ?
//             WHERE Item_ID = ?;
//         `;

//         const result3 = await db.promise().query(updateItemQuery, [order.quantity,order.productId]);

//         if (result3.affectedRows > 0) {
//             console.log('Item_table updated successfully');
//             // res.status(200).send('Order placed and stock updated');
//         } else {
//             console.log("Failed to update Item_Table");
//             // res.status(500).send('Failed to update stock');
//         }


//     } catch (error) {
//         console.error('Error fetching product details:', error);
//         res.status(500).send('Database error');
//     }


//     const query2 = `
//     INSERT INTO \`Order\` (Client_ID, Stock_ID, Item_ID, Amount_Payed, Quantity, Date, Payment_Method)
//     VALUES (?, ?, ?, ?, ?, ?, ?)
//     `;



//     const formattedDate = new Date(order.orderDate).toISOString().split('T')[0];

//     const values = [order.clientId, stock_id, order.productId, order.totalAmount, order.quantity, formattedDate, order.method];
//     console.log(values);
//     db.query(query2, values, (err, result) => {
//         if (err) {
//             console.error('Error inserting order:', err);
//             return res.status(500).send('Database error');
//         }
//         console.log('Order inserted successfully:', result);
//         res.status(201).send('Order inserted successfully');
//     });


// });


app.post('/client/product/buynow', async (req, res) => {
    const order = req.body;
    console.log("Received order:", order);

    if (!order || !order.productId) {
        return res.status(400).send('Invalid request: Missing productId');
    }

    try {
        // Fetch stock ID and quantity
        const query1 = `
            SELECT Stock_ID, Stock_Quantity
            FROM Stock
            WHERE Item_ID = ?
            ORDER BY EXP_Date ASC
            LIMIT 1;
        `;

        const result1 = await runQuery(query1, [order.productId]);

        if (result1.length === 0) {
            console.log('No stock found for this product');
            return res.status(404).send('Stock not found');
        }

        const stock_id = result1[0].Stock_ID;
        const currentStock = result1[0].Stock_Quantity;

        console.log('Stock ID:', stock_id, 'Current Stock:', currentStock);

        if (currentStock < order.quantity) {
            console.log('Insufficient stock');
            return res.status(400).send('Insufficient stock');
        }

        // Update stock quantity
        const updateQuery = `
            UPDATE Stock
            SET Stock_Quantity = Stock_Quantity - ?
            WHERE Stock_ID = ?;
        `;

        const result2 = await db.promise().query(updateQuery, [order.quantity, stock_id]);

        if (result2[0].affectedRows > 0) {
            console.log('Stock updated successfully');
        } else {
            console.log("Failed to update stock");
            return res.status(500).send('Failed to update stock');
        }

        // Update item quantity
        const updateItemQuery = `
            UPDATE Item
            SET Quantity = Quantity - ?
            WHERE Item_ID = ?;
        `;

        const result3 = await db.promise().query(updateItemQuery, [order.quantity, order.productId]);

        if (result3[0].affectedRows > 0) {
            console.log('Item_table updated successfully');
        } else {
            console.log("Failed to update Item_Table");
            return res.status(500).send('Failed to update item table');
        }

        // Insert order
        const query2 = `
            INSERT INTO \`Order\` (Client_ID, Stock_ID, Item_ID, Amount_Payed, Quantity, Date, Payment_Method)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const formattedDate = new Date(order.orderDate).toISOString().split('T')[0];

        const values = [
            order.clientId, 
            stock_id, 
            order.productId, 
            order.totalAmount, 
            order.quantity, 
            formattedDate, 
            order.method
        ];

        const result = await db.promise().query(query2, values);
        console.log('Order inserted successfully:', result);

        const newOrderId = result[0].insertId;
        res.status(201).send(`Order inserted successfully with ID: ${newOrderId}`);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Database error');
    }
});




app.listen(8080, () => {
    console.log('Server started on port 8000');
});

