const express = require('express');
const router = express.Router();

const {
    signupUser,
    loginUser,
    toggleBookmark,
    refreshToken,
    getCurrentUser

} = require('../controllers/userController');
const { auth } = require('../middleware/auth'); // ✅ named import


console.log("✅ /api/user routes loaded");


router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/refresh', refreshToken);
router.post("/toggle-bookmark/:propertyId", auth, toggleBookmark);
router.get("/me", auth, getCurrentUser);


module.exports = router;
