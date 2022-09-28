import createServer from '@tomphttp/bare-server-node';
import http from 'http';
import express from 'express';
import cookie_parser from "cookie-parser";
const app = express();

const bare =  createServer('/bare/');

app.use(cookie_parser(process.env.COOKIESALT));

app.get("/", (req, res) => {
  let cookie_Stuff = req.signedCookies.user
  if (!cookie_Stuff)
  {
    let auth_Stuff = req.headers.authorization
    if (!auth_Stuff)
    {
      res.setHeader("WWW-Authenticate", "Basic")
      res.sendStatus(401)
    }
    else {
      let step1 = new Buffer.from(auth_Stuff.split(" ")[1], 'base64')
      let step2 = step1.toString().split(":")
      if (step2[0] == 'admin' && step2[1] == 'admin') {
        console.log("New login: admin")
        res.cookie('user', 'admin', { signed: true })
        res.sendFile(process.cwd() + "/static/index.html")
      }
      else {
        res.setHeader("WWW-Authenticate", "Basic")
        res.sendStatus(401)
      }
    }
  }
  else {
    if (req.signedCookies.user=='admin') {
      console.log("Returning login: admin")
        res.sendFile(process.cwd() + "/static/index.html")
      }
    else {
        res.setHeader("WWW-Authenticate", "Basic")
        res.sendStatus(401)
    }
  }
})

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
