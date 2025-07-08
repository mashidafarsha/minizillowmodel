const express = require('express');
const router = express.Router();
const upload = require("../middleware/upload"); // 👈 multer
const {auth} = require("../middleware/auth")
const isAdmin = require("../middleware/isAdmin");  

const {
    addProperty,
    getProperty,
    deleteProperty,
    updateProperty,
    loginAdmin,
    refreshAdminToken,
    getAllProperties
  } = require("../controllers/adminController");
  
  // Authentication
  router.post("/login", loginAdmin);
  router.post("/refresh", refreshAdminToken);
  
  // Property CRUD
  router.post("/add-property", auth, isAdmin, upload.single("image"), addProperty);
  router.get("/properties", auth, isAdmin, getAllProperties);
  router.get("/property/:id", auth, isAdmin, getProperty);
  router.delete("/property/:id", auth, isAdmin, deleteProperty);
  router.put("/property/:id", auth, isAdmin, upload.single("image"), updateProperty);
  


module.exports = router;
