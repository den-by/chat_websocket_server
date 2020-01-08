"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CryptoJS = require('./rc2.js');
class RC2Crypto {
    encryptRC2(data, password) {
        const cipherText2 = CryptoJS.default.RC2.encrypt(data, password);
        return cipherText2;
        // return 'dsf';
    }
    static decryptRC2(data, password) {
        let bytes = CryptoJS.default.RC2.decrypt(data, password);
        let plaintext = bytes.toString(CryptoJS.default.enc.Utf8);
        return plaintext;
        // return '23';
    }
}
exports.default = RC2Crypto;
//# sourceMappingURL=RC2Crypto.js.map