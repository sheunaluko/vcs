//Sun Mar  3 11:36:55 PST 2019


var handleSuccess = function(f) { //f is the audio buffer handler
    return function(stream) {
	var context = new AudioContext();
	var source = context.createMediaStreamSource(stream);
	var processor = context.createScriptProcessor(1024, 1, 1);

	source.connect(processor);
	processor.connect(context.destination);

	processor.onaudioprocess = function(e) {
	    f(e.inputBuffer.getChannelData(0))
	};
    };
}

export function connect(f) {  //f is the audio buffer handler 
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
	.then(handleSuccess(f));
}


