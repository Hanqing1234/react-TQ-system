const express = require("express");
const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload");
const ticketsControllers = require("../controllers/tickets-controllers");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

router.get("/all", ticketsControllers.getTickets);
router.get("/:pid", ticketsControllers.getTicket);
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
  ticketsControllers.createTicket
);

router.use(checkAuth);

router.get("/user/:uid", ticketsControllers.getTicketsByUserId);
router.patch("/:pid", ticketsControllers.updateTicket);
router.delete("/:pid", ticketsControllers.deleteTicket);

module.exports = router;
