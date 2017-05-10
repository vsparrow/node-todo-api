// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

 MongoClient.connect("mongodb://localhost/TodoApp",(err, db)=>{
    if(err){ return console.log("Unable to connect to MongoDB server")}
    console.log("Connected to MongoDB server");
    
    //TO ARRAY
    // db.collection("Todos").find({
    //     _id: new ObjectID("59129cfcaee142487ec69218")
    // }).toArray().then((docs)=>{
    //     console.log('Todos')
    //     console.log(JSON.stringify(docs,undefined,2))
    // },(error)=>{console.log("Unable to fetch Todos", error)});
    
    //TO COUNT
    // db.collection("Todos").find({
    //     _id: new ObjectID("59129cfcaee142487ec69218")
    // }).count().then((count)=>{
    //     console.log('Todos count: ',count)
 
    // },(error)=>{console.log("Unable to fetch Todos", error)});
    
    db.collection('Users').find({name: "vsparrow"}).toArray().then((docs)=>{
        console.log("List of document with field name of vsparrow");
        console.log(JSON.stringify(docs,undefined,2))
    })
    
    console.log("Bye")
    db.close();
});