//Sun Mar  3 11:10:33 PST 2019

const winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    //return `${timestamp} ${level}: ${message}`;
    //return `${level}: ${message}`;
    return `${message}`;    
});

const logger = createLogger({
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [new transports.Console()]
});

logger.level = 'debug' 


function get_logger(name) { 

    
    let l = function(t,m) { 
	let spacer = t =='info' ? " " : "" 
	let header = "[" + name + "] \t\t ~ " 	
	
	if (typeof(m) == 'string' ) { 
	    logger[t](header + m)   //adds header if string
	}
	else { 
	    logger[t](header)       //if not prints header first 
	    logger[t](m)
	}
    }

    let i = function(m) { l("info",m) } 
    let d = function(m) { l("debug", m) } 

    return { i, d } 
} 

module.exports = { get_logger } 
