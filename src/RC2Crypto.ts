const CryptoJS = require('./rc2.js');
class RC2Crypto {
     encryptRC2(data : string, password : string) {
       const cipherText2 = CryptoJS.default.RC2.encrypt(data, password);
       return cipherText2
         // return 'dsf';
    }
     decryptRC2(data : string, password :string) {
       let bytes = CryptoJS.default.RC2.decrypt(data, password);
       let plaintext = bytes.toString(CryptoJS.default.enc.Utf8);
       return plaintext;
         // return '23';
    }
}
 export default RC2Crypto;