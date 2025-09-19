CREATE DATABASE IF NOT EXISTS custom_fields_db;

USE custom_fields_db;

CREATE TABLE IF NOT EXISTS custom_fields (
  id INT AUTO_INCREMENT PRIMARY KEY,
  org_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) DEFAULT 'text',
  datatype VARCHAR(50) DEFAULT 'String',
  scope VARCHAR(100) NOT NULL,
  label VARCHAR(255),
  `default` TEXT,
  phase VARCHAR(10) DEFAULT '1',
  position INT DEFAULT 0,
  rule TEXT,
  server_rule TEXT,
  regex VARCHAR(255),
  helptext TEXT,
  error VARCHAR(255),
  attrs TEXT,
  is_disabled BOOLEAN DEFAULT FALSE,
  is_compulsory BOOLEAN DEFAULT FALSE,
  is_updatable BOOLEAN DEFAULT TRUE,
  disable_at_server BOOLEAN DEFAULT FALSE,
  enable_audit_trail BOOLEAN DEFAULT FALSE,
  is_pii_data BOOLEAN DEFAULT FALSE,
  is_psi_data BOOLEAN DEFAULT FALSE,
  modified_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_org_scope (org_id, scope),
  INDEX idx_org_name (org_id, name)
);