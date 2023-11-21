const http = require('http');
const mysql = require('mysql');
var myURL = require('url');
const port = 3000;
const hostname = '192.168.127.182';
//const host = 192.168.56.1;

const db = mysql.createConnection({
  host: 'localhost', //Si la base de datos y el servidor se ejecutan en la misma maquina
  user: 'azcam',
  password: 'Reproche_2211',
  database: 'prueba',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

/*
function checkIdExists(tableName, columnName, id, callback) {
  const query = `SELECT EXISTS(SELECT 1 FROM ?? WHERE ?? = ?) AS exists`;

  db.query(query, [tableName, columnName, id], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    // results[0].exists will be 1 if the ID exists, 0 otherwise
    callback(null, results[0].exists === 1);
  });
}
*/

//Creamos el objeto servidor
const server = http.createServer((req, res) => {

  if (req.method === 'GET') {

    // Perform a MySQL query to fetch data
    q = myURL.pathname(req.url); //nos devuelve el path al que se esta accediendo, el cual va después del host y antes de la query  : /students, /timetable, /tasks, /marks.
    if (q.pathname == '/students') { //CASO DE IDENTIFICACIÓN DE ESTUDIANTE.
      console.log("entrar");
      idToFind = myURL.URLSearchParams(req.url).get(uid); 
      const query = 'SELECT name FROM students WHERE id = ?'

      db.query(query, [idToFind], (err, results) => {
        if(err){
          console.error('An error occurred while executing the query');
          throw err;
        }
        if (results.length > 0) {
          // Assuming 'id' is unique, there should only be one matching row
          console.log('Name:', results[0].name);
          res.end(JSON.stringify({
            'uid': uid,
          }))
      } else {
          console.log('No user found with the specified ID.');
      }
      })
    }

    if (q.pathname == '/timetables') {
      /*
      const reqUrl = url.parse(req.url, true);
      var body = reqUrl.query;
      var qr = 'SELECT * FROM timetables';
      var bol = 0;
      if (body.subject !== undefined) {

        qr += ' WHERE subject="' + body.subject + '"';
        bol = 1;
      }
      if (body.room !== undefined) {

        if (bol == 1) {
          qr += ' AND '
        } else {
          qr += ' WHERE ';
        }
        qr += ' room = "' + body.room + '"';
        bol = 1;
      }
      if (body.day !== undefined) {

        if (bol == 1) {
          qr += ' AND '
        } else {
          qr += ' WHERE ';
        }
        qr += ' day = "' + body.day + '"';
        bol = 1;
      }
      if (body.hour !== undefined) {

        if (bol == 1) {
          qr += ' AND '
        } else {
          qr += ' WHERE ';
        }
        qr += ' hour = "' + body.hour + '"';
        bol = 1;
      }
      qr += ";";

      let response = await todoDao.readEntities(qr);
      console.log(response);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response));
      */
    }

    if (q.pathname == '/tasks') {
    }

    if (q.pathname == '/marks') {
    }

    else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }

  }

});

server.listen(port, hostname, () => {
  console.log(`Server is listening on http://${hostname}:${port}/`);
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
