const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const CustomField = require('./models/CustomField');
const { processCustomFieldCreation, getCustomFieldsByScope } = require('./controllers/customFieldController');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Database synced');
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', status: 'OK' });
});

// Custom Fields Routes with PHP logic
app.post('/api/custom-fields/process', processCustomFieldCreation);
app.get('/api/custom-fields/scope/:orgId/:scope', getCustomFieldsByScope);

// Basic CRUD Routes
app.post('/api/custom-fields', async (req, res) => {
  try {
    const customField = await CustomField.create(req.body);
    res.status(201).json({ success: true, data: customField });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/custom-fields', async (req, res) => {
  try {
    const customFields = await CustomField.findAll();
    res.json({ success: true, data: customFields });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/custom-fields/:id', async (req, res) => {
  try {
    const customField = await CustomField.findByPk(req.params.id);
    if (!customField) {
      return res.status(404).json({ success: false, error: 'Custom field not found' });
    }
    res.json({ success: true, data: customField });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/custom-fields/:id', async (req, res) => {
  try {
    const [updated] = await CustomField.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Custom field not found' });
    }
    const customField = await CustomField.findByPk(req.params.id);
    res.json({ success: true, data: customField });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.delete('/api/custom-fields/:id', async (req, res) => {
  try {
    const deleted = await CustomField.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Custom field not found' });
    }
    res.json({ success: true, message: 'Custom field deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});