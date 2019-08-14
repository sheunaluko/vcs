VCS (Voice Control System) allows you to use your voice to control your computer in arbitrary ways (by writing your own voice
commands)... interacting both with information from the web or with programs running locally on your computer.
Javascript and python are the built into VCS and can be readily started with. Other languages are possible as well. 

---

VCS is installed via npm. To get started, follow the instructions below. 

First create a new npm project and install vcs

```
npm init; #answer the questions 
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

Contact: oluwa@stanford.edu or alukosheun@gmail.com
