const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const database = require("./database");

const userRouter = require('./routes/user-routes');
const templateRouter = require('./routes/template-routes');

const imageRouter = require('./routes/image-routes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use("/api/user", userRouter);
app.use("/api/template", templateRouter);

app.use("/api/upload-image", imageRouter);

const init = async () => {
  await database.init([]);
}

app.listen(8001, () => {
  init()
  console.log('App is listening on url http://localhost:8001')
});