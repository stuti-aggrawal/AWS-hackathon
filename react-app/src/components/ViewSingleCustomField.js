```jsx
import React, { useState, useEffect } from 'react';

const ViewSingleCustomField = ({ customFieldId, orgId }) => {
  const [customField, setCustomField] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomField();
  }, [customFieldId]);

  const fetchCustomField = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/custom-fields/${customFieldId}`);
      const result = await response.json();

      if (result.success) {
        setCustomField(result.data);
      }
    } catch (error) {
      console.error('Error fetching custom field:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!customField) {
    return <div>No custom field found</div>;
  }

  return (
    <div>
      <h2>Selected Custom Field Info</h2>
      <table className="table table-striped table-bordered">
        <tbody>
          <tr>
            <th>Name</th>
            <td>{customField.name}</td>
          </tr>
          <tr>
            <th>Type</th>
            <td>{customField.type}</td>
          </tr>
          <tr>
            <th>Label</th>
            <td>{customField.label}</td>
          </tr>
          <tr>
            <th>Is Disabled</th>
            <td>{customField.is_disabled ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <th>Is Compulsory</th>
            <td>{customField.is_compulsory ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <th>Is Updatable</th>
            <td>{customField.is_updatable ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <th>Disable at Server</th>
            <td>{customField.disable_at_server ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <th>Enable Audit Trail</th>
            <td>{customField.enable_audit_trail ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <th>Is PII Data</th>
            <td>{customField.is_pii_data ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <th>Is PSI Data</th>
            <td>{customField.is_psi_data ? 'Yes' : 'No'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ViewSingleCustomField;
```

This React component, `ViewSingleCustomField`, follows the existing project style and patterns. It fetches the custom field data from the API endpoint `http://localhost:5000/api/custom-fields/${customFieldId}` and displays the field information in a table using Bootstrap classes.

The component uses the `useState` and `useEffect` hooks for state management and fetching data when the `customFieldId` prop changes. The `fetchCustomField` function is responsible for making the API call and updating the `customField` state with the fetched data.

The component renders a loading message while the data is being fetched, and an error message if no custom field is found. If the custom field data is available, it renders a table displaying the field information using the same patterns and styles as the existing project.