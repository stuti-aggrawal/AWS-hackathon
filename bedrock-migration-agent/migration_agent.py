import os
import json
from php_analyzer import PHPAnalyzer
from react_generator import ReactGenerator
from migration_validator import MigrationValidator

class MigrationAgent:
    def __init__(self):
        self.analyzer = PHPAnalyzer()
        self.generator = ReactGenerator()
        self.validator = MigrationValidator()
        self.results = {}
    
    def load_php_files(self, directory_path):
        php_files = {}
        for filename in os.listdir(directory_path):
            if filename.endswith('.php'):
                file_path = os.path.join(directory_path, filename)
                with open(file_path, 'r', encoding='utf-8') as f:
                    php_files[filename] = f.read()
        return php_files
    
    def migrate_php_to_react(self, php_files, output_dir='output'):
        # Create output directory
        os.makedirs(output_dir, exist_ok=True)
        os.makedirs(f"{output_dir}/react", exist_ok=True)
        os.makedirs(f"{output_dir}/api", exist_ok=True)
        os.makedirs(f"{output_dir}/tests", exist_ok=True)
        os.makedirs(f"{output_dir}/reports", exist_ok=True)
        
        migration_results = {}
        
        for file_name, php_content in php_files.items():
            print(f"\n=== Migrating {file_name} ===")
            
            # Step 1: Analyze PHP code
            print("1. Analyzing PHP code...")
            analysis = self.analyzer.analyze_php_code(php_content, file_name)
            
            # Step 2: Generate React component
            print("2. Generating React component...")
            component_name = file_name.replace('.php', '')
            migration = self.generator.generate_full_migration(analysis, component_name)
            
            # Step 3: Validate migration
            print("3. Validating migration...")
            validation = self.validator.validate_migration(
                php_content, 
                migration['react_component'], 
                migration['api_endpoints']
            )
            
            # Step 4: Generate test cases
            print("4. Generating test cases...")
            test_cases = self.validator.generate_test_cases(analysis, migration['react_component'])
            
            # Save results
            self.save_migration_results(
                output_dir, component_name, analysis, migration, validation, test_cases
            )
            
            migration_results[file_name] = {
                'analysis': analysis,
                'migration': migration,
                'validation': validation,
                'component_name': component_name
            }
            
            print(f"✓ Migration completed. Overall score: {validation.get('overall_score', 'N/A')}")
        
        # Generate summary report
        self.generate_summary_report(migration_results, output_dir)
        
        return migration_results
    
    def save_migration_results(self, output_dir, component_name, analysis, migration, validation, test_cases):
        # Save React component
        with open(f"{output_dir}/react/{component_name}.js", 'w') as f:
            f.write(migration['react_component'])
        
        # Save API endpoints
        with open(f"{output_dir}/api/{component_name}API.js", 'w') as f:
            f.write(migration['api_endpoints'])
        
        # Save test cases
        with open(f"{output_dir}/tests/{component_name}.test.js", 'w') as f:
            f.write(test_cases)
        
        # Save analysis report
        with open(f"{output_dir}/reports/{component_name}_analysis.json", 'w') as f:
            json.dump(analysis, f, indent=2)
        
        # Save validation report
        with open(f"{output_dir}/reports/{component_name}_validation.json", 'w') as f:
            json.dump(validation, f, indent=2)
    
    def generate_summary_report(self, results, output_dir):
        summary = {
            'total_files': len(results),
            'migration_scores': {},
            'overall_metrics': {
                'avg_score': 0,
                'files_above_85': 0,
                'files_needing_fixes': 0
            },
            'issues_summary': []
        }
        
        total_score = 0
        for file_name, result in results.items():
            validation = result['validation']
            score = validation.get('overall_score', 0)
            summary['migration_scores'][file_name] = score
            total_score += score
            
            if score >= 85:
                summary['overall_metrics']['files_above_85'] += 1
            
            if validation.get('manual_fixes_needed'):
                summary['overall_metrics']['files_needing_fixes'] += 1
        
        summary['overall_metrics']['avg_score'] = total_score / len(results) if results else 0
        
        with open(f"{output_dir}/migration_summary.json", 'w') as f:
            json.dump(summary, f, indent=2)
        
        print(f"\n=== Migration Summary ===")
        print(f"Total files migrated: {summary['total_files']}")
        print(f"Average score: {summary['overall_metrics']['avg_score']:.1f}")
        print(f"Files above 85%: {summary['overall_metrics']['files_above_85']}")
        print(f"Files needing manual fixes: {summary['overall_metrics']['files_needing_fixes']}")

if __name__ == "__main__":
    agent = MigrationAgent()
    
    # Load PHP files from a directory
    php_files = agent.load_php_files('../cd-cheetah-ui-widget/widget/org/setup/configurations/customFields/')
    
    # Run migration
    results = agent.migrate_php_to_react(php_files)
    
    print("\n✓ Migration completed! Check the 'output' directory for results.")