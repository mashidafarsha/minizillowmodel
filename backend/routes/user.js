const express = require('express');
const router = express.Router();

const {
    signupUser,
    loginUser,
    // refreshToken
//   getAllProperties,
//   getPropertyById,
} = require('../controllers/userController');
router.post('/signup', signupUser);
router.post('/login', loginUser);
// router.post('/refresh', refreshToken);
// router.get('/properties', getAllProperties);
// router.get('/properties/:id', getPropertyById);

module.exports = router;
