#Thu Apr 18 04:08:09 PDT 2019
#Allow vcs commands to be written in python 
import asyncio
import websockets
import json 
import aiochan as ac 
from threading import Thread
import concurrent.futures
import utils as u 
import time 
import command_library as clib 
import log as  l 
import queue 
from  params import params 
import vcs

# - init
port = 9002 

u.register("csi_adapter")

module = 'python' #the vcs module name that will be registered

log = l.get_logger("csi")


# - define on config callback (for setting configuration) 
def on_config(msg) : 
    # should receive both process config and param config  
    log.i("Retrieved config message") 
    vcs.set_params(msg['params']) 
    vcs.set_process(msg['process']) 
    register_all()    
    
# - define connect callback 
async def on_connect(ws) : 
    await ws.send(json.dumps({'type' : 'register' , 'id' : module }))


# define some message handlers 

def handle_init(msg) : 
    # will find, instantiate, and RUN a command in a new thread, 
    # also creating and supplying an input and output (ws) 
    # and storing info clib
    # - parse call info 
    call_info    = msg['call_info']
    id           = call_info['id'] 
    instance_id  = call_info['instance_id'] 
    args         = call_info['args']
    # - notify 
    log.i("Received init msg for: {}".format(id))    
    # - find command class
    command      = clib.lib[id]['command']
    if ( command is  None ) : 
        log.e("Could not find command: {}".format(id)) 
        return None 
    else : 
        # - found it 
        # - create the cmd run function 
        def cmd_fn(cmd,opts) : 
            # instantiate the cmd with the opts 
            instance = cmd(opts)
            # and call the run function in a blocking fashion 
            # keeping in mind that it can ERROR 
            try :
                log.i("Running cmd: {}".format(instance_id))
                instance.run()  
                log.i("Cmd finished: {}".format(instance_id))
            except ValueError as error : 
                log.i("Caught error: {}".format(error))
                
            # after the run completes we delete the instance 
            del instance 
            log.i("Deleted cmd instance: {}".format(instance_id))
            # and return 
            return 
        # - create the opts object 
        in_ch = queue.Queue()
        opts = { 'instance_id' : instance_id , 
                 'id'          : id , 
                 'input' : in_ch , 
                 'output' : ws.i ,  # pass the ws input queue 
                 'args'   : args } 
        # - and now we start the command in new thread
        cmd_thread = Thread(target=cmd_fn, args=(command,opts))
        # - and  we store the info into clib 
        clib.lib[id]['instances'][instance_id] = { 
            'thread' : cmd_thread , 
            'ch'     : in_ch 
        } 
        # - and start the thread 
        cmd_thread.start() 
        log.i("Cmd thread started") 
        
        
def handle_text(msg) : 
    log.i("Handling text")
    # must figure out where to route text
    id = msg['id'] 
    instance_id = msg['instance_id'] 
    log.i("Finding ch for {} > {}".format(id, instance_id))
    # attempt to get the channel 
    ch = clib.lib[id]['instances'][instance_id]['ch']
    # - 
    if (ch is None ) : 
        log.e("Could not find channel!")
        return 
    else : 
        # - found the channel , so will send the text through it :) 
        ch.put(msg['data']) 
        log.i("Put text in channel.") 
        
    
# - :) 
def on_msg(message) : 
    msg = u.json_or_string(message) 
    log.i("Received msg: " + json.dumps(msg))
    
    if (type(msg) == str ) : 
        return 
    
    if (msg['type'] == 'init_command') : 
        # handle init
        handle_init(msg)
    elif (msg['type'] == 'config' ) :         
        # handle parameter configuration
        on_config(msg) 
    elif (msg['type'] == 'text' ) : 
        # - forward text to the appropriate command 
        handle_text(msg) 
    else : 
        log.i("Unrecognized msg type: {}".format(msg.type))
    
    
# - connect to the vcs csi 
def connect(port=port,on_connect=on_connect,on_msg=on_msg) : 
    ws = u.ws_client(port=port,on_connect=on_connect,on_msg=on_msg)
    return ws 


# - when instaniating a command we have to pass it a reference to 
# - the websocket IN queue

import echo 
import new_log
import append_to_log
import new_alias

to_register = [ echo , new_log , append_to_log , new_alias ] 


def register_command(cmd,ws) : 
    #first we register the command with the local command lib 
    clib.register(cmd) 
    #now make a ws msg for vcs core
    msg = { 'type' : 'create_command' , 
            'command_info' : cmd.command_info } 
    #and send it 
    log.i("Sending register request to vcs core for: " + cmd.command_info['id'])
    ws.send(msg)
    

# start the main code here 
ws = connect() 

def register_all() :
    for cmd in to_register : 
        register_command(cmd,ws) 
    
    

    


        
