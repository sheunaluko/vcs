
//Sat May  4 01:09:44 PDT 2019
//interface to mongo 
var util = require("@sheunaluko/node_utils") 
const MongoClient = require('mongodb').MongoClient;
var log = require("./logger").get_logger("vcs_db") 
const params = require("./vcs_params.js").params 


// configure connection url using env vars 
function get_url() { 
    let db_user = process.env.VCS_DB_USER
    let db_pass = process.env.VCS_DB_PASS
    let db_host = process.env.VCS_DB_HOST 
    if ( db_user && db_pass && db_host ) {
	log.i(`Connecting to db @ ${db_host} with user ${db_user}`)
	let url =  util.format("mongodb://%s:%s@%s/vcs?authSource=admin",db_user,db_pass,db_host)
	return url 
    } else { 
	log.i("\n\n ***ERROR ***")
	log.i("Could not detect database configuration in the environment")
	log.i("Please make sure the following variables are exported in the current environment by editing the appropriate environement file: \n\tvcs_db_user\n\tvcs_db_pass\n\tvcs_db_host")
	log.i("If you wish to run vcs without connecting to a database, please pass the vcs_server = vcs.server( {db_enabled : false ... }) option when creating the vcs server") 
	process.exit(1) 
    }
}

var client = null 


async function connect() { 
    if (connected()) { log.i("Already connected") ; return } 
    try {
	log.i("Connecting: ***" ) //+ get_url())
	if (params.db_enabled) { 
	    client = new MongoClient(get_url(), { useNewUrlParser: true });
	    log.i("Initiated client object")
	} else { 
	    log.i("Database connection was disabled by user, though VCS attempted to connect. Please enable database by  passing the  vcs_server = vcs.server( {db_enabled : true ... }) option when creating the vcs server ")
	    process.exit(1) 
	    client = null 
	}

	await client.connect();
	log.i("Connected") 
    } catch (err) {
	log.i("Error connecting")
	log.i(err.stack)
    }
}


function connected() { if (client && client.s.options.servers) { return true } else { return false } } 

async function ensure_connected() { 
    log.i("Ensuring connection")
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


async function get_collection({coll,query,cursor}) { 
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
    get_collection, 
}
