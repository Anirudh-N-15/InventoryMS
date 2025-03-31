import express from "express"
import mysql from "mysql2"
import pkg from "statuses"
const {message} = pkg;

import db from "../database.js";


const prodRouter  = express.Router();



prodRouter.post("/add",(req,res)=>
{
   const {item_id,name,quantity,price,description}=req.body;
   
   const values = [item_id,name,quantity,price,description]
   let query = `INSERT INTO Item (Item_ID,Name,Quantity,Price,Description) values (?,?,?,?,?)` 

  db.query(query,values,(err,Results)=>
{
      if(err)
      {
        console.log("Error inserting new Item into DB");
        return res.status(500).send("Database Error while trying to Insert");

      }

      if(Results.affectedRows>0)
      {
           res.status(200).redirect("/html/products.html")
      }
     
})


});


prodRouter.post("/update/:id",(req,res)=>
  {   
     const {id} = req.params;
     const {name,quantity,price,description}=req.body;
     
     const values = [name,quantity,price,description]


     let query = `UPDATE Item SET Name = ?, Quantity = ?, Price = ?, Description = ? WHERE Item_ID =${id}` 
  
    db.query(query,values,(err,Results)=>
  {
        if(err)
        {
          console.log("Error Updating Item into DB");
          return res.status(500).send("Database Error while trying to Update");
  
        }
  
        if(Results.affectedRows>0)
        {
             res.status(200).redirect("/html/products.html")
        }
       
  })
  
  
  });
  











prodRouter.delete("/delete/:id",(req,res)=>
  {
      const {id} = req.params;
      console.log(id);
      let query = `DELETE FROM Item WHERE Item_ID   = ?`;
  
      db.query(query,[id],(err,Results)=>
      {
          if(err)
          { 
            console.log("Error Deleting from Database");
            return res.status(500).send("Database Error while trying to Delete");
    
          }
    
          return res.status(200).json({ message: "Product Deleted Successfully" });
        
      })
  
});


export default prodRouter;