import React from "react";
import { useSelector } from "react-redux";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import { ObjectInspector, TableInspector } from "react-inspector";

export function Inspector(props) {
  var ports = useSelector(state => state.inspection_ports);
  var inspection_candidates = Object.keys(ports);

  //the UI should render a list of possible things to inspect
  return (
    <ul>
      {inspection_candidates.map(function(x) {
        return (
          <li key={performance.now()}>
            <div>  
                <span>{x}</span>
            <ObjectInspector data={ports[x]} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
