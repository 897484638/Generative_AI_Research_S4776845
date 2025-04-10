const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const path = require("path");
const tools = require("./tools")
const {
	koaBody
} = require("koa-body");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const mongoose = require("mongoose");

var cors = require("koa2-cors");
app.use(cors());
mongoose
	.connect(

		"mongodb://doc_admin:4zz123_..1sabz@182.92.83.79:9095/doc_admin?authSource=admin"
	) //"mongodb://localhost:27017/admin?authSource=admin"
	.then((r) => {
		console.log("connect success");
	});

const project_project = require("./routes/project_project");
const project_user = require("./routes/project_user");
const project_common = require("./routes/project_common");

// error handler
onerror(app);

// middlewares
app.use(
	koaBody({
		multipart: true,
		formidable: {
			uploadDir: path.join(__dirname, "/public/uploads"),
			keepExtensions: true,
		},
	})
);

app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

app.use(
	views(__dirname + "/views", {
		extension: "pug",
	})
);

// logger
app.use(async (ctx, next) => {
	ctx.set("Access-Control-Allow-Origin", "*");
	ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
	const start = new Date();
	//resolve token
	if (ctx.request.header.authorization) {
		tools.unsignToken(ctx.request.header.authorization, (data, error) => {
			if (error) {
				//wrong token 
				msg = tools.error(error)
			} else {
				//right token  get user
				ctx.request.header.user = data
			}
		});
	}
	await next();
	const ms = new Date() - start;
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(project_project.routes(), project_project.allowedMethods());
app.use(project_user.routes(), project_user.allowedMethods());
app.use(project_common.routes(), project_common.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
	console.error("server error", err, ctx);
});
module.exports = app;