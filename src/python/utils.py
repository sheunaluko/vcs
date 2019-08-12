import pprint
import builtins 
import glob 
import json 
import re 
import importlib 
import sys 
import math
import datetime 
import time 
import numpy as np 
import datetime 
import asyncio 
import queue
from threading import Thread 
import websockets 
import logging 

#reloading stuff 
reload_children = set(["utils"] ) 
def register(f) : 
    try :
        mod = sys.modules[f] 
    except KeyError : 
        return 
    
    reload_children.add(f) 
    def reloader() : 
        importlib.reload(mod) 
        print("Reloaded: " + f) 
    mod.r = reloader 
    return get_logger(f) # will return a logger object
    
def r() : 
    global reload_children 
    children = reload_children 
    for m in reload_children : 
        print("reloading: " + m)
        mod = sys.modules[m]
        importlib.reload(mod) 
    reload_children = children 


#logger 

# - 
logging.basicConfig(level=logging.DEBUG)

def get_logger(s) : 
    header = "[{}] \t\t ~ ".format(s) 
    
    def fn(x,t) : 
        if type(x) is str : 
            #simple string, will log it             
            l = getattr(logging,t) 
            l(header + x)
        else :
            #an object, will print the header first 
            l=getattr(logging,t)
            l(header)
            l(x) 
    
    class logger : 
        def __init__(self) : 
            pass 
        
        def i(self,x) : 
            fn(x,'info')
            
        def d(self,x) : 
            fn(x,'debug') 
            
        def e(self,x) : 
            fn(x,'error') 
            
    #return the new object 
    return logger()

log = get_logger('util')     
    
# params , referenc , etc .. 

    
#strings and files 
def stringify_list_sep(l,sep) : 
    if isinstance(l, list) : 
        return  sep.join(l) 
    else :
        return l
    
def stringify_list(l) : 
    return stringify_list_sep(l, ",")


def acopy(tmp) : 
    str = tmp.encode() 
    from subprocess import Popen, PIPE
    p = Popen(['xsel', '-bi'], stdin=PIPE)
    p.communicate(input=str)

def cwd() : 
    import os
    return os.getcwd() + "/" 

def ensure_slash(d) : 
    #make sure there is trailing slash 
    if not d[-1] == "/" : 
        d = d + "/" 
    return d 

def get_files_in_dir(d) : 
    fs = glob.glob(ensure_slash(d) + "*" ) 
    fs.sort()
    return fs
    
def write_json(fname, obj) : 
    with open(fname, 'w') as outfile : 
        json.dump(obj, outfile) 
    print("Wrote ", fname)

def read_json(fname) : 
    with open(fname) as f:
        data = json.load(f)
    return data 

def read_big_string(fname) : 
    result = "" 
    with open(fname) as f:
        while True:
            c = f.read(1024)
            if not c:
                break
            result += c 
    return result
            
def read_string(fname) : 
    with open(fname, 'r') as myfile:
        data=myfile.read()
    return data 

def lines(s) : 
    return s.split("\n")
    
def read_and_split_file(fname, splitter) : 
    s = read_big_string(fname) 
    lines = [ x for x in s.split(splitter) if x is not "" ] 
    return lines 

def read_split_map_file(fname,splitter,mapper) : 
    lines = read_and_split_file(fname, splitter) 
    return [ mapper(l) for l in lines if l ]  
        
def check_for_file(fname)  : 
    import os.path
    return os.path.isfile(fname) 


def append_file(fname, strang) : 
    if not check_for_file(fname) : 
        mode = 'w' 
    else : 
        mode = 'a+' 

    with open(fname, mode) as outfile : 
        outfile.write(strang)


def contains(a1,a2) :  
    return bool(re.search(a2, a1))


# functional 
def map(f,l ) : 
    return  [ f(x) for x in l ] 

def extract_field_from_list(l,f) : 
    return [ x[f] for x in l ] 

def find_duplicates(coll) :   
    #tags: count, unique , ext 
    seen = {}
    dupes = []
    for x in coll:
        if x not in seen:
            seen[x] = 1
        else:
            if seen[x] == 1:
                dupes.append(x)
            seen[x] += 1
    return (seen,dupes) 

def group_info(coll) : 
    s,d = find_duplicates(coll) 
    total = sum(list(s.values()))
    for k,v in s.items() : 
        s[k] = {'frequency' : v , 
                'percentage' : v/total} 
    return s




#lists 
def cycle_add(arr,x) : 
    return arr[1:] + x 


