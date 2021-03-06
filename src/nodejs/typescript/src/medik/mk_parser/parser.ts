
// Thu Apr 02 20:25:50 2020 
// - utilities for parsing medik files

import * as util from "../../utils/index" 
import * as fs from "fs"
export var medik_knowledge_src_directory = "/Users/oluwa/dev/vcs/src/nodejs/typescript/src/medik/knowledge_src/"


export function get_medik_files() { 
    return util.rec_find_dir_ext(medik_knowledge_src_directory,"medik") 
}


export function get_file_chunks(fname : string) { 
    let strang = fs.readFileSync(fname,"utf-8") 
    return strang.split(/[\r\n][\r\n][\r\n]*/).map((x:string)=>x.trim()).filter((x:string)=>(x!=""))
}   

export function starts_ends_with(s:string,start :string,end:string) { 
    return (s[0] == start && s[s.length-1] == end)  
}

export var is_array      = (s:string) => starts_ends_with(s,"[","]")
export var is_concept    = (s:string) => starts_ends_with(s,"<",">")
export var is_expression = (s:string) => starts_ends_with(s,"'","'") 

export function get_targets(text : string) {  
    //only look at first line for this 
    let lines = text.split("@")
    let tmp =  lines[0].split(":") 
    let edge_type  = tmp[0].trim() 
    let target = tmp[1].trim() 

    //console.log(target )

    //-- now we get the targets
    if (is_array(target)) { 
        var target_strings = target.match(/<.*>/)[0].split(/,/)
    } else if ( is_concept(target) ) {  
        var target_strings = [target]
    } else { 
        throw("unrecognized target " + target) 
    }

    //console.log(target_strings)

    var targets = target_strings.map(parse_concept_string)  

    return {edge_type, targets} 

}

export function get_edge_metadata(text : string) { 
    let _lines = text.split("@") 
    let data = _lines.splice(1).filter((x:string)=> x!="") //remove the concept line  

    var metadata : {[k:string] : string} = {} 
    data.forEach( (d : string) => {

        let tmp = d.split(/\s*:\s*/) 
        let attribute = tmp[0].trim() 
        let value = tmp[1].trim() 



        metadata[attribute] = value 
    })

    return {metadata} 

} 


export function parse_concept_string(cs : string ) : { vertex_type : string, metadata : any} {  

    //console.log(cs) 

    let tmp =  cs.match(/<(.*)>/)[1].split("|")  

    //console.log(tmp)

    let vertex_type = tmp[0].trim()

    var metadata : { [k:string] : any} = {}    

    if (tmp.length > 1 ){ 
        let toks = tmp[1].trim().split(/\s+/) 
        
        //console.log(toks)

        toks.forEach((s :string) => {
            //console.log(s)
            let tmp2 = s.split("=") 
            //console.log(tmp2)
            metadata[tmp2[0].trim()] = tmp2[1].trim() 
        })  
    }

    return {vertex_type, metadata} 
}

export function parse_chunk(chunk : string,concept : string) { 
    //this is where it gets interesting -- > 
    var lines = chunk.split(/[\r\n]/)  

    lines = lines.map((l : string)=> l.split("#")[0].trim() ) //only take stuff before comment   
    let text  = lines.join("")

    //the first line will always specify the edge type as well as target(s) 
    let {edge_type , targets } = get_targets(text) 
    let {metadata}        = get_edge_metadata(text)

    return {edge_type,targets, edge_metadata : metadata, source : concept}
} 

export function parse_medik_file(fname : string) { 
    let chunks = get_file_chunks(fname) 

    //first chunk should be the concept  
    let concept = chunks[0].split(":")[1].trim().replace("<","").replace(">","")


    //now we loop thru 
    let relation_data = chunks.splice(1).map((x:string)=>parse_chunk(x,concept))

    return {concept, relation_data }
}



export var equivalencies_loc = "/Users/oluwa/dev/vcs/src/nodejs/typescript/src/medik/knowledge_src/equivalencies.txt"  

export function parse_alternatives(a : string) { 
    let tmp = a.match(/\[(.*)\]/)[1].split(",").filter(util.str_not_empty).map(util.trim).map(util.char_remover('"'))
    return tmp 
}

export function parse_equivalency_chunk(c : string) { 

    let tmp  = c.split("==") 

    let key = util.char_remover('"')(tmp[0].trim()) 
    let alternative_raw = tmp[1].trim() 

    let alternatives = parse_alternatives(alternative_raw) 

    return {key,alternatives}
}

export function parse_equivalencies(fname: string) { 
    const fs = require("fs")
    let raw = fs.readFileSync(fname,'utf-8')  

    let lines = raw.split(/[\r\n]/) 
    let no_comments = lines.map((l:string)=>l.split("#")[0]).filter(util.str_not_empty).join("\n")

    let chunks =  no_comments.split("::").filter(util.str_not_empty).map(util.trim) 
    return chunks.map(parse_equivalency_chunk) 

}


export var debug =  { 
    "1" : function() { 
        return parse_medik_file(get_medik_files()[3])
    } , 
    "2" : function() { 
        return parse_equivalencies(equivalencies_loc) 
    }
}