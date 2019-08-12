//Sat May  4 18:34:08 PDT 2019

var params = { 
    emit_mode : "default" ,
    user_abort : 'abort'  , 
    feedback_indicator : "::@" , 
    escape_indicator  : "::^" , 
    text_port : 9001 ,  //web socket connects here to relay voice msgs 
    ui_port   : 9003 ,  //user interface connects here 
    sync_port : 9004 ,  //diffserver for UI connects here  
    using_db : true , 
}


module.exports = {
    params 
}
    
