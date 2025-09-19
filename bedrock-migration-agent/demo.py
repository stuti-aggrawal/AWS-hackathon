#!/usr/bin/env python3
"""
Demo script for Bedrock Migration Agent
Showcases the migration of PHP custom fields to React/Node.js
"""

import os
import json
from migration_agent import MigrationAgent

def run_demo():
    print("🚀 Bedrock Migration Agent Demo")
    print("=" * 50)
    
    # Initialize the migration agent
    agent = MigrationAgent()
    
    # Demo with sample PHP files
    sample_php_files = {
        'AddWidget.php': '''<?php 
include_once 'ui/widget/base/FormWidget.php';

class AddWidget extends FormWidget{
    private $custom_field_id;
    private $CustomFields;
    private $urlCreator;
    private $org_id;
    
    public function __construct( $urlCreator, $custom_field_id ){
        global $currentorg;
        parent::__construct( "AddCustomField" );
        $this->urlCreator = $urlCreator;
        $this->org_id = $currentorg->getId();
        $this->custom_field_id = $custom_field_id;
        $this->setTitle( 'Add A New Custom Field Data' );
    }
    
    public function processSubmit(){
        $this->params['f_is_disabled'] = ( $this->params['f_is_disabled'] == 'on' )?true:false;
        $this->params['f_is_compulsory'] = ( $this->params['f_is_compulsory'] == 'on' )?true:false;
        $this->params['f_is_updatable'] = ($this->params['f_is_updatable'] == 'on') ? 1 : 0;
        
        list( $id, $status ) = $this->CustomFields->processCustomFieldCreationForm( $this->org_id, false, $this->custom_field_id, $this->params );
        
        if( $status != 'SUCCESS' )
            $this->addError( 'UnAble To Create Custom Field' );
    }
}
?>''',
        
        'ViewWidget.php': '''<?php 
include_once 'ui/widget/base/TableWidget.php';

class ViewWidget extends TableWidget{
    private $custom_field_id;
    private $CustomFields;
    private $org_id;
    
    public function __construct( $url, $custom_field_id ){
        global $currentorg;
        parent::__construct( "ShowSignleCustomFieldValues" );
        $this->org_id = $currentorg->getId();
        $this->custom_field_id = $custom_field_id;
        $this->setTitle( 'Selected Custom Field Info' );
    }
    
    public function loadData(){
        $this->custom_field_data[0] = $this->CustomFields->getCustomFieldById( $this->org_id, $this->custom_field_id , true );
    }
}
?>'''
    }
    
    print(f"📁 Processing {len(sample_php_files)} PHP files...")
    
    # Run the migration
    results = agent.migrate_php_to_react(sample_php_files, 'demo_output')
    
    # Display results
    print("\n📊 Migration Results:")
    print("-" * 30)
    
    for file_name, result in results.items():
        validation = result.get('validation', {})
        score = validation.get('overall_score', 'N/A')
        quality = validation.get('migration_quality', 'unknown')
        
        print(f"📄 {file_name}")
        print(f"   Score: {score}/100")
        print(f"   Quality: {quality}")
        print(f"   Component: {result['component_name']}")
        
        if validation.get('issues_found'):
            print(f"   Issues: {len(validation['issues_found'])} found")
        print()
    
    print("✅ Demo completed! Check 'demo_output' directory for generated files.")
    print("\n📁 Generated Files:")
    print("   - React components in demo_output/react/")
    print("   - API endpoints in demo_output/api/")
    print("   - Test cases in demo_output/tests/")
    print("   - Reports in demo_output/reports/")

if __name__ == "__main__":
    run_demo()