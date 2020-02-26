const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { resStatus200, resStatus500 } = require('../core/restAPI');

router.route('/producttype-list?').get((req, res, next) => {
  let productTypeId = req.query.id ? req.query.id : "";

  let sql_criteria = "TRUE";
  if(productTypeId){
    sql_criteria += ` AND ${db.escapeId('product_type_id')} = '${productTypeId}'`;
  }
  db.query(`SELECT * FROM product_type WHERE ${sql_criteria}`, (error, results, fields) => {
    if (error) return res.status(500).json(resStatus500());
    return res.json(resStatus200(results));
  })
});

router.route('/add-producttype?').post((req, res, next) => {
  let requests = {product_type_name: req.body.product_type_name};
  db.query(`INSERT INTO product_type SET ?;`, requests,  (error, results, fields) => {
    if (error) return res.status(500).json(resStatus500());
    return res.json(resStatus200(results));
  })
});

router.route('/edit-producttype').put((req, res, next) => {
  let id = req.body.id;
  let requests = {product_type_name: req.body.product_type_name};
  
  if(!id) return res.json("id required");
  db.query(`UPDATE product_type SET ? WHERE product_type_id = ?;`, [requests, id],  (error, results, fields) => {
    if (error) return res.status(500).json(resStatus500());
    return res.json(resStatus200(results));
  })
});

router.route('/destroy-producttype').delete((req, res, next) => {
  let id = req.query.id
  if(!id) return res.json("id required");
  db.query(`DELETE FROM product_type WHERE product_type_id = ?;`, id,  (error, results, fields) => {
    if (error) return res.status(500).json(resStatus500());
    return res.json(resStatus200(results));
  });
});

module.exports = router