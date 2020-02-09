//Thu Feb  6 15:30:17 PST 2020
const {ir,it,parse,iu} = require("./interpreter/interpreter.js") 
//ir = interpreter rules ,it = targets 
//load the generic and vcs_specific entities 
const {entity_base}      = require("./vcs_entities.js") 
const {res,ops,types}  = entity_base


/* 
   
  RATIONALE: 
  This file maps text into entities. An ENTITY instance is defined in 
  nodejs/entities/index.js . Other functionality is responsible for combining 
  entities (resources and operations) into computations , for running those 
  computations  

  
  The rule set below consists of an array of objects with keys [rules, target]. 
  These are described briefly here: 
  
  --- RULES --- 
  Please see nodejs/rule_parser.js 
  To understand the options better 
 
  @or(x1|x2|..)
  - will allow any of those (ATLEAST ONE) but not multiple  

  
  ?(x1|x2|x3) 
  - will allow any of those (or none) but not multiple 
  
  [[Y]] 
  - represents a wildcard and will be captured into an object as  { Y : __ } 

  -- TARGET -- 
  The provided target is EITHER 
  1) a function which takes the captured arguments and produces an ENTITY instance  
  2) an ENTITY instances itself 
  
 */

let rule_set = [ 
    
    { target : res.get.numeric  , 
      rules  : ["numeric [[value]]"]  } , 

    { target : ops.get.incrementor, 
      rules  : ["@or(increment|add) [[value]]"]  } , 

    { id : "daily_log" , 
      target : res.get.mongo_collection({id : "awake"}), 
      rules  : ["?(daily) @or(log|logs)"]   } , 

    { id : "dreams" , 
      target : res.get.mongo_collection({id : "asleep"}), 
      rules  : ["?(my) @or(dreams|dream)"]   } , 

    { id : "last" , 
      target : ops.get.array.last , 
      rules  : ["?(get) last"]   } , 

    { id : "first" , 
      target : ops.get.array.first , 
      rules  : ["?(get) first"]   } , 
    
    
    { target : ()=>console.log("boii") , 
      rules : [ "boi" ]  } , 

    { target : (x)=>console.log(x.target) , 
      rules : [ "say [[target]]" ]  } , 
      
    
    { target : it["store_variable"], 
      rules  :  [ "store [[value]] @or(in|into|as) [[name]]" , 
		  "[[name]] equals [[value]]",
		  "[[name]] is equal to [[value]]" , 
		  "set [[name]] @or(to|equal to) [[value]]"] , 
      parsers:  { name : iu.nato_parser  } } , 

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
