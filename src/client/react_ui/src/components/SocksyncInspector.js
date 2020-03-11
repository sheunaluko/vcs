import React, { useState } from "react";
//import ReactDOM from "react-dom";

import * as util from "../js/vcs_client/utils.js";
import * as socksync from "../js/socksync_web_client.js";
import { ObjectInspector } from "react-inspector";
import { Button, Collapse, Divider, FormGroup, InputGroup } from "@blueprintjs/core";
//import JsxParser from "react-jsx-parser";
import * as Babel from "@babel/standalone";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-jsx";
import "ace-builds/src-noconflict/theme-github";

window.babel = Babel;
window.React = React;
window.transpile = function(text) {
  let code = Babel.transform(text, { presets: ["react"] }).code;
  return code;
};

var log = util.get_logger("ss_insp");

function make_client(ops) {
  //let { port, host, subscribe_id, on_update } = ops;
  var client = new socksync.Client(ops);
  return client;
}

/* 
 TO DO -- have blueprint form 
 then evalaute it and connect to the thing ... 
 then render an inspector element 
*/

let editor = () => document.getElementById("textEditor");
window.editor = editor;

const aceDefault = `(state) => { 
    return ( 
        <h1> Hiya </h1> 
    )
}`;

function MyInspector(state) {
  return <ObjectInspector data={state} />;
}

class ConfigurationUI extends React.Component {
  state = {isOpen : true , ui_state : {} } 

  client = null;
  renderElement = MyInspector;

  editorText = aceDefault;
  
  componentDidMount() { 
      //window.obj = this 
  }

  componentWillUnmount() { 
      //close the client 
      this.client.ws.close() 
  }

  getEditor() {
    return (
      <AceEditor
        mode="jsx"
        theme="github"
        name="textEditor"
        editorProps={{ $blockScrolling: true }}
        width="inherit !important"
        height="150px"
        value={this.editorText}
        onChange={function(v) {
          let e = editor();
          e.code = v;
          this.editorText = v;
        }.bind(this)}
      />
    );
  }

  makeSS() {
    //first get all the data
    let host = document.getElementById("url").value || "localhost";
    let port = document.getElementById("port").value || 9005;
    let subscribe_id = document.getElementById("sid").value || "main";

    console.log(
      `Got options: host=${host},port=${port},subscribe_id=${subscribe_id}`
    );

    //now we make the sock sync client ...
    let on_update = function(data) {
      //update the state with it
      this.setState({ui_state: data});
      console.log("State updated with:");
      console.log(data);
    }.bind(this);

    let ops = { port, host, subscribe_id, on_update };
    this.client = make_client(ops);
  }

  renderClick() {
    // eslint-disable-next-line no-new-func
    let text = this.editorText;

    let code = Babel.transform(text, { presets: ["react"] }).code;
    console.log("Got code:");
    console.log(code);
    let El = eval(code);

    console.log("Setting render element ");
    this.renderElement = El;
    this.setState(state => state);
  }

  render() {
    return (
      <div style={{ margin: "30px" }}>
        {" "}
        <Button onClick={
            (function(){this.setState((state)=> { return {isOpen : !state.isOpen}})}).bind(this)}>
          {this.state.isOpen ? "Hide Config" : "Show Config"} 
        </Button> 

        <Divider/> 


        <Collapse
          isOpen={this.state.isOpen}
          keepChildrenMounted={true}
        >
          <button
            id="button"
            style={{ marginBottom: "5px" }}
            onClick={this.makeSS.bind(this)}
          >
            Connect
          </button>
          <FormGroup label="URL" labelFor="url">
            <InputGroup id="url" placeholder="localhost" />
          </FormGroup>
          <FormGroup label="Port" labelFor="port">
            <InputGroup id="port" placeholder={9005} />
          </FormGroup>
          <FormGroup label="Subscribe ID" labelFor="sid">
            <InputGroup id="sid" placeholder="main" />
          </FormGroup>
          <button
            id="button"
            style={{ marginBottom: "5px" }}
            onClick={this.renderClick.bind(this)}
          >
            Render JSX
          </button>

          {this.getEditor()}
        </Collapse>
        <div
          id="uiHolder"
          style={{ marginTop: "10px", backgroundColor: "white" }}
        >
          {this.renderElement(this.state.ui_state)}
        </div>
      </div>
    );
  }
}

function InspectionUI() {
  return <h1>You chose </h1>;
}

export function SSInspector() {
  var [state, update_state] = useState({});
  var [configuring, update_configuring] = useState(true);

  if (configuring) {
    return <ConfigurationUI update={update_configuring} />;
  } else {
    return <InspectionUI />;
  }
}

/* 

let getNodes = str =>
  new DOMParser().parseFromString(str, "text/html").body.childNodes;
let createJSX = nodeArray => {
  const className = nodeArray[0].className;
  return nodeArray.map(node => {
    let attributeObj = {};
    const { attributes, localName, childNodes, nodeValue } = node;
    if (attributes) {
      Array.from(attributes).forEach(attribute => {
        if (attribute.name === "style") {
          let styleAttributes = attribute.nodeValue.split(";");
          let styleObj = {};
          styleAttributes.forEach(attribute => {
            let [key, value] = attribute.split(":");
            styleObj[key] = value;
          });
          attributeObj[attribute.name] = styleObj;
        } else {
          attributeObj[attribute.name] = attribute.nodeValue;
        }
      });
    }
    return localName
      ? React.createElement(
          localName,
          attributeObj,
          childNodes && Array.isArray(Array.from(childNodes))
            ? createJSX(Array.from(childNodes))
            : []
        )
      : nodeValue;
  });
};

export const StringToJSX = props => {
  return createJSX(Array.from(getNodes(props.domString)));
};
*/
