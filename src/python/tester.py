# Tue Apr 30 01:26:14 PDT 2019
import utils as  u 
import state_hub as sh

if __name__ != "__main__" : 
    log = u.register("tester")

tasks = [ 
    { 'id' : 'python.test-1' , 
      'transition' : { 'reqs' : { 'a' : ['python.tested-1' ]} ,
		       'mods' : { 'add' : ['python.tested-1'],
				  'del' : ['sh.init'] }} , 
      'se' : (lambda x : log.i("doing test-1")) }  , 
    
     { 'id' : 'python.test-2' , 
       'transition' : { 'reqs' : { 'a' : ['python.tested-2' ] , 
                                   'p' : ['python.tested-1' ] }, 
		        'mods' : { 'add' : ['python.tested-2'], 
			           'del' : ['nothing-tested'] }} , 
       'se' : (lambda x : log.i("doing test-2")) }  , 
    
     { 'id' : 'python.undo-2' , 
       'transition' : { 'reqs' : { 'a' : [] , 
                                   'p' : ['python.tested-2'] }, 
		        'mods' : { 'add' : [], 
			           'del' : ['python.tested-2'] }} , 
       'se' : (lambda x : log.i("removing test-2")) } 
    
    
    
] 

#main 
def on_init() : 
    for task in tasks : 
        sh.register_task(task['id'],task['transition'],task['se'])

#connect        
sh.init(on_init=on_init) 














