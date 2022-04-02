const express = require("express");
const { check } = require("express-validator");
const usersController = require("../controllers/users-controllers");
const fileUpload = require("../middleware/file-upload");
const router = express.Router();

router.get("/all", usersController.getUsers);
router.get("/:pid", usersController.getSingleUser);
router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email")
      .normalizeEmail() // Test@test.com => test@test.com
      .isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.signup
);
router.post("/login", usersController.login);
router.patch("/:pid", usersController.updateSingleUser);
router.delete("/:pid", usersController.deleteSingleUser);

module.exports = router;
