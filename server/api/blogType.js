const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { resStatus200, resStatus500 } = require('../core/restAPI');

router.route('/blogtype-list?').get((req, res, next) => {
  let blogTypeId = req.query.id ? req.query.id : "";

  let sql_criteria = "TRUE";
  if(blogTypeId){
    sql_criteria += ` AND ${db.escapeId('blog_type_id')} = '${blogTypeId}'`;
  }
  db.query(`SELECT * FROM blog_type WHERE ${sql_criteria}`, (error, results, fields) => {
    if (error) return res.status(500).json(resStatus500());
    return res.json(resStatus200(results));
  })
});

router.route('/add-blogtype?').post((req, res, next) => {
  let requests = {blog_type_name: req.body.blog_type_name};
  db.query(`INSERT INTO blog_type SET ?;`, requests,  (error, results, fields) => {
    if (error) return res.status(500).json(resStatus500());
    return res.json(resStatus200(results));
  })
});

router.route('/edit-blogtype').put((req, res, next) => {
  let id = req.body.id;
  let requests = {blog_type_name: req.body.blog_type_name};
  
  if(!id) return res.json("id required");
  db.query(`UPDATE blog_type SET ? WHERE blog_type_id = ?;`, [requests, id],  (error, results, fields) => {
    if (error) return res.status(500).json(resStatus500());
    return res.json(resStatus200(results));
  })
});

router.route('/destroy-blogtype').delete((req, res, next) => {
  let id = req.query.id
  if(!id) return res.json("id required");
  db.query(`DELETE FROM blog_type WHERE blog_type_id = ?;`, id,  (error, results, fields) => {
    if (error) return res.status(500).json(resStatus500());
    return res.json(resStatus200(results));
  });
});

module.exports = router