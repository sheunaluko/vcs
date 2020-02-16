//Sun Mar  3 16:01:13 PST 2019
import * as util from "./utils.js" 
import * as speech from "./speech.js"

let log = util.get_logger("tts") 

export var tts = window.speechSynthesis;
export var speech_que = []

export function is_speaking() { 
    return tts.speaking
}

export async function finished_speaking() {
    let timeout = await util.loop_until_true(()=>!tts.speaking,200,1000*60)
    return timeout 
}

export async function speak(text) { 
    log.d("Request to speak: " + text) 
    if (! tts.speaking) { 
	speech.stop_recognition()
	var utterance  = new SpeechSynthesisUtterance(text);
	utterance.voice = tts.getVoices()[49] 
	//utterance.pitch = pitch.value;
	utterance.rate = 1.2;
	tts.speak(utterance); 
	let _ = await finished_speaking() 
	let next = speech_que.shift() 
	if (next) { speak(next) } else { 
	    speech.start_recognition()
	}
    } else { 
	log.d("Scheduling speech for later.")
	speech_que.push(text)
    }
}




