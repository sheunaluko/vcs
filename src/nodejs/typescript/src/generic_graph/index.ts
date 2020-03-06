

/* 
 Generic graph implementation (typescript)
 Thu Mar 05 22:30:20 2020
 Sheun Aluko 
 */ 

 //temporary debug 
 var debug = console.log  
 
 /* def vertex type */ 
 export interface VertexOps { 
     id : number , //will map strings to numbers 
     id_readable : string ,  //mapping to readable string 
     incoming : number[]  ,  //array of edge ids 
     outgoing : number[]  ,  //array of edge ids 
 }

 export class Vertex { 
     data : VertexOps  
     constructor(ops : VertexOps) { this.data = ops} 

     add_outgoing(id : number)  { 
         //make sure that the id is not duplicated 
         if (this.has_outgoing(id)) {
             debug("Will not duplicate id: " + id) 
             return 
         } else { 
             this.data.outgoing.push(id) 
         }
     }

     add_incoming(id : number)  {  
        //make sure that the id is not duplicated 
        if (this.has_incoming(id)) { 
            debug("Will not duplicate id: " + id) 
            return 
        } else { 
            this.data.incoming.push(id)  
        }
    }

     has_outgoing(id : number) : boolean { 
         return (this.data.outgoing.indexOf(id) > -1 ) 
     }

     has_incoming(id : number) : boolean  { 
        return (this.data.incoming.indexOf(id) > -1 ) 
    }
 }

 /* def edge type */ 
 export interface EdgeOps { 
     id : number, //unique identifier for the edge 
     id_readable : string , 
     source : number ,  //refers to Vertex id
     target : number,   //refers to Vertex id 
     data    : { [key :string ] : any}   
 }

export class Edge { 
     data : EdgeOps  
     constructor(ops : EdgeOps) { this.data = ops} 
 }

export type MaybeEdge = Edge | null 
export type MaybeVertex = Vertex | null 

export type ID = string | number   

export type MaybeId  = ID | null 
export type MaybeNumber = number | null 
export type MaybeString = string | null   
  


/* houses translations of ids to human readable strings */ 
export class Translations { 
     to_string  :  {[id : number]  : string }  
     to_int     :  {[id : string]  : number }  
     constructor() { 
         this.to_string = {}  
         this.to_int = {} 
     }

    translate(id : ID) { 
        if (id.constructor == String) { 
            return this.to_int[id] 
        } else { 
            return this.to_string[(id as number)]  
        }
    }

    int_id(id : ID) : MaybeNumber { 
        if (id.constructor == String)  { 
            return this.to_int[id] 
        } else { 
            return (id as number )
        }
    }

    string_id(id  : ID ) : MaybeString { 
        if (id.constructor == Number) {  
            return this.to_string[(id as number) ] 
        } else { 
            return (id as string )
        }
    }
    

    add({string,number} : {string : string, number : number}) { 
        this.to_string[number] = string 
        this.to_int[string]  = number
    }

 }  


 /* define class which holds the edges */ 
export class Edges { 
    edges  : Edge[]
    translations : Translations 
    constructor() {
        this.translations = new Translations() 
        this.edges = [] 
    }

    /* implmement GET */ 

    
    /**
     *Check if an instance of edge already exists in the set  
     *
     * @param {Edge} edge
     * @returns {boolean}
     * @memberof Edges
     */
    exists(edge : Edge) : boolean {  
        let matches = this.edges.filter ( (e: Edge) => e === edge ) 
        switch( matches.length) { 
            case 0 : 
            return false 
            case 1 : 
            return true 
            default : 
            throw("Ooopss. have duplicated edges somehow")
        }
    }

    add(e : Edge)  : void {  
        if (this.exists(e)) { throw("Cannot add duplicate!")}         
        this.edges.push(e) 
        this.translations.add({ number : e.data.id , string : e.data.id_readable})
    }

}

