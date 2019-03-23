//Tue Oct  2 18:06:09 PDT 2018
//General JS utils file 
//would like to try creating soft?hard? links so that the utils files can be shared 


var global_debug = true 

var  log = console.log  

function set_debug(b) {
    global_debug = b 
} 



function bug(tag,...msg) { 
    if (global_debug) { 
	console.log("<- " + tag + " ->" )
	for (var i = 0 ; i < msg.length ; i++) { 
	    console.log(msg[i])
	}
	console.log("<- " + tag + " ->" )
    }
}

function debug(msg) { 
    if (global_debug) {
	console.log(msg) 
    }
}

function and(...args) { 
    var ret = true 
    for (var i=0;i<args.length;i++) { 
	ret =  ret && args[i]
    }
    return ret ? true : false 
} 

function array_and(arr) { 
    var ret = true 
    for (var i=0;i<arr.length;i++) { 
	ret =  ret && arr[i]
    }
    return ret ? true : false
}

function apply(f,args) { 
    return f.apply(null,args)
}

function avg(arr) { 
    var sum = 0;
    for( var i = 0; i < arr.length; i++ ){
	sum += arr[i]
    }
    return sum/arr.length 
}

function multiply(arr) { 
    var ret = 1 ; 
    for (var i =0; i < arr.length ; i++ ) { 
	ret *= arr[i]
    }
    return ret 
}

function rms(arr) { 
    var sum = 0;
    for( var i = 0; i < arr.length; i++ ){
    	sum += arr[i]*arr[i]
    }
    return Math.sqrt(sum/arr.length)
}

function variance(arr) { 
    var _avg = avg(arr)
    var sum = 0 
    for( var i = 0; i < arr.length; i++ ){
	sum += Math.pow(arr[i] - _avg, 2)
    }
    return sum/arr.length 
} 

function std(arr) { 
    return Math.sqrt(variance(arr))
} 

function take(coll,num) { 
    var ret = Array(num).fill(0) 
    for (var i =0;i<num; i++) { 
	ret[i] = coll[i]
    }
    return ret 
} 

function arr_mult(arr,x) { 
    return arr.map( y => y /x ) 
}

function perf(f) { 
    var num_times = 20000
    var results = Array(num_times).fill(0) 
    for (i = 0 ; i < num_times ; i++ ) { 
	var t0 = performance.now();
	var result = f() 
	var t1 = performance.now();
	results[i] = t1 - t0 
    } 
    return avg(results) 
} 

function arr_range(arr) { 
    return apply(Math.max, arr) - apply(Math.min, arr)
}

function range(a,b) { 
    var len = b - a 
    var ret = Array(len).fill(0)  ; 
    for (var i = 0 ; i< len ; i++) {  
	ret[i] = a + i 
    }
    return ret 
} 

function first(d) { 
    return d[0]
} 

function second(d) { 
    return d[1]
} 

function rest(d) {  d.slice(1) }    

