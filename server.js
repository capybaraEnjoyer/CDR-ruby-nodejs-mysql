const http = require('http');
const mysql = require('mysql');
var myURL = require('url');
const port = 3000;
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

//FUNCION QUE REVISA SI ESTA EL UID DEL ESTUDIANTE
function checkIdExists(tableName, columnName, id, callback) {
  const query = `SELECT EXISTS(SELECT 1 FROM ?? WHERE ?? = ?) AS exists`;
  connection.query(query, [tableName, columnName, id], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    // results[0].exists will be 1 if the ID exists, 0 otherwise
    callback(null, results[0].exists === 1);
  });
}

//Creamos el objeto servidor
const server = http.createServer((req, res) => {

  if (req.method === 'GET') {

    // Perform a MySQL query to fetch data
    q = myURL.pathname(req.url); //nos devuelve el path al que se esta accediendo, el cual va después del host y antes de la query  : /students, /timetable, /tasks, /marks.
    if (q.pathname == '/students') { //CASO DE IDENTIFICACIÓN DE ESTUDIANTE.
      uid = myURL.URLSearchParams(req.url).get(uid); //nos devuelve el id del estudiante a consultar.

        if (err) {
          console.error('Error querying the database:', err);
          return;
        }

      checkIdExists('students', 'studentID', uid, (err, exists) => {
          if (err) {
            console.error('An error occurred:', err);
          } else {
            console.log('Does the ID exist?', exists);
          }
          //connection.end();
        });
        // Respond with JSON data from the database
        res.end(JSON.stringify({
          'uid': student_id,
          'nombre': student.name
      }))

    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }

    if (q.pathname == '/timetables') {
    } else {

    }

    if (q.pathname == '/tasks') {
    } else {

    }

    if (q.pathname == '/marks') {
    } else {

    }

  }

});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
})
