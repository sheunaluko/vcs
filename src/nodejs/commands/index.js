//Sun Mar 10 15:36:37 PDT 2019

//BUILT IN COMMANDS
let dispatch_builder = require("./dispatch_builder.js")
let append2file = require("./append2file.js") 


bundle = { 
    dispatch_builder,
    append2file, 
} 



module.exports = { 
    module  : "builtins" , 
    bundle : bundle 
} 



