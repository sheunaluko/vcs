//Sun Feb 23 10:38:06 PST 2020 

var log = console.log 

export var subscriptions  = { 
    //empty at the beginning 
}

export function subscribe( { id , cb }) {
    let fns = subscriptions[id]  
    if (!fns ) { 
        //unit 
        subscriptions[id] = [cb]
    } else { 
        subscriptions[id].push(cb) 
    }
}

export function publish( { id, data }) { 
    //log(id,data)
    let fns = subscriptions[id] 
    if ( !fns ) { 
        //nothing to do really
    } else { 
        fns.forEach(f => f({data}) ) //call each one 
    }
}


export var functions = { 
    //empty at first 
}

export function provide( {id, func}) { 
    let fn = functions[id] 
    if (!fn ) { 
        functions[id] = func
    } else { 
        log("Warning: overwriting function") 
        functions[id] = func 
    }
}

export function call( {id,args }) { 
    let fn = functions[id] 
    if (!fn ) { 
        log("No registered function") 
        return null 
    } else { 
        log("calling: " , id)
        return fn(args) 
    }
}