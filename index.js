"use strict";
let http = require('http')
let request = require('request')
let fs = require('fs')

let argv = require('yargs').argv

let logStream = argv.logfile ? fs.createWriteStream(argv.logfile) : process.stdout
let localhost = '127.0.0.1'
  //  .default('host', '127.0.0.1:8000')
  //  .argv
let scheme = 'http://'
let host = argv.host || localhost
let port = argv.port || (host === localhost ? 8000 : 80)
// Build the destinationUrl using the --host value
let destinationUrl = scheme  + host + ':' + port





//let destinationUrl = argv.url || scheme + argv.host + ':' + port

http.createServer((req, res) => {
    //console.log(`Request received at: ${req.url}`)
    logStream.write('This is a echo server\n')
    for (let header in req.headers) {
    process.stdout.write('\n\n\n' + JSON.stringify(req.headers))	
    res.setHeader(header, req.headers[header])
    }
    logStream.write(JSON.stringify(req.headers)+'\n')
    req.pipe(res)
    //res.end('hello world\n')
}).listen(8000)
logStream.write('echo Server listening @ 127.0.0.1:8000\n')


//let destinationUrl = '127.0.0.1:8000'
http.createServer((req, res) => {
	logStream.write('proxyServer\n')
  //console.log(`Proxying request to: ${destinationUrl + req.url}`)
  // Proxy code here
  let url = destinationUrl
  if(req.headers['x-destination-url']){
  	url = 'http://' + req.headers['x-destination-url']
  }

  let options = {
        url: url + req.url
    }
  
    req.pipe(request(options)).pipe(res)

}).listen(8001)
logStream.write('proxyServer listening @ 127.0.0.1:8001\n')