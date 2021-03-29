const express = require("express");
const app = express();
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require('cors')
const fs = require("fs");
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let ran = (length=10) => Math.random().toString(36).substr(2,length);

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //req.body is empty
    var date = new Date();
    let d = `${date.getFullYear()}/${date.getMonth()}/${date.getDay()}`
    let path = `./uploads/${d}`;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path,{recursive: true});
    }
    cb(null, path);
  },
  filename: function (req, file, cb) {
    let r = ran()+'-'+ran()
    var date = new Date()
    cb(null, `${r}-${date.getTime()}.`+file.originalname.split('.').pop());
  },
});

let upload = multer({ storage: storage });
var cpUpload = upload.fields([{ name: "file", maxCount: 1 }, { name: "id" }]);

app.get("/", cpUpload, (req, res) => {
  res.send({ status: 200, message: "Hello world!" });
});

app.post("/upload", upload.single('file'),async (req, res,next) => {
  res.send({ status: 200,data: req.file });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
