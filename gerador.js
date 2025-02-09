
//gerador de senha para o JWT_SECRET
const crypto = require('crypto');
console.log(crypto.randomBytes(64).toString('hex'));


