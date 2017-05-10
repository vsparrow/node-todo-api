var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/TodoApp");

mongoose.Promise = global.Promise; //tell mongoose to use ES6 promise rather than 3rd party

module.exports = { mongoose}