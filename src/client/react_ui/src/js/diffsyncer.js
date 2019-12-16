var DiffSyncClient = window.diffsync.Client 
var vcs = window.vcs 
var port = 9004 

// socket.io standalone or browserify / webpack
var socket = window.io 


export function start_sync(id , ui_element) { 
  vcs.log("Attemping to link data elements for: " + id)

  // pass the connection and the id of the data you want to synchronize
  var client = new DiffSyncClient(socket('http://localhost:' + port), id);

  var data;
  client.on('connected', function() {
    data = client.getData();

    ui_element.__vue__._data.state = data  


    // get the ui_elements state and assign it 
    vcs.log("Linked data elements for: " + id)

  });

  client.on('synced', function() {
    vcs.log("Received sync for: " + id) 
    ui_element.__vue__._data.state = data  
    //console.log(ui_element)

  });

  client.initialize();
  vcs.log("Link setup completed...") 
}
