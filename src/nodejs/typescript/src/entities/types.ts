import * as param_types from "./param_types" 


//define CORE types as enum 
export enum c { 
    string, 
    array,
    dictionary, 
    float, 
    resource,
    operation,
    action,
    argument,
    result
}

export function js_type(x : any) { 
    
    switch (x.constructor) { 
	
    case String : 
	return c.string
	break 
	
    case Array : 
	return c.array 
	break 
	
    case Object : 
	return c.dictionary 
	break 
	
    case Number : 
	return c.float 
	break 
	
    }
    
    return null 
}




export {param_types as p }
