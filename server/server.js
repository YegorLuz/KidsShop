const http = require('http');
const lib_url = require('url');
const config = require('./config.json');
const FileReader = require('./utils/FileReader.js');

const hostname = config.hostname;
const port = config.port;

const server = new http.Server();
const fileReader = new FileReader();

server.on('request', (request, response) => {
    const url = lib_url.parse(request.url);
    const method = request.method;
    const __distPath = __dirname.split('\\').slice(0, -1).join('\\') + '\\dist';

    switch(url.pathname) {
        case '/': {
            if (method === 'GET') {
                fileReader.sendFile(__distPath + '/index.html', response);
            } else {
                /*let body = '';
                request.on('data', (data) => {
                    body += data;
                });
                request.on('end', () => {
                    console.log("Body: " + body);
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.end(body);
                });*/
            }
            break;
        }
        case '/product': {
            if (method === 'GET') {
                fileReader.sendFile(__distPath + '/product.html', response);
            }
            break;
        }
        case '/js/index.js': {
            fileReader.sendFile(__distPath + '/js/index.js', response);
            break;
        }
        case '/js/product.js': {
            fileReader.sendFile(__distPath + '/js/product.js', response);
        }
    }
});

server.listen(port, hostname);