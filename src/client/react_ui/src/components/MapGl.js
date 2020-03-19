import React, { useState } from 'react';
import ReactMapGL from 'react-map-gl';

export function MapGl() {
  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100%",
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8
  });

  window.vcs_setViewport = setViewport
  window.vcs_viewPort = viewport

  window.vcs_set_viewport = function(vp) { 

    let new_vp = Object.assign(viewport,vp)
    console.log("Setting: ")
    console.log(new_vp)
    setViewport(new_vp) 
    
  }

  return (
    <ReactMapGL
      {...viewport}
      onViewportChange={setViewport}
      mapboxApiAccessToken={"pk.eyJ1Ijoic2F0dHN5cyIsImEiOiJjazd5YzBicjMwNWNkM2ZvN3BxaWViNDF6In0.oB6zUrblPfbayrW9DKphhA"} 
    />
  );
}