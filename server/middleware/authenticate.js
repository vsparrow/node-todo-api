var {User} = require("./../models/user.js");


//middleware function we use on our routes
var authenticate = (req,res,next) =>{
   var token = req.header('x-auth');
   User.findByToken(token).then((user) => {
       //not happy path
       if(!user) { 
           return Promise.reject(); 
           //we dont need to write  res.status(401).send()} since goes to catch
       }
       //happy path
       req.user = user; 
       req.token = token;
       next();
       //res.send(user) //<- only needed when not middleware
   } ).catch((e)=>{res.status(401).send()})
}

module.exports = {authenticate};