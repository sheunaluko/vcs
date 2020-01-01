import store from "./store/index";
import vcs_ui from "./vcs_ui.js"
import command_manifest from "./command_manifest.js" 


//configure global env here
window.store = store
window.command_manifest = command_manifest 

window.globals = {subscriptions : {}  , 
		  
		 }
window.Dispatch = store.dispatch 

/* configure global dispatch fns */ 
window.dispatch = {
    'set_msg' : function(payload) { 
	store.dispatch({type: "SET_MSG" , payload })
    } , 

}


