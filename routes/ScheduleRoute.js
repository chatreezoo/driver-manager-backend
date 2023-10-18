const express = require("express");
const router = express.Router();
const scheduleModel = require("../model/Schedule");
var request = require("request");
var mysql = require("mysql");

var con = mysql.createConnection({
  host: "sql12.freesqldatabase.com",
  user: "sql12654314",
  password: "BRCKfeWLEp",
  database: "sql12654314",
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

router.get("/home", (req, res) => {
  res.send("holo word");
});

router.get("/", (req, res) => {
  const sql = "SELECT * FROM schedule";

  // Use the connection pool to handle database queries
  con.query(sql, function(err, result) {
    if (err) {
      console.log(err);
      res.send(err);
      return;
    }
    res.send(result);
  });
});

router.post("/", (req, res) => {
  const schedule = new scheduleModel({
    startDate: req.body.startDate,
    surname: req.body.surname,
    department: req.body.department,
    objective: req.body.objective,
    type: req.body.type,
    time: req.body.time,
    place: req.body.place,
    endTime: req.body.endTime,
    startTime: req.body.startTime,
    endDate: req.body.endDate,
    status: "รอดำเนินการ",
    approve: null,
  });

  var sql = `INSERT INTO schedule (
    startDate,
    surname,
    department,
    objective,
    type,
    time,
    place,
    endTime,
    startTime,
    endDate,
    status,
    approve
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  con.query(
    sql,
    [
      schedule.startDate,
      schedule.surname,
      schedule.department,
      schedule.objective,
      schedule.type,
      schedule.time,
      schedule.place,
      schedule.endTime,
      schedule.startTime,
      schedule.endDate,
      schedule.status,
      schedule.approve,
    ],
    function(err, result) {
      if (err) {
        console.log(err);
        res.send(err);
        return;
      }
      res.send(result);
    }
  );
  // schedule
  //   .save()
  //   .then(() => res.json('Save Succesfuly!'))
  //   .catch(err => res.status(400).json(`error:${err}`))
});

router.put("/:id", (req, res) => {
  const surname = req.body.surname;
  const department = req.body.department;
  const type = req.body.type;
  const approve = req.body.approve;
  const status = req.body.status;
  const sql = `UPDATE schedule SET approve = ?, status = ? WHERE id =?`;
  con.query(sql, [approve, status, req.params.id], function(err, result) {
    if (err) {
      console.log(err);
      res.send(err);
      return;
    }
    res.send(result);
    sendnotification(surname, department, type, approve);
  });
});

router.get("/:id", (req, res) => {
  scheduleModel
    .findById(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json(`error:${err}`));
});

router.delete("/:id", (req, res) => {
  const surname = req.body.surname;
  const reason = req.body.reason;
  res.send(surname);
  const sql = `DELETE FROM schedule WHERE id=?`;
  con.query(sql, [req.params.id], function(err, result) {
    if (err) {
      console.log(err);
      res.send(err);
      return;
    }
    res.send(result);
  });
  sendRejectNoti(surname, reason);
});

function sendnotification(name, department, type, approve) {
  var sendData = `ชื่อผู้จอง : ${name}\n แผนก: ${department}\n ประเภทรถ: ${type}\n คนอนุมัติ: ${approve}\n ตรวจสอบสถานะรายการจอง: https://driver-manager.vercel.app/bookingReport`;
  var token = "YQPZOvgos8jdY7rdppYndNUtdoSLXy1w7vNtWSMXj1d";
  var message = sendData;

  console.log({ message });

  request(
    {
      method: "POST",
      uri: "https://notify-api.line.me/api/notify",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: {
        bearer: token,
      },
      form: {
        message: message,
      },
    },
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("send notification");
      }
    }
  );
}

function sendRejectNoti(name, reason) {
  var sendData = `ชื่อผู้จอง : ${name}\n คำขอไม่ได้รับการอนุมัติเนื่องจาก : ${reason}`;
  var token = "YQPZOvgos8jdY7rdppYndNUtdoSLXy1w7vNtWSMXj1d";
  var message = sendData;

  console.log({ message });

  request(
    {
      method: "POST",
      uri: "https://notify-api.line.me/api/notify",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      auth: {
        bearer: token,
      },
      form: {
        message: message,
      },
    },
    (err, httpResponse) => {
      if (err) {
        console.log(err);
      } else {
        console.log("send notification");
      }
    }
  );
}

module.exports = router;
