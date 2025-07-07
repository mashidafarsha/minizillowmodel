const express = require('express');
const router = express.Router();
const upload = require("../middleware/upload"); // 👈 multer
const { addProperty } = require("../controllers/adminController");
// const auth = require('../middleware/auth');
// const isAdmin = require('../middleware/isAdmin');
// const {
//   adminSignup,
//   adminLogin,
//   createProperty,
//   updateProperty,
//   deleteProperty,
//   getAdminProperties,
// } = require('../controllers/adminController');

// // Auth
// router.post('/signup', adminSignup);
// router.post('/login', adminLogin);

// // CRUD
router.post("/add-property", upload.single("image"), addProperty);
// router.get('/properties', auth, isAdmin, getAdminProperties);
// router.put('/properties/:id', auth, isAdmin, updateProperty);
// router.delete('/properties/:id', auth, isAdmin, deleteProperty);

module.exports = router;
