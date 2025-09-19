const validateCustomField = (data) => {
  const errors = [];

  // Name validation - minimum 3 characters
  if (!data.f_name || data.f_name.trim().length < 3) {
    errors.push('Name Of The Custom Field Has To More Than 3 Letters');
  }

  // Label validation - no special characters
  if (data.f_label && /[\\'^!$%&*()}{@#~?><>,|=+]/.test(data.f_label)) {
    errors.push('Special Character not allowed in Label');
  }

  // Security validation - check for dangerous SQL keywords in rules
  const dangerousKeywords = ['insert', 'delete', 'drop', 'truncate', 'create'];
  if (data.f_rule) {
    for (const keyword of dangerousKeywords) {
      if (data.f_rule.toLowerCase().includes(keyword)) {
        errors.push('Dangerous SQL keywords not allowed in rules');
        break;
      }
    }
  }

  return errors;
};

const uglifyName = (name) => {
  return name.toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
};

module.exports = {
  validateCustomField,
  uglifyName
};