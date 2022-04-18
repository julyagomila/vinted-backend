// ********* IMPORT DES PACKAGES *********
const express = require("express");
const formidableMiddleware = require("express-formidable");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

// ********** CLOUDINARY ***********
cloudinary.config({
  cloud_name: "dztwpbut2",
  api_key: "663591133124583",
  api_secret: "Bj3E1K4QoHyFg1x7kkqyzD9pCoE",
});

// ********* IMPORT DES MODELES *********
const User = require("../models/User");
const Offer = require("../models/Offer");

// ********* IMPORT MIDDLEWARE *********
const isAuthenticated = require("../middlewares/isAuthenticated");

// **************************************
// ********** NEW PUBLICATION ***********
// **************************************

router.post("/offer/publish", isAuthenticated, async (req, res) => {
  try {
    let pictureToUpload = req.files.picture.path;
    const result = await cloudinary.uploader.upload(pictureToUpload, {
      folder: "vinted",
    });

    const newOffer = new Offer({
      product_name: req.fields.title,
      product_description: req.fields.description,
      product_price: req.fields.price,
      product_details: [
        { marque: req.fields.brand },
        { taille: req.fields.size },
        { état: req.fields.condition },
        { couleur: req.fields.color },
        { emplacement: req.fields.city },
      ],
      product_image: result.secure_url,
      owner: req.user._id,
    });
    await newOffer.save();

    const newOfferClient = {
      _id: newOffer._id,
      product_name: "Air Max 90",
      product_description: "Air Max 90, très peu portées",
      product_price: 80,
      product_details: [
        { MARQUE: req.fields.brand },
        { TAILLE: req.fields.size },
        { ÉTAT: req.fields.condition },
        { COULEUR: req.fields.color },
        { EMPLACEMENT: req.fields.city },
      ],
      owner: { account: { username: req.user.account.username } },
      _id: req.user._id,
      product_image: result.secure_url,
    };
    res.json(newOfferClient);
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = router;
