const express = require("express");
const route = require("./src/Route/blogRoute");
const cors = require("cors");
const app = express();
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getMinutes() + " - " + file.originalname);
  },
});

const filter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

require("dotenv").config();
const PORT = 5000;
const db =
  "mongodb+srv://zero:12qwerty@test.cttxssn.mongodb.net/blog?retryWrites=true&w=majority&ssl=true";

app.use(bodyparser.json());
app.use(cors());

app.use(multer({ storage: fileStorage, fileFilter: filter }).single("image"));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/v1", route);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({
    message: message,
    data: data,
  });
  next();
});
app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
mongoose
  .connect(db)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("error mongo", err);
  });