export function first_upper_case(s) { 
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export function identity(x) { return x } 

function last(d) { 
    return d[d.length - 1 ] 
} 

function zip_map(ks,vs) { 
    var result = {} 
    for (var i = 0 ; i < ks.length; i ++ ) { 
	result[ks[i]] = vs[i]
    }
    return result
}

function zip(xs,ys) { 
    return xs.map(function(x,i) { 
	return [x, ys[i]]
    }) 
}

function dict_2_vec(d) { 
    var ret = [] ; 
    for (var k in d) { 
	ret.push([ k, d[k] ]) 
    } 
    return ret 
}

function number_or_self(d) { 
    var val = Number(d) 
    if (isNaN(val)) {
	return d 
    } else { 
	return val 
    } 
}

function d_map(d,f) { 
    for (var k in d) {
	d[k] = f(d[k])
    }
    return d 
}

function dict_vals_2_num(d) { 
    return d_map(d,number_or_self) 
}

function diff(d) { 
    var r =   Array(d.length - 1).fill(0) 
    for (var i = 1 ; i < d.length ; i ++ ) { 
	r[i-1] = d[i] - d[i-1]
    }
    return r 
}

function max(d) { 
    var curr_max = d[0] 
    
    for (var i=1;i<d.length;i++) { 
	if (d[i] > curr_max) { curr_max = d[i] }
    } 
    
    return curr_max 
} 

function min(d) { 
    var curr_min = d[0] 
    
    for (var i=1;i<d.length;i++) { 
	if (d[i] < curr_min) { curr_min = d[i] }
    } 
    
    return curr_min
    
} 

function merge(a,b) { 
    var result = Object.assign({},a,b)
    return result
}

function cycle_array(a,v) { 
    a.push(v)
    a.shift() 
    return a 
} 




function loop_fn(coll,fn,num) { 
    var l = coll.length
    var ret = Array(l).fill(0) 
    for (var i=num ; i < l ; i ++) { 
	ret[i] = fn(coll.slice(i-num,i))
    }
    return ret 
} 





function get_series(coll , field) { 
    return coll.map(e=>e[field])
}




function std_percent_diff(arr) { 
    // Meant to be a magnitude normalized average derivative of an array 
    // calculates the vector of percentage differences (consecutive indeces) 
    // then gets the std of those 
    var tmp = Array(arr.length - 1 ).fill(NaN) 
    for (var i =0 ; i < tmp.length ; i ++ ) { 
	tmp[i] =  (arr[i+1]-arr[i])/arr[i]
    }
    
    return std(tmp)
}

function array_percent_diff(a1, a2 ) { 
    var ret = Array(a2.length).fill(0) 
    for (var i=0; i<ret.length; i++) { 
	ret[i] = (a2[i]-a1[i])/a1[i]
    }
    return ret 
} 

function array_log_diff(a1, a2 ) { 
    var ret = Array(a2.length).fill(0) 
    for (var i=0; i<ret.length; i++) { 
	ret[i] = Math.log(a2[i]) - Math.log(a1[i])
    }
    return ret 
} 

function cv(arr) { 
    return std(arr)/avg(arr)
}

function cv_matrix(matrix) { 

    let num_els = matrix[0].length 
    var result = Array(num_els).fill(null)
    
    for (var e =0; e < num_els ; e ++ ) { 
	let el_array = matrix.map( arr => arr[e]  ) 
	result[e] = cv(el_array)
    }
    
    return result
} 

function log_diff_half_buff(buff) { 
    //splits buffer in half, averages two halves, then calcs log diff of both halves 
    let split = Math.ceil(buff.length/2)  
    let fh = take(buff,split) 
    let sh = buff.slice(-(buff.length - split))
    return Math.log(avg(sh)) - Math.log(avg(fh))
}

function spd_matrix(matrix) { 
    // foo
    let num_els = matrix[0].length 
    var result = Array(num_els).fill(null)
    
    for (var e =0; e < num_els ; e ++ ) { 
	let el_array = matrix.map( arr => arr[e]  ) 
	result[e] = std_percent_diff(el_array)
    }
    
    return result
} 

function matrix_map(matrix,f) { 
    let num_els = matrix[0].length 
    var result = Array(num_els).fill(null)
    for (var e =0; e < num_els ; e ++ ) { 
	let el_array = matrix.map( arr => arr[e]  ) 
	result[e] = f(el_array)
    }
    return result
} 

function matrix_mapper(f) { 
    return function(m) {return matrix_map(m,f)}
} 


// define ui utilities now ------------> 

function dom(s) { 
    return document.createElement(s) 
} 

function set_inner_html(d,thang) { 
    if (thang instanceof HTMLElement) { 
	d.appendChild(thang) 
    } else { 
	d.innerHTML = thang 
    } 
    
} 

function flex_row(num,id_base,f) { 
    var container, i 
    container = dom("div")  
    //container.className = "flex-row"  // see styles.css   
    container.style = "display : flex ; flex-wrap : nowrap ; flex-direction : row ; flex-grow : 1 "
        
    for (i =0 ; i < num ; i ++ ) { 
	var d = dom("div") 
	d.style = "flex-grow : 1"
	var html = f(i,d) 
	if (html) { 
	    set_inner_html(d, html) 
	} 
	container.appendChild(d) 
    } 
    return container  
}


/* 
 * Create a flexbox of divs [m,n] in shape 
 * @param {Function} f - accepts row, column, and HTMLelement. Can either mutate the el or return an new el (which will be appended to div at spot r,c) or return String (which will be set to innerHTML) 
 */ 
function make_div_array(m,n,id_base,f) { 
    var container, i 
    
    container = dom("div")  
    //container.className = "flex-column"  // see styles.css  
    container.id = id_base 
    
    container.style = "width: 100% ; height : 100% ; display : flex ; flex-wrap : nowrap ; flex-direction : column "
    
    // now we will add in the child elements 
    for (i =0 ; i < m ; i ++ ) { 
	
	//f is a function which takes a row and column and element 
	//build a function that takes just a col with row hard coded 
	//and returns f(r,col)
	var fn = function(col,el) {
	    return f(i,col,el) 
	}
	
	var new_id_base = id_base + "_" +  i + "," 
	var row = flex_row(n,new_id_base , fn )
	container.appendChild(row) 
    }
    
    return container
    

} 

function id_from_loc(m,n,c) { 
    return c*m + n   // intersing that this function needs arg c, which is (static) number of cols 
}

function test_div_array(m,n) { 
    var f = function(r,c,el) { 
	return (id_from_loc(r,c,n)).toString()
    } 

    return make_div_array(m,n,"foo", f) 
    
} 
	
function app_clear() { 
    var app = document.getElementById("app");
    while (app.firstChild) {
	app.removeChild(app.firstChild);
    }   
}

function app_render(el) { 
    app_clear() 
    var app = document.getElementById("app")  
    app.appendChild(el) 
}

var colors = ["black" , "blue" , "red" , "green" , "yellow" , "orange"]

function get_colors(num) { 
    return take(colors, num) 
}

function now() { 
    return (new Date()).getTime()    
}
///   extensions 


// Array.prototype.first = function(arr) { 
//     return arr[0] 
// }


function click_id(id) {
    let el = document.getElementById(id) 
    console.assert(el) 
    el.click() 
}

function delay(ms) { 
    return new Promise( (resolve, reject) => { 
	setTimeout( function() { resolve(true) } , ms )
    })
}

function get_ms() { 
    return new Date().getTime() 
}

function loop_until_true(f,rate ,timeout) { 
    var t_start = get_ms() 
    let p = new Promise((resolve ,reject) =>   { 
	let id = setInterval( function(){ 
	    let t_now  = get_ms() 
	    if (f()) { 
		//condition is met 
		setTimeout( function() {clearInterval(id)} , 1) 
		resolve(false) 
	    }  else { 
		let elapsed =  t_now - t_start
		if (elapsed  >= timeout ) { 
		    setTimeout( function() {clearInterval(id)} , 1) 
		    resolve(true) // reports an timeout
		}
	    }
	},rate) 
    }) 
    //return the promise now 
    return p
}

function map_indexed(arr,f) { 
    let ret = Array(arr.length).fill(null)
    for (let i = 0; i < arr.length ; i ++ ) { 
	ret[i] = f(i,arr[i])
    }
    return ret 
}

function merge_arrays(...args) { 
    let arr_1 = first(args) 
    
}

function map_dict(dic,f) { 
    //f is a function that takes 
    let ks = keys(dic) 
    let vs = ks.map(k=>dic[k])
    
    
    
}

function assign_to_window(var_name, val) { 
    if (! window[var_name ] ) { 
	window[var_name] = val
    } else { 
	//log("Could not assign: " + var_name ) 
	window[var_name] = val
	log("(Re)Defining: " + var_name ) 
    }
} 

function reload() { 
    window.location  = window.location 
}

export function set_difference(s1,s2) { 
    let ret = new Set() 
    for (let el of s1 ) { 
	if (!s2.has(el) ) {
	    ret.add(el)
	}
    }
    return ret   
}


export function get_logger(name) { 
    let header = "[" + name + "]:: " 
    
    let l = function(t,m) { 
	if (typeof(m) == 'string' ) { 
	    console[t](header + m)   //adds header if string
	}
	else { 
	    console[t](header +"~>")       //if not prints header first 
	    console[t](m)
	}
    }

    let i = function(m) { l("info",m) } 
    let d = function(m) { l("debug", m) } 
    
    return { i, d } 
} 




export { set_debug, bug, debug, and, array_and, apply, avg, multiply, rms, variance, std, take, arr_mult, perf, arr_range, range, first, second, last, zip_map, zip, dict_2_vec, number_or_self, d_map, dict_vals_2_num, diff, max, min, merge, cycle_array, loop_fn, get_series, std_percent_diff, array_percent_diff, array_log_diff, cv, cv_matrix, log_diff_half_buff, spd_matrix, matrix_map, matrix_mapper, dom, set_inner_html, flex_row, make_div_array, id_from_loc, test_div_array, app_clear, app_render, get_colors, now, click_id, delay, loop_until_true, assign_to_window}
