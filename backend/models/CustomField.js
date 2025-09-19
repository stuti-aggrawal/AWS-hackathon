const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CustomField = sequelize.define('CustomField', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  org_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(50),
    defaultValue: 'text'
  },
  datatype: {
    type: DataTypes.STRING(50),
    defaultValue: 'String'
  },
  scope: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  label: {
    type: DataTypes.STRING(255)
  },
  default: {
    type: DataTypes.TEXT
  },
  is_disabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_compulsory: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_updatable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  disable_at_server: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  enable_audit_trail: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_pii_data: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_psi_data: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'custom_fields',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'last_modified'
});

module.exports = CustomField;