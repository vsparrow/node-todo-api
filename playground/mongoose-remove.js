const {ObjectID} = require("mongodb")
const {mongoose} = require("./../server/db/mongoose.js");
const {Todo} = require("./../server/models/todo.js")
const {User} = require("./../server/models/user.js") 

// REMOVE ALL DOCS
// Todo.remove({}).then((result)=>{
//     console.log(result);
// });

//REMOVE ONE DOC , 1st returned - doc is returned so you can do something with the data
Todo.findByIdAndRemove({_id: '5914927750ab8842102da0ee'}).then((todo)=>{console.log(todo)})

//REMOVE ONE DOC , by id, - doc is returned so you can do something with the data
Todo.findByIdAndRemove('5914927750ab8842102da0ee').then((todo)=>{console.log(todo)})



