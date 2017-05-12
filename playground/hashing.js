const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken")

// jwt.sign     // takes, object, data with user id, signs it create hash , return token val
// jwt.verify   // takes token + scret and makes sure data not manipulated

var data = {id: 10}
var token = jwt.sign(data, '123abc') //object,secret
console.log(token)

var decoded = jwt.verify(token,'123abc');
console.log(decoded)
// var message = "I am user number 3";
// var hash = SHA256(message).toString();

// console.log(`Message : ${message}`);
// console.log(`Hash: ${hash}`);

// var data = { id: 4}
// var token = {
//     data,   //<--es6  es5 --> // data : data
//     hash : SHA256(JSON.stringify(data) + "somesecret").toString()  //secret is salt
// }
// // **********************

// // If data were to be changed it would be at this step
// // // change here to test call fail
// // token.data.id = 5;
// // token.data = SHA256(JSON.stringify(token.data)).toString()
// // *********************

// var resultHash = SHA256(JSON.stringify(token.data)+"somesecret").toString();

// if(resultHash === token.hash){ //then data not manipulateed
//     console.log("Data was not changed");
// }else {
//     console.log("Data was changed, dont trust")
// }


