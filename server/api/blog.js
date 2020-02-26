const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { resStatus200, resStatus500 } = require('../core/restAPI');
const { resizeImages, removeImages } = require('../core/function');
const fs = require('fs');
const { getUploadConfig } = require('../config/multer-config');

const rootpath = "public/uploads/blog";
const upload = getUploadConfig(rootpath)
const tableName = "blog";

// GET
router.route('/blog-list?').get((req, res, next) => {
  db.query(`
    SELECT b.*, ba.filepath AS blog_profile
    FROM ${tableName} AS b
    LEFT JOIN blog_album AS ba ON b.blog_album_id = ba.blog_album_id
    LIMIT 40
  `, (error, results, fields) => {
    // console.error(error)
    if (error) return res.status(500).json(resStatus500());

    return res.json(resStatus200(results));
  });
});
router.route('/blog-detail?').get((req, res, next) => {
  let blog_id = req.query.id;
  db.query(`
    SELECT b.*, bt.blog_type_id, bt.blog_type_name, ba.filepath AS blog_profile
    FROM ${tableName} AS b
    LEFT JOIN blog_type_map AS btm ON b.blog_id = btm.blog_id
    LEFT JOIN blog_type AS bt ON btm.blog_type_id = bt.blog_type_id
    LEFT JOIN blog_album AS ba ON b.blog_album_id = ba.blog_album_id
    WHERE b.blog_id = ?;
    
    SELECT bt.blog_type_id, bt.blog_type_name
    FROM blog_type AS bt
    LEFT JOIN blog_type_map AS btm ON bt.blog_type_id = btm.blog_type_id
    WHERE btm.blog_id = ?;
    
    SELECT filepath
    FROM blog_album
    WHERE blog_id = ?;
  `, [blog_id, blog_id, blog_id], (error, results, fields) => {
    console.error(error)
    if (error) return res.status(500).json(resStatus500());

    return res.json(resStatus200({...results[0].find(result => result.blog_id == blog_id),
      blog_type_list: results[1],
      blog_images: results[2].map(result => result.filepath)
    }));
  });
});
router.route('/blog-album').get((req, res, next) => {
  let blogId = req.query.id;
  db.query(`
    SELECT ba.*, b.blog_album_id AS blog_profile
    FROM blog_album AS ba
    LEFT JOIN blog AS b ON ba.blog_album_id = b.blog_album_id
    WHERE ba.blog_id = ?;
  `, [blogId], (error, results, fields) => {
    if (error) return res.status(500).json(resStatus500());

    return res.json(resStatus200(results));
  });
});

// POST
router.route('/add-blog?').post((req, res, next) => {
  console.log("req", req.body)
  let title = req.body.title;
  let description = req.body.description;
  let requestsProduct = {
    title: title,
    description: description
  }
  let valuesInsertBlogTypeMap = [];
  let blogTypeIdInput = req.body.blog_type_id;
  db.query(`INSERT INTO ${tableName} SET ?;`, requestsProduct, (error, results, fields) => {
    if (error) return res.status(500).json(resStatus500());

    let blogInsertId = results['insertId'];
    console.log("blogInsertId", blogInsertId)
    console.log("blogTypeIdInput", blogTypeIdInput)
    if(blogTypeIdInput.length > 0){
      blogTypeIdInput.forEach(blogTypeID => {
        valuesInsertBlogTypeMap = [...valuesInsertBlogTypeMap, [blogInsertId, blogTypeID]]
      });
      db.query(`INSERT INTO blog_type_map (blog_id, blog_type_id) VALUES ?;`, [valuesInsertBlogTypeMap], (error, results, fields) => {
        // console.error(error)
        if (error) return res.status(500).json(resStatus500());
      });
    }

    return res.json(resStatus200(results));
  });
});
router.route('/upload-blog?',).post(upload.array('blog_images', 1), (req, res, next) => {
  const id = req.header('Blog-ID');
  let fileRequests = req.files;

  let valuesInsertBlog = [];
  db.query(`SELECT COUNT(*) FROM blog WHERE blog_id = ?;`, [id], async (error, results, fields) => {
    if (error) return res.status(500).json(resStatus500());

    let qualityImage = 0;
    await resizeImages(fileRequests, 870, 450, qualityImage, `${id}`);
    await removeImages(fileRequests);
    let pathUpload = `${req.get('host')}/uploads/blog/${id}`;
    fileRequests.forEach(fileRequest => {
      let {filename, mimetype, size, path} = fileRequest;
      let filepathLocation = `${pathUpload}/${filename}`;
      valuesInsertBlog = [...valuesInsertBlog, [filename, filepathLocation, mimetype, size, `${pathUpload}`, id]];
    });
    db.query(`INSERT INTO blog_album (filename, filepath, type, filesize, destination, blog_id) VALUES ?;`, [valuesInsertBlog], (error, results, fields) => {
      console.error(error)
      if (error) return res.status(500).json(resStatus500());

      return res.json(resStatus200(results));
    });
  });
});

