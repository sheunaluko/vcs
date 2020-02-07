const {types}    = require("./types.js") 
const ArrayOperation = require("./array_operation.js") 
const NumericOperation = require("./numeric_operation.js") 
let vcs = require(process.env.VCS_DEV_LOC)  //get vcs 


function getArrayOperation(id,fn) {
    class ArrayOp extends ArrayOperation { 
	constructor() { 
	    super({id,fn})
	}
    }
    return ArrayOp
}


function getNumericOperation(fn) {
    class NumericOp extends NumericOperation { 
	constructor() { 
	    super({fn})
	}
    }
    return NumericOp
}






var Last  = getArrayOperation("last_operation"  , (x)=>x[x.length-1])
var First = getArrayOperation("first_operation" , (x)=>x[0]) 

var Increment10 = getNumericOperation(x=>x+10)
var Increment20 = getNumericOperation(x=>x+10)

module.exports = { 
    Last, 
    First, 
    Increment10, 
    Increment20,
}
