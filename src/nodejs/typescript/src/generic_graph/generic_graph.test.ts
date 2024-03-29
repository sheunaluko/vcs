

import * as gg from "./graph"  
import * as debug from "./debug"  
import * as gu from "./utilities"


/* tests on G1 */ 
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
    expect(gu.num_vertices(G)).toBe(2) 
})

test("has 1 edge" , () => {
    expect(gu.num_edges(G)).toBe(1)
}) 

test("can get vertex", ()=> {
    let v = G.vertices.get("dog") 
    expect(v instanceof gg.Vertex ).toBe(true) 
})

test("id equals on vertex", ()=> {
    let v = G.vertices.get("dog") 
    let num_id = v.data.id_readable
    expect(G.vertices.ids_equal(num_id,"dog")).toBe(true)
})

/* tests on G2 */ 
let G2 = debug.main["2"]() 

test("G2 has 4 vertices", () => {   
    expect(gu.num_vertices(G2)).toBe(4)     
})

test("G2 has 3 edges", ()=> {
    expect(gu.num_edges(G2)).toBe(3) 
})

/* BFS test */ 
test("can make mbfs", ()=> {
    let mbfs = debug.main["3"]() 
    expect(mbfs instanceof gu.MBFS).toBe(true)
})





