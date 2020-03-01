import React from 'react';
import Terminal from 'terminal-in-react';


import * as vcs_tc from "../ts/dist/vcs_text_client"  
import * as util from "../js/vcs_client/utils.js" 

var log = util.get_logger("term") 

  
export function TerminalWidget() { 


    var vcs_params = null 
    
    //feedback handler 
    function handle_feedback({payload}) { 
	return "@::" + payload 
    }

    function handle_text({payload}) { 
	return payload 
    }


    //define message handler   
    let response_dict = { 
	"text"  : handle_text , 
	"feedback" :  handle_feedback , 
	"unrecognized_input" : ()=>"what?" , 
	"params" : function(params) { 
            log.i("Received params") 
            vcs_params = params
            log.i("Params updated") 
	} , 
	"command_result" : function({payload,id}) { 
            log.d("Got command result:")
            log.d(payload) 
            //check the result  
            if(payload.quiet) { 
		log.i("Command suppressed output") 
		return null 
            } else { 
		return "[CMD Result]:: " + payload.result
            }
	} , 
    }



    var on_terminal_msg = function(m) {   //will get reset (this function writes to terminal) 
	
    }
				
    function on_msg(msg) {   
	// msg = { type : string , data : string | number | bool | obj }  
	log.d("Got ws msg:") ;
	log.d(msg) 

	let handler = response_dict[msg.type]  
	if (! handler ) { 
            on_terminal_msg("Received unrecognized message type " + msg.type + " from vcs server")
	} else { 
            var result = handler(msg)       
	    on_terminal_msg(result) 
	}
    } 
    
    
    //init ws and connect with the vcs text endpoint here
    var tc = new vcs_tc.VCS_TEXT_CLIENT({port : 9001 ,
					 host : "localhost", 
					 id  : "term" , 
					 on_msg }) 
    
    
    //connect 
    tc.connect()
    
	 
    var send_msg = function(text) { 
	if (tc) {tc.send({text,type:"vcs_text"})}  else { 
            throw(Error("Not connected")) 
	}
    }
    
    return ( <Terminal 
                  startState="maximised" 
                  //watchConsoleLogging
                  descriptions={{show : false }}
            color='green'
            backgroundColor='black'
            barColor='black'
            style={{ fontWeight: "bold", fontSize: "1em" , width :"100%" }}
            commandPassThrough={(cmd, print) => {
                // do something async
                send_msg(cmd.join(" "))
                //need to await the return then print it ... hmm.. 
                on_terminal_msg = print 
    //             print(`-PassedThrough:${cmd}: command not found`);
              }}
            
          />
        
      );
}
