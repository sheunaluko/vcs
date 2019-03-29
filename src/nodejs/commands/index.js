//Sun Mar 10 15:36:37 PDT 2019

//BUILT IN COMMANDS
let dispatch_builder = require("./dispatch_builder.js")
let append2file = require("./append2file.js") 
let get_text_chunk = require("./get_text_chunk.js")

bundle = { 
    dispatch_builder,
    append2file, 
    get_text_chunk
} 

module.exports = { 
    module  : "builtins" , 
    bundle : bundle 
} 



