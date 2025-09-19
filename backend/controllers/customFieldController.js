const CustomField = require('../models/CustomField');
const { validateCustomField, uglifyName } = require('../utils/validation');

const processCustomFieldCreation = async (req, res) => {
  try {
    const params = req.body;
    
    // Convert checkbox values from 'on' to boolean (matching PHP logic)
    params.f_is_disabled = params.f_is_disabled === 'on' || params.f_is_disabled === true;
    params.f_is_compulsory = params.f_is_compulsory === 'on' || params.f_is_compulsory === true;
    params.f_is_updatable = params.f_is_updatable === 'on' || params.f_is_updatable === true ? 1 : 0;
    params.f_disable_at_server = params.f_disable_at_server === 'on' || params.f_disable_at_server === true;
    params.f_enable_audit_trail = params.f_enable_audit_trail === 'on' || params.f_enable_audit_trail === true;
    params.f_is_pii_data = params.f_is_pii_data === 'on' || params.f_is_pii_data === true;
    params.f_is_psi_data = params.f_is_psi_data === 'on' || params.f_is_psi_data === true;

    // Validate input
    const validationErrors = validateCustomField(params);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: validationErrors[0]
      });
    }

    // Uglify field name
    const uglifiedName = uglifyName(params.f_name);
    
    // Check if updating existing field
    const customFieldId = params.custom_field_id;
    const orgId = params.org_id || 1; // Default org_id

    // Check custom field limits for certain scopes
    const limitedScopes = ['loyalty_registration', 'loyalty_transaction', 'store_custom_fields', 'customer_card'];
    if (!customFieldId && limitedScopes.includes(params.f_scope)) {
      const existingCount = await CustomField.count({
        where: {
          org_id: orgId,
          scope: params.f_scope,
          is_disabled: false
        }
      });

      const customFieldLimit = 10; // Default limit, should come from config
      if (existingCount >= customFieldLimit) {
        const entityMap = {
          'loyalty_registration': 'registration',
          'loyalty_transaction': 'transaction', 
          'store_custom_fields': 'store',
          'customer_card': 'card'
        };
        const entity = entityMap[params.f_scope] || '';
        
        return res.status(400).json({
          success: false,
          error: `Max limit of ${customFieldLimit} on total number of ${entity} custom fields exceeded. Either deactivate custom fields or contact support team for increasing the limit`
        });
      }
    }

    // Prepare data for database
    const fieldData = {
      org_id: orgId,
      name: uglifiedName,
      type: params.f_type || 'text',
      datatype: params.f_datatype || 'String',
      scope: params.f_scope,
      label: params.f_label || '',
      default: params.f_default || '',
      phase: params.f_phase || '1',

      rule: params.f_rule || '',
      server_rule: params.f_server_rule || '',
      regex: params.f_regex || '',
      helptext: params.f_helptext || '',
      error: params.f_error || '',
      attrs: params.f_attrs || '',
      is_disabled: params.f_is_disabled,
      is_compulsory: params.f_is_compulsory,
      is_updatable: params.f_is_updatable,
      disable_at_server: params.f_disable_at_server,
      enable_audit_trail: params.f_enable_audit_trail,
      is_pii_data: params.f_is_pii_data,
      is_psi_data: params.f_is_psi_data
    };

    let result;
    if (customFieldId) {
      // Update existing field
      await CustomField.update(fieldData, {
        where: { id: customFieldId, org_id: orgId }
      });
      result = await CustomField.findByPk(customFieldId);
    } else {
      // Create new field
      result = await CustomField.create(fieldData);
    }

    if (result) {
      return res.json({
        success: true,
        id: result.id,
        status: 'SUCCESS',
        message: customFieldId ? 'Updated Successfully!!!' : 'Created Successfully!!!'
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Unable To Create Custom Field'
      });
    }

  } catch (error) {
    console.error('Error processing custom field:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getCustomFieldsByScope = async (req, res) => {
  try {
    const { orgId, scope } = req.params;
    const excludeDisabled = req.query.excludeDisabled === 'true';
    const excludeDisabledAtServer = req.query.excludeDisabledAtServer !== 'false';

    const whereClause = {
      org_id: orgId,
      scope: scope
    };

    if (excludeDisabled) {
      whereClause.is_disabled = false;
    }

    if (excludeDisabledAtServer) {
      whereClause.disable_at_server = false;
    }

    const customFields = await CustomField.findAll({
      where: whereClause,
      order: [['id', 'ASC']]
    });

    res.json({
      success: true,
      data: customFields
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  processCustomFieldCreation,
  getCustomFieldsByScope
};