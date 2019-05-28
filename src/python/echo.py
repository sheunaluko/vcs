from base_command import base_command 
import time 

command_info = {
    'id' : 'echo' , 
    'rules' : [ '?(please) start echoing ?(me)' ] , 
    'vars' : None 
}
     
    
class command(base_command) : 
    
    def __init__(self,opts) : 
        # pass on the opts to the base class 
        super().__init__(opts) 

    # the main run function for the command
    def run(self) :
        self.log.i("Running")
        self.emit("OK")
        while True : 
            # wait for next message 
            # can write blocking code b/c will be run inside thread
            text = self.call_command({'args' : {} , 'command_info' : { 'id' : 'get_text_chunk' ,
                                                                       'module' : 'builtins'}})
            
            #text =self.get_input() 
            self.log.i("Received msg: {}".format(text))          
            if text == "finished" : 
                self.emit("EXITING")
                break 
            else : 
                self.emit("You said: {}".format(text))
                time.sleep(5)

        # at this point we are done 
        self.finish("DONE")

                       


            
            

        
