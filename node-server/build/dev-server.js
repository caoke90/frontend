

const express = require('express');
// default port where dev server listens for incoming traffic
const port = process.env.PORT || 3000;

const mock = require("../../mstudent/mock/index.js");

const app = express();

mock(app)

var compression = require('compression')

// 启用gzip
app.use(compression());
app.use("/", express.static('../dist'));

function getIPAdress() {
    var interfaces = require('os').networkInterfaces();
    for(var devName in interfaces) {
        var iface = interfaces[devName];
        for(var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}
const opn = require('opn');


const readyPromise = new Promise(resolve => {

    if(port!==80){
        var uri = 'http://' + getIPAdress() + ':' + port;
        console.log('> Listening at ' + uri + '\n');
        opn(uri);
	}

});

var server = app.listen(port);

module.exports = {
	ready: readyPromise,
	close: () => {
        console.log("close")
		server.close();
	}
};
