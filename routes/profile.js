module.exports = ({ client, logger }) => {
  console.log("in por1");

  const express = require("express");
  const UserModel = require("../models/user");
  const validate = require("./../validator");
  const nodemailer = require("nodemailer");

  const router = express.Router();

  router.put("/update", async (req, res) => {
    try {
      // fetching uuid from cookie
      const getuser = req.cookies["connect.sid"];
      // fetching user_id from redis
      const getclient = await client.getAsync(getuser);

      logger.info(`[Auth][update]- ${req.url}`);
      // fetching user from db by id
      const user = await UserModel.findById(getclient);

      // updating bio of user
      const updatebio = await UserModel.updateOne(user, { bio: req.body.bio });
      return res.status(200).json(updatebio);
    } catch (err) {
      console.log(err);
      console.log(err);
    }
  });

  router.post("/pwdreset", async (req, res) => {
    try {
      console.log("here here mate");

      // fetching uuid from cookie
      const getuser = req.cookies["connect.sid"];
      console.log(getuser);

      // fetching user_id from redis
      const getclient = await client.getAsync(getuser);

      logger.info(`[Auth][update]- ${req.url}`);
      // fetching user from db by id
      const user = await UserModel.findById(getclient);
      var pass = req.body.password;
      //validating the user entered password
      const validated = validate.validatePassword(pass);
      // if enetered password fails validation
      if (!validated) {
        res.send(
          "Password Must include one special character, one capital letter, one number with min length 8"
        );
      }
      //if password passes validation successfully
      else {
        //setting user updated password
        user.setPassword(pass);
        const resp = await user.save();
        const mail = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: `${process.env.EMAIL_ID}`,
            pass: `${process.env.EMAIL_PWD}`
          }
        });
        const smail = await mail.sendMail({
          to: user.email,
          from: `${process.env.EMAIL_ID}`,
          subject: "Your password has been changed",
          text:
            "Hello,\n\n" +
            "This is a confirmation that the password for your account " +
            user.email +
            " has just been changed.\n"
        });
        return res.status(200).send("Password change successfully.");
      }
    } catch (error) {
      return res.status(401).send(error.message);
    }
  });

  return router;
};
