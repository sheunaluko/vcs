
//Sat May  4 01:09:44 PDT 2019
//interface to mongo 
var util = require("./node_utils.js") 
const MongoClient = require('mongodb').MongoClient;
var log = require("./logger").get_logger("vcs_db") 
const params = require("./vcs_params.js").params 


// configure connection url using env vars 
function get_url() { 
    let db_user = process.env.vcs_db_user
    let db_pass = process.env.vcs_db_pass
    let db_host = process.env.vcs_db_host 
    if ( db_user && db_pass && db_host ) { 
	let url =  util.format("mongodb://%s:%s@%s/vcs?authSource=admin",db_user,db_pass,db_host)
	return url 
    } else { 
	log.i("Could not detect database configuration in the environment")
	log.i("Please make sure the following variables are exported in the current environment by editing the appropriate environement file: \n\tvcs_db_user\n\tvcs_db_pass\n\tvcs_db_host")
	log.i("If you wish to run vcs without connecting to a database please use the --no-db option on the command line: i.e. node main.js --no-db")
	process.exit(1) 
    }
}

if (params.using_db) { 
    var client = new MongoClient(get_url(), { useNewUrlParser: true });
} else { 
    log.i("Deferring database connection") 
    var client = null 
} 


async function connect() { 
    if (connected()) { log.i("Already connected") ; return } 
    try {
	log.i("Connecting: ***" ) //+ get_url())
	await client.connect();
	log.i("Connected") 
    } catch (err) {
	log.i("Error connecting") 
	log.i(err.stack) 
    }
}


function connected() { if (client.s.options.servers) { return true } else { return false } } 

async function ensure_connected() { 
    if (! connected() ) { 
	await connect() 
    }
}

async function get_collections() { 
    return await client.db().listCollections().toArray()
}


async function find(coll,query,cursor=false) { 
    await ensure_connected() 
    log.i("Querying collection: " + coll + " with: " + JSON.stringify(query) ) 
    let result  = client.db().collection(coll).find(query)
    if (cursor) { 
	return result 
    } else { 
	return await result.toArray() 	
    } 
} 



async function update_one(coll, match, update ) { 
    await ensure_connected() 
    log.i("Updating collection: " + coll + " with match: " + JSON.stringify(match) + ", and update: " + JSON.stringify(update)) 
    let result = await client.db().collection(coll).updateOne( match ,  {$set : update})
    return result 
}


async function delete_one(coll,match ) { 
    await ensure_connected() 
    log.i("Deleting  from collection: " + coll + " with match: " + JSON.stringify(match))
    let result = await client.db().collection(coll).deleteOne( match ) 
    return result 
}






module.exports = { 
    connect ,
    connected ,
    client  , 
    find , 
    update_one , 
    delete_one , 
    get_collections , 
}
