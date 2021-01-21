// jshint esversion:6
const express = require('express');
const bp = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

// constant number declarations
const LOCAL_PORT = 3000;

// express app configuration
const app = express();
app.use(bp.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/lapTimings", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const timingSchema = new mongoose.Schema ({
  driverName: String,
  trackName: String,
  trackConfig: String,
  car: String,
  lapTime: String
});

const Timing = mongoose.model("Timing", timingSchema);

app.get("/", (req, res) => {
  console.log(req.query);
  const query = req.query
  Timing.find({
    trackName: query.track.charAt(0).toUpperCase() + query.track.slice(1).toLowerCase()
  }).limit(100).exec((err,timings) => {
    if (err) return handleError(err);
    res.render('timingBoard', {
      timings: timings
    });
  });
});

app.listen(LOCAL_PORT, () => {
  console.log("Server running on port " + LOCAL_PORT)
});
