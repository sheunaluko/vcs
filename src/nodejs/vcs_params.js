//Sat May  4 18:34:08 PDT 2019

var params = { 
    emit_mode : "default" ,
    user_abort : 'abort'  , 
    feedback_indicator : "::@" , 
    escape_indicator  : "::^" , 
    text_port : 9001 ,  //web socket connects here to relay voice msgs 
    csi_port  : 9002 ,  //csi port 
    ui_port   : 9003 ,  //user interface connects here 
    sync_port : 9004 ,  //diffserver for UI connects here  
    db_enabled : true , 
    csi_enabled : true ,
    ui_server_enabled : true , 
    diff_server_enabled : true , 
    os : { platform : require("os").platform() } , 
}

//platform specific parameter definitions 
var os_params  =  { 
    file_delimiter : { 
	'darwin' : "/" , 
	'linux'  : "/" , 
    } , 
}

//load the platform specific parameter definitions 
Object.keys(os_params).map(function(k){ 
    params.os[k] = os_params[k][params.os.platform] 
}) 


module.exports = {
    params 
}
    
