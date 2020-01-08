import Connection from "./Connection";

const http = require('http');
const ws = require('ws');



const wss = new ws.Server({noServer: true});

function accept(req : any, res :any) {
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

class ServerData{
    public connectionList:  Connection[] = [];
    public userList: string[] = [];
    public messageList: string[] = [];
    constructor() {
    }
    sendAll(message: string ) {
        this.messageList.push(message);
        this.connectionList.forEach((value: Connection, key) => {
            value.newMessage(message);
        })
    }

    userListUpdate() {
        this.connectionList.forEach((value, key) => {
             value.sendUserList();
        })
    }
}

let serverData : any = new ServerData();

function onConnect(ws: any) {
    let connection = new Connection(ws, serverData);
    serverData.connectionList.push(connection);
    connection.sendMessageList(10);
}




if (!module.parent) {
    http.createServer(accept).listen(8080);
} else {
    exports.accept = accept;
}

