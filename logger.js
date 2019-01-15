/**
 * Logger | Bunyan
 */
module.exports = () => {
    const config = require("./config");
    const bunyan = require('bunyan');
    const path = require("path");

    function reqSerializer(req) {
        return {
            method: req.method,
            url: req.url,
            headers: req.headers
        };
    }
    const logger = bunyan.createLogger({
        name: config["name"],
        src: true,
        streams: [{
                level: 'info',
                stream: process.stdout // log INFO and above to stdout
            },
            {
                level: 'error',
                // stream: process.stdout,
                path: config["env"] === "development" ? path.resolve(__dirname, 'log/development-error.log') : path.resolve(__dirname, 'log/production-error.log')
            }
        ],
        serializers: {
            req: reqSerializer
        }
    });
    return logger;
}