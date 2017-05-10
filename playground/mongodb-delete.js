// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

 MongoClient.connect("mongodb://localhost/TodoApp",(err, db)=>{
    if(err){ return console.log("Unable to connect to MongoDB server")}
    console.log("Connected to MongoDB server");
    //delete many
    // db.collection("Todos").deleteMany({text: "Eat lunch"}).then((result)=>{console.log(result)});
    //deleteOne
    // db.collection("Todos").deleteOne({text: "Eat lunch"}).then((result)=>{console.log(result)});
    //findOneAndDelete
    //  db.collection("Todos").findOneAndDelete({completed : false}).then((result)=>{console.log(result)});
    // db.close();
    
    
    //delete many remove dupes vsparrow
    // db.collection("Users").deleteMany({name: "vsparrow"}).then((result)=>{console.log(result)})
    db.collection("Users").findOneAndDelete({_id : ObjectID("5912c5c9bb0a2110d814ecdc")}).then((result)=>{console.log(result)})
    // findOneAndDelete by id and delete, any is ok  Mike
});