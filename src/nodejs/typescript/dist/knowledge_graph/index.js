"use strict";
/*
 Knowledge graph implementation (typescript)
 Thu Mar 05 22:30:20 2020
 Sheun Aluko
 */
Object.defineProperty(exports, "__esModule", { value: true });
//temporary debug 
var debug = console.log;
class Vertex {
    constructor(ops) { this.data = ops; }
    add_outgoing(id) {
        //make sure that the id is not duplicated 
        if (this.has_outgoing(id)) {
            debug("Will not duplicate id: " + id);
            return;
        }
        else {
            this.data.outgoing.push(id);
        }
    }
    add_incoming(id) {
        //make sure that the id is not duplicated 
        if (this.has_incoming(id)) {
            debug("Will not duplicate id: " + id);
            return;
        }
        else {
            this.data.incoming.push(id);
        }
    }
    has_outgoing(id) {
        return (this.data.outgoing.indexOf(id) > -1);
    }
    has_incoming(id) {
        return (this.data.incoming.indexOf(id) > -1);
    }
}
exports.Vertex = Vertex;
class Edge {
    constructor(ops) { this.data = ops; }
}
exports.Edge = Edge;
/* houses translations of ids to human readable strings */
class Translations {
    constructor() {
        this.to_string = {};
        this.to_int = {};
    }
    translate(id) {
        if (id.constructor == String) {
            return this.to_int[id];
        }
        else {
            return this.to_string[id];
        }
    }
    int_id(id) {
        if (id.constructor == String) {
            return this.to_int[id];
        }
        else {
            return id;
        }
    }
    string_id(id) {
        if (id.constructor == Number) {
            return this.to_string[id];
        }
        else {
            return id;
        }
    }
    add({ string, number }) {
        this.to_string[number] = string;
        this.to_int[string] = number;
    }
}
exports.Translations = Translations;
/* define class which holds the edges */
class Edges {
    constructor() {
        this.translations = new Translations();
        this.edges = [];
    }
    /* implmement GET */
    /**
     *Check if an instance of edge already exists in the set
     *
     * @param {Edge} edge
     * @returns {boolean}
     * @memberof Edges
     */
    exists(edge) {
        let matches = this.edges.filter((e) => e === edge);
        switch (matches.length) {
            case 0:
                return false;
            case 1:
                return true;
            default:
                throw ("Ooopss. have duplicated edges somehow");
        }
    }
    add(e) {
        if (this.exists(e)) {
            throw ("Cannot add duplicate!");
        }
        this.edges.push(e);
        this.translations.add({ number: e.data.id, string: e.data.id_readable });
    }
}
exports.Edges = Edges;
/* class that houses vertices */
class Vertices {
    constructor() {
        this.translations = new Translations();
        this.vertices = [];
    }
    exists(id) {
        return (this.translations.translate(id) !== undefined);
    }
    get(id) {
        let int_id = this.translations.int_id(id);
        if (!int_id) {
            return null;
        }
        //id exists in the translations... will search for it in the edge set 
        return this.vertices.filter((vertex) => vertex.data.id == int_id)[0];
    }
    add(v) {
        if (this.exists(v.data.id)) {
            throw ("Cannot add duplicate!");
        }
        this.vertices.push(v);
        this.translations.add({ number: v.data.id, string: v.data.id_readable });
    }
}
exports.Vertices = Vertices;
/* helper fns */
var nonce = 0;
function gen_id() { return nonce++; }
exports.gen_id = gen_id;
function new_ids(id) {
    let num_id = (id.constructor == String) ? gen_id() : id;
    let str_id = (id.constructor == String) ? id : String(id);
    return { id: num_id, id_readable: str_id };
}
exports.new_ids = new_ids;
/* graph class definition */
class Graph {
    constructor(ops) {
        this.ops = ops;
        this.vertices = new Vertices();
        this.edges = new Edges();
    }
    /**
     * Add new relationship to the graph. Nodes and edges that do not exist
     * will be created.
     *
     * @param {Relation} r
     * @memberof Graph
     */
    add_relation(r) {
        let { source, target, edge, data } = r; //destructure the relation 
        let edge_ids = new_ids(edge);
        let source_ids = new_ids(source);
        let target_ids = new_ids(target);
        /*
        check if the edge exists or not
        because edges can have nested data , the easiest way to do this is
        to build the edge and check if an instance exists
        */
        let _edge = new Edge({
            id: edge_ids.id,
            id_readable: edge_ids.id_readable,
            source: source_ids.id,
            target: target_ids.id,
            data: data,
        });
        if (!this.has_edge(_edge)) {
            this.edges.add(_edge);
        }
        else {
            //the edge already exists ... 
            //which must mean that the source and target already exist... 
            //so we will just return 
            debug("Edge already exists, so assuming source and target do as well and returning");
            return;
        }
        /*
        At this point, the desired edge did not exist and was created ,
        BUt we still have to create/modify the source and target:
        */
        /* we deal with the source vertex first */
        if (!this.has_vertex(source)) {
            let { id, id_readable } = source_ids;
            let vertex = new Vertex({
                id,
                id_readable,
                incoming: [],
                outgoing: [edge_ids.id]
            });
            this.vertices.add(vertex); //add the vertex to the graph 
        }
        else {
            //vertex already exists... so we will get it and then update it 
            let v = this.vertices.get(source_ids.id);
            v.add_outgoing(target_ids.id);
        }
        /* then the target vertex */
        if (!this.has_vertex(target)) {
            let { id, id_readable } = target_ids;
            let vertex = new Vertex({
                id,
                id_readable,
                incoming: [edge_ids.id],
                outgoing: []
            });
            this.vertices.add(vertex);
        }
        else {
            let v = this.vertices.get(source_ids.id);
            v.add_incoming(edge_ids.id);
        }
    }
    has_vertex(id) { return this.vertices.exists(id); }
    has_edge(e) { return this.edges.exists(e); }
}
exports.Graph = Graph;
//# sourceMappingURL=index.js.map