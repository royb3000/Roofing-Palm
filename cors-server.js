const http = require('http');
const fs = require('fs');
const data = fs.readFileSync(__dirname + '/pages-data.json');
http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.end(data);
}).listen(3001, () => console.log('CORS server ready on port 3001'));
