//Sun Nov  4 17:53:20 PST 2018

var global = {} 


//define the success callback here (connect micNode to analyser node)  
function success(e){
    console.log("Mic connected") ; 
    sampleRate = this.context.sampleRate 
    //now get the mic in stream
    micNode = this.context.createMediaStreamSource(e) ; 
    micNode.onaudioprocess = function(data) {
    	console.log(data)
    } 

    var bufferSize = 2048
    // setup a javascript node
    javascriptNode = this.context.createScriptProcessor(bufferSize, 1, 1);
    // connect to destination, else it isn't called
    javascriptNode.connect(this.context.destination);

    // setup a analyzer
    analyser = this.context.createAnalyser();
    analyser.smoothingTimeConstant = 0.3;
    analyser.fftSize = 512;

    // when the javascript node is called
    // we use information from the analyzer node
    javascriptNode.onaudioprocess = (function(e) {
        global.raw = e.inputBuffer.getChannelData (0);

        global.freq =  new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(global.freq);

        var mode = 'raw'   //allows for switching which data is forwarded 
        var to_merge = null ; var val =  null
        var rms = wrtsm.util.rms(global.raw) 
        switch (mode) { 
            case 'raw' : 
                val = rms 
                to_merge =  { raw_rms : val }  ; 
                break ; 
            case 'freq' : 
                val  = global.freq
                to_merge =  { freq_array : val }  ; 
                break ; 
        }

        // keep track of values in history buffer 
        this.shift_history({ 'rms' : rms , 'freq' : global.freq })

        //create data packet which includes current current time  
        var packet = { time : (new Date).getTime() / 1000 - this.start_time  } 

        //call the data handler , by merging the relevant data into the default packet 
        var to_send = Object.assign(to_merge , packet  ) 
        //console.log(to_send)
        if (this.streaming) { 
            this.data_handler(to_send) 
        }

        //for event detection 
        //first check if we are recording an event 
        if (this.recording_event) { 
            // RECORDING an event 
            //then check if the sound is above threshold  
            if (rms >= this.rms_thresh) { 
                // append the current to current event
                this.append_current_event({'rms' : rms , 'freq' : global.freq}) 
                // and we should clear the event timeout  
                clearTimeout(this.event_timeout)
                // and set a new one 
                this.event_timeout = setTimeout( (function() {this.flush_current_event()} ).bind(this) , this.event_decay ) 
                //console.log("set timeout: " + this.event_timeout)
            } else {
                // threshold is below.. so we continue appending but do not clear the timeout 
                this.append_current_event({'rms' : rms , 'freq' : global.freq})
            }
        } else {  
            // NOT RECORDING an evnet  
            // if sound above threshold then we copy the history into the current event and start recording 
            if (rms >= this.rms_thresh )  { 
                this.log("Detected event!")
                this.copy_history_to_current_event()  
                this.append_current_event({'rms' : rms , 'freq' : global.freq}) // append curr value
                this.recording_event = true  // set recording to true 
                this.event_timeout = setTimeout( (function() {this.flush_current_event()} ).bind(this) , this.event_decay ) 

            } else { 
                //not recording and we are below threshold .. 
                //do nothing ! 
            }
        }

        
    }).bind(this)
    
    //connect the micNode to analyser 
    micNode.connect(analyser) ; 
    //connect analyzer to javascript node (so graph updates) 
    analyser.connect(javascriptNode);

}

class mic_audio {
    constructor() { 
        this.context  = new AudioContext();
        this.start_time  = (new Date).getTime() / 1000 
        this.log_process = true 
        this.history_size = 10 
        this.event_decay = 300 
        this.history =  (new Array(this.history_size).fill(NaN))
        this.streaming = true 
        this.events = [] 
        this.current_event  = [] 
        this.rms_thresh = 0.025
        this.recording_event = false 
        this.continue_recording = true 
	this.keep_events = true 
        this.event_timeout = null 
        this.data_handler = function(d) { if (this.log_process) {console.log("Processed data") } } 
    }  

    init() { 
        if (navigator.getUserMedia){
        	navigator.getUserMedia({audio:true}, success.bind(this), function(e) {
    	    alert('Error capturing audio.');
        	});
        } else alert('getUserMedia not supported in this browser.');
        
    }

    log(d) {
        console.log("[audio]:: " + d)
    }

    shift_history(d) { 
        this.history.push(d)
        this.history.shift() 
    }
    
    append_current_event(d) { 
        this.current_event.push(d)
    }

    set_data_handler(f) { 
        this.data_handler = f 
    }

    stop_stream() { 
        this.streaming  = false 
    }

    start_stream() { 
        this.streaming = true 
    }
    
    set_label(l) { 
	this.ml_label = l 
    }
    
    save_event(e,l) {
	let label = "vcs_events_" + l + "_" + (new Date()).getTime() 
	localStorage.setItem(label, JSON.stringify(e) )
    }
    
    flush_current_event() { 
	let e = this.current_event
	let t = transform_event(e)
	if (this.keep_events) { 
	    this.events.push( t )
	    // now at this point we will link to the action que for LS saving 
	    action_que.que_object("VCS: " + (new Date()).getTime(), (function() {this.save_event(t,this.ml_label)}).bind(this) )
	    this.log("Added new event!")
	} 
        wrtsm.mods.ui.multi_line_graph("event" , { title : "last_event" , ys : [ this.current_event.map(e => e.rms) ] } ) 
        to_rgb_data(t)

        this.current_event = []
        this.recording_event = false 
    }
    
    get_events(l) { 
	let filt = "vcs_events_" + l
	let names = Object.keys(localStorage).filter( s => s.includes(filt )) 
	return names.map( (n) => JSON.parse(localStorage.getItem(n)) )
    }

    get_events_old() { 
        let event_data = localStorage.getItem("vcs_events")  
        var events  = null 
        if (event_data) { 
            events  = JSON.parse(event_data)
        } else { events = {} } 
        return events 
    }

    save_events_with_label(l) { 
	// OLD OLD !! DOESNT WORK 
        let events = this.get_events() 
        if (! events[l] ) { 
            events[l] = [] 
        } 

        for (var i=0; i< this.events.length ; i ++ ) { 
            events[l].push(this.events[i] )
            this.log("Added event: " + i)
        }

        localStorage.setItem("vcs_events" , JSON.stringify(events) ) 
        this.log("Events saved to local storage")

    }
    copy_history_to_current_event() { 
        for (var i =0 ; i < this.history.length ; i ++ ) { 
            this.append_current_event(this.history[i])
        }
    }

    stop_audio_log() {this.log_process = false}
    start_audio_log() {this.log_process = true}

}

