

const ArrayOperation = require("./array_operation.js")
const IncrementOperation = require("./increment_operation.js")
const LastOperation      = require("./last_operation.js")
const NumericOperation      = require("./numeric_operation.js")
const {Operation}      = require("./operation.js")



function _array({fn}) {
    return new ArrayOperation({fn})
}

var first_array = () => _array({fn : (x) => x[0]}) 
var last_array  = () => _array({fn : (x) => x[x.length - 1]}) 






function numeric({fn}) {
    return new NumericOperation({fn})
}


function incrementor({value}) { 
    return new IncrementOperation({value}) 
}



var get = {
    array : { 
	first : first_array, 
	last : last_array,
	generic : _array , 
    } , 
    numeric, 
    incrementor, 
}




module.exports = { 
    ArrayOperation, 
    IncrementOperation,
    LastOperation, 
    NumericOperation,
    Operation,
    get , 
}
