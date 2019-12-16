
//Sun Mar 10 17:20:01 PDT 2019

/* Parse command line args ------------------------------  */ 

const log = require('./logger.js').get_logger("init")
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')

const optionDefinitions = [
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Display this usage guide.'
  },
  {
    name: 'no-db',
    type: String,
      type: Boolean,
    description: 'Run vcs without connecting to remote database.',
    },
]

const options = commandLineArgs(optionDefinitions)

if (options.help) {
  const usage = commandLineUsage([
    {
      header: 'VCS Usage',
      content: 'VCS is an Open Source, Cross Platform Virtual Assistant'
    },
    {
      header: 'Options',
      optionList: optionDefinitions
    },
    {
      content: 'Project home: {underline https://github.com/sheunaluko/vcs}'
    }
  ])
  console.log(usage)
  return 
} 

/* Done with command line parsing ------------------------------  */ 

log.i("Beginning program initialization") 



if (options['no-db'] ) { 
    log.i("Detected 'no-db' flag, will defer database connection") 
    var params = require("./vcs_params.js").params 
    params.using_db = false 
}

// load vcs  (will load the updated params now) 
var vcs      = require("./vcs.js") 


// load built in commands 
var builtins = require("./commands/index.js")

// load builtins.minimal commands 
var minimals = require("./commands/minimal/index.js") 

// load csi 
var csi      = require("./core_server_interface.js") 

let dev = false 

// add built in commands to vcs core
if (!dev) { 
    
    vcs.core.command_lib.add_command_module(builtins) 
    vcs.core.command_lib.add_command_module(minimals) 
    
    // start vcs wss ,ui ws and core 
    vcs.wss.start() 
    vcs.uis.start()  
    vcs.core.start()

    // start csi (for external commands over websockets) 
    csi.start_server() 
} 

if (dev) {
    vcs.util.make_diff_server(vcs.params.sync_port) 
    vcs.uis.start()  
}

// export file 
module.exports = {vcs , csi } 
