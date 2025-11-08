const express=require('express');
const app=express();
const path=require('path');
const fs=require('fs');

// Set view engine and views directory
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,"public")));
app.get('/', function(_req, res) {
    fs.readdir(`./files`, function(err, files) {
        if (err) {
            console.error(err);
            return res.status(500).send('Unable to read files');
        }
        res.render("index", { files: files });
    });
});
app.get('/file/:filename', function(req, res) {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, filedata) {
    
        res.render('show',{filename:req.params.filename, filedata:filedata});
    });
});
app.get('/edit/:filename', function(req, res) {
    
      res.render("edit",{filename:req.params.filename});
});
app.post('/edit', function(req, res) {
    
     fs.rename(`./files/${req.body.previous}`,`./files/${req.body.new}`,function(err){
        res.redirect("/");
     })
      
});


app.post('/create', function(req, res) {
    console.log(req.body);
    const filename = `${req.body.title.split(' ').join('')}.txt`;
    fs.writeFile(`./files/${filename}`, req.body.details, function(err) {
        if (err) {
            console.error(err);
            return res.status(500).send('Unable to create file');
        }
        res.redirect("/");
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
