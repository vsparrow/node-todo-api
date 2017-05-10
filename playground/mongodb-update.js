// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

 MongoClient.connect("mongodb://localhost/TodoApp",(err, db)=>{
    if(err){ return console.log("Unable to connect to MongoDB server")}
    console.log("Connected to MongoDB server");
    
     //findone and update
     // db.collection("Todos").findOneAndUpdate({_id: ObjectID("5912cc32edda191214d2a6e6")},
     // { $set: {completed : true}},
     //  {returnOriginal:false}
     // ).then((result)=>{console.log(result)});
     
     
     //find jen and make your name
     // inc operator, increment age by 1 //go to docs mongo and look it up
     // db.collection("Users").findOneAndUpdate({name: "Jen"},
     //  {$set : {name : "vsparrow"}},
     //  {returnOriginal : false}
     // ).then((res)=>{console.log(res)});
     
     // db.collection("Users").findOneAndUpdate({name: "vsparrow"},
     //  {$inc : {age : 1}},
     //  {returnOriginal : false}
     // ).then((res)=>{console.log(res)});
  
    db.collection("Users").findOneAndUpdate({name: "vsparrow"},
      {$inc : {age : 1},$set : {Occupation : "C^3 (Cool Connections Creator)"}},
      {returnOriginal : false}
     ).then((res)=>{console.log(res)});
  
  
 });