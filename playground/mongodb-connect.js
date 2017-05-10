// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

 

// MongoClient.connect(urlofdb, callback after connection succed or fail);
MongoClient.connect("mongodb://localhost/TodoApp",(err, db)=>{
    if(err){ return console.log("Unable to connect to MongoDB server")}
    console.log("Connected to MongoDB server");
    
    
    db.collection("Todos").insertOne({
        text: "Eat lunch", completed : false
    },(err,result)=>{
        if(err){return console.log("Unable to insert todo", err)}
        console.log(JSON.stringify(result.ops,undefined, 2)) //ops contains what was inserted
    })
    // //takes name of collection that you want ot insert into
    
    // db.collection("Users").insertOne({
    //     name : "Mike", age: 300, location : "Galaxy 123"//,_id: 123
    // },(error,result)=>{
    //     if(error){return console.log("Error inserting record")}
    //     // console.log(JSON.stringify(result.ops,undefined,2))
    //     console.log(result.ops[0]._id.getTimestamp())
    // })
    
    
    db.close();
});