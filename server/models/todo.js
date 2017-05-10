var mongoose = require("mongoose");

var Todo = mongoose.model("Todo",{
    text: {type: String, required : true, minlength : 1, trim : true},
    completed : {type: Boolean, default: false},
    completedAt : {type: Number, default : null} //obj id has created at so no need for that
}) 


module.exports = {Todo};