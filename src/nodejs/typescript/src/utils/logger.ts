
export class Logger { 
    
    id : string  
    header : string 
     
    constructor(id : string) { 
	
    this.id = id 
    this.header = `[${id}]::` 
    }

    l(...args : any []) { 

        //console.log(args)

        var next_print : any  
        var to_flush = this.header
        while (next_print = args.shift() ) {  

            next_print = next_print[0]
            
            //console.log(next_print) 
            
            if (next_print.constructor == String) { 
                to_flush += (" "  + next_print) 
            } else { 
                console.log(to_flush) 
                console.log(JSON.stringify(next_print)) 
                to_flush = this.header 
            } 

        } 

        if (to_flush != this.header)  {
            console.log(to_flush) 
        }

    }
    
    i(...args : any[]) { 
        this.l(args)
    }

    d(...args : any[]) { 
        this.l(args) 
    }
    
}


export function make_logger(id :string) { 
    return new Logger(id) 
}
