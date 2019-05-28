import log as l

log = l.get_logger("clib") 


lib = {} 

def register(cmd) : 
    id = cmd.command_info['id']
    lib[id] = { 'command' : cmd.command  , 'instances' : {} }
    log.i("Registered command {}".format(id) )
    
    
    
          
          
                        
   # self.cmd_id = opts.id
   #      self.instance_id = opts.instance_id
   #      self.log = log.get_logger(self.instance_id) 
   #      will receive input queue to extract  messages 
   #      self.input = opts.input 
   #      will receive a queue on which to communicate with websocket
   #      self.output = opts.output 
   #      self.args = opts.args   will set args when instantiated 
         
