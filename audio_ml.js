//transform data from audio events into standardized format 
//in audio.js , can see that the struct saved is [ {rms, freq(256) } ... ] 
//however, the length of each array is variable, so I want to standardize that

//for version 1 will linearly interpolate the spectrogram, getting N samples total 
//will use the everpolate JS file (http://borischumichev.github.io/everpolate/) 
var spectrogram_N = 10 

function get_interpolation_for_bin(num,event) { 
    // the event data structure will be an array of {rms , freq} , where freq is 256 bin spectrum 
    // for interpolation we need an x vector and y vector. The x will simply be the index , while y is the freq @ bin *num* 
    let x = Array.from(event.keys() ) 
    let y = event.map( e => e.freq[num] ) 

    return [x, y]

}

function interpolate_bin(num, event) { 
    var [xs, ys ] = get_interpolation_for_bin(num, event)  
    // we need to choose our interpolation points. The way this works is by: 
    // dividing the length of *event* by N
    let width = event.length / spectrogram_N  
    let num_pts_to_avg =  Math.floor(width )
    let interval = width / num_pts_to_avg
    
    // var interpolation_pts = []
    var interpolation = [] 
    for (var i=0; i< spectrogram_N ; i ++ ) { 
        //so we should generate the points we want to interpolate at 
        var to_interpolate = Array(num_pts_to_avg).fill(0) 
        var sum = 0 , index =0 , result = 0 
        for (var y=0 ; y < num_pts_to_avg ; y ++) { 
            index = width*i + interval*y 
            to_interpolate[y] = index 
            result = everpolate.linear(index, xs, ys  )[0]
            //console.log(result)
            sum  = result + sum 
        }
        interpolation[i] =  sum / num_pts_to_avg
        //console.log(interpolation[i])
    }

    return interpolation
}

function transform_event(e) { 
    var result = [] 
    //for each of the frequencies we will get the interpolation 
    for (var i = 0 ; i < 256 ; i ++ ) {
        result.push(interpolate_bin(i,e))
    }
    return result
}



function to_rgb_data(e ) { 
    const concat = (xs, ys) => xs.concat(ys);
    var data =  e.reduce(concat).map(e => [e,e,e,e]).reduce(concat)

    // Render on screen for demo
    const cvs = document.createElement("canvas");
    cvs.width = 10
    cvs.height = 256 ; 
    cvs.style = "width: 100%; height: 100%; image-rendering: pixelated;"
    const ctx = cvs.getContext("2d");
    const imgData = new ImageData(Uint8ClampedArray.from(data), 10, 256);
    ctx.putImageData(imgData, 0, 0);

    var can = document.getElementById("canvas") 
    while (can.firstChild) { can.removeChild(can.firstChild) } 
    can.appendChild(cvs)

    return imgData
}
