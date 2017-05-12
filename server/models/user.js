const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash"); 


//stores schema for a user / stores properties //we cant add methods to user unless we
//swtich how we generate out model. thats why ise mongooseSchema
var UserSchema = new mongoose.Schema(
     {
    email : {type : String, required : true , minlength : 5, trim : true,
        unique: true,
        validate : validator.isEmail,// same-> //{validator : (value)=>{return validator.isEmail(value);}},
            message: `{VALUE} is not a valid email`
    },
    password : {type: String, require : true , minlength : 6},
    tokens : [{
        access : { type: String, require : true},
        token : {type: String, require : true}
    }]
}
);
UserSchema.methods.generateAuthToken = function(){
    var user = this;
    var access = "auth";
    var token = jwt.sign({_id : user._id.toHexString(), access},'abc123')//es5 access:access
        .toString()
    user.tokens.push({access, token});
    return user.save().then(()=>{return token}); 
};

UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject,["_id","email"]);
}

var User = mongoose.model("User",UserSchema)

module.exports = {User};