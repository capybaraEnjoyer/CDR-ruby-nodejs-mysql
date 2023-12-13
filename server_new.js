const http = require('http');
const mysql = require('mysql');
const path = require('path');
const url = require('url');
const port = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'GuardiaAlonso',
  password: 'Jjooaann03',
  database: 'prueba',
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database');


});
//Creamos el objeto servidor
const server = http.createServer((req, res) => {

  if (req.method === 'GET') {
    const myURL = new URL(`http://${req.headers.host}${req.url}`);
    const pathname = myURL.pathname.replace("/", "");
    console.log(pathname);
    const constraintsSeparadas = manejarConstraints(myURL);
    var query = `SELECT * FROM ${pathname}`;
    var primero = true;

    for (const key in constraintsSeparadas) {
      if (key === 'uid' && (pathname == 'marks' || pathname == 'students')) {
        idToFind = myURL.searchParams.get('uid');
        query += ` WHERE ${key} = "${idToFind}"`
      }
      else if(key === 'uid'){
        continue;
      }
      else if (primero) {
        query += ` WHERE ${key} = "${constraintsSeparadas[key]}"`
        primero = false;
      }
      else if (!primero) {
        query += ` AND ${key} = "${constraintsSeparadas[key]}"`
      }
    }
    query += " ;";
    console.log(query);
    db.query(query, (err, results) => {
      if (err) {
        console.error('An error occurred while executing the query', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 'error': 'Internal server error' }));
        return;
      }
      if (results.length > 0) {
        console.log("response");
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results));

      } else {
        console.log('No user found with the specified ID.');
        res.end(JSON.stringify({ 'message': 'No user found with the specified ID.' }));
      }
    });


  }

  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

function manejarConstraints(url) {
  const parsedUrl = new URL(url);
  const constraints = parsedUrl.searchParams;
  const constraintsSeparadas = {};

  for (const [key, value] of constraints.entries()) {

    const [cleanKey, operator] = key.split(/\[(gt|lt|gte)\]/).filter(Boolean);

    if (!constraintsSeparadas[cleanKey]) {
      constraintsSeparadas[cleanKey] = {};
    }
    if (operator) {

      constraintsSeparadas[cleanKey][operator] = value;
    } else {

      constraintsSeparadas[cleanKey] = value;
    }
  }
  return constraintsSeparadas;
}

server.listen(port, () => {
  console.log(`Server is listening on ${port}/`);
});