# sub commands 
def sub_cmd(cmd,mode) : 
    import subprocess
    import sys
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE)
    to_return = "" 
    if mode is "q" : 
        #do nothing 
        pass 
    else : 
        for c in iter(lambda: process.stdout.read(1), b''): 
            ch = c.decode()
            to_return += ch 
            if mode is "v" : 
                sys.stdout.write(ch)
    if mode is "s" : 
        return to_return 

def sub_cmd_v(cmd) : 
    return sub_cmd(cmd,"v")

def sub_cmd_q(cmd) : 
    return sub_cmd(cmd,"q")

def sub_cmd_s(cmd) : 
    return sub_cmd(cmd,"s")


    
#time stuff 
def ms_stamp_2_datetime(t) : 
    return datetime.datetime.fromtimestamp(t/1000) 

def t_stamp_2_datetime(t) : 
    return datetime.datetime.fromtimestamp(t) 

def t_stamp_fname() : 
    return str(datetime.datetime.now()).replace(" ","_").replace("-","_").replace(":","_")

#data science 

def get_series(raw,k) : 
    return np.array(extract_field_from_list(raw, k)) 
        
def get_float_series(raw, k) : 
    return np.array(map(float, extract_field_from_list(raw, k)))

def get_date64_series(raw, k) : 
    return np.array(extract_field_from_list(raw, k), dtype=np.datetime64)


def _mean(coll) : 
    return sum(coll)/len(coll)

def _diff(coll) : 
    vs = [] 
    last_val = coll[0] 
    for i in coll[1:] : 
        vs.append(i-last_val) 
        last_val  = i 
    return vs 

def datetime_mean(dt_list) : 
    tstamps = [ x.timestamp() for x in dt_list ] 
    return datetime.datetime.fromtimestamp( _mean(tstamps) ) 

def datetime64_mean(dt_list) : 
    return np.datetime64(datetime_mean(map(lambda x: x.astype(datetime.datetime),dt_list))) 

def norm(data) : 
    return data/np.max(data) 

def rms(data) : 
    x = np.sqrt(np.mean(data*data))
    if math.isnan(x) : 
        print("!") 
        print(data) 
        print(np.mean(data*data))
    else :
        return x 



def smooth(x,window_len=11,window='hanning'):
    """smooth the data using a window with requested size.
    from https://scipy-cookbook.readthedocs.io/items/SignalSmooth.html
    """
    if x.ndim != 1:
        raise(ValueError, "smooth only accepts 1 dimension arrays.")
    if x.size < window_len:
        raise(ValueError, "Input vector needs to be bigger than window size.")
    if window_len<3:
        return x
    if not window in ['flat', 'hanning', 'hamming', 'bartlett', 'blackman']:
        raise(ValueError, "Window is on of 'flat', 'hanning', 'hamming', 'bartlett', 'blackman'")
    s=np.r_[x[window_len-1:0:-1],x,x[-2:-window_len-1:-1]]
    #print(len(s))
    if window == 'flat': #moving average
        w=np.ones(window_len,'d')
    else:
        w=eval('np.'+window+'(window_len)')
    y=np.convolve(w/w.sum(),s,mode='valid')
    return y


    
    
    
def mean(coll) : 
    if type(coll[0]) == datetime.datetime : 
        return datetime_mean(coll) 
    elif type(coll[0]) == np.datetime64 : 
        return datetime64_mean(coll)
    else : 
        return _mean(coll) 
    

def apply_function_accross_collection_fields(coll,f) : 
    all_keys = coll[0].keys() 
    return_obj = {} 
    for k in all_keys : 
        return_obj[k] = f( extract_field_from_list(coll,k) ) 
    return return_obj 

def field_means(coll) : 
    return apply_function_accross_collection_fields(coll, mean) 
        
def test_data() : 
    res = [] 
    count = 0 
    for i in range(22) : 
        count += 1 
        tmp = { 'c' : count , 
                't' : datetime.datetime.now()  } 
        res.append(tmp) 
        time.sleep(0.5) 
        print(i)
    return res 
        
def partition(coll, group_size)  : 
    l = len(coll) 
    res  = [] 
    end = math.floor(l / group_size ) * group_size 
    for i in range(0, end+1 ,group_size) : 
        if i == end : 
            tmp = coll[end:] 
        else : 
            tmp = coll[i:i+group_size] 
        #add the sublist if it is not empty 
        if tmp != [] : 
            res.append(tmp)  
    return res 


def downsample_dict_list_mean(l, group_size) : 
    if not group_size : 
        return l 
    else : 
        return map(field_means , partition(l, group_size)) 

    
#memory and performance measures 
def now() : 
    return time.perf_counter() 

def time_function(f) : 
    t0 = now() 
    throw_away = f() 
    return now() - t0 

