


/* 
 Sat Feb 29 10:47:36 PST 2020 
 Typescript module for VCS_TEXT_CLIENT 
 Will provide a small re-usable library for
 Communicating with VCS Text server 
 */ 


 /* 
    Makes sense to define a class 
 */ 

type data_field = string | number | boolean | object 

interface ws_msg { 
    type : string, 
    data : data_field , 
}
 
interface c_ops { 
    port : number | string , 
    host :  string ,  
    on_msg  : (msg : ws_msg) => void   , 
    on_open? : () => void , 
    reconnect? : number , 
}

 export class VCS_TEXT_CLIENT {  

    conn : WebSocket | undefined  = undefined  // ref to the connection 
    ops : c_ops 

    constructor(ops : c_ops) {  
        this.ops = ops 
    }

    log(...args : [any?, ...any[]]) {  
        console.log.apply(null,args) 
    }

    connect() { 
        try { 
            let url = `ws://${this.ops.host}:${this.ops.port}` 
            this.log("Attempting connection to url: " +  url)  
            this.conn = new WebSocket(url)  
            
            /* 
            Set the msg handlers 
            */

            //open 
            this.conn.onopen = (function open(this : VCS_TEXT_CLIENT) { 
                this.log("Connection opened") 
                if (this.ops.on_open) {  
                    this.ops.on_open() 
                }
            }).bind(this)

            //msg
            this.conn.onmessage = (function message(this : VCS_TEXT_CLIENT , _msg : MessageEvent ) { 
                this.log("Got message") 

                let msg = JSON.parse(_msg.data) 

                //for now we just forward the message to the handler 
                this.ops.on_msg(msg) 

            }).bind(this)

            //close 
            this.conn.onclose = (function close(this: VCS_TEXT_CLIENT) {
                this.log("WS Connection was closed for some reason") 
                if (this.ops.reconnect) { 
                    this.log("Attempting reconnect") 
                    this.connect() 
                }
            }).bind(this)


        } catch (e) { 
            this.log("Oops.. an error occured") 
            this.log("Here it is:") 
            this.log(e) 
            //throw("Could not connect") 
            if (this.ops.reconnect) { 
                setTimeout( (function(this : VCS_TEXT_CLIENT) { 
                    this.connect() 
                }).bind(this) , this.ops.reconnect ) 
                //will reconnect after this.ops.reconnect MS 
            }
        }
    }

    send(msg : object) {  
        /*
        For now allow sending of any object 
        */
        if (this.conn) { 
            this.conn.send(JSON.stringify(msg))    
        }  else { 
            this.log("Not yet connected! Please connect first by running {obj}.connect()") 
        }
    }

 }