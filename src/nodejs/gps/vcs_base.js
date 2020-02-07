//Thu Jan 30 15:27:56 PST 2020

//load the entities 
const vcs_named_entities   = require("./vcs_named_entities") 
const vcs = require(process.env.VCS_DEV_LOC) 
const log = vcs.logger.get_logger("vcs_base") 

//add them to base 
let entity_keys = Object.keys(vcs_named_entities)  

var base = {}; 
entity_keys.map(k=> {
    let named_entity = vcs_named_entities[k]
    let entity = named_entity.entity 
    let names = named_entity.names 
    
    names.map(n=>{
	log.i(`Adding string ${n} for entity ${entity.entity_id}`)
	base[n] = entity 
    })
    
})


module.exports =  base ; 




