//the parser will automaticall parse and load these commmands 

let commands = [ 
    
    { id : "are you there" , 
      rules : [ "are you ?(there|listening|here)" , 
		"hello"  ] , 
      fn : (args) => { 
	  return "yes" 
      }
    }, 
    
    { id : "request time" , 
      rules : [ "what time is it ?(please)" , 
		"?(please) tell me the time ?(please)" , 
		"what's the time", 
		"time ?(please)" ]  , 
      fn : (args) => { 
	  let d = new Date() 
	  return (d.getHours() % 12) + ":" + ( d.getMinutes() ) 
      }
    }, 
    
    { query : "am i a loser" , 
      response : "some people may think so, but I dont since you spent so much time making me and I appreciate existing" 
    } , 
    
    { query : "how are you" , 
      response : [ "pretty good" , 
		   "fantastic" , 
		   "been better", 
		   "ask me in 5 minutes", 
		   "well lets just say today was a bit rough", 
		   "my bits are a little disorganized at the moment but im grateful to have sufficient battery life",
		   "come on, you know computers dont have emotions" , 
		   "you should know you made me", 
		   "why do you care" , 
		   "why dont you write a program to find out smart ass" 
		 ] } , 
    
    { query : "do you love me", 
      response : [ "of course i do", 
		   "let me think about that", 
		   "I will love you forever baby" , 
		   "computers do not have the capacity for emotion"] } , 
	
] 


module.exports = commands 
