/**
 * Auth routes.
 */
module.exports = ({
    client,
    logger
}) => {
    const express = require('express');
    const router = express.Router();

    /**
     * Test Route
     * TODO: to be removed
     */
    router.route("/").get((req, res, next) => {
        const uid = require('uuid/v4')();
        const val = JSON.stringify({
            username: "tushar"
        });
        logger.info(`[Auth][Login] - ${req.url}`);
        client.setAsync(uid, val).then(() => {
            res.cookie('connect.sid', uid, req.session.cookie);
            res.json({
                message: "OK"
            });
        }).catch(error => {
            next(error);
        });
    });

    // ## Register route
    /**
     * POST request
     * payload: {
     *  username: "tushar",
     *  password: "tushar@123",
     *  email: "tushar@abc.com",
     *  fullName:"Tushar Mudgal"
     * }
     * validations: {
     *  username:   // only alphanumeric characters with first character alphabet, min length 6, max length 25
     *  password:   // all characters with conditions -> one special character, one capital letter, one number,
     *              // min length 8, max length 64
     *  email:      // email validation as per RFC
     *  fullName:   // alphabets only with special condition to include space only one between two words,
     *              // if more than 2 words, only include [first word, last word]
     * }
     * db-validations: {
     *  id:         // auto increment
     *  username:   // unique, required
     *  email:      // unique, required
     *  fullName:   // required
     * }
     * Checks in db if user exists(username || email):
     * YES: sendError("User already exists")
     * NO: create
     */

    // ## Login route
    /**
     * POST request
     * payload: {
     *  [username or email]: "", // check if entered string is username or email using @ matching
     *  password: "tushar@123",
     * }
     * validations: {
     *  username:   // only alphanumeric characters with first character alphabet, min length 6, max length 25
     *  email:      // email validation as per RFC
     *  password:   // all characters with conditions -> one special character, one capital letter, one number,
     *              // min length 8, max length 64
     * }
     * Checks in db if user exists(username || email):
     * YES: send => {
     *  1. ["_id", "username", "email", "fullName", ...rest]
     *  2. res.cookie('UID', ${uuid-v4}, { cookie-options => { set domain to req.host, expiry to 24H } })
     *  3. send X-AUTH-KEY header
     * }
     * NO: sendError("User not found")
     */

    // ## Logout route
    /**
     * POST request
     * payload: {
     *  id:     // user id
     * }
     * headers: { "X_AUTH_KEY" }
     * xhrCredentials: true // in order to send server cookies back
     * Clear cookie and delete session from redis:
     * cleared ? send("Logout successfull") : sendError("Unauthorized") 
     */

    // ## Forgot password route

    // ## Reset password route

    return router;
};