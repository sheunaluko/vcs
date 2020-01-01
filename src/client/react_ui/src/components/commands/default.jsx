import React from "react";
import { useSelector } from "react-redux";

function UI(props) {
  var state = useSelector(state => state);

  return (
    <div>
      <h1>DEFAULT</h1>
      <p>{JSON.stringify(state["subscriptions"][props.subscribe_id])}}</p>
    </div>
  );
}

export default UI;
