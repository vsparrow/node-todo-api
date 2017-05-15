const expect = require("expect")
const request = require("supertest")
const {ObjectID} = require("mongodb")

const {app} = require("./../server.js");
const {Todo} = require("./../models/todo.js")
const {User} = require("./../models/user.js")
const {todos,populateTodos,populateUsers,users} = require("./seed/seed.js")

// const todos = [
//     {_id : new ObjectID(),text : "First test todo"},
//     {_id : new ObjectID(),text : "Second test todo",completed:true, completedAt: 3333}
// ];
// // beforeEach((done)=>{Todo.remove({}).then( ()=> done()); }); //wipes todos //start with 0 //before mod
// beforeEach((done)=>{Todo.remove({}).then(()=> {
//         return Todo.insertMany(todos);
//     }).then(()=>done());
// }); //wipes todos //start with 0
//above added to see.js
beforeEach(populateUsers);
beforeEach(populateTodos);



describe("POST /todos",()=>{
    it("should create a new todo",(done)=>{
        var text = "test todo text";
        request(app).post("/todos").send({text}).expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text );
            })
            .end((err,res)=>{
                if(err){return done(err)}
                
                Todo.find({text}).then((todos)=>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done()
                }).catch( (e)=>{done(e)})
            })
    })
    it("should not create todo with invalid body data",(done)=>{
       //nake post request //send send as empty obejct//test should fail //expect 400//
       //pass to end//make some assumptions about database // length todos is 0
       request(app).post("/todos").send({}).expect(400)
        .end((error,res)=>{
            if(error){return done(error)}
            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2);
                done()
            }).catch((e)=>{done(e)})
            
        })

       
    });
})

describe("GET /todos",()=>{
    it("should get all todos",(done)=>{
        request(app).get("/todos").expect(200).expect((res)=>{
            expect(res.body.todos.length).toBe(2)
        }).end(done)
    })
})

describe("GET /todos/:id",()=>{
   it("should return todo doc",(done)=>{
       request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
       .expect(200)
       .expect((res)=>{
           expect(res.body.todo.text).toBe(todos[0].text)
       })  
       .end(done)
   }) 
   
   it("should return 404 if todo not found",(done)=>{
       var hexId = new ObjectID().toHexString();
       request(app)
      .get(`/todos/${hexId}`)
       .expect(404)
       .end(done)
   })
   
   it("should return 404 for non object ids",(done)=>{
        request(app)
        .get(`/todos/123`)
        .expect(404)
        .end(done)
   })
});

describe("DELETE /todos/:id",()=>{
    it("should remove a todo",(done)=>{
        var hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo._id).toBe(hexId)
            })
            .end((error,res)=>{
                if(error){return done(error)} //error rendered by mocha
// ****************************d**********************                
                Todo.findById(hexId).then((todo)=>{
                    expect(todo).toNotExist();
                    done()
                }).catch((e)=>{done(e)})
               
// **************************************************                 
            })//
    });
    
    it("should return 404 if todo not found",(done)=>{
        var hexId = new ObjectID().toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .expect(404)
        .end(done)
    });
    it("should return 404 if object id is invalid",(done)=>{
        request(app)
        .delete(`/todos/123`)
        .expect(404)
        .end(done)
    });
    
});

describe("PATCH /todos/:id",()=>{
    it("should update the todo",(done)=>{
        var hexId = todos[0]._id.toHexString();//grab id of first item
        var data = {text: "Anything??", completed : true} //update txt, completed: true
        request(app)
        .patch(`/todos/${hexId}`) //make patch req/     provide proper url with id inside 
        .send(data)//use send to send some data
        .expect(200)         //200 back
        .expect((res)=>{
            // console.log("RES.body.todo IS ---->",res.body.todo);
            expect(res.body.todo.text).toBe("Anything??")
            expect(res.body.todo.completed).toBe(true)
            expect(res.body.todo.completedAt).toBeA("number")
            // .expect(res.body.todo.completed).toBe(true) //*****************LOOK HERE
        //     .expect(res.body.completedAt).toBeA("number")
            // .done()
        })
        .end(done)
        // .expect((res)=>{
        //     // console.log("RES2 --->",res.body);
        //     expect(res.body.todo.completed).toBe(true)
        // })
        // .expect((res)=>{
        //     // console.log("RES2 --->",res.body);
        //     // console.log("Completed at type is: " + typeof(res.body.todo.completedAt))
        //     expect(res.body.todo.completedAt).toBeA("number")
        // })
        // .end(done) //THIS WORKS IF JUST here
    /*    .end((err,res)=>{  ///not neeeded
            if(err){return done(err)}
            //check against DB
            Todo.findById(hexId).then((todo)=>{
                expect(todo.text === "Anything??");
                expect(todo.completed === true);
                expect(todo.completedAt).toBeA("number")
                done()
            }).catch((e)=>{done(e)})
        }) */
        // .catch((e)=>{done(e)})
        //along as the rq body
        //update the text = "anything" // set compelted = true 
    

        //assert text has changed // competed true // compeltedat is a number //use tobeA
    });
   
    it("should clear completedAt when todo is not completed",(done)=>{
        var hexId = todos[1]._id.toHexString();//grab id of 2nd todo // console.log(hexId);
        // update text to differnt     // set compelted false
        var data = {text : "changed text", completed : false}
        request(app)
        .patch(`/todos/${hexId}`)
        .send(data)
        .expect(200) // assert 200
         // resbody now has changes text changed,
        .expect((res)=>{
        //   console.log(res.body);  
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toBe(null)
            
        }) 
          //completed fasle//completedat is null
        // //can use to not exist method        
        //run npm test
        .end((error,res)=>{
            if(error){return done(error)}
           Todo.findById(res.body.todo._id).then((todo)=>{
                // console.log(todo)
                expect(todo.completed).toBe(false)
                expect(todo.completedAt).toBe(null)            
                done()
            }).catch((e)=>{done(e)});
        })
    });
   
    // it("should",(done)=>{});
    
    // it("should",(done)=>{});
    
})

