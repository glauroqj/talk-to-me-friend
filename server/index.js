import express from "express";
import { createServer } from "http";
import path from "path";
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const server = createServer(app);
const environment = process.env.NODE_ENV || "development";
/** routes */
import createRoutes from "./routes/createRoutes";
import createSocket from "./middlewares/socket";
/** middlewares */
app.use(cors());
if (environment === "development") {
  app.use(express.static(path.join(__dirname, "../client/public")));
} else {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

/** global variables */
global.rooms = {};
global.users = {};

createSocket(server);
createRoutes(app);

server.listen(process.env.PORT, "0.0.0.0", () =>
  console.log("< SERVER IS RUNNING >")
);
