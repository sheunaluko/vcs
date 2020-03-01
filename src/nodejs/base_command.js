//Sun Mar 10 11:44:54 PDT 2019
const channel = require("./channel.js");
var vcs_state = require("./vcs_state.js");
var log = require("./logger.js");
var core = require("./vcs_core.js");
var R = require("./ramda.js");
var params = require("./vcs_params.js").params;
var ui = require("./vcs_ui_server.js");

var debug = null;

class base_command {
  constructor(opts) {
    let { id, initial_state, filters } = opts;

    this.cmd_id = id;
    this.initial_state = initial_state;
    this.instance_id = this.cmd_id + "_" + vcs_state.unique_id(); //assing unique instance id
    this.log = log.get_logger(this.instance_id); //assign logger

    this.input = new channel.channel({
      type: "in",
      cmd_ref: this,
      filters: filters
    }); //the input which the command will listen on
    //vcs_core will route speech information into this channel when appropriate

    //we also will give the channel a reference of the command, so that it can modify the
    //command object when necessary
    this.input_counter = 0; //the input channel will increment this each time it gets input

    this.output = new channel.channel({ type: "out", cmd_ref: this }); //channel for the command to do IO (eg. tts,print)

    //channel that will be written to when the command is finished
    this.sink = new channel.channel({ type: "sink", cmd_ref: this });

    /* 
	   Sat Jun 29 17:09:26 PDT 2019
	   Each command has a special "state" object which it can read and write from 
	   Encapsulation of the state is helpful because under the hood vcs is running a 
	   diffsync server (https://github.com/janmonschke/diffsync). 
	   The server allows any websocket clients to connect and subscibe to the IDs 
	   of any command, thus retriving that commands STATE, as well as having a synchronized JSON 
	   object of that state. This feature was implmented when designing the UI for vcs. I wanted  
	   a way for a command to communicate with a UI without having to couple the command workings with 
	   an external ui interface. Instead, it seemed natural for a command to modify a STATE variable, which 
	   the UI could subscribe too (as in vue.js). 
	   Theoretically, the best UI should simply be a function of some state
	 */
  }

  /* methods ----------------------------------------  */

  async init_state() {
    let info = this.constructor.get_info(); //static method

    if (true) {
      this.state = await vcs_state.create_state(this);

      if (this.initial_state) {
        this.log.i("+ init state");
        this.state.set_initial_state(this.initial_state);
      }

      this.log.i("Created state");

      //after we create the state we will notify the ui (if connected) that the command has launched
      ui.command_launched(this.instance_id);
    } else {
      //CAN CONSIDER MODIFICATIONS HERE IN FUTURE
      //this.log.d("Detected minimal command and so will not initialize state ++sustainability :)")
    }
  }

  finish(opts) {
    let { payload, error } = opts;

    //can we clean up the commands state here
    this.log.d("Cleaning up command state");
    delete vcs_state.command_states[this.instance_id];

    //and then we have to pop the stack
    this.log.d("Removing command from stack");
    core.stack.pop();

    //and then wrte write the result to the sink channel
    this.log.d("Writing result to sink channel");
    if (false) {
      //for debug
      this.log.d("Connected sink is:");
      console.log(this.sink.connected_sink);
    }

    //slight modifcations to the object here
    //in general
    this.sink.push({ id: this.instance_id, payload });
    this.sink.close();

    if (false) {
      //for debug (can skip the sink and go directly to receiver)
      this.log.d("Writing result directly to connected_sink");
      this.sink.connected_sink.push(payload.result);
    }

    //ui
    ui.command_finished(this.instance_id);

    this.log.d("Deleting object");
    delete this; //lmao i dont know if this line even does anything  :/ but i like it
  }

  emit(_data) {
    // modifying to only allow OBJECT emissions  (not strings) , for
    // gaining flexibility of client side response to emissions
    this.log.d("Emit> ");
    this.log.d(_data);
    let id = this.instance_id;

    //if data is a string then will wrap it in an object with text
    //otherwise will pass it as is
    var data = null;
    if (_data.constructor == String) {
      //wrap in object
      data = {
        type: "text",
        payload: _data
      };
    } else if (_data.constructor == Object) {
      data = _data;
    } else {
      throw "Ooops... please only emit a string or an object!";
    }

    //add the id
    data.id = id;
    this.output.push(data);
  }

  feedback(_data) {
    /* modifying the feedback mechanism - Sat Feb 29 14:21:21 PST 2020
			To communicate using obj/json instead of string keywords 
			see emit modification above also 
		  */

    let data = { type: "feedback", payload: _data };
    this.emit(data);
  }

  async get_input() {
    //commands will call this fn to get their input
    this.log.i("Awaiting input...");
    //console.trace("INPUT TRACE"); for debugging
    let data = await this.input.shift();
    this.log.i("Got input...");
    this.log.d(data);
    if (data == params.user_abort || (data.payload && data.payload.abort) ) {
      this.log.i("Received user or cmd abort \(o_o)/");
      let error = false;
      this.finish({ payload: { result: null , abort : true  }, error });
      throw "user_abort";
    } else {
      this.log.i("returning result");
      return data; 
    }
  }

  async request(arg) {
    this.log.d("Request> " + arg);
    this.emit(arg);
    let res = await this.get_input();
    this.log.d("Got> " + res);
    return res;
  }

  //interface to vcs_core
  async call_command(call_info) {
    core.initialize_command(call_info); //this will add command to the stack
    //now we listen on the input channel for when the above command returns

    /* we are gonna call this.get_input. however   
	   1) in user mode the return will be text string
	   2) for sub command mode, return may be {id,payload} 
     */

    let data = await this.get_input();

    if (data.constructor == String) {
      return data; //
    } else {
	  var { id, payload } = data;
	  this.log.d("RETURNING DATA") 
      return data 
    }
  }

  //interface to vcs_core FOR CSI adapter
  //because of the CSI architecture -- it needs to be able to launch a command
  //without launching ANOTHER listener on the input port (since there is a continuous
  //listener already to allow relaying to the client (note difference from call_command above)
  launch_command(call_info) {
    this.log.i("'Launching' command w/o extra listener");
    core.initialize_command(call_info);
  }
}

module.exports = { base_command };
