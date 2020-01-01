var DiffSyncClient = window.diffsync.Client 

var port = 9004 

// socket.io standalone or browserify / webpack
var socket = window.io 


var log = function(x) {window.vcs_ui.log(x)}

export function start_sync(id) { 
    log("Initializing sync for: " + id)

    // pass the connection and the id of the data you want to synchronize
    var client = new DiffSyncClient(socket('http://localhost:' + port), id);

    var data; //note this var is outside of below scopes 
    
    //will save the info for debugging 
    //window.globals['subscriptions'][id] = { client, data  }
    
    //  - 
    client.on('connected', function() {
	data = client.getData();

	//update the subscription 
	window.Dispatch( {type : "UPDATE_SUBSCRIPTION" , 
			  payload : { id : id , 
				      data : data } } )


    });

    client.on('synced', function() {
	log("Received sync for: " + id) 
	
	window.Dispatch( {type : "UPDATE_SUBSCRIPTION" , 
			  payload : { id : id , 
				      data : data } } )

    });

    client.initialize();
    log("Link setup completed...") 
    
    return  { client } 
    
}
