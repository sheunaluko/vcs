//first menuX extension 
//allows the queing of objects and actions  

//there will be an ID displayed, an X button and a GO button 
//when the go button is pressed the corresponding action is run 

function make_que_object(id,f) { 
    let qo = document.createElement("div") 
    qo.id = id 
    qo.style = "display : flex; justify-content : space-around; margin-bottom : 10px; width : 100%;"

    function remove_me() { 
	qo.parentElement.removeChild(qo) 
    }
    
    let name   = document.createElement("p") 
    name.innerText = id 
    name.style = "flex-basis : 100%; margin-left  : 10px;"
    
    let close = document.createElement("button") 
    close.innerText = "X" 
    close.onclick = remove_me 
    close.style = "height : 20px; align-self : center;"
    close.id = "close"
    
    let go   = document.createElement("button") 
    go.innerText = "=>" 
    go.onclick = function() { 
	f() 
	qo.style.backgroundColor = "green"
    }
    go.id = "go"
    go.style = "margin-left : 10px; margin-right : 15px; height : 20px; align-self : center;"

    qo.appendChild(name)
    qo.appendChild(close) 
    qo.appendChild(go) 
    
    return qo 
    
}


//ok s now we can easily create que objects 
function make_que_container() { 
    var qc = document.createElement("div") 
    qc.id = "que_container" 
    qc.style = "display : flex; flex-direction : column" 
    qc.que_object = function(id,f) { 
	let obj = make_que_object(id,f) 
	qc.appendChild(obj) 
    }
    
    qc.do_all = function() {
	for (el of qc.childNodes ) { 
	    el.querySelector("#go").click() 
	}
    }
    
    qc.clear = function() { 
	for (el of qc.childNodes ) { 
	    el.querySelector("#close").click() 
	}
    }
    
    
    return qc  
} 


    
    
function test_action_que() { 
    let qc = make_que_container() 
    add_selector("AQ" , qc ) 
    
    return qc 
    
}
