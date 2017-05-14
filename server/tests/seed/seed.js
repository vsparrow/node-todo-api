const {ObjectID} = require("mongodb")
const {Todo} = require("./../../models/todo.js")
const {User} = require("./../../models/user.js")
const jwt = require("jsonwebtoken")
const userOneId = new ObjectID
const userTwoId = new ObjectID
const users = [
    {_id : userOneId, email: "andrew@example.com", password : "userOnePass",
        tokens : [{access : "auth", token: jwt.sign({_id:userOneId, access: "auth"}
            ,"abc123").toString()}]
    },
    {_id: userTwoId , email: "jen@example.com", password : "userTwoPass"}
]

const todos = [
    {_id : new ObjectID(),text : "First test todo"},
    {_id : new ObjectID(),text : "Second test todo",completed:true, completedAt: 3333}
];
 
const populateTodos = (done)=>{Todo.remove({}).then(()=> {
        return Todo.insertMany(todos);
    }).then(()=>done());
}; //wipes todos //start with 0

const populateUsers = (done)=>{ User.remove({}).then(()=>{
        var userOne = new User(users[0]).save()    
        var userTwo = new User(users[1]).save()    
        
        return Promise.all([userOne,userTwo])
    }).then(()=>done())
}


module.exports = {populateTodos,todos,populateUsers,users}