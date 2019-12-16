//Fri Jul 26 21:59:21 PDT 2019
let   mem = require(process.env.VCS_DEV_DIR + "/memory.js") 
const log = require(process.env.VCS_DEV_DIR + "/logger.js").get_logger("interpreter_targets")

function store_variable(opts) { 
    log.i("Received store request") 
    let { name, value } = opts 
    mem[name] = value 
    let msg = "Stored value into memory field " + name + " :"
    log.i(msg) 
    log.i(value) 
    return "OK" 
} 

function get_variable(opts) { 
    log.i("Received get request for: " + opts.name ) 
    let value = mem[opts.name]  
    log.i(value) 
    return value
}


module.exports = { 
    store_variable, 
    get_variable 
} 
