const koaJWT = require("koa-jwt");

const crypto = require("crypto"); 

const md5 = crypto.createHash("md5");

let password = md5.update("123" + "123").digest("hex");
console.log(password);

module.exports = koaJWT({
	secret: "123456"
});