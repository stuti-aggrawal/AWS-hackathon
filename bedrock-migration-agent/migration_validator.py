import json
from bedrock_client import BedrockClient

class MigrationValidator:
    def __init__(self):
        self.bedrock = BedrockClient()
    
    def validate_migration(self, original_php, generated_react, generated_api):
        prompt = f"""
        Validate the migration from PHP to React/Node.js by comparing functionality and business logic.

        Original PHP Code:
        ```php
        {original_php}
        ```

        Generated React Component:
        ```javascript
        {generated_react}
        ```

        Generated API Code:
        ```javascript
        {generated_api}
        ```

        Evaluate and score (0-100) the following aspects:
        1. Business Logic Preservation - Are all PHP business rules implemented?
        2. Form Validation - Do validation rules match exactly?
        3. Database Operations - Are CRUD operations equivalent?
        4. Error Handling - Is error handling comprehensive?
        5. UI Functionality - Does the React component provide same features?
        6. Security - Are security measures maintained?

        Return JSON with scores and detailed analysis:
        {{
            "overall_score": 0-100,
            "business_logic_score": 0-100,
            "validation_score": 0-100,
            "database_score": 0-100,
            "error_handling_score": 0-100,
            "ui_functionality_score": 0-100,
            "security_score": 0-100,
            "issues_found": [
                {{
                    "severity": "high|medium|low",
                    "category": "string",
                    "description": "string",
                    "recommendation": "string"
                }}
            ],
            "migration_quality": "excellent|good|fair|poor",
            "manual_fixes_needed": ["fix1", "fix2"]
        }}
        """
        
        response = self.bedrock.invoke_model(prompt, max_tokens=4000)
        
        try:
            json_start = response.find('{')
            json_end = response.rfind('}') + 1
            json_str = response[json_start:json_end]
            return json.loads(json_str)
        except:
            return {"error": "Failed to parse validation", "raw_response": response}
    
    def generate_test_cases(self, php_analysis, react_component):
        prompt = f"""
        Generate comprehensive test cases for the migrated React component based on the original PHP functionality.

        PHP Analysis:
        {json.dumps(php_analysis, indent=2)}

        React Component:
        {react_component}

        Generate Jest test cases that cover:
        1. Form field validation
        2. Submit functionality
        3. Error handling
        4. UI interactions
        5. API integration

        Return complete Jest test file code.
        """
        
        response = self.bedrock.invoke_model(prompt, max_tokens=6000)
        return response