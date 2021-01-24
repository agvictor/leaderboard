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

app.get("/tracks", (req,res) => {
  Timing.find().limit(100).exec((err, timings) => {
    if (err) return handleError(err);
    res.render('timingBoard', {
      timings: timings
    });
  });
})

app.get("/tracks/:trackID", (req, res) => {
  const trackID = req.params.trackID;
  console.log(trackID);
  Timing.find({
    trackName: trackID.charAt(0).toUpperCase() + trackID.slice(1).toLowerCase()
  }).limit(100).exec((err,timings) => {
    if (err) return handleError(err);
    res.render('timingBoard', {
      timings: timings
    });
  });
});

app.post("/tracks", (req, res) => {
  const entry = new Timing({
    driverName: req.body.driverName,
    trackName: req.body.trackName,
    trackConfig: req.body.trackConfig,
    car: req.body.car,
    lapTime: req.body.lapTime
  });
  entry.save((err)=>{
    if(!err){
      res.send("Successfully added a new article");
    } else {
      res.send(err);
    }
  });
})

app.listen(LOCAL_PORT, () => {
  console.log("Server running on port " + LOCAL_PORT)
});
