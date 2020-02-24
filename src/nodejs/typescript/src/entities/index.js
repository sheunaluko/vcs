

const {Entity} = require("./entity.js")
const {types} = require("./types.js")
const res = require("./resources/index.js") 
const ops = require("./operations/index.js") 


module.exports = { 
    res, 
    ops, 
    Entity,
    types 
}
