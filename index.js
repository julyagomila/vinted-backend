// ********* IMPORT DES PACKAGES *********
require("dotenv").config();
const express = require("express");
const formidableMiddleware = require("express-formidable");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

const cloudinary = require("cloudinary").v2;

// ********** CLOUDINARY ***********
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// ********** CREATION SERVER ***********
const app = express();
app.use(cors());
app.use(formidableMiddleware());

// ********** CONNEXION BDD ***********
mongoose.connect("mongodb://localhost/vinted");

// ********* IMPORT DES ROUTES *********
const usersRoutes = require("./routes/users");
app.use(usersRoutes);
const offersRoutes = require("./routes/offers");
app.use(offersRoutes);

app.all("*", (req, res) => {
  res.status(404).json("Page introuvable !");
});

app.listen(process.env.PORT, () => {
  console.log("Server has started !");
});
