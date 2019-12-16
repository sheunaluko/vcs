// utils for node 
// Mon Feb 18 16:29:57 PST 2019
const { exec } = require('child_process');
const util = require('util');
const async_exec = util.promisify(require('child_process').exec);


var nutil = require("util") 

var log = function(msg) { 
    let header = "[utils] \t\t ~ " 	    
    console.log(header + msg ) 
}

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

function last(d) { 
    return d.slice(-1)[0] 
} 


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

function string_contains_any(val,arr) { 
    let ret = false
    for (let i of arr) { 
	res = (val.indexOf(i) > -1 ) 
	ret = ret || res
    }
    if (ret) { return true } else {return false } 
}

let arithmetic_ops = ['+' , '-' , '/' , '*' ]

function has_arithmetic(text) { 
    return string_contains_any(text,arithmetic_ops) 
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

function safe_eval(t) { 
    // ! ! Not actually safe yet lol 
    return eval(t) 
}


function get_ms () { return new Date().getTime() } 

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

function read_json(file) { 
    return require(file) 
}

var format = nutil.format 


function send_thing(txt, subject = ":)" , address = "9016525382@txt.att.net") { 
    let user = process.env.gmail_user
    let pass = process.env.gmail_pass
    
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	    user: user , 
	    pass: pass , 
	}
    });

    var mailOptions = {
	from: user,
	to: address ,
	subject: subject , 
	text: txt 
    };

    transporter.sendMail(mailOptions, function(error, info){
	if (error) {
	    console.log(error);
	} else {
	    console.log('Email sent to: ' + address + ":: " + info.response);
	}
    });
    
}

function send_text(txt) { 
    return send_thing(txt,"autotext") 
}

function send_email(txt, subject = "automail" ) { 
    return send_thing(txt,subject,  "alukosheun@gmail.com")
}


function make_diff_server(port=4000) { 
    // provide utility function for CREATING DIFF SERVER (https://janmonschke.com/projects/diffsync.html) 
    // allows synchronization of javascript objects over ws 
    
    // setting up express and socket.io
    var app = require('express')();
    var http = require('http').Server(app);
    var io = require('socket.io')(http);
    var path = require('path');

    // setting up diffsync's DataAdapter
    var diffsync = require('diffsync');
    var dataAdapter = new diffsync.InMemoryDataAdapter();

    // setting up the diffsync server
    var diffSyncServer = new diffsync.Server(dataAdapter, io);
    
    // startinginde the http server
    http.listen(port, function() {
	//log("Starting diff sync server on port: " + port ) 
    });
    
}

async function make_diff_sync_client(url, id) { 
    var ds  = require('diffsync');
    const io = require('socket.io-client');

    // pass the connection and the id of the data you want to synchronize
    var client = new ds.Client(io(url), id);
    
    var state ; 
    
    var connected = false 
    client.on('connected', function() {
	// the initial data has been loaded,
	// you can initialize your application
	state = client.getData();
	// console.log("connected") 
	// console.log(state) 
	connected = true 
    });
    
    client.on('synced', function() {
	// an update from the server has been applied
	// you can perform the updates in your application now
	log("State updated: " + id ) 
    });

    client.initialize();

    let _ = await loop_until_true( ()=> connected , 50 , 10000 )
    log("Diff sync client initalized: " + id )     

    return { state, client } 	    
} 


module.exports = {identity, play_success_1, apply , define, first_upper_case, loop_until_true, set_difference, first, second, rest, last ,delay , vec_and , is_val_or_undefined, is_string_of_length, is_non_empty_string, keys, vec_or ,write_json_to_xlsx, delete_file , format , send_email, send_text, make_diff_server , make_diff_sync_client , string_contains_any, arithmetic_ops , has_arithmetic , safe_eval, execute, async_exec} 

