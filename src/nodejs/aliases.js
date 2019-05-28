// Sat May  4 16:07:06 PDT 2019
var db = require("./vcs_db.js") 
var log = require("./logger").get_logger("aliases") 

var aliases = {} 

async function get_aliases() { 
    return db.find('aliases' , {})  
} 

async function load_aliases() { 
    log.i("Loading aliases:")
    let _aliases = await get_aliases() 
    var i ;  
    var o ; 
    for (var x=0 ; x < _aliases.length ; x++) { 
	i = _aliases[x].input
	o = _aliases[x].output 
	aliases[i] = o 
	log.i("[ALIASING] " + i + " > " + o)	
    }
    log.i("Done") 
}

function alias_exists(i) { 
    if (aliases[i]) { 
	return true 
    } else { 
	return false 
    } 
}

async function update_alias(i,o) { 
    log.i("Updating alias: " + i )
    if ( alias_exists(i) ) { 
	let result = await db.update_one('aliases', { input : i } , { output : o })
	log.i("Finished: " + result ) 
	await load_aliases()
    }  else { 
	log.i("Alias does not exist") 
    }
}

async function delete_alias(i) { 
    log.i("Deleting alias: " + i )
    if ( alias_exists(i) ) { 
	let result = await db.delete_one('aliases', { input : i } )
	log.i("Finished: " + result ) 
	await load_aliases()
    }  else { 
	log.i("Alias does not exist") 
    }
}

function translate(msg) { 
    let x = aliases[msg]
    if (x) { 
	log.i("Translated: " + msg + " > " + x)
	return x 
    } else { 
	log.i("No aliases found") 
	return msg 
    }
}

module.exports = { 
    aliases , 
    load_aliases , 
    get_aliases , 
    alias_exists , 
    update_alias, 
    delete_alias,
    translate
}
