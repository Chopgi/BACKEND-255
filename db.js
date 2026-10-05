const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://user:pass@songdb.lx6co42.mongodb.net/?appName=SongDB",
);

module.exports = mongoose;
