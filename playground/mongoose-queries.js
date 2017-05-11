const {ObjectID} = require("mongodb")
const {mongoose} = require("./../server/db/mongoose.js");
const {Todo} = require("./../server/models/todo.js")
const {User} = require("./../server/models/user.js")
// var id = "591381746d128deb184401ad"; //if to use for querying
// if(!ObjectID.isValid(id)){console.log("Id not valid")}
// // Todo.find({
//     _id: id //mongoose takes string convert it to onject id, thenrun query
// }).then((todos)=>{console.log("Todos:",todos)})

// Todo.findOne({
//     _id: id //mongoose takes string convert it to onject id, thenrun query
// }).then((todo)=>{console.log("Todo:",todo)})

// Todo.findById(id).then((todo)=>{if(!todo){return console.log("findById: ID not found")}
//     console.log("Todo by ID:",todo)}).catch((e)=>{console.log(e)})

//query users collection / grab id /load user mongoose model
//use user FindById // then handle 3 cases
// query works but no user
//user found and print to screen
//handle error that occur, print error to screen
//59134a9aadf78db209cef2e1

var userId = "59134a9aadf78db209cef2e1";
User.findById( {_id: userId}).then((user)=>{
    if(!user){return console.log("No user found")}
    // console.log("User:",user)
    console.log(JSON.stringify(user,undefined,2))
}).catch((e)=>{console.log(e)})