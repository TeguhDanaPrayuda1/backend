const express = require("express");
const router = express.Router();
const connection = require("../config/db");
const { body, validationResult } = require("express-validator");

router.get("/", (req, res) => {
  connection.query("SELECT * FROM Post ORDER BY id DESC", (error, results) => {
    if (error) {
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "List Data Posts",
        data: results,
      });
    }
  });
});

router.post(
  "/store",
  [
    //validation
    body("judul").notEmpty(),
    body("isi").notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    //define formData
    let formData = {
      judul: req.body.judul,
      isi: req.body.isi,
    };

    // insert query
    connection.query(
      "INSERT INTO posts SET ?",
      formData,
      function (err, results) {
        //if(err) throw err
        if (err) {
          return res.status(500).json({
            status: false,
            message: "Internal Server Error",
          });
        } else {
          return res.status(201).json({
            status: true,
            message: "Insert Data Successfully",
            data: results[0],
          });
        }
      }
    );
  }
);

// menampilkan detail data
router.get("/(:id)", (req, res) => {
  let id = req.params.id;
  connection.query(`SELECT * FROM Post WHERE id = ${id}`, (err, results) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
      });
    }

    if (results.length <= 0) {
      return res.status(404).json({
        status: false,
        message: "Data Post Not Found",
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "Detail Data Post",
        data: results[0],
      });
    }
  });
});

// update post
router.patch(
  "/update/:id",
  [body("judul").notEmpty(), body("isi").notEmpty()],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    let id = req.params.id;

    let formData = {
      judul: req.body.judul,
      isi: req.body.isi,
    };

    connection.query(
      `UPDATE Post SET ? WHERE id = ${id}`,
      formData,
      (err, results) => {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "internal server error",
          });
        } else {
          return res.status(200).json({
            status: true,
            message: "Data Post has been updated",
          });
        }
      }
    );
  }
);

// delete post
router.delete("/delete/(:id)", (req, res) => {
  let id = req.params.id;

  connection.query(`DELETE FROM Post WHERE id = ${id}`, (err, results) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "Data Post has been deleted",
      });
    }
  });
});

module.exports = router;
