const express = require("express");
const router = express.Router();

const {
  signupUser,
  loginUser,
  toggleBookmark,
  refreshToken,
  getCurrentUser,
  rateProperty
} = require("../controllers/userController");
const { auth } = require("../middleware/auth");

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/toggle-bookmark/:propertyId", auth, toggleBookmark);
router.get("/me", auth, getCurrentUser);
router.post("/rate-property/:id", auth, rateProperty); 

module.exports = router;
