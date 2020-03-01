//Fri Jul 26 18:36:38 PDT 2019
//modified for ts Sun Mar  1 11:59:31 PST 2020 

import * as ir from "./deps/interpreter_rules" 
import * as it from "./deps/interpreter_targets" 
import * as iu from "./deps/interpreter_utils"  


/**
 * Parse a text string  
 *
 * @param {string} text
 * @returns
 */
function parse(text : string) {  
    return ir.handle_text(text)    
} 

module.exports = { 
    parse  , 
    it  , 
    ir,  
    iu, 
}


