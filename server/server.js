const _=require("lodash")
const express = require("express");
const bodyParser = require("body-parser");
const {ObjectID} = require("mongodb")

var {mongoose} = require("./db/mongoose.js")
var {Todo} = require("./models/todo.js")
// var {User} = require("./models/user.js")


var app  = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
 
//****************************************************************************** ROUTES
//CRUD create/POST read update delete

app.post("/todos",(req,res)=>{
    // console.log(req.body);
    var todo = new Todo({text : req.body.text});
    // console.log("req.body.text::",req);
    // res.send(todo);
    todo.save().then(
        (doc)=>{res.send(doc)}
        ,(e)=>{res.status(400).send(e)});
})

app.get("/todos",(req,res)=>{
    Todo.find().then((todos)=>{
        res.send({todos})  //<-es6 es5-> {todos : todos}
    },(e)=>{
        res.status(400).send(e);
    })
})

app.get("/todos/:id",(req,res)=>{
    // res.send(req.params);
    var id = req.params.id;
    if(!ObjectID.isValid(id)){return res.status(404).send() }

    // res.send("SUCCESS")
    //validate id using objectID isValid // if not valid  return respond 404 send back empty body
        //send without any value    res.status(404).send(e);
    //findbyid
    Todo.findById(id).then(
        // res.send("Got here")
        (todo) =>{
            //error
            if(!todo){return res.status(404).send()}
            //success  
            res.send({todo}) //by placing todo in object future proof in case we want to add other things
            
        }
    ).catch((e)=>{res.send(400).send()})
    //success case 
        // if todo send back
        // if not todo found: id ok but not found in collection: send back 404 with empty body
    //error case : send 400, req not valid / send empty body
});

app.delete("/todos/:id", (req,res)=>{
    var id = req.params.id; //get id//ID coming back//tested //res.status(200).send({id: `ID: ${id}`});
    if(!ObjectID.isValid(id)){return res.status(404).send()} ////validate id   //if not valid return 404
    Todo.findByIdAndRemove(id).then((todo)=>{
        if(!todo){return res.status(404).send()}
        res.status(200).send({todo})
    }).catch((e)=>{res.status(400).send();})  
});

// ------------------------------------------------------------------PATCH Route
//update todo items
app.patch('/todos/:id',(req,res)=>{
    var id = req.params.id;
    var body = _.pick(req.body, ['text','completed'])//pull of the items we want, takes array of items to pull of if they exist
    if(!ObjectID.isValid(id)){return res.status(404).send()} 
    
    if(_.isBoolean(body.completed) && body.completed){ //if it is a bool, and is true then run code
        body.completedAt = new Date().getTime() //getTime return JS timestamp        
    }else { //not bool or not true
        body.completedAt = null;
        body.completed = false;
    }
    
    //update DB 
    //findByIdAndUpdate //object body was setup above see PICK
    Todo.findByIdAndUpdate(id, {$set : body}, {new : true}) //newtrue show updated obj not old
    .then((todo)=>{
        if(!todo){ return res.status(404).send()}
        res.send({todo});
    })
    .catch((e)=>{res.status(400).send()})
    
    
    
})




// app.listen(process.env.PORT, process.env.IP,()=>{
app.listen(port, process.env.IP,()=>{
console.log("Started on",process.env.PORT," ", process.env.IP)
})

module.exports = {app};