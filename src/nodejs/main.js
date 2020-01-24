//Sun Mar 10 17:20:01 PDT 2019

/* Parse command line args ------------------------------  */ 

const log = require('./logger.js').get_logger("init")
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
var params = require("./vcs_params.js").params 

const optionDefinitions = [
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Display this usage guide.'
  },
  {
    name: 'no-db',
    type: Boolean,
    description: 'Run vcs without connecting to remote database.',
    },
  {
    name: 'no-csi',
    type: Boolean,
    description: 'Run vcs without running client server interface for external commands.',
    },
  {
    name: 'no-ui',
    type: Boolean,
    description: 'Run vcs without running ui server to enable external UI.',
    },

  {
    name: 'no-diff-server',
    type: Boolean,
    description: 'Run vcs without starting the diff server, which creates a web socket endpoint of all command states (this is REQUIRED by UI for state updates)' 
    },

  {
    name: 'only-core',
    type: Boolean,
    description: 'Run vcs with ONLY core functionality (no db, csi, etc..)' 
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
    params.db_enabled = false 
}

if (options['no-csi'] ) { 
    log.i("Detected 'no-csi' flag, will defer server launch") 
    params.csi_enabled = false 
}

if (options['no-ui'] ) { 
    log.i("Detected 'no-ui' flag, will defer ui server launch") 
    params.ui_server_enabled = false 
}

if (options['no-diff-server'] ) { 
    log.i("Detected 'no-diff-server' flag, will defer diff server launch\nNote that this will break UI interface") 
    params.diff_server_enabled = false 
}

if (options['only-core'] ) { 
    log.i("Detected 'only-core' flag, the following will NOT be launched:\ndb, csi, ui, diff-server")
    params.using_db = false     
    params.csi_enabled = false     
    params.ui_server_enabled = false     
    params.diff_server_enabled = false 
}



// load vcs  (will load the updated params now) 
var vcs      = require("./vcs.js") 

// load command modules
var cmd_parser = require("./utilities/command_parser.js")
let {modules,ui} = cmd_parser.parse_command_dir()
// add command modules 
vcs.add_command_modules(modules) 


// migrate the ui files  and start file watcher 
cmd_parser.migrate_ui_files() 
if (true) { 
    var watcher = cmd_parser.watch_command_dir() 
}



//start vcs 
console.log("\n") 
log.i("Will initialize vcs core with the following parameters:") 
console.log(params) 
console.log("\n") 

vcs.initialize() 

console.log("\n -- \n") 
