

var express = require("express");
var sqlite3 = require("sqlite3").verbose();
var bodyParser = require("body-parser");

var db = new sqlite3.Database("db/document.db");
var app = express();

app.use(express.static(__dirname + "/public"));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get("/items", function(req, res) {
  db.all("SELECT * FROM items", function(err, rows) {
    if (err) {
      console.log(err);
    } else {
      console.log(rows);
      res.json(rows);
    }
  });
});



app.post("/items", function(req, res) {
  var title = req.body.title;
  var content = req.body.content;
 

  db.run("INSERT INTO items (title, content) VALUES (?, ?);", title, content, function(err) {

    if (err) {
      console.log(err);
    } else {
      var id = this.lastID; 
      db.get("SELECT * FROM items WHERE id = ?;", id, function(err, row) {
        if (err) {
          console.log(err);
        } else {
          console.log(row)
          res.json(row);
        }
      });
    }
  });
});



app.delete("/item/:id", function(req, res) {
  var id = req.params.id;
  db.run("DELETE FROM items WHERE id = ?;", id, function(err) {
    if (err) {
      //console.log(err);
    } else {
      res.json({ deleted: true });
        
    }
  });
});



app.put("/item/:id", function(req, res) {
  console.log("It works! - put function");
  console.log(JSON.stringify(req.body));
  console.log(JSON.stringify(req.query));

  var id = req.params.id;
  console.log("line 71 and id value " + id);
  var title = req.body.title;
  console.log("line 73 value of title " + title);
  var content = req.body.content;
  console.log("line 75 value of content "+ content);

  db.run("UPDATE items SET title = ?, content = ? WHERE id = ?;", title, content, id, function(err) {
    if (err) {
      console.log("Still works!")
      console.log(err);
    } else {
      db.get("SELECT * FROM items WHERE id = ?;", id, function(err, row) {
        if (err) {
          console.log(err);
        } else {
          console.log()
          console.log("working")
          res.json(row);
        }
      });
    }
  });
});


app.listen(3000);
console.log("Listening on port 3000");
































