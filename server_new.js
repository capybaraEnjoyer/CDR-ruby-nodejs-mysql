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
  port: 3000,
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
    const pathname = myURL.pathname;
    pathname.replace("/");
    console.log(pathname);

    if (pathname === 'students') { //CASO DE IDENTIFICACIoN DE ESTUDIANTE.
      console.log("entrar");
      idToFind = myURL.searchParams.get('uid');
      const query = 'SELECT * FROM students WHERE studentID = ?';

      db.query(query, [idToFind], (err, results) => {
        if (err) {
          console.error('An error occurred while executing the query', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 'error': 'Internal server error' }));
          return;
        }
        if (results.length > 0) {
          const { name, studentID } = results[0];
          console.log('Name:', results[0].name);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 'nombre': results[0].name }));
        } else {
          console.log('No user found with the specified ID.');
          res.end(JSON.stringify({ 'message': 'No user found with the specified ID.' }));
        }
      });
    }

    else if (pathname === 'timetables' || pathname === 'tasks' || pathname === 'marks') {

      const constraintsSeparadas = manejarConstraints(myURL);
      var query = `SELECT * FROM ${pathname}`;
      var primero = true;

      for (const key in constraintsSeparadas) {
        if(key === 'uid' && pathname != 'marks'){}
        else if (primero) {
          query += `WHERE ${key} = ${result[key]}`
          primero = false;
        }
        else if (!primero) {
          query += `AND WHERE ${key} = ${result[key]}`
        }
      }
      
      db.query(query, (err, results) => {
        if (err) {
          console.error('An error occurred while executing the query', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 'error': 'Internal server error' }));
          return;
        }
        if (results.length > 0) {
          console.log(response);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(response));

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
  /*
  const query = 'SELECT mark FROM marks WHERE studentID = 0;';

  db.query(query, (err, results) => {
    if (err) throw err;

    // Display each row's column value
    results.forEach(row => {
      console.log(row.mark);
    });
  });
  */
})


const urlEjemplo = "https://ejemplo.com/ruta?constraint1=valor1&constraint2=valor2&constraint3[gt]=5&constraint4[lte]=10&constraint5[gte]=3"

const result = manejarConstraints(urlEjemplo);
for (const key in result) {
  console.log(`Key: ${key}, Value: ${result[key]}`);
}
console.log("Constraints separadas:");
console.log(result);
