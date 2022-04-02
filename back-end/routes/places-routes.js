const express = require("express");
const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload");
const placesControllers = require("../controllers/places-controllers");
const router = express.Router();

/* Ticket Get - all , byId and allForOneUser*/
router.get("/all", placesControllers.getPlaces);
router.get("/:pid", placesControllers.getTicket);
router.get("/user/:uid", placesControllers.getPlacesByUserId);
router.post(
  "/all",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    // check('cust_name')
    //  .not()
    //  .isEmpty(),
    //  check('cust_email')
    //  .not()
    //  .isEmpty()
  ],
  placesControllers.createPlace
);

/* Ticket patch - editTicket */
router.patch("/:pid", placesControllers.updatePlace);

/* Ticket delete - deleteTicket */
router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
