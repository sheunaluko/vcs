/* 
    UI interface to vcs 
    FIRST PASS 
    Sat Jun 29 22:08:22 PDT 2019
    adapted from vue to react on Tue Dec 17 17:13:28 EST 2019

*/ 

import {start_sync} from './diffsyncer.js'
import cmd_manifest from './command_manifest.js' 

if (! window.vcs_ui ) { 
    window.vcs_ui = {} 
}

var log = function(msg) {
    console.log("[vcs_ui] \t\t ~ " + msg);
  };

function init() { 
    log("Initializing")
    window.vcs_ui.log = log 
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
      
      window.Dispatch({type : "ADD_ACTIVE_ID" , payload : {id} })
      
      //init the sync a
      var {client}  = start_sync(id)   //returns the sync client  
      window.Dispatch({type : "ADD_SYNC_INFO" , payload : {  client,  id } }) 
      
	  
      break;
      
  case "command_finish":
      var id = msg.id;
      log("Received command finish for: " + id);
      
      window.Dispatch({type : "REMOVE_ACTIVE_ID" , payload : {id} })
      window.Dispatch({type : "REMOVE_SUBSCRIPTION" , payload : {id} })      
      break;      
      
      
      
    default:
      log("Unrecognized message type:" + msg.type);
  }
};

