const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { resStatus200, resStatus500 } = require('../core/restAPI');

router.route('/user-verify?').get((req, res, next) => {
  let username = req.query.username;
  let password = req.query.password;
  db.query(`
    SELECT u.user_id, CONCAT(salutation, firstname, ' ', surname) AS fullname, username, ut.user_type_name
    FROM user AS u
    LEFT JOIN user_type AS ut ON u.user_type_id = ut.user_type_id
    WHERE u.username = ? AND u.password = ?;
    `, [username, password], (error, results, fields) => {
    console.error(error)
    if (error) return res.status(500).json(resStatus500());

    return res.json(resStatus200(results));
  });
});

module.exports = router;