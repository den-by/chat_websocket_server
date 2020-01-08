"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Connection_1 = __importDefault(require("./Connection"));
const http = require('http');
const ws = require('ws');
const wss = new ws.Server({ noServer: true });
function accept(req, res) {
    // все входящие запросы должны использовать websockets
    if (!req.headers.upgrade || req.headers.upgrade.toLowerCase() != 'websocket') {
        res.end();
        return;
    }
    // может быть заголовок Connection: keep-alive, Upgrade
    if (!req.headers.connection.match(/\bupgrade\b/i)) {
        res.end();
        return;
    }
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onConnect);
}
class ServerData {
    constructor() {
        this.connectionList = [];
        this.userList = [];
        this.messageList = [];
    }
    sendAll(message) {
        this.messageList.push(message);
        this.connectionList.forEach((value, key) => {
            value.newMessage(message);
        });
    }
    userListUpdate() {
        this.connectionList.forEach((value, key) => {
            value.sendUserList();
        });
    }
}
let serverData = new ServerData();
function onConnect(ws) {
    let connection = new Connection_1.default(ws, serverData);
    serverData.connectionList.push(connection);
    connection.sendMessageList(10);
}
if (!module.parent) {
    http.createServer(accept).listen(8080);
}
else {
    exports.accept = accept;
}
//# sourceMappingURL=index.js.map