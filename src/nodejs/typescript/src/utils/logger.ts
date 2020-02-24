

export class Logger { 
    
    id : string  
    
    constructor(id : string) { 
	
	this.id = id 
    }
    
    i(...args : any[]) { 
	let tmp = `[${this.id}]:: ` + args.join(" ") 
	console.log(tmp) 
    }

    d(...args : any[]) { 
	let tmp = `[${this.id}]:: ` + args.join(" ") 
	console.log(tmp) 
    }
    
}


export function make_logger(id :string) { 
    return new Logger(id) 
}