def get_size(obj, seen=None):
    """Recursively finds size of objects"""
    ##https://goshippo.com/blog/measure-real-size-any-python-object/ 
    size = sys.getsizeof(obj)
    if seen is None:
        seen = set()
    obj_id = id(obj)
    if obj_id in seen:
        return 0
    # Important mark as seen *before* entering recursion to gracefully handle
    # self-referential objects
    seen.add(obj_id)
    if isinstance(obj, dict):
        size += sum([get_size(v, seen) for v in obj.values()])
        size += sum([get_size(k, seen) for k in obj.keys()])
    elif hasattr(obj, '__dict__'):
        size += get_size(obj.__dict__, seen)
    elif hasattr(obj, '__iter__') and not isinstance(obj, (str, builtins.bytes, bytearray)):
        size += sum([get_size(i, seen) for i in obj])
    return size

def sysbytes(d) : 
    return sys.getsizeof(d)  #returns size of data in bytes 
def ubytes(d) : 
    return get_size(d)  
def kbytes(d) :
    return ubytes(d)/1024  
def mbytes(d) : 
    return kbytes(d)/1024  
def gbytes(d) : 
    return mbytes(d)/1024
    
    
    
#printing 
pretty_printer = pprint.PrettyPrinter(indent=4)
def pretty(val) : 
    pretty_printer.pprint(val)

#json_or_string
def json_or_string(s) : 
    try : 
        msg = json.loads(s) 
    except : 
        msg = s 
    return msg


        

    
# WS CLIENT  
ws_logger = logging.getLogger('websockets')
ws_logger.setLevel(logging.ERROR)
ws_logger.addHandler(logging.StreamHandler())

async def listen(ou_ch,ws) : 
    while True : 
        #print("listen")
        msg = await ws.recv()
        ou_ch.put(msg) 
        
async def relay(in_ch,ws) :         
    while True : 
        try : 
            msg = in_ch.get(block=False) 
            await ws.send(json.dumps(msg))
        except queue.Empty : 
            await asyncio.sleep(0)

async def main(i,o,url,on_connect) : 
    
    async with websockets.connect(url) as websocket:
        log.i("WS client connected to: {}".format(url))
        if on_connect != None : 
            log.i("#running on_connect")
            await on_connect(websocket)
        # now we start the listening and the sending tasks 
        await asyncio.gather( 
            relay(i,websocket) ,            
            listen(o,websocket), 
        ) 

def start_server(i,o,url,on_connect) : 
    asyncio.run(main(i,o,url,on_connect))

    
def output_loop(q,on_msg) : 
    while True : 
        msg = q.get() 
        if on_msg != None :
            on_msg(msg) 
    
#define ws class 
class ws : 
    def __init__(self,i,o,client_thread, output_thread) : 
        self.i = i 
        self.o = o 
        self.client_thread = client_thread 
        self.output_thread = output_thread
            
    def send(self,x) : 
        self.i.put(x) 

            
def ws_client(host="localhost",port=8000,on_connect=None,on_msg=None)  : 
    o = queue.Queue()
    i = queue.Queue() 
    url = "ws://{}:{}".format(host,port) 
    #start the client thread 
    client_thread = Thread(target=start_server, args=(i,o,url,on_connect,))
    client_thread.start()
    #will also start a thread that will check the output queue 
    output_thread = Thread(target=output_loop, args=(o,on_msg))
    output_thread.start() 
    #and will prepare the return object now 
    w = ws(i,o,client_thread,output_thread)
    return w



#HTTP server   --- 


from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs

def http_server(port,handle_get) : 
    # HTTPRequestHandler class
    class MyHandler(BaseHTTPRequestHandler):
        
        # GET
        def do_GET(self):
            # Send response status code2
            self.send_response(200)
        
            # Send headers
            self.send_header('Content-type','application/json')
            self.end_headers()
        
            query_components = parse_qs(urlparse(self.path).query)
            log.i("Received msg: {}".format(json.dumps(query_components))) 
            
            result = handle_get(json.loads(query_components['payload'][0]))
            
            log.d("HTTP got result: {}".format(result)) 
        
            # Send message back to client
            message = json.dumps(result) 
            # Write content as utf-8 data
            log.i("Sending response: {}".format(message))
            self.wfile.write(bytes(message, "utf8"))
            return
    
    def run():
        log.i("Starting http server on port {}".format(port) )
        # Server settings
        server_address = ('127.0.0.1', port)
        httpd = HTTPServer(server_address, MyHandler) 
        httpd.serve_forever()
        
    # create new thread to run server in and return the thread 
    server_thread = Thread(target=run)
    server_thread.start() 
    return server_thread 



# disable loggers ! 

logging.getLogger("urllib3").setLevel(logging.WARNING) 
logging.getLogger("matplotlib").setLevel(logging.WARNING) 
