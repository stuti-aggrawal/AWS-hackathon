import React, { useState, useEffect } from 'react';

const ViewAllCustomFields = ({ scope = 'loyalty_registration', orgId = 1, onViewField, onAddNew, refreshTrigger }) => {
  const [customFields, setCustomFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomFields();
  }, [scope, orgId, refreshTrigger]);

  const fetchCustomFields = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/custom-fields/scope/${orgId}/${scope}`);
      const result = await response.json();
      
      if (result.success) {
        setCustomFields(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to fetch custom fields');
    } finally {
      setLoading(false);
    }
  };

  const formatBoolean = (value) => value ? 'Yes' : 'No';
  
  const beautifyScope = (scope) => {
    return scope.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">View Custom Fields For {beautifyScope(scope)}</h4>
          <button className="btn btn-primary" onClick={onAddNew}>
            Add New Field
          </button>
        </div>
        <div className="card-body">
          {customFields.length === 0 ? (
            <p className="text-muted">No custom fields found for this scope.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Label</th>
                    <th>Scope</th>
                    <th>Disabled</th>
                    <th>Compulsory</th>
                    <th>Updatable</th>
                    <th>PII Data</th>
                    <th>PSI Data</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customFields.map((field) => (
                    <tr key={field.id}>
                      <td>
                        <button 
                          className="btn btn-link p-0 text-start"
                          onClick={() => onViewField(field.id)}
                        >
                          {field.name}
                        </button>
                      </td>
                      <td>{field.type}</td>
                      <td>{field.label}</td>
                      <td>{beautifyScope(field.scope)}</td>
                      <td>{formatBoolean(field.is_disabled)}</td>
                      <td>{formatBoolean(field.is_compulsory)}</td>
                      <td>{formatBoolean(field.is_updatable)}</td>
                      <td>{formatBoolean(field.is_pii_data)}</td>
                      <td>{formatBoolean(field.is_psi_data)}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => onViewField(field.id)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAllCustomFields;