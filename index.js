const express = require("express");

const db = require("./data/db.js");

const server = express();

//this is our middleware
server.use(express.json());

server.get("/", (req, res) => {
  res.send("Ayyo World! Whaddup!");
});

server.get("/now", (req, res) => {
  var dt = new Date();
  var utcDate = dt.toUTCString();
  res.send(utcDate);
});

//"R" in CRUD
server.get("/hubs", (req, res) => {
  const hubs = db.hubs
    .find()
    .then(hubs => {
      res.status(200).json(hubs);
    })
    .catch(({ code, message }) => {
      res.status(code).json({
        success: false,
        message
      });
    });
});

// "C" in CRUD
server.post("/hubs", (req, res) => {
  const hubInfo = req.body;

  db.hubs
    .add(hubInfo)
    .then(hub => {
      res.status(201).json({ success: true, hub });
    })
    .catch(({ code, message }) => {
      res.status(code).json({
        success: false,
        message
      });
    });
});

// "D" in CRUD
server.delete("/hubs/:id", (req, res) => {
  const id = req.params.id;
  db.hubs
    .remove(id)
    .then(deleted => {
      res.status(204).end();
    })
    .catch(({ code, message }) => {
      res.status(code).json({
        success: false,
        message
      });
    });
});

// "U" in CRUD
server.put("/hubs/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db.hubs
    .update(id, changes)
    .then(updated => {
      if (updated) {
        res.status(200).json({ success: true, updated });
      } else {
        res.status(404).json({
          success: false,
          message: "unable to find id"
        });
      }
    })
    .catch(({ code, message }) => {
      res.status(code).json({
        success: false,
        message
      });
    });
});

server.get("/hubs/:id", (req, res) => {
  const { id } = req.params;

  db.hubs
    .findById(id)
    .then(hubs => {
      if (hubs) {
        res.status(200).json({ success: true, hubs });
      } else {
        res.status(404).json({
          success: false,
          message: "unable to find requested id"
        });
      }
    })
    .catch(({ code, message }) => {
      res.status(code).json({
        success: false,
        message
      });
    });
});

server.listen(5000, () => {
  console.log("Server Running on http://localhost:5000");
});
