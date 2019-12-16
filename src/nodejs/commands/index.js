// Sun Mar 10 15:36:37 PDT 2019

/* create command bundle  */ 
bundle = [ 

    require("./append2file.js") ,
    require("./dispatch_builder.js"),
    require("./get_text_chunk.js"),
    require("./reload_alias.js"), 
    require("./javascript_echo.js") ,
    require("./review_logs.js") ,    
    require("./continuous_timer.js") ,    
    require("./interpreter.js") ,    
    require("./typer.js"), 
    require("./shutdown.js")
]

/* make module export */
module.exports = { 
    module  : "builtins" , 
    bundle : bundle 
} 



