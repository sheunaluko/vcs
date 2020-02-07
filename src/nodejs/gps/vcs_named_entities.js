

const NamedEntity = require("./named_entity.js") 

var res  = require("./vcs_resources.js") 
var ops  = require("./vcs_operations.js") 

//helper fn 
function nentity(e,names) { return new NamedEntity(new e(),names) } 


module.exports = { 
    Dreams : nentity(res.Dreams,["dream" ,"dreams"]),
    Logs   : nentity(res.Logs  ,["log"   ,"logs", "daily log"]), 
    First  : nentity(ops.First ,["first"]),
    Last   : nentity(ops.Last ,["last"]),
    Inc10  : nentity(ops.Increment10 ,["add ten" , "add 10"]),
    Inc20  : nentity(ops.Increment20 ,["add twenty" , "add 20"]),
}




