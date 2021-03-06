const {spawn} = require('child_process');
const path = require('path');
const url = require('url');

let server;

var quark = function (opts) {
    if (server == null) {
        console.log('Creating server');
        server = spawn('node', [path.join(__dirname, 'server')], {
            env: {
                QUARK_PORT: opts.port || 21048,
                QUARK_DIR: opts.dir || __dirname,
                QUARK_DESC: opts.description || 'default',
                QUARK_LOG: opts.log || false
            }
        });

        server.opts = opts;

        server.stdout.on('data', (data) => {
            console.log(data.toString());
        })

        server.stderr.on('data', (data) => {
            console.log(data.toString());
        })
    }
};

quark.url = function (path) {
    return url.format({
        hostname: 'localhost',
        port: server.opts.port,
        pathname: path,
        protocol: 'http'
    });
}

quark.html = function (path) {
    return quark.url(`${path}.html`);
}

quark.js = function (path) {
    return quark.url(`${path}.js`)
}

module.exports = quark;
