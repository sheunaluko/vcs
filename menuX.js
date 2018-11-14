


var close_btn = '<a href="javascript:void(0)" class="menuX_close" onclick="menuX_close()"><i class="fas fa-window-close"></i></a>'


var style_string = '.menuX_nav { height: 100%;\nwidth: 0;\nposition: fixed;\nz-index: 1000;\ntop: 0;\nleft: 0;\nbackground-color: #111;\noverflow-x: hidden;\ntransition: 0.5s;\npadding-top: 25px;\n } \n#menuX_body { transition: margin-left .5s;\npadding: 16px; } \n.menuX_close { position: absolute;\ntop: 0;\nright: 25px;\nfont-size: 36px;\nmargin-left: 50px;\nmargin-top : 20px; }'


function add_style() { 
    let link_str = '<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous">'

    document.head.insertAdjacentHTML('beforeend', link_str)
    let style = document.createElement("style")
    style.innerHTML = style_string 
    document.body.insertAdjacentElement('afterbegin', style)     
} 

function wrap_body() { 
    
    let children  = document.body.children
    let wrapper = document.createElement("div") 
    wrapper.id = "menuX_body" 
    
    //copy them over
    for (let c of children) { 
	wrapper.appendChild(c.cloneNode(true))   //note the cloneNode call 
    }
    
    //now delete all the items from the body 
    while (document.body.firstChild) {
	document.body.removeChild(document.body.firstChild) 
    }
    
    //add the div to body 
    document.body.insertAdjacentElement('afterbegin', wrapper) 
}

function string2html(s) { 
    var r = document.createElement("div") 
    r.insertAdjacentHTML('afterbegin' , s) 
    return r.firstChild 
}

function make_option(option) { 
    let template = "<option value=\"TO_REPLACE\">TO_REPLACE</option>"  
    let result = template.replace(/TO_REPLACE/g, option)
    return string2html( result ) 
}

var plugin_content = {} 

function add_selector(s, c) { 
    let e = document.getElementById("menuX_selector") 
    e.appendChild( make_option(s) ) 
    
    if (typeof c == "string" ) { 
	c = string2html(c) 
    }
    
    plugin_content[s] = c
    
    handle_selector_change()
}

function get_container() { 
    return document.getElementById("menuX_container")
}

function remove_els(e) {
    while (e.firstChild) { 
	e.removeChild(e.firstChild) 
    }
}

function handle_selector_change() { 
    let val = document.getElementById("menuX_selector").value

    // and set the container hmtl to the html of the appropriate selector 
    let c = get_container() 
    
    //empty it -- 
    remove_els(c) 
    
    //add the html 
    c.appendChild(plugin_content[val])
    
    
}

function add_menu() { 
    let menu = document.createElement("div") 
    menu.id = "menuX_menu"
    menu.className = "menuX_nav"
    
    var close  = document.createElement("div")
    close.innerHTML = close_btn 
    close = close.firstChild 
    
    var selector = document.createElement("select")
    selector.id = "menuX_selector"
    selector.style = "margin-left : 10px;"
    selector.onchange = handle_selector_change
    
    var container  = document.createElement("div") 
    container.id = "menuX_container" 
    container.style = "height: 80%; width : 100% ; margin-top : 50px; color : white;"

    
    
    menu.appendChild(selector) 
    menu.appendChild(close)
    menu.appendChild(container)
    document.body.insertAdjacentElement('afterbegin', menu)     
    
    add_selector("info" , "<p>menuX -- version 0.1 | sheun_aluko 2018-19</p>")   

    
}

function add_button() { 
    let button = document.createElement("a") 
    button.href = "javascript:void(0)"
    button.style = "position: fixed; z-index:0.5 ; top: 3; left: 5; opacity : 0.5; color: blue; "
    button.onclick = menuX_open
    button.innerHTML = "mX"
    document.body.insertAdjacentElement('afterbegin', button)         
}

function inject_menuX() { 
    wrap_body() 
    add_menu() 
    add_style()
    add_button()
} 


function menuX_open() {
    document.getElementById("menuX_menu").style.width = "250px";
    //document.getElementById("menuX_body").style.marginLeft = "250px";
}

function menuX_close() {
    document.getElementById("menuX_menu").style.width = "0";
    document.getElementById("menuX_body").style.marginLeft= "0";
}



/// the interface to menuX is add_selector("id", init_content) 




