#Fri May  3 17:37:22 PDT 2019
from base_command import base_command
import vcs_db as db 


command_info = { 
    'id'    : 'new_alias' , 
    'rules' : [ "?(create|make) ?(new) alias ?(please)" ] , 
    'vars'  : { "input" : { 'default_value' : False , 
			    'query'         : "What is the input?", 
			    'filter'        : None } , 
		"output" : { 'default_value' : False , 
			     'query'         : "What is the output?", 
			     'filter'        : None}}
}
    

class command(base_command) : 
    
    def __init__(self,opts) : 
        super().__init__(opts) 
        
    def run(self) : 
        self.log.i("Creating new alias") 
        
        #when the program runs we should just validate 
        _in = self.args.input
        _ou = self.args.output

        self.emit( "Confirm that {} will be aliased to {}".format(_in,_ou) ) 
        
        response = self.get_input()
        # validate user result 
        if (response  == "yes") : 
            # the args are correct, so we will send the info to the database 
            result = db.new_alias({'input' : _in , 'output' : _ou })
            self.emit(result)
        elif (response == "no") : 
            self.emit("Exiting")
        else : 
            self.emit("Please say either yes or no. Exiting") 
            
        # end the program 
        self.finish("DONE") 
            
                
       
