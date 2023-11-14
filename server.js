const http = require('http');
const mysql = require('mysql');
const port = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/api/resource') {
    // Perform a MySQL query to fetch data
    db.query('SELECT * FROM your_table', (err, results) => {
      if (err) {
        console.error('Error querying the database:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }

      // Respond with JSON data from the database
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(results));
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
