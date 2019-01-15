/**
 * Redis Client
 */
class Redis {
    constructor() {
        const redis = require("redis");
        const bluebird = require("bluebird");
        bluebird.promisifyAll(redis);
        const client = redis.createClient();
        this.redis = redis;
        this.client = client;
    }

    get getClient() {
        return this.client;
    }
}

module.exports = new Redis();