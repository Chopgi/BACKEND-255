const express = require("express");
const Song = require("./models/song");
var cors = require("cors"); //cross origin scripting | allows two servers to communicate on the same machine, different ports, different servers, different domains

const app = express();
app.use(cors()); // Enable CORS
// Middleware that parses HTTP requests with JSON body
app.use(express.json());

const router = express.Router();

// Get list of all songs in the database
router.get("/songs", async function (req, res) {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

//grabbing a single song from id
router.get("/songs/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    res.json(song);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

// Add a new song to the database
router.post("/songs", async (req, res) => {
  try {
    const song = new Song(req.body);
    await song.save();
    res.status(201).json(song);
    console.log(song);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

//update is to update an existing record/resourse/database entry = it uses a PUT request
router.put("/songs/:id", async (req, res) => {
  //first we need to find and update the song the frontend wants us to update,
  //and to do this, we need to request the id of the song from the original request
  //and then find it in the database and update it with the nre data
  try {
    const song = req.body;
    await Song.updateOne({ _id: req.params.id }, song);
    console.log(song);
    res.sendStatus(204);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

app.use("/api", router);

app.listen(3000);
