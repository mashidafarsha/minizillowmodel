const Property = require('../models/Property');

exports.getAllProperties = async (req, res) => {
  const properties = await Property.find();
  res.json(properties);
};

exports.getPropertyById = async (req, res) => {
  const property = await Property.findById(req.params.id);
  res.json(property);
};