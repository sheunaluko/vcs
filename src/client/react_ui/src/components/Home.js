import React from "react";
import { useSelector } from "react-redux";

function Home() {
  var msg = useSelector(state => state.message);

  return (
    <div>
      <h1>VCS UI HOMEPAGE</h1>

      <p>{msg}</p>
    </div>
  );
}

export default Home;
