```jsx
import React, { useState } from 'react';
import axios from 'axios';

const AddWidget = () => {
  const [formData, setFormData] = useState({
    f_is_disabled: false,
    f_is_compulsory: false,
    f_is_updatable: false,
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/custom-fields', formData);
      // Handle successful submission
      console.log('Custom field added successfully');
    } catch (err) {
      setError('Failed to add custom field');
    }
  };

  return (
    <div className="container">
      <h2>Add Custom Field</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="f_is_disabled"
              name="f_is_disabled"
              checked={formData.f_is_disabled}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="f_is_disabled">
              Is Disabled
            </label>
          </div>
        </div>
        <div className="form-group">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="f_is_compulsory"
              name="f_is_compulsory"
              checked={formData.f_is_compulsory}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="f_is_compulsory">
              Is Compulsory
            </label>
          </div>
        </div>
        <div className="form-group">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="f_is_updatable"
              name="f_is_updatable"
              checked={formData.f_is_updatable}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="f_is_updatable">
              Is Updatable
            </label>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Add Custom Field
        </button>
      </form>
    </div>
  );
};

export default AddWidget;
```