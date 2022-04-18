// ********* IMPORT DES PACKAGES *********
const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

// ********* IMPORT DES MODELES *********
const User = require("../models/User");

// ******************************
// ********** SIGN UP ***********
// ******************************

router.post("/user/signup", async (req, res) => {
  try {
    const password = req.fields.password;
    const salt = uid2(16);
    const hash = SHA256(password + salt).toString(encBase64);
    const token = uid2(16);

    const isEmailExist = await User.findOne({
      email: req.fields.email,
    });

    if (isEmailExist) {
      res.status(400).json({ message: "This email is already used !" });
    } else if (User.username === null) {
      res.status(400).json({ message: "Username is missing ! " });
    } else {
      const newUser = new User({
        email: req.fields.email,
        account: { username: req.fields.username },
        token: token,
        hash: hash,
        salt: salt,
      });
      await newUser.save();
      res
        .status(200)
        .json({ message: "Account successfully created !", newUser: newUser });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

// ******************************
// ********** LOGIN *************
// ******************************

router.post("/user/login", async (req, res) => {
  try {
    const userToCheck = await User.findOne({ email: req.fields.email });
    if (userToCheck === null) {
      res.status(401).json({ message: "You have to sign up !" });
    } else {
      const newHash = SHA256(req.fields.password + userToCheck.salt).toString(
        encBase64
      );
      if (userToCheck.hash === newHash) {
        res.json({
          id: userToCheck.id,
          token: userToCheck.token,
          account: { account: userToCheck.account.username },
        });
      } else {
        res.json({ message: "Unauthorized !" });
      }
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = router;
