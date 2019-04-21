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

# - init
port = 9002 
u.register("csi_adapter")

# - define connect callback 
async def on_connect(ws) : 
    await ws.send(json.dumps({'type' : 'register' , 'id' : 'python' }))


# - TODO -  EDIT to triage based on the COMMAND    
def on_msg(message) : 
    msg = u.json_or_string(message) 
    print("Received msg: " + json.dumps(msg))
        
    
# - connect to the vcs csi 
def connect(port=port,on_connect=on_connect,on_msg=on_msg) : 
    ws = u.ws_client(port=port,on_connect=on_connect,on_msg=on_msg)
    return ws 



