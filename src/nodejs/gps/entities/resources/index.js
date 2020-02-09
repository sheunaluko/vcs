

const {MongoCollectionResource} = require("./mongo_collection_resource.js")
const NumericResource = require("./numeric_resource.js")
const {Result} = require("./result.js")
const {Resource} = require("./resource.js")





function numeric({value}) {
    return new NumericResource({value}) 
}


function mongo_collection({id,query}) { 
    return new MongoCollectionResource({id,query}) 
}


var get = {

    numeric , 
    mongo_collection,  
    
}




module.exports = { 
    MongoCollectionResource, 
    NumericResource, 
    Result, 
    Resource ,
    get , 
}
