import React from "react";
import { useSelector } from "react-redux";

import command_manifest from "../js/command_manifest.js";

var log = function(x) {
  window.vcs_ui.log(x);
};

function CmdWrapper(props) {
  var state = useSelector(state => state);
  if (state.subscriptions[props.subscribe_id]) {
    return <props.Renderer subscribe_id={props.subscribe_id} />;
  } else {
    return <h1>Awaiting State</h1>;
  }
}

function CmdsContainer() {
  var active_ids = useSelector(state => state.active_ids);

  var cmd_uis = active_ids.map(function(id) {
    let cmd = id
      .split("_")
      .slice(0, -1)
      .join("_");
    var Renderer = null;

    if (!command_manifest[cmd]) {
      log("!! Could not find matching interface for cmd: " + cmd);
      Renderer = command_manifest["default"];
    } else {
      //1
      log("Found matching command interface for: " + cmd);
      Renderer = command_manifest[cmd];
    }

    return (
      <CmdWrapper Renderer={Renderer} subscribe_id={id} key={id}></CmdWrapper>
    );
  });

  return <div className="commandsContainer">{cmd_uis}</div>;
}

export default CmdsContainer;
