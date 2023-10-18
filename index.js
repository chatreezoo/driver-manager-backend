const express = require("express");
const cors = require("cors");
// const mongoose = require("mongoose");
require("dotenv").config();
var mysql = require('mysql');
// ตั้งค่า project
const app = express();
// ดึงค่า port จาก file env
const port = process.env.PORT || 4000;
app.use((req, res, next) => {
res.header("Access-Control-Allow-Origin", "*");
res.header(
    "Access-Control-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
);
next();
});

// Middleware
app.use(express.json());
const corsOptions = {
  // origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Export the Express 
// ตั้งค่าฐานข้อมูล


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "driver"
});

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });
// const uri = process.env.ATLAS_URI;


// mongoose.connect(uri, {
//   // useCreateIndex:true,
// useNewUrlParser: true,
// useUnifiedTopology: true,
// });

// const connection = mongoose.connection;
// connection.once("open", () => console.log("DB connect"));

// Route
const scheduleRouter = require("./routes/ScheduleRoute");
app.use("/schedule", scheduleRouter);

app.listen(port, () => console.log(`Running on port:${port}`));
