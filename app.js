const express = require("express");
const app = express();
const morgan = require("morgan");
const session = require('express-session')
require('dotenv').config();

app.use(session({
  secret:'secret key',
  resave: false,
  saveUninitialized: true
}))


app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.set("views");
app.set("view engine", "ejs");
app.use(express.static("./public"))


const route = require("./routes/route")
app.use("/", route)


PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
  console.log('working');
});