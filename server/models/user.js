const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash"); 
const bcrypt = require("bcryptjs");

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


// UserSchema.statics //everything turns into model meethod rather than instance method
UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded; //undefiend variable :: 

    
    try {decoded = jwt.verify(token,"abc123")}
    catch(e){
        return Promise.reject();
        //return new Promise((resolve,reject)=>{ reject();});
    }
    
    return User.findOne({ //SUCCESS CASE
        "_id"  : decoded._id,
        "tokens.token" : token,
        "tokens.access" : "auth"
    })
}
UserSchema.statics.findByCredentials = function (email,password) {
    var User = this;
    
    return User.findOne({email}).then((user)=>{
        if(!user){return Promise.reject()} //user not exist
        return new Promise((resolve,reject)=>{
            //bcrypt//if ok call resovle with user
            //if false, call reject
            bcrypt.compare(password,user.password,(err,result)=>{
                if(err){console.log(err); reject()}
                if(result===false){return reject()}
                
                if(result===true){return resolve(user)}
            })
        })
    })
}


UserSchema.pre("save",function (next) {
    var user = this;
//    var hash = null;
    if(user.isModified("password")){
        // console.log(user.password)
        bcrypt.genSalt(10,(err,salt)=>{
            // if(err){next(err)}
            bcrypt.hash(user.password,salt,(err,hash)=>{
                // if(err){next(err)}
                // console.log("Hash :",hash); ////////
                user.password = hash; next();
                // this.update({"password" : hash})
                // this.update( {$set: {"password" : hash}})
                // this._doc.password = hash;
                // this.password = hash;
                // console.log("THIS PASSWORD",this.password)
                // next()
                    //  console.log("user password after hash and assignments:",user.password)
                
                
            })
        })    
        

     //start server, make new user inside postman
     //once get 200
     //then view records in db, see hashed password 
     //drop db if you wnat
    //  console.log("user password after hash:",user.password)
    //  next(user)
    }else {
        next()
    }
})

var User = mongoose.model("User",UserSchema)

module.exports = {User};