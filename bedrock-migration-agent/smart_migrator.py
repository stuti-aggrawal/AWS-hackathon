#!/usr/bin/env python3
"""
Smart Migration Tool - Analyzes existing project structure and generates compatible code
"""

import os
import json
import re
from bedrock_client import BedrockClient

class SmartMigrator:
    def __init__(self, react_project_path, backend_project_path):
        self.bedrock = BedrockClient()
        self.react_path = react_project_path
        self.backend_path = backend_project_path
        self.existing_patterns = self.analyze_existing_code()
    
    def analyze_existing_code(self):
        """Analyze existing React/Node.js code to understand patterns"""
        patterns = {
            'react_imports': [],
            'react_patterns': [],
            'api_patterns': [],
            'existing_models': []
        }
        
        # Analyze existing React components
        components_dir = f"{self.react_path}/src/components"
        if os.path.exists(components_dir):
            for file in os.listdir(components_dir):
                if file.endswith('.js'):
                    with open(f"{components_dir}/{file}", 'r') as f:
                        content = f.read()
                        patterns['react_imports'].extend(re.findall(r'import.*from.*', content))
                        patterns['react_patterns'].append(self.extract_react_patterns(content))
        
        # Analyze existing API structure
        controllers_dir = f"{self.backend_path}/controllers"
        if os.path.exists(controllers_dir):
            for file in os.listdir(controllers_dir):
                if file.endswith('.js'):
                    with open(f"{controllers_dir}/{file}", 'r') as f:
                        content = f.read()
                        patterns['api_patterns'].append(self.extract_api_patterns(content))
        
        # Analyze existing models
        models_dir = f"{self.backend_path}/models"
        if os.path.exists(models_dir):
            for file in os.listdir(models_dir):
                if file.endswith('.js'):
                    patterns['existing_models'].append(file.replace('.js', ''))
        
        return patterns
    
    def extract_react_patterns(self, content):
        """Extract React patterns from existing code"""
        return {
            'uses_hooks': 'useState' in content,
            'uses_bootstrap': 'className=' in content and 'btn' in content,
            'api_calls': 'fetch(' in content,
            'form_handling': 'onSubmit' in content
        }
    
    def extract_api_patterns(self, content):
        """Extract API patterns from existing code"""
        return {
            'uses_sequelize': 'findAll' in content or 'create' in content,
            'error_handling': 'try {' in content and 'catch' in content,
            'json_responses': 'res.json' in content,
            'validation': 'validate' in content.lower()
        }
    
    def generate_compatible_react_component(self, php_content, widget_name):
        """Generate React component that matches existing project patterns"""
        
        existing_component = self.get_similar_component()
        
        prompt = f"""
        Convert this PHP widget to React component matching the existing project style.

        PHP Code:
        {php_content}

        Existing Component Pattern (for reference):
        {existing_component}

        Requirements:
        1. Match the exact import style and component structure of existing code
        2. Use same Bootstrap classes and form patterns
        3. Follow same API call patterns (fetch to localhost:5000)
        4. Use same state management approach
        5. Component name: {widget_name}

        Generate complete React component file that will work with existing project.
        """
        
        return self.bedrock.invoke_model(prompt, max_tokens=6000)
    
    def generate_compatible_api_method(self, php_content, widget_name):
        """Generate API method that fits existing controller structure"""
        
        existing_controller = self.get_existing_controller()
        
        prompt = f"""
        Create API method based on PHP logic that fits existing controller structure.

        PHP Code:
        {php_content}

        Existing Controller Pattern:
        {existing_controller}

        Requirements:
        1. Use existing CustomField model (already imported)
        2. Follow same error handling pattern
        3. Use same response format
        4. Method name: process{widget_name}
        5. Only generate the method function, not imports or exports

        Generate only the method that can be added to existing controller.
        """
        
        return self.bedrock.invoke_model(prompt, max_tokens=4000)
    
    def get_similar_component(self):
        """Get existing component as template"""
        component_path = f"{self.react_path}/src/components/AddCustomField.js"
        if os.path.exists(component_path):
            with open(component_path, 'r') as f:
                return f.read()[:2000]  # First 2000 chars as pattern
        return ""
    
    def get_existing_controller(self):
        """Get existing controller as template"""
        controller_path = f"{self.backend_path}/controllers/customFieldController.js"
        if os.path.exists(controller_path):
            with open(controller_path, 'r') as f:
                return f.read()[:2000]  # First 2000 chars as pattern
        return ""
    
    def migrate_widget(self, php_file_path, widget_name):
        """Migrate single widget with smart integration"""
        
        with open(php_file_path, 'r') as f:
            php_content = f.read()
        
        print(f"🧠 Smart migration of {widget_name}...")
        
        # Generate compatible code
        react_code = self.generate_compatible_react_component(php_content, widget_name)
        api_code = self.generate_compatible_api_method(php_content, widget_name)
        
        # Save to existing project structure
        self.save_react_component(widget_name, react_code)
        self.add_api_method(widget_name, api_code)
        
        return {
            'widget_name': widget_name,
            'status': 'completed',
            'files_updated': [
                f"react-app/src/components/{widget_name}.js",
                "backend/controllers/customFieldController.js"
            ]
        }
    
    def save_react_component(self, widget_name, code):
        """Save React component to existing project"""
        component_path = f"{self.react_path}/src/components/{widget_name}.js"
        
        with open(component_path, 'w') as f:
            f.write(code)
        
        print(f"💾 Saved {component_path}")
    
    def add_api_method(self, widget_name, method_code):
        """Add API method to existing controller"""
        controller_path = f"{self.backend_path}/controllers/customFieldController.js"
        
        with open(controller_path, 'r') as f:
            content = f.read()
        
        # Add method before module.exports
        export_index = content.rfind("module.exports")
        if export_index > 0:
            # Insert method before exports
            new_content = content[:export_index] + f"\n{method_code}\n\n" + content[export_index:]
            
            # Add to exports
            new_content = new_content.replace(
                "module.exports = {",
                f"module.exports = {{\n  process{widget_name},"
            )
            
            with open(controller_path, 'w') as f:
                f.write(new_content)
            
            print(f"💾 Updated {controller_path}")

def main():
    migrator = SmartMigrator("../react-app", "../backend")
    
    # Test with one widget first
    php_file = "../cd-cheetah-ui-widget/widget/org/setup/configurations/customFields/ViewWidget.php"
    
    if os.path.exists(php_file):
        result = migrator.migrate_widget(php_file, "ViewSingleCustomField")
        print(f"✅ Migration result: {result}")
    else:
        print("❌ PHP file not found")

if __name__ == "__main__":
    main()