


var log  = (x) => console.log("[js_sound] ~  " + x ) 



// for cross browser compatibility
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

export function play_sound({f,l, d=0}) {
     let osc = audioCtx.createOscillator();
    osc.type = 'sine'  ; 
    osc.frequency.value = f ; 
     osc.connect(audioCtx.destination);
    
    setTimeout( function() {
	osc.start();
	osc.stop(audioCtx.currentTime + l);
    } , d) 
}


let ddur = 0.1 //default duration 
export var sound_map = { 
    "success" :  [ {f : 554 , l : ddur }  ,  {f : 440 , l : ddur } ] , 
    "continue" : [ {f : 440 , l : ddur*0.6  },  {f : 659 , l : ddur , d :300  }  ]  , 
    "unrecognized" :  [ {f : 420 , l : ddur }  ,  {f : 440 , l : ddur } ] , 
    "error" :  [ {f : 440 , l : ddur }  ,  {f : 523 , l : ddur } ] , 
    "ready" :   [ {f : 440, l : ddur } ] , 
}

export function trigger(s) { 
    return function() { 
	log(s) 
	//play the sound 
	let to_play = sound_map[s] 
	to_play.map(s => { 
	    play_sound(s) 
	})
	
    }
}

export var sounds = { 
    "success" : trigger("success")  , 
    "continue" :  trigger("continue") , 
    "unrecognized" : trigger("unrecognized") , 
    "error" : trigger("error") , 
    "ready" : trigger("ready") 
}


window.play_sound = play_sound
