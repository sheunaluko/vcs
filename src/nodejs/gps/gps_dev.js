const {types}                    = require("./types.js") 
const {Resource}                = require("./resource.js")
const {Operation}               = require("./operation.js")
const {Modifier}                = require("./modifier.js") 
const {MongoCollectionResource} = require("./mongo_collection_resource.js") 


async function init() {
    await require("../configurator.js").init_config() 
}


module.exports = { 
    Resource,
    Operation,
    Modifier,
    MongoCollectionResource,  
    types, 
}

init() 
