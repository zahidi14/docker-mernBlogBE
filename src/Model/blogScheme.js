const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  reply: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const blogSceme = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    author: {
      type: Object,
      required: true,
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("blog", blogSceme);