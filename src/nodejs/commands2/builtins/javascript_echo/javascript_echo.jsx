import React from "react";
import { useSelector } from "react-redux";

function UI(props) {
  var state = useSelector(state => state["subscriptions"][props.subscribe_id]);
  var items = state.items;

  return (
    <div>
      <h1>Javascript Echo</h1>
      <p> {items[items.length - 1].time}</p>
      <p> You said => {items[items.length - 1].text}</p>
    </div>
  );
}

export default UI;
