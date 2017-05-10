const expect = require("expect")
const request = require("supertest")

const {app} = require("./../server.js");
const {Todo} = require("./../models/todo.js")

const todos = [{text : "First test todo"},{text : "Second test todo"}];
// beforeEach((done)=>{Todo.remove({}).then(()=> done()); }); //wipes todos //start with 0 //before mod
beforeEach((done)=>{Todo.remove({}).then(()=> {
        return Todo.insertMany(todos);
    }).then(()=>{done();});
}); //wipes todos //start with 0




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