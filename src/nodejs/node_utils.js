// utils for node 
// Mon Feb 18 16:29:57 PST 2019
const { exec } = require('child_process');
var nutil = require("util") 

var log = console.log

var execute = function(cmd_str) { 
    exec(cmd_str , (err,stdout, stderr) => { 
	if (err) { 
	    log("Exec error: "  + err) 
	  return   
	} 
	return stdout
    })
}


function play_success_1() {
    execute("/Users/oluwa/dev/bin/play_success_1")
}

function apply(f,args)  { 
    return f.apply(null, args) 
} 

function first(d) { 
    return d[0]
} 

function second(d) { 
    return d[1]
} 

function nth(coll,num) { 
    return coll[num] 
}

function rest(d) {  d.slice(1) }    


function range(n) { 
    let ret = Array(n).fill(null)
    for (let i=0; i < n; i ++ ) { ret[i] = i } 
}


function map_dict(dic,f) { 
    //f is a function that takes 
    let ks = keys(dic) 
    let vs = ks.map(k=>dic[k])
    
}


function keys(x) { 
    return Object.keys(x) 
}

function vec_and(v) { 
    let ret = true 
    for (let i of v) { 
	ret = ret && i 
    }
    if (ret) { return true } else {return false } 
}

function vec_or(v) { 
    let ret = false
    for (let i of v) { 
	ret = ret || i 
    }
    if (ret) { return true } else {return false } 
}


function first_upper_case(s) { 
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function identity(x) { return x } 


function test_promise() {
    return new Promise(function(resolve,reject) {
	setTimeout( function(){resolve("Hello!")} , 2000  ) 
    })
}

function sanitize(s) {
    return s.replace(/require/g , "").replace(/function/g , "").replace(/[(,)]/g , "")
}

async function define(_var_name,f) { 
    let var_name = sanitize(_var_name) 
    let tmp_define_result = await f() 
    eval(var_name + " = tmp_define_result")
    log("Defined: " + var_name) 
}

function loop_until_true(f,rate ,timeout) { 
    var t_start = get_ms() 
    let p = new Promise((resolve ,reject) =>   { 
	let id = setInterval( function(){ 
	    let t_now  = get_ms() 
	    if (f()) { 
		//condition is met 
		resolve(false) 
		clearInterval(id) 

	    }  else { 
		let elapsed =  t_now - t_start
		if (elapsed  >= timeout ) { 
		    resolve(true) // reports timeout
		}
	    }
	},rate) 
    }) 
    //return the promise now 
    return p
}


function set_difference(s1,s2) { 
    let ret = new Set() 
    for (let el of s1 ) { 
	if (!s2.has(el) ) {
	    ret.add(el)
	}
    }
    return ret   
}


function delay(ms) { 
    return new Promise( (resolve, reject) => { 
	setTimeout( function() { resolve(true) } , ms )
    })
}


function is_val_or_undefined(x,val) { 
    if ( x == val ) { 
	return true 
    } else if (x == undefined ) {  
	return false 
    } else 
	throw "Error in field: " + x 
}

function is_string_of_length(s,l) { 
    return  ( typeof(s) == 'string' && s.length == l ) 
}

function is_non_empty_string(s) { 
    return ( typeof(s) == 'string' && s.length > 0) 
}


function delete_file(fname) { 
    var fs = require('fs');
    fs.unlinkSync(fname);   
}


function write_json_to_xlsx(d,fname) { 
    var json2xls = require('json2xls');
    var xls = json2xls(d);
    fs.writeFileSync(fname + ".xlsx", xls, 'binary');
    return "OK" 
}

var format = nutil.format 



module.exports = {identity, play_success_1, apply , define, first_upper_case, loop_until_true, set_difference, first, second, delay , vec_and , is_val_or_undefined, is_string_of_length, is_non_empty_string, keys, vec_or ,write_json_to_xlsx, delete_file , format } 

