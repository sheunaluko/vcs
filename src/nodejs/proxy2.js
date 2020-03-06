exports.debug = null 

var http = require('http'),
    httpProxy = require('http-proxy');

var qstring = require("query-string") 
    
//
// Create a proxy server with custom application logic
//
var proxy = httpProxy.createProxyServer({});

//
// Create your custom server and just call `proxy.web()` to proxy
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
//
var server = http.createServer(function(req, res) {
  // You can define here your custom logic to handle the request
  // and then proxy the request.
  //let parsed = qstring.parseUrl(req.url) 
  //let query = parsed.query 

  //let target = query.target
  
  //console.log("Request for target: " +  target) 

  res.oldWriteHead = res.writeHead;
  res.writeHead = function(statusCode, headers) {
    /* add logic to change headers here */
    
    res.removeHeader("X-Frame-Options")
    //res.removeHeader("Set-Cookie") 
    //res.setHeader("Content-Security-Policy","")      
    res.setHeader("Access-Control-Allow-Origin" , "*" ) 
    console.log(res.getHeaders()) 
    exports.debug = res.getHeaders()
    

    res.oldWriteHead(statusCode, headers);
  }

  exports.debug = [req,res] 
  
  proxy.web(req, res, { target  :  "https://www.google.com", changeOrigin : true , followRedirects : true });
});

console.log("listening on port 5050")
server.listen(5050);
