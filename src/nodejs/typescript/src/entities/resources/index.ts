
import  * as numeric from "./numeric_resource"
import * as result from "./result" 
import * as resource from "./resource" 

import * as t from "../types" 




export var get = {
    numeric : function (op : t.p.ValueOp) {
	return new numeric.NumericResource(op)
    } , 
} 


export  { 
    numeric, 
    result, 
    resource 
}

