"use strict";
/*
 Sat Feb 29 10:47:36 PST 2020
 Typescript module for VCS_TEXT_CLIENT
 Will provide a small re-usable library for
 Communicating with VCS Text server
 */
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var VCS_TEXT_CLIENT = /** @class */ (function () {
    function VCS_TEXT_CLIENT(ops) {
        this.conn = undefined; // ref to the connection 
        this.ops = ops;
    }
    VCS_TEXT_CLIENT.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log.apply(null, __spreadArrays(["[vtc(" + (this.ops.id || "") + ")]::"], args));
    };
    VCS_TEXT_CLIENT.prototype.connect = function () {
        try {
            var url = "ws://" + this.ops.host + ":" + this.ops.port;
            this.log("Attempting connection to url: " + url);
            this.conn = new WebSocket(url);
            /*
            Set the msg handlers
            */
            //open 
            this.conn.onopen = (function open() {
                this.log("Connection opened");
                if (this.ops.on_open) {
                    this.ops.on_open();
                }
            }).bind(this);
            //msg
            this.conn.onmessage = (function message(_msg) {
                this.log("Got message");
                var msg = JSON.parse(_msg.data);
                //for now we just forward the message to the handler 
                this.ops.on_msg(msg);
            }).bind(this);
            //close 
            this.conn.onclose = (function close() {
                this.log("WS Connection was closed for some reason");
                if (this.ops.reconnect) {
                    this.log("Attempting reconnect");
                    this.connect();
                }
            }).bind(this);
        }
        catch (e) {
            this.log("Oops.. an error occured");
            this.log("Here it is:");
            this.log(e);
            //throw("Could not connect") 
            if (this.ops.reconnect) {
                setTimeout((function () {
                    this.connect();
                }).bind(this), this.ops.reconnect);
                //will reconnect after this.ops.reconnect MS 
            }
        }
    };
    VCS_TEXT_CLIENT.prototype.send = function (msg) {
        /*
        For now allow sending of any object
        */
        if (this.conn) {
            this.conn.send(JSON.stringify(msg));
        }
        else {
            this.log("Not yet connected! Please connect first by running {obj}.connect()");
        }
    };
    VCS_TEXT_CLIENT.prototype.close = function () {
        if (this.conn) {
            this.conn.close();
        }
    };
    return VCS_TEXT_CLIENT;
}());
exports.VCS_TEXT_CLIENT = VCS_TEXT_CLIENT;
