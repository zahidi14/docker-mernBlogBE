const { validationResult } = require("express-validator");
const blogScheme = require("../Model/blogScheme");
const path = require("path");
const fs = require("fs");

exports.getAll = (req, res, next) => {
  const currentPage = req.query.currentPage || 1;
  const perPage = req.query.perPage || 3;
  let totalData;

  blogScheme
    .find()
    .countDocuments()
    .then((count) => {
      totalData = count;
      return blogScheme
        .find()
        .skip((parseInt(currentPage) - 1) * 3)
        .limit(parseInt(perPage));
    })
    .then((result) => {
      res.status(201).json({
        message: "data Fetcched",
        data: result,
        total_data: parseInt(totalData),
        current_page: parseInt(currentPage),
        per_page: parseInt(perPage),
      });
    })
    .catch((err) => {
      console.log({ error: err });
    });
};

exports.getById = (req, res, next) => {
  const id = req.params.blogId;
  console.log("tes", req.body);
  blogScheme
    .findById(id)
    .then((result) => {
      if (!result) {
        const err = new Error("blog not found");
        err.status = 404;
        throw err;
      }
      res.status(201).json({
        message: "blog found",
        data: result,
      });
      console.log("req", result);
    })
    .catch((err) => {
      next(err);
    });
};

exports.blogPost = (req, res, next) => {
  console.log("req", req.body);
  const title = req.body.title;
  const content = req.body.content;
  const image = req.file.path;

  const error = validationResult(req);

  if (!error.isEmpty()) {
    const err = new Error("bad request");
    err.status = 400;
    err.data = error.array();
    throw err;
  }
  if (!req.file) {
    const err = new Error("upload image");
    err.errorStat = 422;
    throw err;
  }

  const post = new blogScheme({
    title: title,
    content: content,
    image: image,
    author: {
      name: "coki coki",
    },
  });
  post
    .save()
    .then((result) => {
      res.status(201).json({
        message: "posted",
        data: result,
      });
    })
    .catch((err) => {
      console.log("error post", err);
      next(err);
    });
};

exports.addComment = (req, res, next) => {
  console.log("comment", req.body);
  const blogId = req.params.blogId;
  const comment = req.body;

  console.log("blogid", blogId);
  console.log("comment", comment);
  blogScheme
    .findById(blogId)
    .then((post) => {
      post.comments.push(comment);
      if (!post) {
        const error = new Error("data not found");
        error.status = 404;
        throw error;
      }

      return post.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "comment added",
        data: result,
      });
    })
    .catch((err) => {
      next(err);
      console.log("err comment", err);
    });
};
exports.blogUpdate = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const image = req.file.path;
  const err = validationResult(req);
  const blogId = req.params.blogId;

  if (!err.isEmpty()) {
    const error = new Error("bad request");
    error.status = 400;
    throw error;
  }

  blogScheme
    .findById(blogId)
    .then((post) => {
      post.title = title;
      post.content = content;
      post.image = image;
      if (!post) {
        const err = new Error("data to update not found");
        err.status = 404;
        throw err;
      }
      return post.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "Successfully updated",
        data: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.blogDelete = (req, res, next) => {
  const id = req.params.blogId;

  blogScheme
    .findById(id)
    .then((post) => {
      if (!post) {
        const error = new Error("Data not found");
        error.status = 404;
        throw error;
      }
      removeImage(post.image);
      return blogScheme.findByIdAndRemove(id);
    })
    .then((result) => {
      res.status(200).json({
        message: "deleted",
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "not found",
      });
      next(err);
    });
};

const removeImage = (filepath) => {
  filepath = path.join(__dirname, "../..", filepath);
  fs.unlink(filepath, (err) => {
    console.log("file delete", err);
  });
};