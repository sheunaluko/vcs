# base command class for python 
# abstracts handling interaction with CSI
# Sun Apr 21 12:01:02 PDT 2019, Sheun Aluko
import asyncio 
import state 
import log 
import queue 
import json 
from collections import namedtuple
from  params import params 

# note that the code will appear to be blocking code, but that 
# the command is run in its own thread 
class base_command : 
    
    #constructor for the class     
    def __init__(self,opts) : 
        self.cmd_id = opts['id']
        self.instance_id = opts['instance_id']
        self.log = log.get_logger(self.instance_id) 
        self.log.i("Initializing") 
        #will receive input queue to extract  messages
        #it is wrapped with an input channel to allow filtering 
        self.input = opts['input'] 
        #will receive a queue on which to communicate with websocket
        self.output = opts['output']
        #will set args when instantiated         
        args = opts['args']   
        self.args  = namedtuple("args", args.keys())(*args.values())

    
    # class methods here --------------------
    def cmd_info(self) : 
        info = {'cmd_id' : self.cmd_id , 
                'instance_id' : self.instance_id}
        return info 
        
    def send_ws(self,x) : 
        #just put it into the output queue and voila 
        self.output.put(x) 
    
    def finish(self,arg) : 
        # prepare the WS payload 
        x = {'type' : 'finish', 
             'command_info' : self.cmd_info() , 
             'data'  : {'result' : arg , 'error' : None } } 
        # send it 
        self.log.d("Sending msg: {}".format(json.dumps(x)))
        self.send_ws(x) 
        
    def emit(self,data) : 
        # prepare the WS payload 
        x = {'type' : 'emit', 
             'command_info' : self.cmd_info() , 
             'data'  : data } 
        # send it 
        self.log.d("Sending msg: {}".format(json.dumps(x)))
        self.send_ws(x) 

    def feedback(self,data) : 
        # prepare the WS payload 
        x = {'type' : 'feedback', 
             'command_info' : self.cmd_info() , 
             'data'  : data } 
        # send it 
        self.log.d("Sending msg: {}".format(json.dumps(x)))
        self.send_ws(x) 
        
    def request(self,arg) : 
        #first emit
        self.emit(arg)
        #then read from the input for result 
        #NOTE: it is OK that this is blocking because of sep thread
        # ! CHANGED ! Fri May 24 14:33:37 -05 2019
        #result = self.input.get() 
        result = self.get_input() 
        return result 
    
    def get_input(self) : 
        result = self.input.get() 
        # now we parse what was received 
        if ( result == params['user_abort']) : 
            self.log.i("Received user abort \(o_o)/") 
            self.finish(result)  
            raise ValueError("user_abort") 
        else : 
            return result 
        
    
    def call_command(self,call_info) : 
        # call_info should be {args, command_info} 
        # command_info should be {id, module} 
        # prepare the WS payload 
        x = {'type' : 'call_command', 
             'command_info' : self.cmd_info() , 
             'data'  : call_info  } 
        # send it 
        self.send_ws(x) 
        #get result 
        result = self.get_input()  #have to always use get_input! 
        return result 


