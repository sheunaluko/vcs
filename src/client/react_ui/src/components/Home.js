import React from "react";
import { useSelector } from "react-redux";

function Home() {
  var msg = useSelector(state => state.message);

  return (
    <div>
      <h1>vcs</h1>
    </div>
  );
}

export default Home;


