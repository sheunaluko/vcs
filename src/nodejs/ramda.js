const R = require('ramda');

let m = {}  // define module object 

/* Ramda extensions */
R.isFalse = R.equals(false) 
R.first = R.nth(0) 
R.second = R.nth(1) 
R.third = R.nth(2) 

function map_as_array(m) { 
    
}
R.mapIndexed = R.compose(R.values , R.mapObjIndexed ) 



/* Define Rx (custom Ramda) functions here */ 
m.length_of_keys            = R.compose(R.length, R.keys) 
m.filter_by_val_key_length  = R.filter(m.length_of_keys)
m.all_dict_vals_empty       = R.compose(R.isEmpty,m.filter_by_val_key_length)

/* define thread fn (https://jondavidjohn.com/clojure-threading-macros-in-javascript/) */ 
// IMPORTANT THIS FUNCTION CANNOT BE curried !! " 
let thread = function(type,args) {
    var i, type, func, value;
    value = args.shift();
    switch (type) {
        case '->': // thread-first
            while (args.length) {
                arg = args.shift();
                if (arg instanceof Array) {
                    func = arg.shift();
                    arg.unshift(value);
                    value = func.apply(this, arg);
                }
                else {
                    value = arg(value);
                }
            }
            break;

        case '->>': // thread-last
            while (args.length) {
                arg = args.shift();
                if (arg instanceof Array) {
                    func = arg.shift();
                    arg.push(value);
                    value = func.apply(this, arg);
                }
                else {
                    value = arg(value);
                }
            }
            break;
    }
    return value;
};

R.thread_f = function(...args) { return thread('->',args) } 
R.thread_l = function(...args) { return thread('->>', args) }
R.thread = thread 



R.custom = m 
module.exports = R




