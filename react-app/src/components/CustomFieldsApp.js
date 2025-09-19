import React, { useState } from 'react';
import ViewAllCustomFields from './ViewAllCustomFields';
import ViewCustomField from './ViewCustomField';
import AddCustomField from './AddCustomField';

const CustomFieldsApp = ({ initialScope = 'loyalty_registration', initialOrgId = 1 }) => {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'view', 'add', 'edit'
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [scope, setScope] = useState(initialScope);
  const [orgId] = useState(initialOrgId);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const availableScopes = [
    'loyalty_registration',
    'loyalty_transaction', 
    'customer_feedback',
    'zone_custom_fields',
    'store_custom_fields',
    'points_redemption',
    'voucher_redemption',
    'check_in_feedback',
    'customer_preferences',
    'advance_feedback',
    'customer_card'
  ];

  const handleViewField = (fieldId) => {
    setSelectedFieldId(fieldId);
    setCurrentView('view');
  };

  const handleAddNew = () => {
    setSelectedFieldId(null);
    setCurrentView('add');
  };

  const handleEdit = (fieldId) => {
    setSelectedFieldId(fieldId);
    setCurrentView('edit');
  };

  const handleBackToList = () => {
    setSelectedFieldId(null);
    setCurrentView('list');
  };

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch('http://localhost:5000/api/custom-fields/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          f_name: formData.field_name,
          f_type: formData.field_type,
          f_label: formData.field_description,
          f_scope: scope,
          f_is_disabled: formData.f_is_disabled,
          f_is_compulsory: formData.f_is_compulsory,
          f_is_updatable: formData.f_is_updatable,
          f_disable_at_server: formData.f_disable_at_server,
          f_enable_audit_trail: formData.f_enable_audit_trail,
          f_is_pii_data: formData.f_is_pii_data,
          f_is_psi_data: formData.f_is_psi_data,
          custom_field_id: currentView === 'edit' ? selectedFieldId : null,
          org_id: orgId
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Trigger refresh and redirect back to list
        setRefreshTrigger(prev => prev + 1);
        handleBackToList();
      }
      
      return result;
    } catch (error) {
      console.error('Error submitting form:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  const handleCancel = () => {
    handleBackToList();
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'view':
        return (
          <ViewCustomField
            customFieldId={selectedFieldId}
            onBack={handleBackToList}
            onEdit={handleEdit}
          />
        );
      case 'add':
        return (
          <AddCustomField
            customFieldId={null}
            orgId={orgId}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        );
      case 'edit':
        return (
          <AddCustomField
            customFieldId={selectedFieldId}
            orgId={orgId}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        );
      case 'list':
      default:
        return (
          <div>
            <div className="container mt-3">
              <div className="row">
                <div className="col-md-4">
                  <label htmlFor="scopeSelect" className="form-label">Select Scope:</label>
                  <select 
                    id="scopeSelect"
                    className="form-select"
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                  >
                    {availableScopes.map(s => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <ViewAllCustomFields
              scope={scope}
              orgId={orgId}
              onViewField={handleViewField}
              onAddNew={handleAddNew}
              refreshTrigger={refreshTrigger}
            />
          </div>
        );
    }
  };

  return (
    <div>
      {renderCurrentView()}
    </div>
  );
};

export default CustomFieldsApp;