/**
 * Auth routes.
 */
module.exports = ({
    client,
    logger
}) => {
    const express = require('express');
    const UserModel = require('../models/user');
    const validate = require('./../validator');
    const router = express.Router();

    /**
     * Test Route
     * TODO: to be removed
     */
    router.route("/").get((req, res, next) => {
        const uid = req.sessionID;
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
    router.route("/").post( async (req,res, next) => {
        try{
            //search for user with same email in db
            const user = await UserModel.findOne({email : req.body.email});
            if(user){
                //if found, error => user exist
                console.log(user);
                logger.info(`[Auth][Signup] - ${req.url}`);
                res.status(400).json("User Already Exist.");
            }
            else{
                // mapping params for new user
                const newUser = new UserModel({
                    username: req.body.username,
                    email: req.body.email,
                    'fullname.firstname': req.body.firstname,
                    'fullname.middlename': req.body.middlename,
                    'fullname.lastname': req.body.lastname
                })
                //saving password in a variable to validate further
                var pass = req.body.password;
                //validating password as per requirement
                const validated =  validate.validatePassword(pass);
                //if validation fails
                if(!validated){
                    res.json('Password Must include one special character, one capital letter, one number with min length 8')
                }
                //if password passes validation successfully
                else{
                newUser.setPassword(pass);
                logger.info(`[Auth][Signup] - ${req.url}`);
                //saving in the db
                const saveModel = await newUser.save();
                return res.status(201).json(saveModel);
                }
            }

        }
        catch(err){
            console.log(err);
        }
    })
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
     * 
     *  email:      // unique, required
     *  fullName:   // required
     * }
     * Checks in db if user exists(username || email):
     * YES: sendError("User already exists")
     * NO: create
     */

    // ## Login route
    router.route('/login').post(async (req, res) =>{
       
       try{
        //checking in db for user with either email id or password
        const user = await UserModel.findOne({$or: [{'email': req.body.email}, {'username': req.body.username}]});
        console.log(user._id);
        //if user not found
        if(!user){
            logger.info(`[Auth][login] - ${req.url}`);
            res.status(404).json('User not Found');
        }
        else{
            //validating password with the hash saved for this password. 
        if(user.validPassword(req.body.password)){

            
          
           //requesting sessionId
            const sid = req.sessionID;
            //converting the userid from object to string for redis
            const UID = (user._id).toString();
          
          
            logger.info(`[Auth][Login] - ${req.url}`);
         
            //setting client for this.user
            const clientr = await client.setAsync(sid, UID);
         
            console.log(clientr + 'redis');
            //checking for client registeration
            const reply = await client.getAsync(sid);
         
            console.log(reply + 'reply');
            // setting payload data.
            const payload = [{'sid': sid},{'id' : user._id}, 
         
            {'uname': user.username},{'email': user.email},
         
            {'fullname': user.fullname},
         
            {'subscription': user.subscription}];
            console.log(req.sessionID);
            
            //sending cookie for session with name connect.sid and domain name with max age set to 24hr         
            return res.set({'X-Auth-Token': `${sid} ${UID}`}).cookie('connect.sid', sid, {domain: req.hostname}, {maxAge: 86400000}).send(payload);

        }
        
        }
    }
    catch(err){
        console.log(err);
    }



    }
    )
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

    router.route('/logout').get((req, res,next) => {
        try{

        const uid = req.sessionID;
        redis.del(uid);
        
         req.session.destroy(function(){
            console.log('session logged out.');
        });
        res.set({'X-Auth-Token': 'null'}).clearCookie('uid').redirect('/login')
    } catch(err){
        console.log(err);
    }
    });
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