const http = require('http');
const mysql = require('mysql');
const port = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
});


const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/api/resource') {
    // Perform a MySQL query to fetch data
    db.query('SELECT * FROM table', (err, results) => {
      if (err) {
        console.error('Error querying the database:', err);
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
