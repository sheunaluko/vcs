
# Global process vars and parameters for vcs
# passed and set after the websocket client is connected 

import log as  l 
log = l.get_logger("vcs")

process = {} # reflects the vcs node process environment (process.env) 
params = {}  # reflects vcs.params 

def set_params(p) : 
    global params 
    log.i("Setting params: ")
    print(p) 
    params = p  
    
def set_process(p) : 
    global process 
    log.i("Setting process: ")
    print(p) 
    process = p 
