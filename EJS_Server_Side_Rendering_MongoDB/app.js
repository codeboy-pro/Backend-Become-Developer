const express=require('express');
const app=express();
const path=require('path');
const usermodel=require('./models/user');
const { read } = require('fs');

app.set("view engine","ejs")
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'public')));



app.get('/',function(req,res){
    res.render("index");
});

app.get('/read',async function(req,res){
    let users=await usermodel.find();
console.log(users);

    res.render("read",{users});
});
app.get('/edit/:userId',async function(req,res){
    let user=await usermodel.findOne({_id:req.params.userId});



    res.render("edit",{user});
});

app.get('/delete/:id',async function(req,res){
let users=await usermodel.findOneAndDelete({_id:req.params.id});

    res.redirect("/read");
});

app.post('/update/:userid',async function(req,res){

    let {name,email,image}=req.body;

    await usermodel.findOneAndUpdate({_id:req.params.userid},{name,email,image},{new:true});

    res.redirect("/read");app.post('/update/:userid',async function(req,res){

    let {name,email,image}=req.body;

    await usermodel.findOneAndUpdate({_id:req.params.userid},{name,email,image},{new:true});

    res.redirect("/read");
});

});

app.post('/create',async function(req,res){
    let {name,email,image}=req.body;
  let createduser=await usermodel.create({
    name,
    email,
    image

  });

  res.redirect("/read");
});

app.listen(4000);

