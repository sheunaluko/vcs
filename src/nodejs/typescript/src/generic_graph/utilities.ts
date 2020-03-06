/* 
    Defines utilities for operating on Graphs  
    Graphs structure is defined in graph.ts 

    Sheun Aluko , Fri Mar 06 02:00:56 2020 
*/

import * as g from "./graph"   


/*
    Some  dummy utilities to get started 
*/
export function num_vertices(G : g.Graph) {     
    return G.vertices.vertices.length 
}
 
export function num_edges(G: g.Graph) { 
    return G.edges.edges.length  
}

/* 
 TODO : 
 implement modified BFS like algorithm for 
 generic graph searches. 

 Should keep track of paths as it goes. 
 Should accept the following functions: 
 {should_terminate, 
  should_succeed, 
  get_next_vertices } 

 Also... should implement in a modular way so that code can be easily 
 adapted for PARALLEL operation on CPU (server side) vs... browser? 

*/ 


interface Path { 
    /* TODO */
}

type MaybePath = Path | null 

interface BFS_Search_Ops { 
    should_terminate : (p :Path) => boolean , 
    should_succeed   : (p :Path) => boolean , 
    get_next_vertices : (p : Path) => g.Vertex[] , 
}

export function BFS(G : g.Graph, ops : BFS_Search_Ops) : MaybePath { 
    /* TODO */ 
    return null
} 


