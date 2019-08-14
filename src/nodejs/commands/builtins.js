// Tue Aug 13 17:46:32 PDT 2019

/* create command bundle  */ 
bundle = [ 
    require("./append2file.js") ,
    require("./dispatch_builder.js"),
    require("./get_text_chunk.js"),
    require("./javascript_echo.js") ,
    require("./shutdown.js") ,    
]

/* make module export */
module.exports = { 
    module  : "builtins" , 
    bundle : bundle 
} 



