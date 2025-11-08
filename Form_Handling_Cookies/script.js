const express=require('express');


const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));



app.get("/",function(req,res){
    res.send("Champion hu ma haha lala");
    
})
app.get("/about",function(req,res){
    res.send("about  page ha ye");
    
})
app.get("/profile",function(req,res,next){
   
    return next(new Error("something went wrong"));

})
//error handler
app.use((err,req,res,next)=>{
    console.log(err.stack);
    res.status(500).send("Something broke!");

    
});

app.listen(3000);



