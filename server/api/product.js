const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { validation, schema } = require('../validator/product')
const { resStatus200, resStatus500 } = require('../core/restAPI');
const { resizeImages, removeImages } = require('../core/function');
const path = require('path')
const fs = require('fs');

const multer  = require('multer');
const rootpath = "public/uploads/product";
let upload = multer({
  storage:multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', rootpath));
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}${Math.floor((Math.random() * 10) + 1)}${path.extname(file.originalname)}`);
    }
  }),
  fileFilter:(req, file, cb)=>{
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Upload only Picture!'), false)
    }
    cb(null, true)
  },
	limits: {
		fileSize: 4000000
	},
	onFileSizeLimit: function(file) {
		console.log('Failed: ' + file.originalname + ' is limited');
		fs.unlink(file.path);
	}
});

const tableName = "product";

// GET
router.route('/product-list?').get((req, res, next) => {
  let productType = req.query.type;
  let textSearch = req.query.q;
  let stop = req.query.stop;
  
  let sqlCriteria = "";
  if(productType) sqlCriteria += ` AND p.product_id IN (
    SELECT product_id
    FROM product_type_map
    WHERE product_type_id = '${productType}'
  )`;
  if(textSearch) sqlCriteria += ` AND product_name LIKE '%${textSearch}%'`;
  let sqlLimitOffset = "";
  if(stop) sqlLimitOffset += ` LIMIT ${stop}`;

  db.query(`
    SELECT p.*, pa.filepath AS product_profile
    FROM ${tableName} AS p
    LEFT JOIN product_album AS pa ON p.product_album_id = pa.product_album_id
    WHERE 1 = 1 ${sqlCriteria}
    ${sqlLimitOffset}
  `, (error, results, fields) => {
    console.error(error)
    if (error) return res.status(500).json(resStatus500());

    return res.json(resStatus200(results));
  });
});
router.route('/product-detail?').get((req, res, next) => {
  let product_id = req.query.id;
  db.query(`
    SELECT p.*, pt.product_type_id, pt.product_type_name, pa.filepath AS product_profile
    FROM ${tableName} AS p
    LEFT JOIN product_type_map AS ptm ON p.product_id = ptm.product_id
    LEFT JOIN product_type AS pt ON ptm.product_type_id = pt.product_type_id
    LEFT JOIN product_album AS pa ON p.product_album_id = pa.product_album_id
    WHERE p.product_id = ?;
    
    SELECT pt.product_type_id, pt.product_type_name
    FROM product_type AS pt
    LEFT JOIN product_type_map AS ptm ON pt.product_type_id = ptm.product_type_id
    WHERE ptm.product_id = ?;
    
    SELECT filepath
    FROM product_album
    WHERE product_id = ?;
  `, [product_id, product_id, product_id], (error, results, fields) => {
    if (error) return res.status(500).json(resStatus500());

    return res.json(resStatus200({...results[0].find(result => result.product_id == product_id),
      product_type_list: results[1],
      product_images: results[2].map(result => result.filepath)
    }));
  });
});
router.route('/product-album').get((req, res, next) => {
  let product_id = req.query.id;
  db.query(`
    SELECT pa.*, p.product_album_id AS product_profile
    FROM product_album AS pa
    LEFT JOIN product AS p ON pa.product_album_id = p.product_album_id
    WHERE pa.product_id = ?;
  `, [product_id], (error, results, fields) => {
    if (error) return res.status(500).json(resStatus500());

    return res.json(resStatus200(results));
  });
});

// POST
router.route('/add-product?').post((req, res, next) => {
  // console.log("req", req.body)
  let requestsProduct = {
    'product_name': req.body.product_name,
    'price': req.body.price,
    'qty': req.body.qty,
    'description': req.body.description
  }
  let valuesInsertProductTypeMap = [];
  let productTypeIDInput = req.body.product_type_id;
  db.query(`INSERT INTO ${tableName} SET ?;`, requestsProduct, (error, results, fields) => {
    if (error) return res.status(500).json(resStatus500());

    let productInsertID = results['insertId'];
    if(productTypeIDInput.length > 0){
      productTypeIDInput.forEach(productTypeID => {
        valuesInsertProductTypeMap = [...valuesInsertProductTypeMap, [productInsertID, productTypeID]]
      });
      db.query(`INSERT INTO product_type_map (product_id, product_type_id) VALUES ?;`, [valuesInsertProductTypeMap], (error, results, fields) => {
        // console.error(error)
        if (error) return res.status(500).json(resStatus500());
      });
    }

    return res.json(resStatus200(results));
  });
});
router.route('/upload-product?',).post(upload.array('product_images', 12), (req, res, next) => {
  const id = req.header('Product-ID');
  let valuesInsertProduct = [];
  let fileRequests = req.files;
  console.log("fileRequests", fileRequests)
  db.query(`SELECT COUNT(*) FROM product WHERE product_id = ?;`, [id], async (error, results, fields) => {
    if (error) return res.status(500).json(resStatus500());

    let qualityImage = 0;
    // await resizeImages(fileRequests, 80, 106, qualityImage, `${id}/80x106`);
    // await resizeImages(fileRequests, 290, 385, qualityImage, `${id}/290x385`);
    await resizeImages(fileRequests, 510, 677, qualityImage, `${id}`);
    await removeImages(fileRequests);
    let pathUpload = `${req.get('host')}/uploads/product/${id}`;
    fileRequests.forEach(fileRequest => {
      let {filename, mimetype, size, path} = fileRequest;
      let filepathLocation = `${pathUpload}/${filename}`;
      valuesInsertProduct = [...valuesInsertProduct, [filename, filepathLocation, mimetype, size, `${pathUpload}`, id]];
    });
    db.query(`INSERT INTO product_album (filename, filepath, type, filesize, destination, product_id) VALUES ?;`, [valuesInsertProduct], (error, results, fields) => {
      console.error(error)
      if (error) return res.status(500).json(resStatus500());

      return res.json(resStatus200(results));
    });
  });
});

// PUT
router.route('/edit-product?').put((req, res, next) => {
  let product_id = req.body.id;
  let productTypeIDListInputResult = req.body.product_type_id;
  let valuesInsert = [];
  let valuesDelete = [];
  let requestsUpdate = {
    'product_name': req.body.product_name,
    'price': req.body.price,
    'qty': req.body.qty,
    'detail': req.body.detail,
    'description': req.body.description
  }
  db.query(`
    SELECT p.*, GROUP_CONCAT(product_type_id) AS product_type_id
    FROM ${tableName} AS p
    LEFT JOIN product_type_map AS ptm ON p.product_id = ptm.product_id
    WHERE p.product_id = ?
  `, product_id, (error, results, fields) => {
    if (error) return res.status(500).json(resStatus500());
    let productResult = JSON.parse(JSON.stringify(results));
    let productTypeIDListResult = productResult[0].product_type_id ? productResult[0].product_type_id.split(',') : [];

    productTypeIDListInputResult.forEach(productTypeIDInput => {
      if(!productTypeIDListResult.includes(productTypeIDInput)){
        valuesInsert = [...valuesInsert, [product_id, productTypeIDInput]];
      }
    });
    productTypeIDListResult.forEach(productTypeID => {
      if(!productTypeIDListInputResult.includes(productTypeID)){
        valuesDelete = [...valuesDelete, [product_id, productTypeID]];
      }
    });
    
    db.query(`UPDATE product SET ? WHERE product_id = ?;`, [requestsUpdate, product_id], (error, results, fields) => {
      if (error) return res.status(500).json(resStatus500());
      if(valuesInsert.length > 0){
        db.query(`INSERT INTO product_type_map (product_id, product_type_id) VALUES ?;`, [valuesInsert], (error, results, fields) => {
          if (error) return res.status(500).json(resStatus500());
        });
      }
      if(valuesDelete.length > 0){
        db.query(`DELETE FROM product_type_map WHERE (product_id, product_type_id) IN (?);`, [valuesDelete], (error, results, fields) => {
          if (error) return res.status(500).json(resStatus500());
        });
      }
      
      return res.json(resStatus200(results));
    });
  });
});

// PATCH
router.route('/status-product').patch((req, res, next) => {
  let productID = req.body.id;
  let productStatus = req.body.status;
  db.query(`UPDATE product SET status = ? WHERE product_id = ?`, [productStatus, productID], (error, results, fields) => {
    if(error) return res.status(500).json(resStatus500());
    return res.json(resStatus200(results));
  });
});
router.route('/set-profile-product').patch((req, res, next) => {
  let productId = req.body.id;
  let profileId = req.body.profile_id;
  db.query(`UPDATE product SET product_album_id = ? WHERE product_id = ?`, [profileId, productId], (error, results, fields) => {
    if(error) return res.status(500).json(resStatus500());
    return res.json(resStatus200(results));
  });
});

// DELETE
router.route('/destroy-product?').delete((req, res, next) => {
  let productID = req.query.id;

  db.query(`SELECT * FROM product_album WHERE product_id = ?`, [productID], (error, results, fields) => {
    if (error) return res.status(500).json(resStatus500());
    let productAlbumJson = JSON.parse(JSON.stringify(results));
    let productAlbumData = productAlbumJson;
    db.query(`DELETE FROM product_album WHERE product_id = ?;`, [productID], (error, results, fields) => {
      if (error) return res.status(500).json(resStatus500());
      productAlbumData.forEach(productAlbum => {
        fs.unlink(`server/${rootpath}/${productID}/${productAlbum.filename}`, (error) => console.error(error));
      });

      db.query(`
        DELETE FROM product_type_map WHERE product_id = ?;
        DELETE FROM product WHERE product_id = ?;
      `, [productID, productID], (error, results, fields) => {
        console.error(error)
        if (error) return res.status(500).json(resStatus500());
        
        fs.rmdir(`server/${rootpath}/${productID}`, (error) => console.error(error));
        return res.json(resStatus200(results));
      });
    });
  });
});
router.route('/remove-image-product?').delete((req, res, next) => {
  let productAlbumID = req.query.id;
  db.query(`SELECT * FROM product_album WHERE product_album_id = ?`, [productAlbumID], (error, results, fields) => {
    console.error(error)
    if (error) return res.status(500).json(resStatus500());
    let productAlbumJson = JSON.parse(JSON.stringify(results));
    let productAlbumData = productAlbumJson[0];
    db.query(`DELETE FROM product_album WHERE product_album_id = ?;`, [productAlbumID], (error, results, fields) => {
      if (error) return res.status(500).json(resStatus500());
      
      fs.unlink(`server/${rootpath}/${productAlbumData.product_id}/${productAlbumData.filename}`, (error) => console.error(error));
      return res.json(resStatus200(results));
    });
  });
});

module.exports = router;