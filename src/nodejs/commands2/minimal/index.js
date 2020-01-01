let vcs = require(process.env.VCS_DEV_LOC) 

/* 
   Sun Jun 16 20:23:26 PDT 2019
   
   This file Defines minimal commands: 
     - have rules for triggering 
     - run a single function with arguments 
   
   After the array defining the commands, there 
   is a simple transformer which wraps the commands 
   into a base_command instance, then creates the 
   builtins.minimal module for export 
     
*/ 




/* END COMMAND DEFINITIONS HERE */  
/* ---------------------------- */ 

   
/* and finally will create the bundle buy mapping the transform accross the cmds */ 
module.exports = { 
    module : "builtins.minimal"  , 
    bundle : commands.map(transform_minimal) 
}
