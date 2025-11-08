const express=require('express');

// const app = express()

// app.get('/', (req, res) => {
//   res.send('Hello World')
// })

// app.listen(3000)


const app=express();

// app.get(route,requestHandler);//requestHandler   is middleware




// app.get("/",function(req,res){
//     res.send("Champion hu ma haha lala");
// })
// app.get("/profile",function(req,res){
//     res.send("chapion ha mera coach haha");

// })


// app.listen(3000);





// const app=express();
// app.get('/user/:id', function(req, res) {
//     const userId = req.params.id;
//     res.send(`User ID is: ${userId}`);
// });

app.use(function(req,res,next){
    console.log("middleware chala");
    next();
});
app.use(function(req,res,next){
    console.log("middleware chala again");
    next();
});

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