/* class that houses vertices */ 
export class Vertices { 
    vertices : Vertex[]
    translations : Translations   
    constructor() {
        this.translations = new Translations()  
        this.vertices = [] 
    } 

    exists(id : ID ) : boolean { 
        return (this.translations.translate(id) !== undefined ) 
    }

    get(id : ID) : MaybeVertex {  
        let int_id = this.translations.int_id(id)  
        if (! int_id) { return null} 
        //id exists in the translations... will search for it in the edge set 
        return this.vertices.filter( (vertex : Vertex) => vertex.data.id == int_id )[0]
    }
    

    add(v : Vertex) : void { 
        if (this.exists(v.data.id)) { throw("Cannot add duplicate!")} 
        this.vertices.push(v) 
        this.translations.add({ number : v.data.id , string : v.data.id_readable})         
    } 


}




 /* relation type */ 
 export interface Relation { 
    source : ID , 
    target : ID , 
    edge   : ID  , 
    data?  : {[id:string] : any } 
}

/* helper fns */  
var nonce = 0 
export function gen_id() {return nonce++}
export function new_ids(id :  ID) : {id : number, id_readable : string}  { 
    let num_id : number  =  (id.constructor == String) ? gen_id()   : (id  as number) 
    let str_id : string  =  (id.constructor == String) ? (id  as string) : String(id) 
    return {id : num_id , id_readable : str_id} 
}


 /* graph ops interface */ 
 export interface GraphOps { 

 }

 /* graph class definition */ 
 export class Graph {  

    vertices : Vertices 
    edges : Edges 
    ops : GraphOps  //options  
    
    
    constructor(ops : GraphOps) { 
        this.ops = ops 
        this.vertices = new Vertices() 
        this.edges    = new Edges() 

    }  


    /**
     * Add new relationship to the graph. Nodes and edges that do not exist
     * will be created. 
     *
     * @param {Relation} r
     * @memberof Graph
     */
    add_relation( r : Relation) : void { 
        let { source, target, edge, data } = r  //destructure the relation 

        let edge_ids = new_ids(edge ) 
        let source_ids = new_ids(source) 
        let target_ids = new_ids(target) 

        /* 
        check if the edge exists or not 
        because edges can have nested data , the easiest way to do this is 
        to build the edge and check if an instance exists
        */ 

       let _edge = new Edge( {  
        id : edge_ids.id ,    
        id_readable  : edge_ids.id_readable,
        source : source_ids.id , 
        target : target_ids.id, 
        data : data ,
        }) 

       if (! this.has_edge(_edge) ) { 
            this.edges.add(_edge)
        } else { 
            //the edge already exists ... 
            //which must mean that the source and target already exist... 
            //so we will just return 
            debug("Edge already exists, so assuming source and target do as well and returning")
            return 
        } 

        /* 
        At this point, the desired edge did not exist and was created , 
        BUt we still have to create/modify the source and target: 
        */

        /* we deal with the source vertex first */ 
        if (! this.has_vertex(source)) {  

            let {id,id_readable} =  source_ids 
            let vertex = new Vertex({ 
                id  , 
                id_readable , 
                incoming : [] , 
                outgoing : [edge_ids.id]  
            })
            this.vertices.add(vertex)  //add the vertex to the graph 

        } else { 
            //vertex already exists... so we will get it and then update it 
            let v = this.vertices.get(source_ids.id) 
            v.add_outgoing(target_ids.id)

        }

        /* then the target vertex */ 
        if (! this.has_vertex(target)) {  

            let {id,id_readable} =  target_ids  
            let vertex = new Vertex({ 
                id  , 
                id_readable , 
                incoming : [edge_ids.id] ,   
                outgoing : []
            })
            this.vertices.add(vertex) 

        } else { 
            let v = this.vertices.get(source_ids.id) 
            v.add_incoming(edge_ids.id) 
        } 

       

    }


    has_vertex(id : ID) { return this.vertices.exists(id)} 
    has_edge(e: Edge) { return this.edges.exists(e)}

 }


