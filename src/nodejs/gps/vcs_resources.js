const {MongoCollectionResource} = require("./mongo_collection_resource.js") 


function getMongoCollectionResource(id,query) { 
    
    class MongoCollRes extends MongoCollectionResource { 
	constructor() { 
	    super({id, query})  
	}
    }
    
    return MongoCollRes 
}

var Dreams = getMongoCollectionResource("asleep",{})
var Logs   = getMongoCollectionResource("awake",{})

module.exports = { 
    Dreams, 
    Logs 
}

