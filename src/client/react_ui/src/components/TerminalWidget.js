import React, { Component } from 'react';
import Terminal from 'terminal-in-react';


var log = function(x) {
    window.vcs_ui.log(x);
  };

  
  
export function TerminalWidget() { 


    //init ws and connect with the vcs text endpoint here
    var ws = new WebSocket("ws://localhost:9001");


    var on_msg = function(){}
    var send_msg = function(text) { 
        let type = "vcs_text";
        ws.send(JSON.stringify({ type, text }));
        log("Send ws message: ");
        console.log({ type, text });
    }
        
    //and configure call backs
    ws.onopen = function() {
      log("Terminal Connected to VCS text ws server");
    };

    ws.onmessage = function(m) {
      var msg = JSON.parse(m.data);
      log("Terminal Received message:");

      console.log(msg);

      switch (msg.type) {
        case "output":
          log("Terminal rendering output: " + msg.text);
          on_msg(msg.text);
          break;
        case "unrecognized_input":
          on_msg("What?");
          break;

        case "params":
          break;

        case "command_result":
          log("Terminal got command result:");
          console.log(msg.result);
          //on_msg(msg.result)
          break 

        default:
          log( "Terminal Received unrecognized message type " + msg.type +" from vcs server" ) 

      }
    } 

    ws.onclose = function() {
      log("Terminal websocket CLOSING! !! ");
    };


    return (
                  <Terminal 
                  className="foo"
                  startState="maximised" 
                  //watchConsoleLogging
                  commands={{ "blah" : () => "yo!" } }
                  descriptions={{show : false }}
            color='green'
            backgroundColor='black'
            barColor='black'
            style={{ fontWeight: "bold", fontSize: "1em" , width :"100%" }}
            commandPassThrough={(cmd, print) => {
                // do something async
                //basically query 
                send_msg(cmd.join(" ")) 
                //need to await the return then print it ... hmm.. 
                on_msg = print 
    //             print(`-PassedThrough:${cmd}: command not found`);
              }}
            
          />
        
      );
}