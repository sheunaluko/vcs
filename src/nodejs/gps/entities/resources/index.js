

const MongoCollectionResource = require("./mongo_collection_resource.js")
const NumericResource = require("./numeric_resource.js")
const {Result} = require("./result.js")
const {Resource} = require("./resource.js")





function make_numeric({value}) {
    return new NumericResource({value}) 
}










module.exports = { 
    MongoCollectionResource, 
    NumericResource, 
    Result, 
    Resource ,
    make_numeric 
}
