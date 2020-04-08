import React, { useState } from "react";
import Globe from "react-globe.gl";

import {
  Button,
  ControlGroup,
  InputGroup,
  Spinner , 
} from "@blueprintjs/core";

/* 
    This program will allow you to visualize the path that
    traceroute returns to any public domain 

    In order to request the traceroute information directly 
    from the web browser, we use the sattsys.hyperloop library, 
    which has been configured to expose the traceroute service 

    
*/

async function traceroute(url) {
  if  (!window.vcs.hyperloop) { 
      await window.vcs.hyperloop_connect() 
  }

  return await window.vcs.hyperloop_call({
    id: "sattsys.hyperloop.traceroute",
    args: { url }
  });
}


const N = 3;

function get_data() {
    const arcsData = [...Array(N).keys()].map(() => ({
        startLat: (Math.random() - 0.5) * 180,
        startLng: (Math.random() - 0.5) * 360,
        endLat: (Math.random() - 0.5) * 180,
        endLng: (Math.random() - 0.5) * 360,
        color: [
          ["red", "white", "blue", "green"][Math.round(Math.random() * 3)],
          ["red", "white", "blue", "green"][Math.round(Math.random() * 3)]
        ]
      }));
    return arcsData 
} 

function parse_ip_locs(locs){
    return locs.map(function(l) {
        return {
            latitude : Number(l.result.latitude),
            longitude : Number(l.result.longitude)
         } 
    })
}


function geo_data_to_arcs(geo_data) { 
    var arcs = [] 
    for (var i =0; i < geo_data.length -1 ;  i++ ) { 
        let curr = geo_data[i]
        let next = geo_data[i+1]
        arcs.push( {
            startLat : curr.latitude , 
            startLng : curr.longitude , 
            endLat :   next.latitude , 
            endLng :   next.longitude ,  
            color: [ 
                "white" , 
                ["red", "black", "blue", "green", "orange", "yellow"][Math.round(Math.random() * 3)]
            ]
              
        }) 
    }
    return arcs 
}




export function GlobeGl() {

    var [data , setData ] = useState([]) 


    /*

    setInterval( function() {
        setData(get_data()) 
    } , 4000)

    */ 


    var do_search = async function(setState) {  

        setState({thinking : true }) 

        let url = document.getElementById("globe.traceroute.search").value
        console.log("Doing traceroute request with the url: " + url) 

        setState({displaying : url }) 

        let trace_data = (await traceroute(url)).result
        console.log("Got data...") 
        console.log(trace_data) 

        let ips = trace_data.map(x=>x.ip).slice(1)
        console.log("Got ips..")
        console.log(ips) 

        //need to translate the ips into geolocation data, 
        //and will use the hyperloop for that too 

        let promises = ips.map(ip=>window.vcs.hyperloop_call({id:"sattsys.hyperloop.geolocate_ip" , args : {ip } }))
        let ip_locs = await Promise.all(promises) 

        console.log("Got ip locs: ") 
        console.log(ip_locs)

        let geo_data = parse_ip_locs(ip_locs) 
        console.log("Got geo data:" ) 
        console.log(geo_data) 

        let arcs = geo_data_to_arcs(geo_data) 
        console.log("Got arc data:")
        console.log(arcs) 

        console.log("Setting globe data") 
        setData(arcs)

        setState({thinking: false}) 
        

    }


    var SearchWidget = function() {

        var [state, setState] = useState( {thinking : false , displaying : "none"  })

        const style = { flexGrow: undefined };
        return (
          <div style={{ position: "absolute", top: "20px", left: "20px" , zIndex : 1000  }}>
            <ControlGroup style={style}>
              <InputGroup id="globe.traceroute.search" placeholder="Enter url..." />
              <Button icon="arrow-right" onClick={function(){do_search(setState)}}/>
            
            </ControlGroup>
        <p style={{color : "white"}}> Currently displaying : {state.displaying}</p>
        <div>
        { state.thinking ? <Spinner/> : null }             
        </div> 
        </div>
        );
      }

  return (
    <div style={{position :"relative", zIndex : 0 }}>
      <SearchWidget />
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        arcsData={data}
        arcColor={"color"}
        arcStroke={"2px"}
        arcDashLength={() => 0.3}
        arcDashGap={() => 0.05}
        arcDashAnimateTime={() => 8000}
      />
    </div>
  );
}
