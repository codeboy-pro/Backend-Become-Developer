
const expresss=require('express');
const app=expresss();
// app.use(cookieParser());

const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// bcrypt.genSalt(saltRounds, function(err, salt) {
//     bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
//         // Store hash in your password DB.
//     });
// });



// app.get("/",function(req,res){

// bcrypt.compare("pododododo", "$2b$10$7mlWq9X2RhJja6SCGH3f3OdgXo/c6kiamM10uxBrXJ2H./qCVKLPa", function(err, result) {
//     console.log(result);
    
// });

// });



// app.get("/read",function(req,res){
// // console.log(req.cookies);

// res.send("read page");
// });


app.get("/",function(req,res){
let token=jwt.sign({email:"ppp@gmail.com"},"secret")
console.log(token);
res.cookie("token",token);

res.send("done");

});


app.get('/read',function(req,res){
    // console.log(req.cookies.token);
    let data=jwt.verify(req.cookies.token,"secret");
    console.log(data);
    
})
app.listen(3000);
