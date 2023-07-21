import app from "./app";
import logger from "./util/logger";
import * as socketio from "socket.io";
import Text from "./models/textPad";

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
  startAutosave();
  logger.info(
    "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
  logger.info("  Press CTRL-C to stop");
});
// server.headersTimeout = 0;
// server.keepAliveTimeout = 0;

// setInterval(() => {
//     server.getConnections((err, connections) => {
//         // logger.info(`${connections} connections currently open`);
//     });
// }, 10000);

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

let connections: any = [];

server.on("connection", (connection) => {
  connections.push(connection);
  connection.on(
    "close",
    () => (connections = connections.filter((curr: any) => curr !== connection))
  );
});

const io = new socketio.Server(server);
//Whenever someone connects this gets executed
io.on("connection", function (socket) {
  console.log("a user connected");

  //Whenever someone disconnects this piece of code executed
  socket.on("disconnect", function () {
    console.log("a user disconnected");
  });
});

/**
 * Shutdown express server gracefully.
 */
function shutDown() {
  stopAutosave();
  logger.info("Received kill signal, shutting down gracefully");
  server.close(() => {
    logger.info("Closed out remaining connections");
    process.exit(0);
  });

  setTimeout(() => {
    logger.info(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);

  connections.forEach((curr: any) => curr.end());
  setTimeout(() => connections.forEach((curr: any) => curr.destroy()), 5000);
}

const SAVE_INTERVAL = 5000;
var timerId: any;

function startAutosave() {
  timerId = setInterval(async () => {
    const myNote = await Text.findOne();
    if (myNote) {
      await myNote.save();
    }
  }, SAVE_INTERVAL);
}

function stopAutosave() {
  clearInterval(timerId);
}
export default server;
