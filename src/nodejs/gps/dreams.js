const {MongoCollectionResource} = require("./mongo_collection_resource.js") 


function getMongoCollectionResource(id,query) { 
    
    
    class tmp extends MongoCollectionResource { 
	constructor() { 
	    let id = "asleep"  
	    let query = {} 
	    super({id, query})  
	}
    }
    
    return tmp 
}


var Dreams = getMongoCollectionResource("asleep",{})
var Logs   = getMongoCollectionResource("awake",{})

module.exports = { 
    Dreams, 
    Logs 
}

