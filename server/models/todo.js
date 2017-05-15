var mongoose = require("mongoose");

var Todo = mongoose.model("Todo",{
    text: {type: String, required : true, minlength : 1, trim : true},
    completed : {type: Boolean, default: false},
    completedAt : {type: Number, default : null}, //obj id has created at so no need for that
    _creator : {required: true, type: mongoose.Schema.Types.ObjectId} 
        //it is an object id, stores id of user who created it
    
}) 


module.exports = {Todo};