const express = require("express");
const route = express.Router();
const blogCont = require("../Controller/blogController");
const { body } = require("express-validator");

route.get("/blog", blogCont.getAll);
route.get("/blog/:blogId", blogCont.getById);
route.patch("/blog/:blogId/comment", blogCont.addComment);
route.post(
  "/blog/post",
  [
    body("title")
      .isLength({ min: 5 })
      .withMessage("Not meet minimum character"),
    body("content")
      .isLength({ min: 5 })
      .withMessage("Not meet minimum character"),
  ],
  blogCont.blogPost
);
route.put(
  "/blog/:blogId",
  [
    body("title")
      .isLength({ min: 5 })
      .withMessage("minimum 5 character required"),
    body("content")
      .isLength({ min: 15 })
      .withMessage("minimum of 15 character required"),
  ],
  blogCont.blogUpdate
);
route.delete("/blog/:blogId", blogCont.blogDelete);
module.exports = route;