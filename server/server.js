const config = require("./config/config.js");

const _=require("lodash")
const express = require("express");
const bodyParser = require("body-parser");
const {ObjectID} = require("mongodb")
const bcrypt = require("bcryptjs")
var {mongoose} = require("./db/mongoose.js")
var {Todo} = require("./models/todo.js")
var {User} = require("./models/user.js")
var {authenticate} = require("./middleware/authenticate.js")

var app  = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
 
//****************************************************************************** ROUTES todos
//CRUD create/POST read update delete

app.post("/todos",authenticate,(req,res)=>{
    // console.log(req.body);
    var todo = new Todo({text : req.body.text, _creator : req.user._id});   //!! set _creator here
    // console.log("req.body.text::",req);
    // res.send(todo);
    todo.save().then(
        (doc)=>{res.send(doc)}
        ,(e)=>{res.status(400).send(e)});
})

// app.get("/todos",(req,res)=>{
app.get("/todos",authenticate,(req,res)=>{
    Todo.find({_creator : req.user._id}).then((todos)=>{
        res.send({todos})  //<-es6 es5-> {todos : todos}
    },(e)=>{
        res.status(400).send(e);
    })
})

app.get("/todos/:id",authenticate,(req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){return res.status(404).send() }
    Todo.findOne({_id : id, _creator: req.user._id}).then(//Todo.findById(id).then(
        (todo) =>{
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

app.delete("/todos/:id",authenticate, (req,res)=>{
    var id = req.params.id; //get id//ID coming back//tested //res.status(200).send({id: `ID: ${id}`});
    if(!ObjectID.isValid(id)){return res.status(404).send()} ////validate id   //if not valid return 404
    // Todo.findByIdAndRemove(id).then((todo)=>{
    Todo.findOneAndRemove({
        _id: id, _creator : req.user._id
    }).then((todo)=>{
        if(!todo){return res.status(404).send()}
        res.status(200).send({todo})
    }).catch((e)=>{res.status(400).send();})  
});

// -------------------------------------------------------------TODO PATCH Route
//update todo items
app.patch('/todos/:id',authenticate,(req,res)=>{
    var id = req.params.id;
    var body = _.pick(req.body, ['text','completed'])//pull of the items we want, takes array of items to pull of if they exist
    if(!ObjectID.isValid(id)){return res.status(404).send()} 
    
    if(_.isBoolean(body.completed) && body.completed){ //if it is a bool, and is true then run code
        body.completedAt = new Date().getTime() //getTime return JS timestamp        
    }else { //not bool or not true
        body.completedAt = null;
        body.completed = false;
    }
    // Todo.findByIdAndUpdate(id, {$set : body}, {new : true}) //newtrue show updated obj not old
    Todo.findOneAndUpdate({_id: id, _creator : req.user._id }, {$set : body}, {new : true}) //newtrue show updated obj not old
    .then((todo)=>{
        if(!todo){ return res.status(404).send()}
        res.send({todo});
    })
    .catch((e)=>{res.status(400).send()})
    
    
    
})


//****************************************************************************** ROUTES Users
// -------------------------------------------------------------USERS POST Route

app.post("/users",(req,res)=>{
    var body = _.pick(req.body,["email","password"])
    var user = new User(body);
    user.save().
    // then( (user)=>{ //this user variable identical to var user above!!!!!!!!! so we remove
       then( ()=>{
        // res.send(user)
        return user.generateAuthToken();
        
    })
    .then((token)=>{ res.header('x-auth',token).send(user)})
        // ,(error)=>{res.status(400).send(error)})
    .catch((e)=>{res.status(400).send(e)})
})


// ----------------------------------------------------------USERS me? GET Route



app.get("/users/me", authenticate,(req, res) => {
    res.send(req.user);
});

// ------------------------------------Dedicated for logging in users POST Route
app.post("/users/login",(req,res)=>{
    var body = _.pick(req.body, ["email","password"])
    // User.findOne({"email": body.email}).then((result)=>{
    //     if(result===null){res.status(400).send()}
    //     bcrypt.compare(body.password,result.password,(err,result)=>{
    //         if(err){console.log(err)}
    //         if(result===false){return res.status(400).send()}
    //         // if(result===true){return res.send("match")}
    //         if(result===true){return res.send(body)}
    //     })
    // })
    User.findByCredentials(body.email,body.password).then((user)=>{
        // res.send(user)
        user.generateAuthToken().then((token)=>{
            res.header("x-auth", token).send(user);
        })
    }).catch((e)=>{res.status(400).send()})
})


//delete route
//delte toekn inside authentication middleware
app.delete("/users/me/token",authenticate,(req,res)=>{
    //we can call requser since user authenitcated
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send()
    },()=>{res.status(400).send()});
    
})




// app.listen(process.env.PORT, process.env.IP,()=>{
app.listen(port, process.env.IP,()=>{
console.log("Started on",process.env.PORT," ", process.env.IP)
})

module.exports = {app};