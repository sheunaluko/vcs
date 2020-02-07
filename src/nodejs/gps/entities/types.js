
//defines the gps data types 

var types = {
    "string"   : 0  , 
    "array"    : 1  , 
    "dictionary" : 2 , 
    "float"    : 3 , 
    
    "resource"  : 5 , 
    "operation" : 6 ,
    "modifier"  : 7 , 
    "action"    : 8 ,  
    "argument"  : 9 , 
    "result"    : 10, 
}

function js_type(x) { 
    
    switch (x.constructor) { 
	
    case String : 
	return types.string
	break 
	
    case Array : 
	return types.array 
	break 
	
    case Object : 
	return types.dictionary 
	break 
	
    case Number : 
	return types.float 
	break 
	
    }
    
    return null 
}


module.exports = { 
    types , 
    js_type 
}
