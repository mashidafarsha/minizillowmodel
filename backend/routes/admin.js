const express = require('express');
const router = express.Router();
const upload = require("../middleware/upload"); // 👈 multer
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
  router.post("/add-property", upload.single("image"), addProperty);
  router.get("/properties", getAllProperties); // 👈 Get all properties
  router.get("/property/:id", getProperty);
  router.delete("/property/:id", deleteProperty);
  router.put("/property/:id", upload.single("image"), updateProperty);
  


module.exports = router;
