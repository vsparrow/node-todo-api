var env = process.env.NODE_ENV || "development";
// console.log("env **********",env);


if(env === "development"){
    // process.env.port =
    process.env.MONGODB_URI = "mongodb://localhost/TodoApp"
    
} else if(env ==="test") {
    process.env.MONGODB_URI = "mongodb://localhost/TodoAppTest"
}