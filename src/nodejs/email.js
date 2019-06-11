var args = process.argv.slice(2);


const nu = require("./node_utils.js") 


nu.send_email(args[0],args[1]) 

