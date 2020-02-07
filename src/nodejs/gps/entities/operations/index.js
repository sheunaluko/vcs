



const ArrayOperation = require("./array_operation.js")
const IncrementOperation = require("./increment_operation.js")
const LastOperation      = require("./last_operation.js")
const NumericOperation      = require("./numeric_operation.js")
const {Operation}      = require("./operation.js")




function make_incrementor({value}) { 
    return new IncrementOperation({value}) 
}

module.exports = { 
    ArrayOperation, 
    IncrementOperation,
    LastOperation, 
    NumericOperation,
    Operation,
    make_incrementor , 
}
