const express = require("express");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
require("encoding");

const app = express();
const router = express.Router();
require("dotenv").config();
const Parsbdy = require("body-parser");
var cors = require("cors");

var port = process.env.PORT || "3000";

const mailAccountUser = process.env.MAIL_USER_NAME;
const mailAccountPassword = process.env.MAIL_PASSWORD;

router.post("/", (req, res) => {
  var name = req.body.name;
  var receiver = req.body.receiver;
  var subject = req.body.subject;
  var text = req.body.text;
  var data = req.body.data;

  var message = "";
  try {
    var transport = nodemailer.createTransport(
      smtpTransport({
        service: "Gmail",
        auth: {
          user: mailAccountUser,
          pass: mailAccountPassword,
        },
      })
    );

    data.forEach((element) => {
      message =
        message +
        "<h2>" +
        element.field +
        "<h2/><h3>" +
        element.value +
        "</h3><br>";
    });
    let mail = {
      from: '"' + name + '" <' + mailAccountUser + ">",
      to: receiver,
      subject: subject,
      text: text,
      html: message,
    };

    transport.sendMail(mail, function (error, response) {
      if (error) {
        res.json({ status: -1, message: "Error Occured", error: error });
      } else {
        res.json({ status: 1, message: "Email Sent" });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

app.use(cors());
app.use(Parsbdy.json());
app.use(`/api/email`, router);
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message });
});
app.listen(port, function () {
  console.log(`Server is running on port: ${port}`);
});

module.exports = app;
