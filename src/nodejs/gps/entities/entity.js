


class Entity { 
    
    constructor({entity_id}) { 
	
	this.log = require(require("path").join(process.env.VCS_DEV_DIR, "logger.js")).get_logger(entity_id)

    }
    
    //for errors  
    catch_error(e) {
	this.log.i("Got error:\n" + e ) 
	//will decide if I want it to throw or not ? 
	//right now they will never throw 
	//probably need to throw at some point though 
	console.error(e.stack) 	
    }
    
    
    
}


module.exports = { 
    Entity , 
}


