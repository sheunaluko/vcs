
let util = wrtsm.util 

// will define a function that runs once wrtsm has been loaded 


function main() { 
    
    inject_menuX() 
    //then initialize the action_que extension 
    window.action_que = make_que_container() 
    add_selector("action_que", window.action_que) 
    

    //params 
    var sm_buffer_size = 200 

    // we will create a state machine that we can pipe the raw data from the mic node to 
    var sm = new wrtsm.mods.state_machine({buffer_size : sm_buffer_size, gui_mode:  true } ) 

    // define a sensor that will extract the raw audio data from the state machine 
    function raw_audio_sensor(sm) { 
        let buffer = sm.buffer 
        return util.last(buffer).raw_rms  //the mic_audio object streams objects with field raw_avg 
    }

    // and add the sensor to the state machine 
    sm.add_sensor({ id : "raw"  , f : raw_audio_sensor } ) 

    // create the mic object 
    var mic = new mic_audio() 
    //set the label for recorded events 
    mic.set_label("happy")

    // wire them up 
    var pm = new wrtsm.mods.pipe_manager() 
    pm.connect(mic, sm) 

    // initialize the sm gui & init the mic node 
    var viz  = { "audio" : [ "raw" ]}
    sm.init_gui("wrtsm"  , viz )  // do not forget to put container first ! 
    mic.init() 

    window.mic = mic 


}
