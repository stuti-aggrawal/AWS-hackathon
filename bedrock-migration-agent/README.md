# Bedrock-Powered Migration Agent

AI-powered code migration tool that converts legacy PHP applications to modern React/Node.js stack using AWS Bedrock.

## Features

- **PHP Code Analysis**: Extracts business logic, validation rules, and UI patterns
- **React Component Generation**: Creates modern functional components with hooks
- **API Endpoint Generation**: Builds Express/Node.js APIs with Sequelize ORM
- **Migration Validation**: Scores migration quality and identifies issues
- **Test Case Generation**: Creates comprehensive Jest test suites
- **Detailed Reporting**: Provides migration metrics and recommendations

## Setup

1. **Install Dependencies**:
```bash
pip install -r requirements.txt
```

2. **Configure AWS Credentials**:
Update `.env` file with your AWS credentials and preferred Bedrock model.

3. **Run Migration**:
```bash
python migration_agent.py
```

## Usage

```python
from migration_agent import MigrationAgent

# Initialize agent
agent = MigrationAgent()

# Load PHP files
php_files = agent.load_php_files('path/to/php/files/')

# Run migration
results = agent.migrate_php_to_react(php_files)
```

## Output Structure

```
output/
├── react/           # Generated React components
├── api/             # Generated Node.js APIs
├── tests/           # Generated test cases
├── reports/         # Analysis and validation reports
└── migration_summary.json  # Overall migration metrics
```

## KPI Metrics

- **Migration Coverage**: 90%+ automated migration
- **Functional Equivalence**: 85%+ test pass rate
- **UI Fidelity**: 80%+ visual consistency
- **Migration Efficiency**: 70%+ time reduction
- **Post-Migration Fixes**: <10% manual corrections

## Supported Models

- Claude 3 Sonnet (recommended)
- Claude 3 Haiku
- Titan Text models

## Architecture

1. **PHPAnalyzer**: Extracts patterns from legacy code
2. **ReactGenerator**: Creates modern React/Node.js code
3. **MigrationValidator**: Validates functional equivalence
4. **MigrationAgent**: Orchestrates the entire pipeline