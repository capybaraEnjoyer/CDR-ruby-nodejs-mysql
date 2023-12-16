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
    var query1 = null;
    var primero = true;
    var controlDay = false;
    var controlHour = false;
    var resultat1;
    console.log(constraintsSeparadas);
    for (const key in constraintsSeparadas) {
      if (pathname == 'timetables') {
        if (key == 'day') {
          constraintsSeparadas[key] = convertirDiaTextoANumero(constraintsSeparadas[key]);
          controlDay = true;
          controlHour = true; 
        } else if (key == 'hour') {
          controlHour = true;
          controlDay = true; 
        }
      }
      if (key === 'uid' && (pathname == 'marks' || pathname == 'students')) {
        idToFind = myURL.searchParams.get('uid'); // Utilizo parsedUrl en lugar de myURL
        if (pathname == 'marks') {
          if (primero) {
            query += ` WHERE ${key} = "${idToFind}"`;
            primero = false;
          } else {
            query += ` AND ${key} = "${idToFind}"`;
          }
        }
        else{
          query += ` WHERE ${key} = "${idToFind}"`;
        }

      } else if (key === 'uid') {
        continue;
      } else {
        const keyValue = constraintsSeparadas[key];
        const keyOperators = constraintsSeparadas[key];
  
        if (keyOperators && Object.keys(keyOperators).length > 0) {
          const ops = Object.keys(keyOperators);
          for (const op of ops) {
            if (keyValue[op] !== null && keyValue[op] !== undefined) {
              if (primero) {
                query += ` WHERE ${key} ${op} "${keyValue[op]}"`;
                primero = false;
              } else {
                query += ` AND ${key} ${op} "${keyValue[op]}"`;
              }
            }
          }
        } else {
          if (primero) {
            query += ` WHERE ${key} = "${keyValue}"`;
            primero = false;
          } else {
            query += ` AND ${key} = "${keyValue}"`;
          }
        }
      }
    }
    const now = new Date();
    const day = now.getDay().toString();
    const hh = now.getHours().toString().padStart(2, 0);
    const mm = now.getMinutes().toString().padStart(2, 0);
    const hora = hh + ":" + mm;
    
    if (pathname == 'timetables' && controlDay == false) {
      
      if (primero) {
        //query1 += `SELECT * FROM ${pathname}` + query
        query += ` WHERE day >= "2"`
        primero = false;
        //query1 += ` WHERE day < "${day}"`
      }
      else {
        //query1 += `SELECT * FROM ${pathname}` + query
        query += ` AND day >= "2"`
        //query1 += ` AND day < "${day}"`
      }
    }
    if(pathname == 'timetables' && controlHour == false){
      if (primero) {
        //query1 += `SELECT * FROM ${pathname}` + query
        query += ` WHERE hour >= "${hora}"`
        primero = false;
        //query1 += ` WHERE day < "${day}"`
      }
      else {
        query += ` AND hour >= "${hora}"`
      }
    }

    query += " ;";
    console.log(query);
    //var resultat;
    db.query(query, (err, results) => {
      if (err) {
        console.error('An error occurred while executing the query', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 'error': 'Internal server error' }));
        return;
      }
      results.forEach(result => {
        if (result.hasOwnProperty('day')) {
          const numeroDia = parseInt(result.day);
          result.day = convertirNumeroADiaTexto(numeroDia);
        }
      });
      if (results.length > 0) {
        //resultat = results;
        console.log(results);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results));

      } else {
        console.log('No user found with the specified ID.');
        res.end(JSON.stringify({ 'message': 'No user found with the specified ID.' }));
      }
    });
    /*if (query1 != null) {
      
      db.query(query, (err, results1) => {
        if (results1.length > 0) {
          resultat1 = results1;
          console.log(results1);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(results1));
        }
      });
      var resultatFin = resultat.concat(resultat1);
      res.end(JSON.stringify(resultatFin));
    }
    else{
      res.end(JSON.stringify(resultat));
    }*/
  }
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }


});

function convertirNumeroADiaTexto(numeroDia) {
  const diasSemana = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return diasSemana[numeroDia]; 
}

function convertirDiaTextoANumero(diaTexto) {
  const diasSemana = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const numeroDia = diasSemana.indexOf(diaTexto);
  return numeroDia !== -1 ? numeroDia : null;
}

function manejarConstraints(url) {
  const parsedUrl = new URL(url);
  const constraints = parsedUrl.searchParams;
  const constraintsSeparadas = {};
  for (const [key, value] of constraints.entries()) {

      var [cleanKey, operator] = key.split(/\[(gt|lt|gte|lte)\]/).filter(Boolean);

      if (!constraintsSeparadas[cleanKey]) {
          constraintsSeparadas[cleanKey] = {};
      }
      if (operator) {
          var casos = { gte: ">=", lte: "<=", gt: ">", lt: "<" };
          operator = operator.replace(/gte|lte|lt|gt/gi, function (matched) {
              return casos[matched];
          });
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
