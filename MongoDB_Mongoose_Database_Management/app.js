 const express=require('express');
 const app=express();

const usermodel=require('./usermodel');

 app.get('/',(req,res)=>{
  res.send("hey");
 });

 app.get('/create',async (req,res)=>{
 let createduser=await usermodel.create({
    name:"Rahul DAS",
    username:"RRR",
    email:"RRR23we@gmail.com"
 });
    
res.send(createduser);
 });
app.get('/read',async (_req,res)=>{
    let users=await usermodel.find();
    res.send(users);

 });

app.get('/update',async (_req,res)=>{
let updateduser=await usermodel.findOneAndUpdate({username:"RRR"},{name:" ratul"},{new:true});

    
res.send(updateduser);
 });


//  app.get('/read',async (_req,res)=>{
//     let users=await usermodel.findOne({username:"RRR"});
//     res.send(users);

//  });



 app.get('/delete',async (_req,res)=>{
    let users=await usermodel.findOneAndDelete({name:"Pradip"});
   
res.send(users);
 });


 app.listen(3000);