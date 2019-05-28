from base_command import base_command 
import vcs_db as db 

command_info =  {
    'id' : 'new_log' , 
    'rules' : [ 'new log' , 
                'new log [[name]]' ] , 
    'vars' : { 'name' : { 'default_value' : False, 
                          'query' : "What is the log name?"  } } 
} 

class command(base_command) : 

    def __init__(self,opts) : 
        super().__init__(opts) 
        
    def run(self) : 
        name = self.args.name
        self.emit("Creating new log: {}".format(name))
        db.new_log(name) 
        self.emit("Finished")
        self.finish("DONE")
        
        
       


                
