```javascript
// routes/customFields.js
const express = require('express');
const router = express.Router();
const customFieldsController = require('../controllers/customFieldsController');
const { validateCustomField } = require('../middlewares/validations');

// GET all custom fields
router.get('/', customFieldsController.getAllCustomFields);

// GET a single custom field
router.get('/:id', customFieldsController.getCustomFieldById);

// POST a new custom field
router.post('/', validateCustomField, customFieldsController.createCustomField);

// PUT (update) a custom field
router.put('/:id', validateCustomField, customFieldsController.updateCustomField);

// DELETE a custom field
router.delete('/:id', customFieldsController.deleteCustomField);

module.exports = router;

// models/customField.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CustomField = sequelize.define('CustomField', {
  f_is_disabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  f_is_compulsory: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  f_is_updatable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = CustomField;

// middlewares/validations.js
const { body, validationResult } = require('express-validator');

const validateCustomField = [
  body('f_is_disabled').optional().isBoolean(),
  body('f_is_compulsory').optional().isBoolean(),
  body('f_is_updatable').optional().isBoolean(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateCustomField,
};

// controllers/customFieldsController.js
const CustomField = require('../models/customField');

// GET all custom fields
const getAllCustomFields = async (req, res) => {
  try {
    const customFields = await CustomField.findAll();
    res.json(customFields);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET a single custom field
const getCustomFieldById = async (req, res) => {
  try {
    const customField = await CustomField.findByPk(req.params.id);
    if (!customField) {
      return res.status(404).json({ error: 'Custom field not found' });
    }
    res.json(customField);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST a new custom field
const createCustomField = async (req, res) => {
  try {
    const newCustomField = await CustomField.create(req.body);
    res.status(201).json(newCustomField);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT (update) a custom field
const updateCustomField = async (req, res) => {
  try {
    const [updatedRows] = await CustomField.update(req.body, {
      where: { id: req.params.id },
    });
    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Custom field not found' });
    }
    const updatedCustomField = await CustomField.findByPk(req.params.id);
    res.json(updatedCustomField);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE a custom field
const deleteCustomField = async (req, res) => {
  try {
    const deletedRows = await CustomField.destroy({
      where: { id: req.params.id },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Custom field not found' });
    }
    res.json({ message: 'Custom field deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllCustomFields,
  getCustomFieldById,
  createCustomField,
  updateCustomField,
  deleteCustomField,
};
```