import * as res from "./resource"
import * as t from "../types" 


export interface MongoCollectionOp { 
    id : string,  
    query : { optional? : any }  //has to be a map 
}





class MongoCollectionResource extends Resource {
    
    constructor(ops){ 
	
	if (!ops.id) { throw("Need collection id") } 
	if (!ops.query) { ops.query = {} } 
	
	//define params 
	var collection_id = ops.id
	var query         = ops.query 
	var entity_id     = `MongoCollectionResource::${collection_id}` 
	    
	// - init object 
	super({entity_id}) 
	
	//set the member vars 
	this.query = query; 
	this.collection_id = collection_id 
	
	//define the type handlers 
	this.type_handlers = {} 
	this.type_handlers[types.array] = this.as_array
	
	//define default type 
	this.default_type = types.array 
    }
    
    
    async as_array() {
	let coll = this.collection_id ; let query = this.query ; 
	return await vcs.db.get_collection({coll,query})
	
    }
    
    
}


module.exports = {
    MongoCollectionResource 
}
