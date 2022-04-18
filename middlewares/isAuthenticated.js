// ********* IMPORT DES PACKAGES *********
const express = require("express");
const formidableMiddleware = require("express-formidable");

// ********* IMPORT DES MODELES *********
const User = require("../models/User");

// **************************************
// ********** AUTHENFICATION ***********
// **************************************

const isAuthenticated = async (req, res, next) => {
  console.log(req.headers.authorization);
  console.log("Middleware isAuthenticated");

  const token = req.headers.authorization;
  console.log(token);
  const isTokenValid = await User.findOne({
    token: req.headers.authorization.replace("Bearer ", ""),
  });
  if (isTokenValid) {
    req.user = isTokenValid;
    next();
  } else {
    res.json("Unauthorized");
  }
};

module.exports = isAuthenticated;