// PUT
router.route('/edit-blog?').put((req, res, next) => {
  let blog_id = req.body.id;
  let title = req.body.title;
  let description = req.body.description;
  let blogTypeIDListInputResult = req.body.blog_type_id;
  let requestsUpdate = {
    'title': title,
    'description': description,
  }

  let valuesInsert = [];
  let valuesDelete = [];
  db.query(`
    SELECT b.*, GROUP_CONCAT(blog_type_id) AS blog_type_id
    FROM ${tableName} AS b
    LEFT JOIN blog_type_map AS btm ON b.blog_id = btm.blog_id
    WHERE b.blog_id = ?
  `, blog_id, (error, results, fields) => {
    if (error) return res.status(500).json(resStatus500());
    let blogResult = JSON.parse(JSON.stringify(results));
    let blogTypeIDListResult = blogResult[0].blog_type_id ? blogResult[0].blog_type_id.split(',') : [];

    blogTypeIDListInputResult.forEach(blogTypeIDInput => {
      if(!blogTypeIDListResult.includes(blogTypeIDInput)){
        valuesInsert = [...valuesInsert, [blog_id, blogTypeIDInput]];
      }
    });
    blogTypeIDListResult.forEach(blogTypeID => {
      if(!blogTypeIDListInputResult.includes(blogTypeID)){
        valuesDelete = [...valuesDelete, [blog_id, blogTypeID]];
      }
    });
    
    db.query(`UPDATE blog SET ? WHERE blog_id = ?;`, [requestsUpdate, blog_id], (error, results, fields) => {
      if (error) return res.status(500).json(resStatus500());
      if(valuesInsert.length > 0){
        db.query(`INSERT INTO blog_type_map (blog_id, blog_type_id) VALUES ?;`, [valuesInsert], (error, results, fields) => {
          if (error) return res.status(500).json(resStatus500());
        });
      }
      if(valuesDelete.length > 0){
        db.query(`DELETE FROM blog_type_map WHERE (blog_id, blog_type_id) IN (?);`, [valuesDelete], (error, results, fields) => {
          if (error) return res.status(500).json(resStatus500());
        });
      }
      
      return res.json(resStatus200(results));
    });
  });
});

// PATCH
router.route('/status-blog').patch((req, res, next) => {
  let blogId = req.body.id;
  let blogStatus = req.body.status;
  db.query(`UPDATE blog SET status = ? WHERE blog_id = ?`, [blogStatus, blogId], (error, results, fields) => {
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
router.route('/destroy-blog?').delete((req, res, next) => {
  let blogId = req.query.id;

  db.query(`SELECT * FROM blog_album WHERE blog_id = ?`, [blogId], (error, results, fields) => {
    if (error) return res.status(500).json(resStatus500());
    let blogAlbumJson = JSON.parse(JSON.stringify(results));
    let blogAlbumData = blogAlbumJson;
    db.query(`DELETE FROM blog_album WHERE blog_id = ?;`, [blogId], (error, results, fields) => {
      if (error) return res.status(500).json(resStatus500());
      if(blogAlbumData.length > 0){
        blogAlbumData.forEach(blogAlbum => {
          fs.unlink(`server/${rootpath}/${blogId}/${blogAlbum.filename}`, (error) => console.error(error));
        });
      }

      db.query(`
        DELETE FROM blog_type_map WHERE blog_id = ?;
        DELETE FROM blog WHERE blog_id = ?;
      `, [blogId, blogId], (error, results, fields) => {
        console.error(error)
        if (error) return res.status(500).json(resStatus500());
        
        fs.rmdir(`server/${rootpath}/${blogId}`, (error) => console.error(error));
        return res.json(resStatus200(results));
      });
    });
  });
});
router.route('/remove-image-blog?').delete((req, res, next) => {
  let blogAlbumID = req.query.id;
  db.query(`SELECT * FROM blog_album WHERE blog_album_id = ?`, [blogAlbumID], (error, results, fields) => {
    console.error(error)
    if (error) return res.status(500).json(resStatus500());
    let blogAlbumJson = JSON.parse(JSON.stringify(results));
    let blogAlbumData = blogAlbumJson[0];
    db.query(`DELETE FROM blog_album WHERE blog_album_id = ?;`, [blogAlbumID], (error, results, fields) => {
      if (error) return res.status(500).json(resStatus500());
      
      fs.unlink(`server/${rootpath}/${blogAlbumData.blog_id}/${blogAlbumData.filename}`, (error) => console.error(error));
      return res.json(resStatus200(results));
    });
  });
});

module.exports = router;