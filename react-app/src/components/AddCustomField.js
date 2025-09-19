import React, { useState, useEffect } from 'react';

const AddCustomField = ({ customFieldId, orgId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    f_is_disabled: false,
    f_is_compulsory: false,
    f_is_updatable: false,
    f_disable_at_server: false,
    f_enable_audit_trail: false,
    f_is_pii_data: false,
    f_is_psi_data: false,
    field_name: '',
    field_type: '',
    field_description: ''
  });

  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customFieldId) {
      fetchCustomField();
    }
  }, [customFieldId]);

  const fetchCustomField = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/custom-fields/${customFieldId}`);
      const result = await response.json();
      
      if (result.success) {
        const field = result.data;
        setFormData({
          f_is_disabled: field.is_disabled,
          f_is_compulsory: field.is_compulsory,
          f_is_updatable: field.is_updatable,
          f_disable_at_server: field.disable_at_server,
          f_enable_audit_trail: field.enable_audit_trail,
          f_is_pii_data: field.is_pii_data,
          f_is_psi_data: field.is_psi_data,
          field_name: field.name,
          field_type: field.type,
          field_description: field.label || ''
        });
      }
    } catch (error) {
      console.error('Error fetching custom field:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    try {
      const result = await onSubmit({
        ...formData,
        custom_field_id: customFieldId,
        org_id: orgId
      });
      
      if (result.success) {
        // Handle success - could show success message or redirect
        console.log('Custom field created successfully');
      } else {
        setErrors([result.error || 'Unable to create custom field']);
      }
    } catch (error) {
      setErrors(['An error occurred while creating the custom field']);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">{customFieldId ? 'Edit Custom Field Data' : 'Add A New Custom Field Data'}</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {errors.length > 0 && (
                  <div className="alert alert-danger">
                    {errors.map((error, index) => (
                      <div key={index}>{error}</div>
                    ))}
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="field_name" className="form-label">Field Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="field_name"
                    name="field_name"
                    value={formData.field_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="field_type" className="form-label">Field Type *</label>
                  <select
                    className="form-select"
                    id="field_type"
                    name="field_type"
                    value={formData.field_type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Field Type</option>
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="email">Email</option>
                    <option value="date">Date</option>
                    <option value="boolean">Boolean</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="field_description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="field_description"
                    name="field_description"
                    value={formData.field_description}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>

                <div className="card bg-light">
                  <div className="card-body">
                    <h6 className="card-title">Field Options</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="f_is_disabled"
                            name="f_is_disabled"
                            checked={formData.f_is_disabled}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="f_is_disabled">
                            Is Disabled
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="f_is_compulsory"
                            name="f_is_compulsory"
                            checked={formData.f_is_compulsory}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="f_is_compulsory">
                            Is Compulsory
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="f_is_updatable"
                            name="f_is_updatable"
                            checked={formData.f_is_updatable}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="f_is_updatable">
                            Is Updatable
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="f_disable_at_server"
                            name="f_disable_at_server"
                            checked={formData.f_disable_at_server}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="f_disable_at_server">
                            Disable at Server
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="f_enable_audit_trail"
                            name="f_enable_audit_trail"
                            checked={formData.f_enable_audit_trail}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="f_enable_audit_trail">
                            Enable Audit Trail
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="f_is_pii_data"
                            name="f_is_pii_data"
                            checked={formData.f_is_pii_data}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="f_is_pii_data">
                            Is PII Data
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="f_is_psi_data"
                            name="f_is_psi_data"
                            checked={formData.f_is_psi_data}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="f_is_psi_data">
                            Is PSI Data
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={onCancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting || loading}
                  >
                    {isSubmitting ? (customFieldId ? 'Updating...' : 'Creating...') : (customFieldId ? 'Update Custom Field' : 'Create Custom Field')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCustomField;