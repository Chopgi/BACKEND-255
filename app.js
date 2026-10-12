const express = require("express");
const Song = require("./models/song");
var cors = require("cors"); //cross origin scripting | allows two servers to communicate on the same machine, different ports, different servers, different domains
// const bodyParser = require('body-parser')   //to parse token
const jwt = require("jwt-simple");
const User = require("./models/users");

const app = express();
app.use(cors()); // Enable CORS
// Middleware that parses HTTP requests with JSON body
app.use(express.json());

const router = express.Router();
const secret = "supersecret";

//Creting a new user in db
router.post("/user", async (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.sendStatus(400).json({ error: "Missing username or password" });
  }

  const newUser = await new User({
    username: req.body.username,
    password: req.body.password,
    status: req.body.status,
  });

  try {
    await newUser.save();
    res.sendStatus(201); //created status
    console.log(newUser);
  } catch (ex) {
    res.sendStatus(400).send(ex); //created status
  }
});

//authenticate or login
//post request -we use post because when you log in, you are creating what we will call a new "session"
router.post("/auth", async (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.sendStatus(400).json({ error: "Missing username or password" });
    return;
  }
  //try to find the username in the database, then see if it matches with a username and password.
  //wait finding a user
  let user = await User.findOne({ username: req.body.username });
  //we have to create this variable to grab the user data instead of using a callback (since they are note supported)

  if (!user) {
    res.sendStatus(401).json({ error: "Bad Username" });
  }
  //check to see if user's password  matches the request's password
  else {
    if (user.password != req.body.password) {
      res.sendStatus(401).json({ error: "Bad Password" });
    }
    // successful login:
    else {
      //create a token that is encoded with the jwt library, and send back the username. this will be important later
      //create, encode, and send back the token...
      //we also will send back, as part of the token, that you are currently authorized
      //we could also do this with a boolean or number value (i.e if auth = 0 you're not authorized; if auth =1 you are auth)

      //user.username from (err, user), which is from req.body.username
      username2 = user.username;
      const token = jwt.encode({ username: user.username }, secret);
      //for creating a token, you take a seed value and another value as "algorithmic input"
      const auth = 1;

      //respond with the tolen
      res.json({
        username2,
        token: token,
        auth: auth,
        //we use the same names because we are binding const values to field names in json
      });
    }
  }
});

//check the status of user using their valid token, check if it matches the fron tend token
router.get("/status", async (req, res) => {
  // if there are no request headers for the "x-auth" section
  if (!req.headers["x-auth"]) {
    return res.sendStatus(401).json({ error: "Missing X-Auth" });
  }
  //if x-auth contains the token (it should)
  const token = req.headers["x-auth"];
  try {
    const decoded = jwt.decode(token, secret);

    //send back all username and status fields to the user or front end
    let users = User.find({}, "username status");
    res.json(users);
  } catch (ex) {
    res.sendStatus(401).json({ error: "Invalid jwt token" });
  }
});

// Get list of all songs in the database
router.get("/songs", async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (ex) {
    res.sendStatus(400).send(ex.message);
  }
});

//grabbing a single song from id
router.get("/songs/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    res.json(song);
  } catch (ex) {
    res.sendStatus(400).send(ex.message);
  }
});

// Add a new song to the database
router.post("/songs", async (req, res) => {
  try {
    const song = new Song(req.body);
    await song.save();
    res.sendStatus(201).json(song);
    console.log(song);
  } catch (ex) {
    res.sendStatus(400).send(ex.message);
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
    res.sendStatus(400).send(ex.message);
  }
});

router.delete("/songs/:id", async (req, res) => {
  //method or function in mongoose/mongo to delete a single instance of a song or object
  try {
    const song = await Song.findById(req.params.id);
    //console.log(song);
    await Song.deleteOne({ _id: song._id });
    res.sendStatus(204);
  } catch (ex) {
    res.sendStatus(400).send(ex.message);
  }
});
app.use("/api", router);

// var port = process.env.PORT || 3000;
// app.listen(port);
//for listening on opened port of hosting service

app.listen(3000);
