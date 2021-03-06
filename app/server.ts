import * as express from "express";
import * as bodyParser from "body-parser";
import * as morgan from "morgan";
import * as helmet from "helmet";
import * as methodOverride from "method-override";
import * as favicon from "serve-favicon";
import * as path from "path";
import * as compression from "compression";
import { __express as handleBars } from "hbs";
import { routes } from "./routes";
import { log, requestLogStream } from "./libraries/Log";
import { config } from "./config/config";
import { createServer } from "http";

export const app = express();
export const server = createServer(app);
// Security middleware
app.use(helmet());
// Util middleware
app.use(methodOverride());
app.use(favicon(path.join(__dirname, "../public/favicon.ico")));
// Body parser middleware
const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || "utf8");
  }
};

app.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }));
app.use(bodyParser.json({ verify: rawBodyBuffer }));
// Response compression
app.use(compression());
// use morgan to log requests to the console
app.use(morgan("short", { stream: requestLogStream }));

app.set("views", `${config.root}/views`);
app.set("view engine", "html");
app.engine("html", handleBars);

// Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

routes(app);

export function setupServer(): Promise<any> {
  return new Promise((resolve, reject) => {
    server.listen(config.server.port, () => {
      log.info(`conference-booking started at port ${config.server.port}`);
      resolve();
    });
  });
}
