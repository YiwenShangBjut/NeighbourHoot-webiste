const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: process.env.DB_USER,
  host:process.env.DB_HOST,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

app.post("/create", (req, res) => {
  const name = req.body.name;
  const category = req.body.category;
  const condition_cat = req.body.condition_cat;
  const price = req.body.price;
  const description = req.body.description;
  const user_id=req.body.user_id
  const status=req.body.status

  db.query(
    "INSERT INTO barter (name, category, condition_cat, price, description, user_id, status) VALUES (?,?,?,?,?,?,?)",
    [name, category, condition_cat, price, description, user_id, status],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

app.get("/barter", (req, res) => {
  db.query("SELECT * FROM barter", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/barter/:id", (req, res)=>{
  const id = req.params.id;
  db.query("SELECT * FROM barter WHERE barter.user_id=?",id, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      });
});

app.get("/user/:name", (req, res)=>{
  const name = req.params.name;
  db.query("SELECT * FROM user WHERE user.name=?",name, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      });
});

app.put("/update/barter", (req, res) => {
  const id = req.body.id;
  const status = req.body.status;
  db.query(
    "UPDATE barter SET status = ? WHERE id = ?",
    [status, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.put("/update/user", (req, res) => {
  const id = req.body.id;
  const points = req.body.points;
  db.query(
    "UPDATE user SET points = ? WHERE id = ?",
    [points, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});


// app.delete("/delete/:id", (req, res) => {
//   const id = req.params.id;
//   db.query("DELETE FROM barter WHERE id = ?", id, (err, result) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.send(result);
//     }
//   });
// });

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log("Yey, your server is running on port " + port);
});
