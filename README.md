# Password-Protected-Ultraviolet-Node
### A fork of the popular Node.js proxy Ultraviolet, but password protected. 

This code works to some extent. In the `index.mjs` file, we've added a login system which works with cookies, and restricts access to the main page and proxy websockets. We haven't figured out how to use the same cookies to restrict access to the rest of the proxy though. 

We have three login 'accounts' in the source, but you can modify that to suit your needs. 

## Bare minimum setup steps

- Make sure you're able to set environment variables - through a `.env` file or other, depending on your environment. If you're physically running `node index.js` then you'll probably have to modify the code. Use the [dotenv](https://www.npmjs.com/package/dotenv) package. You could also define your secrets in `index.mjs` (bad idea), or another type of config file provided that you can import the values.

- Define the environment variable `COOKIESALT`.

- Define at least one username and password pair using environment variables. For example, we use `process.env.NAME_ADMIN` and `process.env.PASS_ADMIN`.

## Explanations

Currently, the accounts `ADMIN` and `TIER1` that we have implemented are identical. The account `TIER2` sends a different page within the `/static` directory to the user, which happens to be a redirect to proxy a specific site. The account `TIER2` has no restrictions on what routes it can/cannot access, other than being served a different home page. We haven't published the changes we've made to the `static` module. 

### The original proxy's README is below.

<p align="center"><img src="https://raw.githubusercontent.com/titaniumnetwork-dev/Ultraviolet-Static-Archive/main/uv.png" height="200">
</p>

<h1 align="center">Ultraviolet-Node</h1>

<p align="center">The deployable version of Ultraviolet, a highly sophisticated proxy used for evading internet censorship or accessing websites in a controlled sandbox using the power of service-workers and more!<br><br></p>

## Features
- CAPTCHA support along with hCAPTCHA support
- URL encoding settings to further hide activity when using Ultraviolet
- Configuration all done on the client-side via service-workers
- Speed in comparison to other web proxies that fully proxy content
- Blacklist setting and more for easy hosting
- Security in mind and leak prevention
- Frequent updates to improve site support or fix security issues

