

import * as logger from "./logger" 




/**
 * Returns a logger instance 
 *
 * @export
 * @param {string} name
 * @returns 
 */
export function get_logger(name : string) {  
	return logger.make_logger(name)  
}



function string_contains_any(val :string,arr : string[]) { 
    let ret = false
    for (let i of arr) { 
		var res = (val.indexOf(i) > -1 ) 	
		ret = ret || res
    }
    if (ret) { return true } else {return false } 
}

let arithmetic_ops = ['+' , '-' , '/' , '*' ]




/**
 * Checks if a string has any arithmetic operations in it 
 *
 * @export
 * @param {*} text
 * @returns {Boolean}
 */
export function has_arithmetic(text : string) : Boolean { 
    return string_contains_any(text,arithmetic_ops) 
}





/**
 * Unsafe nodejs evaluation 
 * 
 * @export
 * @param {string} text
 * @returns {*}
 */
export function _eval(text : string) : any  {   
	return eval(text)  
}



