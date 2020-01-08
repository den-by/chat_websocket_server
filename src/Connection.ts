const RC2Crypto = require('./RC2Crypto');

interface request {
    requestType: requestType;
    data: { name?: string, message?: string, text?: string }
}

enum requestType {
    login = 0,
    message = 1,
    getUsers = 2,
    logOut = 3,
    getMessages = 4,
}

interface response {
    responseType: responseType;
    data?: {}
}

enum responseType {
    newMessage = 0,
    userConnected = 1,
    userDisconnected = 2,
    userList = 3,
    messageList = 4,
    serverKick = 5,
    loginSuccessfully = 6
}

class Connection {
    private ws: any;
    private serverData: any;
    public userName: string | undefined = undefined;
    private pass = 'test';
    private crypto: any;

    constructor(ws: any, serverData: any) {
        this.ws = ws;
        this.serverData = serverData;
        ws.on('message', (data: any) => this.onMessage(data));
        this.sendMessageList(10);
        this.sendUserList();
        this.crypto = new RC2Crypto.default();
    }

    public onMessage(data: any): void {
        console.log(data);
        let request: request;
        let decryptData;
        try {
            debugger
            decryptData = this.crypto.decryptRC2(data, this.pass);
            console.log(decryptData);
            request = JSON.parse(decryptData);
        } catch (e) {
            console.log('PassError');
            return;
        }
        let message: string;
        switch (+request.requestType) {
            case requestType.login:
                let oldName = this.userName;
                this.userName = request.data['name'];
                if (oldName) {
                    message = 'Пользователь ' + oldName + ' теперь известен как ' + this.userName;
                } else {
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

    sendData(data: response) {
        const jsonData = JSON.stringify(data);
        this.ws.send(jsonData);
    }

    newMessage(message: string) {
        const data: response = {responseType: responseType.newMessage, data: {text: message}};
        this.sendData(data);
    }

    sendMessageList(count: any) {
        const data: response = {
            responseType: responseType.messageList,
            data: {messageList: this.serverData['messageList'].slice(-count)}
        };
        this.sendData(data);
    }

    sendUserList() {
        const data: response = {
            responseType: responseType.userList,
            data: {userList: this.serverData['connectionList'].filter((val: any) => val.userName).map((val: any) => val.userName)}
        };
        this.sendData(data);
    }

}

export default Connection;