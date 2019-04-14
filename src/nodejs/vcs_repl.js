//Thu Mar 28 18:25:09 PDT 2019
var repl = require("repl");
const WebSocket = require('ws');
var log = console.log //require("./logger.js").get_logger("vcs_repl")
var port = 9001 

/* 
   Architecture
   
   The repl is intended to mimic a conversational vcs client but through text on the 
   command line. As background, The conversational approach is implemented by using the
   client.html file in a 
   browser which detects speech using web apis then forwards it to the vcs server via a web 
   socket client. 
   
   For this repl interface approach a nodejs websocket client is instantiated for communicating
   with the vcs web socket server, but rather than a browser generating speech, the user enters 
   the same speech directly into the command line. 
   
   Fortunately, nodejs implements a way to build repls, using the "repl" module. 
   
   Here are the steps this file will take:
   1) Connect to vcs server via websocket connection
   2) When a websocket message is received, print that message to stdout
   3) When the user enters text, forward that message to the server 
   
*/

var pending_callback = null 


//0. Start the repl 
repl_server = repl.start({
    prompt: "vcs>" , eval : _eval , 
})

//1. Connect to the vcs database
let url = "ws://" + process.argv[2]

const client = new WebSocket(url)
client.on('close' , function close() {
    log("Connection closed:: " + url)
})
    
client.on('open' , function() { 
    log("Connected: " + url)
    repl_server.displayPrompt()
})

client.on('error' , function(e) { 
    log("Error: ")
    log(e) 
})

//2. Print messages that are received	  
client.on('message', function incoming(data) {
    let msg = JSON.parse(data) 
    switch ( msg.type) { 
    case  'output' : 
	//log(msg.text) 
	pending_callback(null, msg.text)
	break 
    case 'unrecognized_input' : 
	pending_callback(null, "unrecognized_input")
	break 
    case 'command_result' : 
	pending_callback(null, msg.result)
	break
    default : 
	pending_callback("!unrecognized message type received from remote server:")
	log(data) 
    } 
    
})
	
//3. When user enters text we forward that text 
//define the eval function here
function _eval(cmd, context, filename, callback) {
    if (cmd ==  "\n") { 
	callback(null,null)
	return 
    }
    let type = "vcs_text" 
    let text = cmd 
    client.send(JSON.stringify({type, text})) //forward the text 
    pending_callback = callback 
}
	  
