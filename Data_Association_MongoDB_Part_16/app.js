const express=require('express');
const app=express();
const usermodel=require("./models/user");
const postmodel=require('./models/post');

app.get("/",function(req,res){
    res.send("hey");

});


app.get("/create",async function (req,res) {
    let user=await usermodel.create({
        username:"podo",
        age:25,
        email:"ppp@ppp.com"
    });
res.send(user);


});

app.get("/post/create",async function (req,res) {
 let post= await postmodel.create({
    postdata:"hello sare log kaise ho?",
    user:"68f303ad680fd18b9e29bff9",

 })
let user=await usermodel.findOne({_id:"68f303ad680fd18b9e29bff9"});
user.posts.push(post._id);
await user.save();
res.send({post,user});


});


app.listen(3000);




