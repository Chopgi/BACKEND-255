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

app.use("/api", router);

app.listen(3000);
