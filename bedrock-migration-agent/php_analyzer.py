import json
from bedrock_client import BedrockClient

class PHPAnalyzer:
    def __init__(self):
        self.bedrock = BedrockClient()
    
    def analyze_php_code(self, php_content, file_name):
        prompt = f"""
        Analyze this PHP file ({file_name}) and extract the following information in JSON format:

        1. Class name and purpose
        2. Database operations (tables, CRUD operations)
        3. Form fields and validation rules
        4. Business logic patterns
        5. UI components and their properties
        6. Dependencies and relationships

        PHP Code:
        ```php
        {php_content}
        ```

        Return a JSON object with the following structure:
        {{
            "class_name": "string",
            "purpose": "string",
            "database_operations": [
                {{
                    "table": "string",
                    "operations": ["create", "read", "update", "delete"],
                    "fields": ["field1", "field2"]
                }}
            ],
            "form_fields": [
                {{
                    "name": "string",
                    "type": "string",
                    "validation": "string",
                    "required": boolean
                }}
            ],
            "business_logic": [
                {{
                    "function": "string",
                    "description": "string",
                    "validation_rules": ["rule1", "rule2"]
                }}
            ],
            "ui_components": [
                {{
                    "type": "string",
                    "properties": {{}},
                    "interactions": ["interaction1", "interaction2"]
                }}
            ],
            "dependencies": ["dependency1", "dependency2"]
        }}
        """
        
        response = self.bedrock.invoke_model(prompt, max_tokens=6000)
        
        try:
            # Extract JSON from response
            json_start = response.find('{')
            json_end = response.rfind('}') + 1
            json_str = response[json_start:json_end]
            return json.loads(json_str)
        except:
            return {"error": "Failed to parse analysis", "raw_response": response}
    
    def analyze_multiple_files(self, php_files):
        results = {}
        for file_path, content in php_files.items():
            print(f"Analyzing {file_path}...")
            results[file_path] = self.analyze_php_code(content, file_path)
        return results