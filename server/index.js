const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "12345678",
  database: "project",
});

app.post("/create", (req, res) => {
  const name = req.body.name;
  const category = req.body.category;
  const condition_cat = req.body.condition_cat;
  const price = req.body.price;
  const description = req.body.description;
  console.log(name);

  db.query(
    "INSERT INTO barter (name, category, condition_cat, price, description) VALUES (?,?,?,?,?)",
    [name, category, condition_cat, price, description],
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

// app.put("/update", (req, res) => {
//   const id = req.body.id;
//   const description = req.body.description;
//   db.query(
//     "UPDATE barter SET description = ? WHERE id = ?",
//     [description, id],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//       } else {
//         res.send(result);
//       }
//     }
//   );
// });

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

app.listen(3001, () => {
  console.log("Yey, your server is running on port 3001");
});