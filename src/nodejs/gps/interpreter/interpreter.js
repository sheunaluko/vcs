//Fri Jul 26 18:36:38 PDT 2019
let vcs = require(process.env.VCS_DEV_LOC)
let ir  = require("./deps/interpreter_rules.js") 
var it  = require("./deps/interpreter_targets.js") 
var iu  = require("./deps/interpreter_targets.js") 
let id = "interpreter"



function parse(text) { 
    return ir.handle_text(text)    
} 


module.exports = { 
    parse  , 
    it  , 
    ir,  
    iu, 
}




//need to build a VCS ENTITY rule set-- which will map rules DIRECTLY IN VCS ENTITIES 
//for this will need to build a target function which takes the OPS from the rule and produces 
//the appropriate ENTITY 
