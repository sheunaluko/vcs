

import {Entity} from "./entities/entity" 
//import * as res from "./entities/resources/index"


export function logit(msg : string) { 
    console.log(msg) 
}


export var tests = { 
    "1" : function() {
	var e = new Entity({entity_id : "test_entity"})
	e.describe()
    }
}




