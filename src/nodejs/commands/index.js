// Sun Mar 10 15:36:37 PDT 2019

/* create command bundle  */ 
bundle = [ 
    require("./dispatch_builder.js"),
    require("./append2file.js") ,
    require("./get_text_chunk.js"),
    require("./reload_alias.js"), 
]

/* make module export */
module.exports = { 
    module  : "builtins" , 
    bundle : bundle 
} 



