var mongoose = require("mongoose");
// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/TodoApp");
mongoose.connect(process.env.MONGODB_URI );

mongoose.Promise = global.Promise; //tell mongoose to use ES6 promise rather than 3rd party

module.exports = { mongoose}