// src/js/reducers/index.js

import produce from "immer"


export const initialState = {
    message : "hey sista" , 
    num : 20 , 
    active_ids : [] ,  //the currently active UI IDS 
    subscriptions : {} , //for ui 
    subscription_data : {} , //holds objects 
    
};

var log = (x) => console.log("[store]:: " + x) 

export const  rootReducer = produce((state, action) => { 
    switch(action.type) { 
	    
    case "SET_MSG" : 
	state.message = action.payload 
	return state
	
    case "ADD_ACTIVE_ID" : 
	state.active_ids.push(action.payload.id)
	log("Added active id: " + action.payload.id) 
	return state 
	
    case "ADD_SYNC_INFO" : 
	state.subscription_data[action.payload.id] = { client : action.payload.client }
	log("Added sync info for id: " + action.payload.id) 
	return state 	
	
    case "UPDATE_SUBSCRIPTION" : 
	log("Updating subscription for: " + action.payload.id)
	console.log(action)
	state.subscriptions[action.payload.id] = action.payload.data
	state.message = "Updated subscription for: " + action.payload.id + " @" +  new Date().toString()
	return state 
	
	
    case "REMOVE_ACTIVE_ID" : 
	state.active_ids = state.active_ids.filter( id => id != action.payload.id ) 
	log("Removed active id: " + action.payload) 
	return state 
	
    case "REMOVE_SUBSCRIPTION" : 
	//get the client ref and close it 
	var client = state.subscription_data[action.payload.id].client 
	//close 
	client.socket.close() 
	log("Closed websocket connection for id: " + action.payload.id) 
	//now delete the info 
	delete state.subscription_data[action.payload.id] 
	delete state.subscriptions[action.payload.id] 
	//and return the state 
	return state 
	
	
	
	
    default : 
	log("Hit default case in root reducer with action -> ")
	log(action)
	return state 
	
	
    }
    
    
})



			     
			     
