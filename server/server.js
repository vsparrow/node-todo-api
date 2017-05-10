var express = require("express");
var bodyParser = require("body-parser");

var {mongoose} = require("./db/mongoose.js")
var {Todo} = require("./models/todo.js")
var {User} = require("./models/user.js")

var app  = express();
app.use(bodyParser.json());

//****************************************************************************** ROUTES
//CRUD create/POST read update delete

app.post("/todos",(req,res)=>{
    // console.log(req.body);
    var todo = new Todo({text : req.body.text});
    console.log("req.body.text::",req);
    // res.send(todo);
    todo.save().then(
        (doc)=>{res.send(doc)}
        ,(e)=>{res.status(400).send(e)
    });
})


app.listen(process.env.PORT, process.env.IP,()=>{
console.log("Started on",process.env.PORT," ", process.env.IP)
})