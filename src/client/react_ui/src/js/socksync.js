/* 
    socksync interface to vcs 
    Tue Jan 28 11:23:39 PST 2020
*/ 

import {Client} from './socksync_web_client.js'  ; 


export function  start_sync({id, on_change}) {
    let subscribe_id = id 
    var on_update    = on_change || function(d) { 
	console.log("GOT CHANGE:")
	console.log(d) 
    }
    var client = new Client({subscribe_id, on_update})
    return client 
}


window.socksync = Client 
window.start_sync = start_sync 
console.log("loaded socksync" )

