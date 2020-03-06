import * as gg from "./graph"  


export var main = { 
    "1" : function() { 
        var G = new gg.Graph({}) 

        let rel  = { 
            source : "dog" , 
            target : "animal" , 
            edge   : "is"  , 
            
        }

        G.add_relation(rel) 
        return G 
    }, 
    
}