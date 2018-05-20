const mongoose = require("mongoose");
const keys = require("../config/keys.js");

console.log(keys)
mongoose.Promise = global.Promise; // Tell mongoose to use promises.
mongoose.connect(`mongodb://${keys.mongo_user}:${keys.mongo_password}@ds155191.mlab.com:55191/recap-node-app`);

module.exports = {
    mongoose
}

// wer80hwenaiYGLIa