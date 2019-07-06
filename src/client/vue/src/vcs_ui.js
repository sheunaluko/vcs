/* 
    UI interface to vcs 
    Sat Jun 29 22:08:22 PDT 2019
*/ 

import {start_sync} from './diffsyncer.js'

if (! window.vcs ) { 
    window.vcs = {} 
}
var vcs = window.vcs 

var log = function(msg) {
    console.log("[vcs_ui] \t\t ~ " + msg);
  };

function init() { 
    log("Initializing")
    vcs.log = log 
}

init() 

/* eslint-disable */

/* 
  Connect to the vcs ui WS endpoint 
  */
// eslint-disable-next-line
var vcs_ui_connection = new WebSocket("ws://localhost:9003");
vcs_ui_connection.onopen = function() {
  log("Connected to vcs UI port");
};

vcs_ui_connection.onmessage = function(event) {
  var msg = JSON.parse(event.data);
  switch (msg.type) {
    case "command_initialization":
      var id = msg.id;
      log("Received command initialization for: " + id);
      var cmd = id.split("_").slice(0,-1).join("_");
      log("Retrieving UI for: " + cmd);
      init_cmd_ui({cmd,id}) 
      break;
    default:
      log("Unrecognized message type:" + msg.type);
  }
};



function init_cmd_ui(opts) { 
    var {cmd,id }  = opts
    /* 
        Two things need to happen
        1. The template for the command is found and rendered 
        2. The data for the ui is LINKED to the data for the vcs command 
    */  

    if ( Object.keys(vcs.swapper_interfaces).indexOf(cmd) < 0 ) { 
        log("Could not find matching interface for cmd: " + cmd)
        return 
    } else { 
        //1 
        log("Found matching command interface for: " + cmd) 
        set_swapper_ui(cmd) 

        //2 
        var checkExist = setInterval(function() {
            log("Checking for interface mount:")
            var el = document.getElementById(cmd)
            if (el) {
               clearInterval(checkExist);
               start_sync(id,el)
            }
         }, 500);

    }

}



function set_swapper_ui(id) { 
    var sw = document.getElementById("swapper")
    sw.__vue__._data.current = id 
    log("Set swapper ui to: " + id)
}


vcs.fns =  { set_swapper_ui }
