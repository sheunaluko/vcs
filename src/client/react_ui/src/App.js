import React from 'react';
import Home from './components/Home.js' 
import CmdsContainer from './components/CmdsContainer.js'
import ChatBox from './components/ChatBox.js'

function App() {
  return (
    <div className="App">
	  <Home />
	  <CmdsContainer /> 
	  <ChatBox /> 
    </div>
  );
}

export default App;
