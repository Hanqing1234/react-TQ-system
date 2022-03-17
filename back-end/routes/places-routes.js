const express = require('express');
const { check } = require('express-validator');

const fileUpload = require('../middleware/file-upload');

const placesControllers = require('../controllers/places-controllers');

const router = express.Router();

router.get('/:pid', placesControllers.getPlaces);

router.get('/user/:uid', placesControllers.getPlacesByUserId);

router.get('/tickets/all', placesControllers.getPlaces);

router.post(
  '/tickets/all',
  fileUpload.single('image'),
  [
    check('title')
      .not()
      .isEmpty(), 
    check('description').isLength({ min: 5 })
    //check('address')
    //  .not()
    //  .isEmpty()
  ],
  placesControllers.createPlace
);

router.patch(
  '/:pid',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  placesControllers.updatePlace
);

router.delete('/:pid', placesControllers.deletePlace);

module.exports = router;
