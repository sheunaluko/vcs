import React, { Component } from "react";
import { Launcher } from "react-chat-window";
import { useSelector } from "react-redux";

var log = function(x) {
  window.vcs_ui.log(x);
};

//https://www.npmjs.com/package/react-chat-window (source code)
class ChatBox extends Component {
  constructor() {
    super();
    this.state = {
      messageList: []
    };

    //init ws and connect with the vcs text endpoint here
    var ws = new WebSocket("ws://localhost:9001");

    //and configure call backs
    ws.onopen = function() {
      log("ChatBox Connected to VCS text ws server");
    };
    ws.onmessage = function(m) {
      var msg = JSON.parse(m.data);
      log("ChatBox Received message:");

      console.log(msg);

      switch (msg.type) {
        case "output":
          log("ChatBox rendering output: " + msg.text);
          this._sendMessage(msg.text);
          break;
        case "unrecognized_input":
          this._sendMessage("What?");
          break;

        case "params":
          break;

        case "command_result":
          log("ChatBox got command result:");
          console.log(msg.result);

        default:
          log(
            "ChatBox Received unrecognized message type " +
              msg.type +
              " from vcs server"
          );
      }
    }.bind(this);

    ws.onclose = function() {
      log("ChatBox websocket CLOSING! !! ");
    };

    this.ws = ws;
  }

  _onMessageWasSent(message) {
    this.setState({
      messageList: [...this.state.messageList, message]
    });

    log("ChatBox detected msg sent: ");
    console.log(message);
    let type = "vcs_text";
    let text = message.data.text;
    this.ws.send(JSON.stringify({ type, text }));
    log("Send ws message: ");
    console.log({ type, text });
  }

  _sendMessage(text) {
    if (text.length > 0) {
      this.setState({
        messageList: [
          ...this.state.messageList,
          {
            author: "them",
            type: "text",
            data: { text }
          }
        ]
      });
    }
  }

  render() {
    return (
      <div>
        <Launcher
          agentProfile={{
            teamName: "VCS Chat"
            //imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
          }}
          onMessageWasSent={this._onMessageWasSent.bind(this)}
          messageList={this.state.messageList}
          showEmoji
        />
      </div>
    );
  }
}

export default ChatBox;
