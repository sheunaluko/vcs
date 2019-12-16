import store from "../js/store/index";

//configure global env here
window.store = store

window.globals = {} 
window.Dispatch = store.dispatch 

/* configure global dispatch fns */ 
window.dispatch = {
    'set_msg' : function(payload) { 
	store.dispatch({type: "SET_MSG" , payload })
    } , 

}


