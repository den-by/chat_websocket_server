"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RC2Crypto_1 = __importDefault(require("./RC2Crypto"));
var requestType;
(function (requestType) {
    requestType[requestType["login"] = 0] = "login";
    requestType[requestType["message"] = 1] = "message";
    requestType[requestType["getUsers"] = 2] = "getUsers";
    requestType[requestType["logOut"] = 3] = "logOut";
    requestType[requestType["getMessages"] = 4] = "getMessages";
})(requestType || (requestType = {}));
var responseType;
(function (responseType) {
    responseType[responseType["newMessage"] = 0] = "newMessage";
    responseType[responseType["userConnected"] = 1] = "userConnected";
    responseType[responseType["userDisconnected"] = 2] = "userDisconnected";
    responseType[responseType["userList"] = 3] = "userList";
    responseType[responseType["messageList"] = 4] = "messageList";
    responseType[responseType["serverKick"] = 5] = "serverKick";
    responseType[responseType["loginSuccessfully"] = 6] = "loginSuccessfully";
})(responseType || (responseType = {}));
class Connection {
    constructor(ws, serverData) {
        this.userName = undefined;
        this.pass = 'test';
        this.ws = ws;
        this.serverData = serverData;
        ws.on('message', (data) => this.onMessage(data));
        this.sendMessageList(10);
        this.sendUserList();
        this.crypto = new RC2Crypto_1.default();
    }
    onMessage(data) {
        console.log(data);
        let request;
        let decryptData;
        try {
            debugger;
            decryptData = this.crypto.decryptRC2(data, this.pass);
            console.log(decryptData);
            request = JSON.parse(decryptData);
        }
        catch (e) {
            console.log('PassError');
            return;
        }
        let message;
        switch (+request.requestType) {
            case requestType.login:
                let oldName = this.userName;
                this.userName = request.data['name'];
                if (oldName) {
                    message = 'Пользователь ' + oldName + ' теперь известен как ' + this.userName;
                }
                else {
                    message = 'Пользователь с именем ' + this.userName + ' зашел в чат';
                }
                console.log(message);
                this.serverData.sendAll(message);
                this.serverData.userListUpdate();
                break;
            case requestType.message:
                let userSay = request.data['message'];
                message = this.userName + ': ' + userSay;
                console.log(message);
                this.serverData.sendAll(message);
                break;
            default:
                break;
        }
    }
    sendData(data) {
        const jsonData = JSON.stringify(data);
        // const cryptoData = this.crypto(jsonData, this.pass);
        // console.log(cryptoData);
        this.ws.send(jsonData);
    }
    newMessage(message) {
        const data = { responseType: responseType.newMessage, data: { text: message } };
        this.sendData(data);
    }
    sendMessageList(count) {
        const data = {
            responseType: responseType.messageList,
            data: { messageList: this.serverData['messageList'].slice(-count) }
        };
        this.sendData(data);
    }
    sendUserList() {
        const data = {
            responseType: responseType.userList,
            data: { userList: this.serverData['connectionList'].filter((val) => val.userName).map((val) => val.userName) }
        };
        this.sendData(data);
    }
}
exports.default = Connection;
//# sourceMappingURL=Connection.js.map