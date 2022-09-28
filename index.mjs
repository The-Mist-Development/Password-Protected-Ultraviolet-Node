import createServer from '@tomphttp/bare-server-node';
import http from 'http';
import express from 'express';
import cookie_parser from "cookie-parser";
const app = express();

const bare =  createServer('/bare/');
app.use(express.static(process.cwd() + "/static"))

const server = http.createServer();

server.on('request', (req, res) => {
  if (bare.shouldRoute(req)) {
		bare.routeRequest(req, res);
	} else {
	  app(req, res);
}
});

server.on('upgrade', (req, socket, head) => {
	if (bare.shouldRoute(req, socket, head)) {
		bare.routeUpgrade(req, socket, head);
	} else {
		socket.end();
	}
});

server.listen({
	port: process.env.PORT || 8080,
});