## Supported Sites
- [Youtube](https://www.youtube.com)
- [CAPTCHA/hCAPTCHA](https://www.captcha.net)
- [Spotify](https://spotify.com)
- [Discord](https://discord.com)
- [Reddit](https://reddit.com)
- [GeForce NOW](https://play.geforcenow.com/) (Partially Supported)
- And more!

## Technologies Used
- Service Workers
- HTML, JS, CSS rewriting
- Parse5
- Acorn.js

## Used by
- [Incognito](https://github.com/caracal-js/Incognito), a popular web proxy service with focus on privacy
- [Holy-Unblocker](https://github.com/titaniumnetwork-dev/Holy-Unblocker), a popular web proxy service focusing on bypassing web filters and more
- [Hypertabs](titaniumnetwork.org/), a web proxy service using a PWA browser as its frontend

## Table of Contents
- [Installation And Setup](#installation-and-setup)
- [Basic Guide](#basic-guide)
- [Replit Setup Guide](#replit-setup-guide)
- [Comprehensive Guide](#comprehensive-guide)
- [Configuration](#configuration)
- [Frontend](#static-files)
- [Core Scripts](#core-scripts)

# Installation and Setup

Installation of Ultraviolet is simple. You can find a Tl;DR of the installation and setup process just below. If you are unfamiliar with the "standard" installation process, look a bit farther down for a more comprehensive installation and setup guide.

## Basic Guide

```sh
$ git clone https://github.com/titaniumnetwork-dev/Ultraviolet-Node --recursive
$ cd Ultraviolet-Node
$ npm install
$ npm start
```

## Replit Setup Guide

To setup on Replit, first click on the "Run on Replit" button. After loading into your repl, click on the green "Run" button. Alternatively, run the following commands:

```sh
$ npm install
$ chmod +x main.sh
$ ./main.sh
```

You will only have to run the second command once. It just allows `main.sh` to be executed. By running `main.sh`, you will update any submodules and will start the app.

**Note**: If you choose not to use `main.sh`, but would rather just run all commands manually, please note that you will have to manually install submodules by running `git update submodules --init`. Without it, `static` will not be installed, and that is a required directory.

## Comprehensive Guide

Below will describe a comprehensive guide to install Ultraviolet on Linux machines.

To clone the repository, simply run the following command:

```sh
$ git clone https://github.com/titaniumnetwork-dev/Ultraviolet-Node --recursive
```

The `--recursive` flag will clone the repository and all submodules.

To begin work on the actual setup, cd into the repository. You can do so by running the following command:

```sh
$ cd Ultraviolet-Node
```

From here, you can update your submodules and install your dependencies. To do so, run the following command:

```sh
$ npm install
```

Finally, to start Ultraviolet, run the following command:

```sh
$ npm start
```

You can then find Ultraviolet on `http://127.0.0.1:8080`. If you would like to change the port UV will be running on, edit the last line in `index.mjs`. 

Please note that UV will not function without HTTPS. If you are hosting on Replit or Heroku, this won't be a problem as they provide you with SSL/TLS by default and will automatically apply it to your instance, however if you are attempting to host UV on a different platform, such as a personal server, you **WILL** need to use HTTPS. 

## Configuration
Configuring Ultraviolet is very simple. Simple descriptions of each configurable option are provided as a comment in the block below. More detailed documentation can be found just below mentioned block.

`uv.config.js`

```javascript
self.__uv$config = {
    prefix: '/sw/', // Proxy url prefix
    bare: '/bare/', // Bare server location
    encodeUrl: Ultraviolet.codec.xor.encode, // URL Encoding function
    decodeUrl: Ultraviolet.codec.xor.decode, // Decode URL function
    handler: '/uv.handler.js', // Handler script
    bundle: '/uv.bundle.js', // Bundled script
    config: '/uv.config.js', // Configuration script
    sw: '/uv.sw.js', // Service Worker Script
};
```

| Configuration | Options and Explanation |
| ------------- | ----------------------- |
| Prefix | The prefix is the prefix that you want users to see. Ex: `https://example.com/service.` The default prefix is `service`. |
| Bare | Bare Servers can run on directories. For example, if the directory was /bare/ then the bare origin would look like `http://example.org/bare/`. The bare origin is passed to clients. |
| encodeUrl| EncodeUrl is how you want the URL a proxy site's visitors has to be encoded. Options include `Ultraviolet.codec.base64.encode`, `Ultraviolet.codec.plain.encode`, or `Ultraviolet.codec.xor.encode`. It is recommended that you use `xor` or `base64` as it hides the queries your visitors are searching and visiting.
| decodeURL | DecodeUrl is how you want the url to be decoded. It is recommended you keep it the same as `encodeUrl`. |
| Handler | Handler is the path to the UV handler. The default name and path to this file is `static/uv/uv.handler.js`. |
| Bundle | Bundle is the path to the UV bundle file. The default name and path to this file is `static/uv/uv.bundle.js`. |
| Config | Config is the path to the UV config file. The default name and path to this file is `static/uv/uv.bundle.js`. |
| SW | SW is the path to the UV Service Worker script. The default name and path to this file is `static/uv/uv.sw.js`. |

## Static Files

Static files is the frontend for Ultraviolet. A standalone repository for it can be found [here](https://github.com/titaniumnetwork-dev/Ultraviolet-Static).

## Core Scripts

[Configuration](#configuration) mentions a few scripts that make up Ultraviolet. To get documentation for what each of the scripts do, check out the [documentation](https://github.com/titaniumnetwork-dev/Ultraviolet-Core) for them in their standalone repository.

# Main Scripts After Building

The client-hooking & service worker scripts required for UV are located in [ultraviolet-scripts](https://github.com/titaniumnetwork-dev/ultraviolet-scripts)

- Scripts
    - `uv.sw.js` Service worker gateway
    - `uv.sw-handler.js` - Service worker handler
    - `uv.bundle.js` Webpack compiled Ultraviolet rewriter
    - `uv.handler.js` Client-side hooking
    - `uv.config.js` Configuration

# Authors

- Caracal.js (Creator of Ultraviolet)
- Divide (Creator of TOMP)

# Credits
- https://github.com/tomphttp


