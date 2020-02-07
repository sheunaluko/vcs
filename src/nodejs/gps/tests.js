

//load the env 
require("./gps_dev") 
//load the entities 
const {Dreams,Logs}   = require("./vcs_resources") 
const {First,Last}    = require("./vcs_operations")
const Parser          = require("./parser.js") 
const {generate_computation, do_computations} = require("./computation.js")
const ii              = require("./interpreter_interface.js") 

//define the tests 
async function test1(){ 
    //load the entities 
    var logs  = new Logs() ;
    var last = new Last() ; 
    
    //try to apply the operation 
    let val = await last.run({resource: logs}) 
    return val 
    
}

async function test2(){ 
    //load the entities 
    var dreams  = new Dreams() ;
    var last = new Last() ; 
    
    //try to apply the operation 
    let val = await last.run({resource: dreams}) 
    return val 
    
}


function test3(){
    let parser = new Parser(); 
    return parser.parse("last dream") 
}

function test4() { 
    return test3().map(generate_computation) 
}

function test5() { 
    
    //todo ---> run test 5 but also figure out how to generate a number resource smartly ! 
    //already running into arguments... seems like I may need to update the resolver :/ 
    //HOWEVER, this could be easier than it seems at first...
    
    //THE !  -- KEY  -- ! is to MERGE the ENTITY / computation representations with the I
    //already built INTERPRETER functionality (intelligently) 
    //not sure exactly how that looks but it is fascinating ;) 
    
    //before I do this i will finish STATS videos 
    let parser = new Parser(); 
    return parser.parse("last dream and add ten and add ten") 
}

function test6() { 
    return test5().map(generate_computation)     
}

function test7() { 
    return do_computations(test6()) 
}


function test8() { 

} 


function iparse(txt) { 
    return ii.parse(txt) 
}


function pparse(txt) { 
    let parser = new Parser();     
    return parser.parse(txt) 
}

function compute_entities(es) { 
    return do_computations(generate_computation(es)) 
}

function compute(ds) { 
    return do_computations(ds) 
}


module.exports = { 
    test1 , 
    test2, 
    test3, 
    test4, 
    test8 , 
    iparse , 
    pparse , 
    compute, 
    generate_computation , 
    do_computations , 
}
