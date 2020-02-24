import store from "./store/index";
import vcs_ui from "./vcs_ui.js"
import vcs_client from "./vcs_client/index.js" 
import command_manifest from "./command_manifest.js" 
import * as hub from "./vcs_hub" 

//configure global env here
//window.command_manifest = command_manifest 

var globals = {hub,store,command_manifest} 

if ( ! window.vcs) { 
    window.vcs = globals
} else { 
    Object.assign(window.vcs, globals) 
}

window.globals = {subscriptions : {}  , 
		  
		 }
window.Dispatch = store.dispatch 

/* configure global dispatch fns */ 
window.dispatch = {
    'set_msg' : function(payload) { 
	store.dispatch({type: "SET_MSG" , payload })
    } , 

}


