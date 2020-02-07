//Thu Feb  6 15:30:17 PST 2020
const {ir,it,parse,iu} = require("./interpreter/interpreter.js")  //ir = interpreter rules ,it = targets 
const vcs_targets      = require("./entity_targets.js") 


let rule_set = [ 
    
    { target : vcs_targets["res_numeric"], 
      rules  : ["numeric [[value]]"]  , 
      parsers : { value : iu.variable_value_parser } } , 

    { target : vcs_targets["op_increment"], 
      rules  : ["@or(increment|add) [[value]]"]  , 
      parsers : { value :iu.variable_value_parser } } , 
    
    { target : ()=>console.log("boii") , 
      rules : [ "boi" ]  } , 

    { target : (x)=>console.log(x.target) , 
      rules : [ "say [[target]]" ]  } , 
      
    
    { target : it["store_variable"], 
      rules  :  [ "store [[value]] @or(in|into|as) [[name]]" , 
		  "[[name]] equals [[value]]",
		  "[[name]] is equal to [[value]]" , 
		  "set [[name]] @or(to|equal to) [[value]]"] , 
      parsers:  { name : iu.nato_parser , 
		  value : iu.variable_value_parser  } } , 
    
    { target : it["get_variable"], 
      rules  :  [ "what is ?(the value of) [[name]]" , 
		  "output [[name]]" ] , 
      parsers:  { name : iu.nato_parser  } } 
    
]

//add the rules 
for (obj of rule_set) { ir.add_to_rule_set(obj) } 

// -  
module.exports = { 
    parse 
}
