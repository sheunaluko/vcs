import React from "react";
import { useSelector } from "react-redux";

function UI() {
  var state = useSelector(state => state[this.props.subscribe_id]);

  return (
    <div>
      <h1>JAVASCRIPT ECHO</h1>

      <p>{state.items[state.items.length - 1].text}</p>
    </div>
  );
}

export default UI;
