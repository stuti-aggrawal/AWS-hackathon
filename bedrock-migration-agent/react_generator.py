import json
from bedrock_client import BedrockClient

class ReactGenerator:
    def __init__(self):
        self.bedrock = BedrockClient()
    
    def generate_react_component(self, php_analysis, component_name):
        prompt = f"""
        Generate a React component based on this PHP analysis. Create a modern, functional React component with hooks.

        PHP Analysis:
        {json.dumps(php_analysis, indent=2)}

        Requirements:
        1. Use React functional components with hooks
        2. Implement all form fields from the PHP analysis
        3. Preserve all validation rules
        4. Use Bootstrap classes for styling
        5. Handle form submission with API calls
        6. Include proper error handling
        7. Use modern JavaScript (ES6+)

        Component Name: {component_name}

        Generate complete React component code with:
        - Import statements
        - State management using useState
        - Form handling
        - API integration
        - Bootstrap styling
        - Export statement

        Return only the React component code, no explanations.
        """
        
        response = self.bedrock.invoke_model(prompt, max_tokens=8000)
        return response
    
    def generate_api_endpoints(self, php_analysis, component_name):
        prompt = f"""
        Generate Node.js Express API endpoints based on this PHP analysis.

        PHP Analysis:
        {json.dumps(php_analysis, indent=2)}

        Requirements:
        1. Create Express router with CRUD operations
        2. Use Sequelize ORM for database operations
        3. Implement all validation rules from PHP
        4. Include proper error handling
        5. Add input sanitization
        6. Follow RESTful conventions

        Generate:
        - Express router code
        - Sequelize model
        - Validation middleware
        - Controller functions

        Return only the Node.js code, no explanations.
        """
        
        response = self.bedrock.invoke_model(prompt, max_tokens=8000)
        return response
    
    def generate_full_migration(self, php_analysis, component_name):
        react_component = self.generate_react_component(php_analysis, component_name)
        api_endpoints = self.generate_api_endpoints(php_analysis, component_name)
        
        return {
            'react_component': react_component,
            'api_endpoints': api_endpoints,
            'component_name': component_name
        }