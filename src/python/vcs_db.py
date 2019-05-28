import os 
from pymongo import MongoClient
import log as l 
import utils as u 
import datetime 
import json 

log = l.get_logger("vcs_db") 
u.register("vcs_db")

# get db info and credentials from environment vars
db_user = os.getenv("vcs_db_user")
db_pass = os.getenv("vcs_db_pass") 
db_host = os.getenv("vcs_db_host") 

# global db structures
client = None 
db     = None 

def is_connected() : 
    if not client : 
        return False 
    else : 
        try : 
            client.server_info() 
            return True 
        except : 
            return False 
            
def connect() : 
    if is_connected() : 
        log.i("Already connected to db") 
        return 

    global client , db 
    uri = "mongodb://{}:{}@{}/vcs?authSource=admin".format(db_user,db_pass,db_host) 
    client = MongoClient(uri,serverSelectionTimeoutMS=500)
    db     = client.get_database() 
    log.i("Connected to remote db") 

def ensure_connected() : 
    connect() 
    
# - generic query function     

def find(coll,query,data=False) : 
    ensure_connected() 
    cursor = db[coll].find(query)
    if data : 
        return list(cursor) 
    else : 
        return cursor 

    
# - functions for dealing with logs 
    
def log_exists(name) : 
    ensure_connected() 
    if db[name].find_one({'init' : {'$exists' : True }}) : 
        return True 
    else  : 
        return False 
        
def new_log(name) : 
    ensure_connected()     
    db[name].insert_one({'init' : datetime.datetime.now() }) 
    log.i("initialized log: {}".format(name) )
    return "DONE" 

def insert_object_into_collection(name,obj) : 
    ensure_connected() 
    obj['t'] = datetime.datetime.now() 
    db[name].insert_one(obj) 
    obj['t'] = str(datetime.datetime.now()) #datetime errs when json.dumped below
    log.i("inserted obj into log: {}".format(name))
    log.i(obj)

def insert_text_into_log(name,text) : 
    insert_object_into_collection(name, { 'text' : text } ) 

# - alias functions 

def new_alias(opts) : 
    i = opts['input']
    o = opts['output'] 
    obj = { 'input' : i , 'output' : o } 
    insert_object_into_collection('aliases' , obj )
    return "Added alias"

    

# - connect to db when loaded 
connect()    





    
