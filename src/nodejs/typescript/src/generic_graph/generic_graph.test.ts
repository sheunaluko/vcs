

import * as gg from "./graph"  
import * as debug from "./debug"  
import * as util from "./utilities"

let G = debug.main["1"]()

test('Can create graph', ()=> {
    expect(new gg.Graph({})!= null).toBe(true) 
})  

test("id_check", ()=> {
    expect(G.edges.edges[0].data.id_readable).toBe("is")
})

test("source check" , ()=> {
    expect(G.vertices.exists("dog")).toBe(true) 
})


test("target check" , ()=> {
    expect(G.vertices.exists("animal")).toBe(true)
})


test("has 2 vertices" , ()=> { 
    expect(util.num_vertices(G)).toBe(2) 
})

test("has 1 edge" , () => {
    expect(util.num_edges(G)).toBe(1)
}) 


