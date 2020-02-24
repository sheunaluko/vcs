//Sun Mar  3 11:36:55 PST 2019

export var audio_primitives = { 
	context : null, 
	source : null, 
	processor : null , 
	stream  : null , 

}

var handleSuccess = function(f) { //f is the audio buffer handler
    return function(stream) {

	audio_primitives.stream = stream 

	audio_primitives.context = new AudioContext();
	audio_primitives.source = audio_primitives.context.createMediaStreamSource(stream);
	audio_primitives.processor = audio_primitives.context.createScriptProcessor(1024, 1, 1);

	audio_primitives.source.connect(audio_primitives.processor);
	audio_primitives.processor.connect(audio_primitives.context.destination);

	audio_primitives.processor.onaudioprocess = function(e) {
		f(e.inputBuffer.getChannelData(0))
		//look at audio_detector.js to find buffer processing 
	};

    };
}

export function connect(f) {  //f is the audio buffer handler 
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
	.then(handleSuccess(f));
}

export function disconnect() { 

	let ctx = audio_primitives.context 

	if (ctx) { 
		ctx.close() 
	} 

	audio_primitives = { 
		context : null, 
		source : null, 
		processor : null , 
		stream  : null , 
	
	}
		
}


