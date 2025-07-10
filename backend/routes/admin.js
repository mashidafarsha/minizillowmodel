const express = require('express');
const router = express.Router();
const upload = require("../middleware/upload"); 
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
  

  router.post("/login", loginAdmin);
  router.post("/refresh", refreshAdminToken);
  

  router.post("/add-property", auth, isAdmin, upload.array("images", 10), addProperty);
  router.get("/properties",getAllProperties);
  router.get("/property/:id",getProperty);
  router.delete("/property/:id", auth, isAdmin, deleteProperty);
  router.put(
    "/property/:id",
    auth,
    isAdmin,
    upload.array("newImages"), 
    updateProperty
  );
  


module.exports = router;
