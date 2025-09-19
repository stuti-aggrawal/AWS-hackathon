#!/usr/bin/env python3
"""
Integrated Migration Tool - Updates existing React/Node.js project directly
"""

import os
import json
from bedrock_client import BedrockClient

class IntegratedMigrator:
    def __init__(self, react_project_path, backend_project_path):
        self.bedrock = BedrockClient()
        self.react_path = react_project_path
        self.backend_path = backend_project_path
    
    def migrate_php_widget_to_react(self, php_file_path, widget_name):
        """Migrate a single PHP widget to React component and update existing project"""
        
        # Read PHP file
        with open(php_file_path, 'r') as f:
            php_content = f.read()
        
        print(f"🔍 Analyzing {widget_name}...")
        
        # Generate React component that fits existing structure
        react_component = self.generate_integrated_react_component(php_content, widget_name)
        
        # Generate API controller method (not full controller)
        api_method = self.generate_api_method(php_content, widget_name)
        
        # Update existing files
        self.update_react_component(widget_name, react_component)
        self.update_backend_controller(widget_name, api_method)
        
        print(f"✅ {widget_name} migrated successfully!")
        
        return {
            'widget_name': widget_name,
            'react_component_path': f"{self.react_path}/src/components/{widget_name}.js",
            'api_updated': True
        }
    
    def generate_integrated_react_component(self, php_content, widget_name):
        prompt = f"""
        Convert this PHP widget to a React component that matches the existing project structure.

        PHP Code:
        {php_content}

        Requirements:
        1. Create a functional React component using hooks
        2. Use Bootstrap classes (already imported in project)
        3. Make API calls to http://localhost:5000/api/custom-fields/
        4. Follow the same pattern as existing AddCustomField component
        5. Use the same form structure and validation
        6. Component name: {widget_name}

        Generate ONLY the React component code (no imports, just the component function and export).
        Make it compatible with existing project structure.
        """
        
        return self.bedrock.invoke_model(prompt, max_tokens=6000)
    
    def generate_api_method(self, php_content, widget_name):
        prompt = f"""
        Extract the business logic from this PHP code and create a Node.js controller method.

        PHP Code:
        {php_content}

        Requirements:
        1. Create only the controller method (not full file)
        2. Use existing CustomField model (already defined)
        3. Follow existing validation patterns
        4. Return JSON responses matching existing API format
        5. Method name: process{widget_name}

        Generate ONLY the controller method code that can be added to existing controller.
        """
        
        return self.bedrock.invoke_model(prompt, max_tokens=4000)
    
    def update_react_component(self, widget_name, component_code):
        """Update or create React component in existing project"""
        
        # Clean up the generated code
        component_code = self.clean_react_code(component_code, widget_name)
        
        # Write to existing React project
        component_path = f"{self.react_path}/src/components/{widget_name}.js"
        
        with open(component_path, 'w') as f:
            f.write(component_code)
        
        print(f"📝 Updated {component_path}")
    
    def update_backend_controller(self, widget_name, api_method):
        """Add method to existing controller"""
        
        controller_path = f"{self.backend_path}/controllers/customFieldController.js"
        
        # Read existing controller
        with open(controller_path, 'r') as f:
            controller_content = f.read()
        
        # Clean up API method
        api_method = self.clean_api_code(api_method, widget_name)
        
        # Add method before module.exports
        export_line = "module.exports = {"
        if export_line in controller_content:
            # Add to exports
            controller_content = controller_content.replace(
                export_line,
                f"{api_method}\n\n{export_line}\n  process{widget_name},"
            )
        
        with open(controller_path, 'w') as f:
            f.write(controller_content)
        
        print(f"📝 Updated {controller_path}")
    
    def clean_react_code(self, code, widget_name):
        """Clean and format React component code"""
        
        # Add proper imports
        imports = """import React, { useState, useEffect } from 'react';

"""
        
        # Ensure proper component structure
        if f"const {widget_name}" not in code:
            code = f"const {widget_name} = (props) => {{\n{code}\n}};"
        
        # Add export
        if "export default" not in code:
            code += f"\n\nexport default {widget_name};"
        
        return imports + code
    
    def clean_api_code(self, code, widget_name):
        """Clean and format API method code"""
        
        # Ensure proper async function structure
        if f"const process{widget_name}" not in code:
            code = f"const process{widget_name} = async (req, res) => {{\n{code}\n}};"
        
        return code
    
    def add_route_to_server(self, widget_name):
        """Add route to existing server.js"""
        
        server_path = f"{self.backend_path}/server.js"
        
        with open(server_path, 'r') as f:
            server_content = f.read()
        
        # Add route
        route_line = f"app.post('/api/custom-fields/{widget_name.lower()}', process{widget_name});"
        
        if route_line not in server_content:
            # Find where to add route (after existing custom-fields routes)
            insert_point = server_content.find("// Basic CRUD Routes")
            if insert_point > 0:
                server_content = server_content[:insert_point] + f"{route_line}\n\n" + server_content[insert_point:]
        
        with open(server_path, 'w') as f:
            f.write(server_content)
        
        print(f"📝 Added route to {server_path}")

def main():
    # Paths to existing projects
    react_project = "../react-app"
    backend_project = "../backend"
    
    migrator = IntegratedMigrator(react_project, backend_project)
    
    # Migrate specific PHP widgets
    php_widgets = {
        "ViewAllCustomFields": "../cd-cheetah-ui-widget/widget/org/setup/configurations/customFields/ViewAllWidget.php",
        "ViewCustomField": "../cd-cheetah-ui-widget/widget/org/setup/configurations/customFields/ViewWidget.php"
    }
    
    results = []
    
    for widget_name, php_path in php_widgets.items():
        if os.path.exists(php_path):
            result = migrator.migrate_php_widget_to_react(php_path, widget_name)
            results.append(result)
        else:
            print(f"⚠️  PHP file not found: {php_path}")
    
    print(f"\n🎉 Migration completed! Updated {len(results)} components in existing projects.")
    print("✅ React components updated in react-app/src/components/")
    print("✅ API methods added to backend/controllers/")

if __name__ == "__main__":
    main()