describe("GET /users/me", ()=>{
    //user data sent back
    it("should return user if authenticated",(done)=>{
                    // console.log("users[0].tokens[0].token:",users[0].tokens[0].token)
        request(app)
        .get("/users/me")
        .set("x-auth",users[0].tokens[0].token ) //header name, header value
        .expect(200)
        .expect((res)=>{
            // console.log("hi!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            // console.log("res.body",res.body)
            expect(res.body._id).toBe(users[0]._id.toHexString())
            expect(res.body.email).toBe(users[0].email)
        })
        .end(done);
    });
    
    //if no token provided random user data not sent back
    it("should return a 401 if not authenticated",(done)=>{
       request(app)
       .get("/users/me")
       .expect(401)
       .expect((res)=>{
           expect(res.body).toEqual({})
       })
       .end(done)
    });
    
})

describe("POST /users",()=>{
    
    it("should create a user", (done)=>{
     var email = "example@example.com";
     var password = "123mnb!"
     request(app)
        .post("/users")
        .send({email,password})
        .expect(200)
        .expect((res)=>{
            expect(res.headers['x-auth']).toExist();
            expect(res.body._id).toExist()
            expect(res.body.email).toBe(email)
        })
        .end((err)=>{
            if(err){return done(err)}
            User.findOne({email}).then((user)=>{
                expect(user).toExist()
                expect(user.password).toNotBe(password)
                done()
            }).catch((err)=>{done(err)}) //*********************************************
        });
    });
    //send invalid email//send invalid password//expect 400 ->then good
    it("should return validation errors if request is invalid", (done)=>{
        request(app)
        .post("/users")
        .send({email: "a@b.123", password: "small"})
        .expect(400)
        .end(done)
    });
    //sign up with email that is alrady taken, user andrew@example.com
    //expect 400 //something about a valid password
    it("should not createuser if email in use", (done)=>{
        request(app)
        .post("/users")
        .send({email: "andrew@example.com", password : "Password1!"})
        .expect(400)
        .end(done)
    });
})

 
describe("POST /users/login", ()=>{
    it("should login user and return auth token",(done)=>{
        request(app)
        .post("/users/login")
        .send({email: users[1].email, password : users[1].password})
        .expect(200)
        .expect((res)=>{
            expect(res.headers["x-auth"]).toExist();
            
        })
        .end((err,res)=>{
            if(err){done(err)}
            User.findById(users[1]._id).then((user)=>{
                expect(user.tokens[0]).toInclude({
                    access: "auth", token: res.headers["x-auth"]
                })
                done()
            }).catch((err)=>{done(err)})
        })
    })
    
    //similar to above // pass in invalid pass
    //tweak asssertions // get 400// xauth not exist
    //user tokens array has lenght of 0
    
    it("should reject invalid login",(done)=>{
        request(app)
        .post("/users/login")
        .send({email: users[1].email, password : "badpass"})
        .expect(400)
        .expect((res)=>{
            expect(res.headers["x-auth"]).toNotExist();
            
        })
        // .end(done)
        .end((err,res)=>{
            if(err){done(err)}
            User.findById(users[1]._id).then((user)=>{
                expect(user.tokens .length).toEqual(0)
                done()
            }).catch((err)=>{done(err)})
            
        })//
    })//it
    
}); //des

describe("DELETE /users/me/token", ()=>{
    it("should remove auth token on logout",(done)=>{ 
       request(app)
       .delete("/users/me/token")
       .set("x-auth",users[0].tokens[0].token ) //.set("x-auth").toBe(users[0].tokens.token)
       .expect(200)
    //   .expect((res)=>{
    //     //   User.f
    //     // console.log(res.body)
    //         User.findOne({email : users[0].email}).then((user)=>{
    //             expect(user.tokens.length).toBe(0)
    //         }).catch((e)=>{done(e)})
    //   })
    //   .end(done)
       .end((err,res)=>{
           if(err){return done(err)}
           User.findById(users[0]._id).then((user)=>{
                expect(user.tokens.length).toBe(0)   
                done()
           }).catch((e)=>{done(e)})
       })
    });
});
    
 

