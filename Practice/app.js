const express=require('express');

const cookieParser=require('cookie-parser');
const usermodel=require("./models/user");

const app=express();
const path=require('path');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');


app.set("view engine","ejs");

app.use(express.json());
app.use(express.urlencoded());

app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());


app.get('/',(req,res)=>{
    res.render("index");

});
app.post('/create', function (req, res) {
  let { username, email, password, age } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let createduser = await usermodel.create({
        username,
        email,
        password: hash,
        age
      });

      console.log(createduser);
      let token = jwt.sign({ email }, "jsjsjsjsjjsjsjs");
      res.cookie("token", token);
    res.redirect('/login');



    //   res.redirect('/login');
      
    });
  });
});


app.get('/login',(req,res)=>{
    res.render('login');

});


app.post('/login',async function(req,res){
    let user=await usermodel.findOne({email:req.body.email});
    if(!user){
        return res.send("User not found!");
    }

    bcrypt.compare(req.body.password,user.password,function(err,result){
        if(result){
            let token=jwt.sign({email:user.email},"jsjsjsjsjjsjsjs");
            res.cookie("token",token);
         res.send("Login successful");
        }else{
            res.send("something went wrong");
        }
    });
});

app.get('/logout', function (req, res) {
  res.cookie("token", "");
  res.redirect('/');
});

app.listen(3000);
