//Sun Mar 10 14:09:31 PDT 2019


class Filter { 
    constructor(filters) { 
	this.filters  = filters 
    }
    
    set_filters(fs) {
	this.filters = fs 
    }
    
    add_filter(f) { 
	this.filters.push(f) 
    }
    
    remove_filter(f) { 
	this.filters.filter(x=>x!=f)
    }

    /* runs the filter on a given input */ 
    filter(input){ 
	var result = input 
	if (this.filters && this.filters.length) {
	    for (var i=0; i< this.filters.length; i++) { 
		result = this.filters[i](result) 
	    } 
	}
	return result 
    }
    
}


function string_dict_filter(dict) { 
    return function(input) { 
	if (typeof input == 'string' ) {
	    let to_find = Object.keys(dict) 
	    for (var i=0; i<to_find.length; i++) { 
		let re = new RegExp(to_find[i], "g") 
		input = input.replace(re,dict[to_find[i]])
	    } 
	} 
	return input 
    }
} 

function lower_case(x) { return x.toLowerCase() } 

let number_filter = string_dict_filter(
    {
      "one" : 1,
      "two" : 2, 
      "three" : 3, 
      "four"  : 4, 
      "five"  : 5,
      "six"   : 6, 
      "seven" : 7,
      "eight" : 8, 
      "nine"  : 9, 
      "ten"   : 10,  
    }) 

module.exports = { Filter , string_dict_filter, lower_case, number_filter } 
