const mysql = require('mysql');

// Local
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'amulet',
  multipleStatements: true
});
// Prod
// const db = mysql.createConnection({
//   host: 'tj5iv8piornf713y.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
//   user: 'e4zljegphgsben7l',
//   password: 'og1wql0kqam5hvxu',
//   database: 'podrok2hj96yv5fl',
//   multipleStatements: true
// });

db.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack)
    return
  }
  console.log('connected as id ' + db.threadId)
})

module.exports = db