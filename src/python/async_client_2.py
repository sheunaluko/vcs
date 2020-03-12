

# WS client example

import asyncio
import websockets
import json 
import queue 



async def listen(ou_ch,ws) : 
    while True : 
        #print("listen")
        msg = await ws.recv()
        print(msg)
        #ou_ch.put(msg) 

        
async def relay(in_ch,ws) :         
    while True : 
        try : 
            msg = in_ch.get(block=False) 
            await ws.send(json.dumps(msg))
        except queue.Empty : 
            print("empty") 
            await asyncio.sleep(0.05)

async def main() : 
    url = "ws://localhost:5678"    
    o = queue.Queue()
    i = queue.Queue() 
    async with websockets.connect(url) as websocket:
        await asyncio.gather( 
            listen(o,websocket),
            relay(i,websocket) 
        )
                
        
def start() : 
    asyncio.run(main())          

if __name__ == "__main__" : 
    start() 




