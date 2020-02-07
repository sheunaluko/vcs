
//Thu Feb  6 16:01:26 PST 2020

/* 
   VCS Interpretar target definitions for parsing to GPS entities 
*/

const {res,ops,types}  = require("./entities/index.js")  



//note that x in the fns below is an OBJECT with fields returned from the parser 
//chose x to NOT conflict with the ops var 
function res_numeric(x) { 
    return res.make_numeric(x) 
}

function op_increment(x) {
    return ops.make_incrementor(x) 
}

module.exports = { 
    res_numeric, 
    op_increment , 
}

