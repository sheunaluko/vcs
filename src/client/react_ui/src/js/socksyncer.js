
import {Client} from './socksync_web_client.js' 


/* 
   GLUE between vcs and socksync API 
 */


var port = 9004
var log = function(x) {window.vcs_ui.log(x)}



export function start_sync(id) { 
    log("Initializing sync for: " + id)

    let on_update = function(data){ 
	log("Got update for id: " + id ) 
	//update the subscription 
	window.Dispatch( {type : "UPDATE_SUBSCRIPTION" , 
			  payload : { id : id , 
				      data : data } } )
    }
    
    // pass the connection and the id of the data you want to synchronize
    let subscribe_id = id 
    var client = new Client({port, subscribe_id , on_update})

    log("Link setup has been initiated...") 
    
    /* 
       we can go ahead and initialize (empty) the state 
       However, there is something to keep in mind 
       If the vcs command has not explicitly initialized its state, then 
       the client above will NOT actually receive a state update 
       (it only receives one when an explicit update is sent). 
       However, the UI detects if the data field below is present in order 
       To render the UI, else it just says "AWAITING STATE". Thus I pre-emptively send 
       a message now to force the rendering of the default UI 
    */

    /*
    window.Dispatch( {type : "UPDATE_SUBSCRIPTION" , 
		      payload : { id : id , 
				  data : {}  }} ) 
				  
				  */
    
    return  { client } 
    
}
