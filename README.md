*NOTE: Version 2.0 under heavy development, please email for details* 

VCS (Voice Control System) allows you to use your voice to control your computer in arbitrary ways (by writing your own voice
commands)... interacting both with information from the web or with programs running locally on your computer.
Javascript and python are built into VCS and can be readily started with. Other languages are possible as well. 

VCS is installed via npm. To get started, follow the instructions below. 

---

First create a new npm project and install vcs

```
mkdir vcs_test ; cd vcs_test; 
npm init; #this command will prompt you with several questions, the defaults are OK 
npm install @sheunaluko/vcs; 
``` 

Now, put the following into a file named **test.js**: 

```javascript 
// require vcs
vcs = require("@sheunaluko/vcs")

vcs_server = vcs.server( {db_enabled : false ,
			  ui_server_enabled : false,
			  csi_enabled : false } )


// create some commands now
let minimal_commands = [

    { id : "are you there" ,
      rules : [ "are you ?(there|listening|here)" ,
		"hello"  ] ,
      fn : (args) => {
	  return "yes"
      }
    },

    { id : "request time" ,
      rules : [ "what time is it ?(please)" ,
		"?(please) tell me the time ?(please)" ,
		"what's the time",
		"time ?(please)" ]  ,
      fn : (args) => {
	  let d = new Date()
	  return (d.getHours() % 12) + ":" + ( d.getMinutes() )
      }
    },

    { query : "how are you" ,
      response : [ "pretty good" ,
		   "fantastic" ,
		   "been better",
		   "ask me in 5 minutes",
		   "well lets just say today was a bit rough",
		   "come on, you know computers dont have emotions" ,
		   "you should know you made me",
		   "why do you care" ,
		   "why dont you write a program to find out smart ass"
		 ] }
]

//and add them
vcs_server.add_command_module( {module : "minimals", bundle: minimal_commands })


// initialize the server
vcs_server.initialize()

// initialize the client (for browser based microphone access)
vcs_client = vcs.client({port : 8001})
vcs_client.start()

``` 

Finally, get started by running: 

```
node test.js #now navigate your web browser to "localhost:8001" and say, "Are you there?" 
```

Please note, this is just the tip of the iceberg. The above commands are known as "simple" commands, and most notably,
they do not note store stateful information and thus it is not possible to write interactive voice commands with them. 
VCS was built for interactivity however, and thus ships with the **vcs.base_command** class which allows for the 
creation of arbitrary commands which maintain state and which can **call and await on results from other defined commands**.
Here is an example of an echo command in **echo.js** 

```javascript
let vcs = require("@sheunaluko/vcs")
let id = "echo"

class echo extends vcs.base_command { 
    
    constructor(config) { 
	super({id})
    }
    
    /* 
       All commands have a static method returning their info (used for initialization)
       The 'rules' field below defines how the user can trigger the command, and supports 
       An expressive syntax (the '?' indicates please is optional) 
    */
    static get_info() { 
	return {
	    id    : id , 
	    rules : [ "echo" , "start echoing me ?(please)"],
	    vars     : null 
	}
    } 
    
    /* 
       All commands must implement the async run method
       Because all commands are asynchronous, they do not block the nodejs runtime while waiting for user input 
    */      
    async run() { 
	this.feedback("continue") //this triggers a feedback sound to acknowledge the command is running 

	while(true ) {
	    
	    let text = await this.get_input() 
	    if (text == undefined || text == "finished") { break } //this will end the command IF the user says 'finished'
	    
	    this.emit("You said " + text )  //this will echo the user input 
	    
	}
	
	//this will execute when the program breaks out of the above while loop 
	this.finish({result : "OK" } )
    } 
    

}

module.exports = echo 
```

Finally, in order to define your own commands (like echo.js above) and add them to vcs, I recommmend using the following pattern: 

```javascript 
// require vcs
vcs = require("@sheunaluko/vcs")

vcs_server = vcs.server( {db_enabled : false ,
			  ui_server_enabled : false,
			  csi_enabled : false } )


custom_module = { module : "my_commands" , //can name the module however you want 
                  bundle : [ require("./path_to_command_like_echo.js_above") , 
	                     require("./path_to_command_like_echo.js_above")  ] } 
			  
//add commands
vcs_server.add_command_module( custom_module ) 

// initialize the server
vcs_server.initialize()

// initialize the client (for browser based microphone access)
vcs_client = vcs.client({port : 8001})
vcs_client.start()

``` 


Contact: oluwa@stanford.edu or alukosheun@gmail.com
