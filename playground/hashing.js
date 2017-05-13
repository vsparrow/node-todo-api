const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");

var password = "123abc!"
 // without salt after hash get sam result every time
//salting adds a bunch of random characters to the hash
// bcrypt.genSalt(10, (error,salt)=>{  //rounds used to generate sale, callback
//     bcrypt.hash(password,salt,(err,hash)=>{// things to hash, salt to use, callback
//         console.log(hash);
//     })        
// })

var hashedPassword = "$2a$10$lHqUGF4Se/67Ly56cFQOk.BYDrzWHwJu8k7ZeSnrGgTOo3N9q.lJ2"

//takes plain value, hashed value then lets you know if they equal each other
 bcrypt.compare(password,hashedPassword,(err,result)=>{
     console.log(result)
 }) 


// // jwt.sign     // takes, object, data with user id, signs it create hash , return token val
// // jwt.verify   // takes token + scret and makes sure data not manipulated

// var data = {id: 10}
// var token = jwt.sign(data, '123abc') //object,secret
// console.log(token)

// var decoded = jwt.verify(token,'123abc');
// console.log(decoded)
// // var message = "I am user number 3";
// // var hash = SHA256(message).toString();

// // console.log(`Message : ${message}`);
// // console.log(`Hash: ${hash}`);

// // var data = { id: 4}
// // var token = {
// //     data,   //<--es6  es5 --> // data : data
// //     hash : SHA256(JSON.stringify(data) + "somesecret").toString()  //secret is salt
// // }
// // // **********************

// // // If data were to be changed it would be at this step
// // // // change here to test call fail
// // // token.data.id = 5;
// // // token.data = SHA256(JSON.stringify(token.data)).toString()
// // *********************

// var resultHash = SHA256(JSON.stringify(token.data)+"somesecret").toString();

// if(resultHash === token.hash){ //then data not manipulateed
//     console.log("Data was not changed");
// }else {
//     console.log("Data was changed, dont trust")
// }


