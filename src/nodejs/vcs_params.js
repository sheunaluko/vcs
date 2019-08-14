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
}


module.exports = {
    params 
}
    
