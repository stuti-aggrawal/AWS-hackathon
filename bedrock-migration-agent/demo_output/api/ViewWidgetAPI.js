```javascript
// routes/customFields.js
const express = require('express');
const router = express.Router();
const customFieldsController = require('../controllers/customFieldsController');
const { validateCustomField } = require('../middlewares/validationMiddleware');

// GET /api/custom-fields
router.get('/', customFieldsController.getAllCustomFields);

// GET /api/custom-fields/:id
router.get('/:id', customFieldsController.getCustomFieldById);

// POST /api/custom-fields
router.post('/', validateCustomField, customFieldsController.createCustomField);

// PUT /api/custom-fields/:id
router.put('/:id', validateCustomField, customFieldsController.updateCustomField);

// DELETE /api/custom-fields/:id
router.delete('/:id', customFieldsController.deleteCustomField);

module.exports = router;

// models/customField.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CustomField = sequelize.define('CustomField', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  // Add other fields as needed
}, {
  tableName: 'CustomFields',
});

module.exports = CustomField;

// middlewares/validationMiddleware.js
const { body, validationResult } = require('express-validator');

const validateCustomField = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string'),
  // Add other validation rules as needed

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

// GET /api/custom-fields
const getAllCustomFields = async (req, res) => {
  try {
    const customFields = await CustomField.findAll();
    res.json(customFields);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET /api/custom-fields/:id
const getCustomFieldById = async (req, res) => {
  try {
    const customField = await CustomField.findByPk(req.params.id);
    if (!customField) {
      return res.status(404).json({ message: 'Custom field not found' });
    }
    res.json(customField);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// POST /api/custom-fields
const createCustomField = async (req, res) => {
  try {
    const newCustomField = await CustomField.create(req.body);
    res.status(201).json(newCustomField);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// PUT /api/custom-fields/:id
const updateCustomField = async (req, res) => {
  try {
    const [updated] = await CustomField.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedCustomField = await CustomField.findByPk(req.params.id);
      res.json(updatedCustomField);
    } else {
      res.status(404).json({ message: 'Custom field not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// DELETE /api/custom-fields/:id
const deleteCustomField = async (req, res) => {
  try {
    const deleted = await CustomField.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.json({ message: 'Custom field deleted' });
    } else {
      res.status(404).json({ message: 'Custom field not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
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