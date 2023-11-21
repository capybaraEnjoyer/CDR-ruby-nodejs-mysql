const http = require('http');
const mysql = require('mysql');
const url = require('url');
const port = 3000;


const db = mysql.createConnection({
  host: 'localhost', //Si la base de datos y el servidor se ejecutan en la misma maquina
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
    const pathname = myURL.pathname;

    if (pathname === '/students') { //CASO DE IDENTIFICACIÓN DE ESTUDIANTE.
      console.log("entrar");
      idToFind = myURL.searchParams.get('uid'); 
      const query = 'SELECT * FROM students WHERE studentID = ?';

      db.query(query, [idToFind], (err, results) => {
        if(err){
          console.error('An error occurred while executing the query', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 'error': 'Internal server error' }));
          return;
        }
        if (results.length > 0) {
          const { name, studentID } = results[0];
          console.log('Name:', results[0].name);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({'nombre': results[0].name }));
      } else {
          console.log('No user found with the specified ID.');
          res.end(JSON.stringify({'message': 'No user found with the specified ID.'}));
      }
    });
  }
    if (pathname == '/timetables') {
      const params = myURL.searchParams;
      //var body = reqUrl.query;
      var qr = 'SELECT * FROM timetables';
      var bol = 0;
      if (params.has('subject')) {

        qr += ' WHERE subject="' + params.get('subject') + '"';
        bol = 1;
      }
      if (params.has('room')) {

        if (bol == 1) {
          qr += ' AND '
        } else {
          qr += ' WHERE ';
        }
        qr += ' room = "' + params.get('room') + '"';
        bol = 1;
      }
      if (params.has('day')) {

        if (bol == 1) {
          qr += ' AND '
        } else {
          qr += ' WHERE ';
        }
        qr += ' day = "' + params.get('day') + '"';
        bol = 1;
      }
      if (params.has('hour')) {

        if (bol == 1) {
          qr += ' AND '
        } else {
          qr += ' WHERE ';
        }
        qr += ' hour = "' + params.get('hour') + '"';
        bol = 1;
      }
      qr += ";";

      db.query(qr, (err, results) => {
        if(err){
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
          res.end(JSON.stringify({'message': 'No user found with the specified ID.'}));
      }
    });
    }

    if (pathname == '/tasks') {
    }

    if (pathname == '/marks') {
    }

    else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }

  }

});

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
//HAVING CLEAR WHAT IS NECESSARY TO CONNECT MYSQL AND HOW DO JAVASCRIPT EXECUTES?
