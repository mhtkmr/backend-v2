const mongo = require("mongoose");
const config = require("./config");
const logger = require("./logger")();

mongo.connect(config["mongo_host"], {
    useNewUrlParser: true
}, (err) => {
    if (err) {
        throw new Error("Error connecting mongoose");
    } else {
        logger.info("Connection successfull");
    }
});

module.exports = mongo;