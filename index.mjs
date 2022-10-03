import createServer from '@tomphttp/bare-server-node';
import http from 'http';
import express from 'express';
import cookie_parser from "cookie-parser";
import * as signature from "cookie-signature";
import * as cookie from "cookie";
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
      if (step2[0] == process.env.NAME_ADMIN && step2[1] == process.env.PASS_ADMIN) {
        console.log("[EXPRESS] New login: admin")
        res.cookie('user', 'admin', { signed: true })
        res.sendFile(process.cwd() + "/static/index.html")
      }
      else if (step2[0] == process.env.NAME_TIER1 && step2[1] == process.env.PASS_TIER1) {
        console.log("[EXPRESS] New login: tier 1")
        res.cookie('user', 'tier 1', { signed: true })
        res.sendFile(process.cwd() + "/static/index.html")
      }
      else if (step2[0] == process.env.NAME_TIER2 && step2[1] == process.env.PASS_TIER2) {
        console.log("[EXPRESS] New login: tier 2")
        res.cookie('user', 'tier 2', { signed: true })
        res.redirect(process.env.TIER2REDIRECT)
      }
      else {
        res.setHeader("WWW-Authenticate", "Basic")
        res.sendStatus(401)
      }
    }
  }
  else {
    if (req.signedCookies.user=='admin') {
      console.log("[EXPRESS] Returning login: admin")
      res.sendFile(process.cwd() + "/static/index.html")
    }
    else if (req.signedCookies.user=='tier 1') {
      console.log("[EXPRESS] Returning login: tier 1")
      res.sendFile(process.cwd() + "/static/index.html")
    }
    else if (req.signedCookies.user=='tier 2') {
      console.log("[EXPRESS] Returning login: tier 2")
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
  //console.log(req.headers)
  if (bare.shouldRoute(req)) {
		bare.routeRequest(req, res);
	} else {
	  app(req, res);
}
});

server.on('upgrade', (req, socket, head) => {
  //console.log(req.headers)
  if (!req.headers.cookie) {
    console.log("[WEBSOCKET PROXY] Upgrade request without any cookies.")
    return socket.end();
  }
  let cookies = cookie.parse(req.headers.cookie);
  //console.log(cookies)
  let unsigned = signature.unsign(cookies[Object.keys(cookies)[0]].slice(2), process.env.COOKIESALT);
  //console.log(unsigned);
  if (!(unsigned == "admin" || unsigned == "tier 1" || unsigned == "tier 2")) {
    console.log("[WEBSOCKET PROXY] Unauthorised upgrade, potentially using false cookie!");
    return socket.end();
  }
	if (bare.shouldRoute(req, socket, head)) {
		bare.routeUpgrade(req, socket, head);
	} else {
		socket.end();
	}
});

server.listen({
	port: process.env.PORT || 8080,
});
