// require all modules on the path and with the pattern defined
const req = require.context("../components/commands/", true, /.jsx$/);

var modules = {} 

req.keys().map(function(n) { 
    var k = n.replace("./","").replace(".jsx","")
    modules[k] = req(n).default 
})

// export 
module.exports = modules





