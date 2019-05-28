from base_command import base_command 
import vcs_db as db 

command_info =  {
    'id' : 'append_to_log' , 
    'rules' : [ 'append ?(to) log ?([[name]])' ] ,
    'vars' : { 'name' : { 'default_value' : False, 
                          'query' : "What is the log name?"  } } 
} 

class command(base_command) : 

    def __init__(self,opts) : 
        super().__init__(opts) 
        
    def run(self) : 
        name = self.args.name
        self.emit("Appending to log: {}".format(name))
        
        # first we will call sub cmd to get text chunk 
        call_info = { 'args' : None , 
                      'command_info' : {'id' : 'get_text_chunk',
                                        'module' : 'builtins' } } 
        text = self.call_command(call_info) 
        
        self.log.i("Got result: {}".format(text))
        self.log.i("Inserting...")
        db.insert_text_into_log(name,text) 
        self.emit("Finished")
        self.finish("DONE")
        
        
       


                
