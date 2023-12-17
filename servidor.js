const http = require('http');
const mysql = require('mysql');
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
    query = handler(myURL);
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
        console.log(results);
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
function handler(myURL) {
  const pathname = myURL.pathname.replace("/", "");
  console.log(pathname);
  const constraintsSeparadas = manejarConstraints(myURL);
  var query = `SELECT * FROM ${pathname}`;
  var primero = true;
  var controlDay = false;
  console.log(constraintsSeparadas);
  for (const key in constraintsSeparadas) {
    if (pathname == 'timetables' & (key == 'hour' || key == 'day')) {
      if (key == 'day') {
        constraintsSeparadas[key] = convertirDiaTextoANumero(constraintsSeparadas[key]);
      }
      controlDay = true;
    }
    if (key === 'uid' && (pathname == 'marks' || pathname == 'students')) {
      const id = constraintsSeparadas[key];
      query += primero ? ` WHERE ${key} = "${id}"` : ` AND ${key} = "${id}"`;
      primero = false;

    } else if (key !== 'uid') {

      const keyValue = constraintsSeparadas[key];
      const keyOperators = constraintsSeparadas[key];

      if (keyOperators) {
        const ops = Object.keys(keyOperators);
        const hasValidOperators = ops.some(op => /(<|<=|>|>=)/.test(op));

        if (hasValidOperators) {
          for (const op of ops) {
            if (keyValue[op] !== null && keyValue[op] !== undefined && /(<|<=|>|>=)/.test(op)) {
              query += primero ? ` WHERE ${key} ${op} "${keyValue[op]}"` : ` AND ${key} ${op} "${keyValue[op]}"`;
              primero = false;
            }
          }
        } else {
          query += primero ? ` WHERE ${key} = "${keyValue}"` : ` AND ${key} = "${keyValue}"`;
          primero = false;
        }
      }
    }
  }
  const now = new Date();
  const day = now.getDay().toString();
  const hh = now.getHours().toString().padStart(2, 0);
  const mm = now.getMinutes().toString().padStart(2, 0);
  const hora = hh + ":" + mm;
  //en cas de que no hi hagi constraint de dia i hora que aparegui en funció del dia i actual
  if (pathname === 'timetables' && controlDay === false) {
    if (primero) {
      query += ` WHERE (day = "${day}" AND hour >= "${hora}") OR day > "${day}" OR day < "${day}" OR (day = "${day}" AND hour < "${hora}")`;
    } else {
      let query1 = query.replace("SELECT * FROM timetables WHERE", "");
      query = `SELECT * FROM timetables WHERE (day = "${day}" AND hour >= "${hora}") AND (${query1}) OR (day > "${day}" AND (${query1})) OR (day < "${day}" AND (${query1})) OR (day = "${day}" AND hour < "${hora}" AND (${query1}))`;
    }
    query += ` ORDER BY CASE WHEN day = '${day}' AND hour >= "${hora}" THEN 1 
        WHEN day > '${day}' THEN 2 
        WHEN day < '${day}' AND day = '${day}' AND hour < "${hora}" THEN 3 
        ELSE 4 END`;
  }
  query += " ;";
  console.log(query);
  return query;
}
server.listen(port, () => {
  console.log(`Server is listening on ${port}/`);
});
