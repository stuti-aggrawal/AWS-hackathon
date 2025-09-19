import React, { useState, useEffect } from 'react';

const ViewCustomField = ({ customFieldId, onBack, onEdit }) => {
  const [customField, setCustomField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setCustomField(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to fetch custom field details');
    } finally {
      setLoading(false);
    }
  };

  const formatBoolean = (value) => value ? 'Yes' : 'No';
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const beautifyScope = (scope) => {
    return scope.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!customField) return <div className="alert alert-warning">Custom field not found</div>;

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Selected Custom Field Info</h4>
          <div>
            <button className="btn btn-secondary me-2" onClick={onBack}>
              Back to List
            </button>
            <button className="btn btn-primary" onClick={() => onEdit(customField.id)}>
              Edit
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <th scope="row" className="w-50">Name:</th>
                    <td>{customField.name}</td>
                  </tr>
                  <tr>
                    <th scope="row">Type:</th>
                    <td>{customField.type}</td>
                  </tr>
                  <tr>
                    <th scope="row">Data Type:</th>
                    <td>{customField.datatype}</td>
                  </tr>
                  <tr>
                    <th scope="row">Scope:</th>
                    <td>{beautifyScope(customField.scope)}</td>
                  </tr>
                  <tr>
                    <th scope="row">Label:</th>
                    <td>{customField.label || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th scope="row">Default Value:</th>
                    <td>{customField.default || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th scope="row">Phase:</th>
                    <td>{customField.phase}</td>
                  </tr>
                  <tr>
                    <th scope="row">Position:</th>
                    <td>{customField.position}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <th scope="row" className="w-50">Is Disabled:</th>
                    <td>{formatBoolean(customField.is_disabled)}</td>
                  </tr>
                  <tr>
                    <th scope="row">Is Compulsory:</th>
                    <td>{formatBoolean(customField.is_compulsory)}</td>
                  </tr>
                  <tr>
                    <th scope="row">Is Updatable:</th>
                    <td>{formatBoolean(customField.is_updatable)}</td>
                  </tr>
                  <tr>
                    <th scope="row">Disable at Server:</th>
                    <td>{formatBoolean(customField.disable_at_server)}</td>
                  </tr>
                  <tr>
                    <th scope="row">Enable Audit Trail:</th>
                    <td>{formatBoolean(customField.enable_audit_trail)}</td>
                  </tr>
                  <tr>
                    <th scope="row">Is PII Data:</th>
                    <td>{formatBoolean(customField.is_pii_data)}</td>
                  </tr>
                  <tr>
                    <th scope="row">Is PSI Data:</th>
                    <td>{formatBoolean(customField.is_psi_data)}</td>
                  </tr>
                  <tr>
                    <th scope="row">Last Modified:</th>
                    <td>{formatDate(customField.last_modified)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {(customField.rule || customField.server_rule || customField.regex || customField.helptext) && (
            <div className="mt-4">
              <h5>Additional Configuration</h5>
              <div className="row">
                <div className="col-12">
                  {customField.rule && (
                    <div className="mb-3">
                      <strong>Rule:</strong>
                      <pre className="bg-light p-2 mt-1">{customField.rule}</pre>
                    </div>
                  )}
                  {customField.server_rule && (
                    <div className="mb-3">
                      <strong>Server Rule:</strong>
                      <pre className="bg-light p-2 mt-1">{customField.server_rule}</pre>
                    </div>
                  )}
                  {customField.regex && (
                    <div className="mb-3">
                      <strong>Regex:</strong>
                      <code className="bg-light p-1">{customField.regex}</code>
                    </div>
                  )}
                  {customField.helptext && (
                    <div className="mb-3">
                      <strong>Help Text:</strong>
                      <p className="mb-0">{customField.helptext}</p>
                    </div>
                  )}
                  {customField.attrs && (
                    <div className="mb-3">
                      <strong>Attributes:</strong>
                      <pre className="bg-light p-2 mt-1">{customField.attrs}</pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCustomField;