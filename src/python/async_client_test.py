
# WS client example

import asyncio
import websockets

async def hello():
    uri = "ws://localhost:5678"
    async with websockets.connect(uri) as websocket:
        while True : 
            greeting = await websocket.recv()
            print(f"< {greeting}")

asyncio.run(hello())