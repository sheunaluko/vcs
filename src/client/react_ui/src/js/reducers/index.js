// src/js/reducers/index.js

import produce from "immer"


export const initialState = {
    message : "hey sista" , 
    num : 20 

};


export const  rootReducer = produce((state, action) => { 
    switch(action.type) { 
	    
    case "SET_MSG" : 
	state.message = action.payload 
	return state
	
	
    default : 
	console.log("Hit default case in root reducer with action -> ")
	console.log(action)
	return state 
	
	
    }
    
    
})



			     
			     
