
// features/authentication/routes/authRoutes.js
// routes/authRoutes.js
const express = require('express');
const ImageSliderController = require("../controllers/image_slider_controller")

const router = express.Router();

router.post('/',  ImageSliderController.addImage);
router.get('/', ImageSliderController.getAllImage);
router.delete('/:imageId', ImageSliderController.deleteImage);

module.exports = router;

