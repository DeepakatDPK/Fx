import os
import sys
import json
from dotenv import load_dotenv

def test_environment():
    """Test the Python environment setup."""
    results = {
        "python_version": sys.version,
        "environment_variables": {},
        "imports": {},
        "paths": {
            "current_directory": os.getcwd(),
            "python_path": os.environ.get("PYTHONPATH", ""),
            "script_directory": os.path.dirname(os.path.abspath(__file__))
        }
    }
    
    print("Testing Python environment...")
    
    # Test environment variables
    load_dotenv()
    openai_key = os.getenv('OPENAI_API_KEY')
    results["environment_variables"]["OPENAI_API_KEY"] = "Present" if openai_key else "Missing"
    
    # Test imports
    try:
        import openai
        results["imports"]["openai"] = {
            "success": True,
            "version": openai.__version__
        }
    except ImportError as e:
        results["imports"]["openai"] = {
            "success": False,
            "error": str(e)
        }
        
    try:
        import numpy
        results["imports"]["numpy"] = {
            "success": True,
            "version": numpy.__version__
        }
    except ImportError as e:
        results["imports"]["numpy"] = {
            "success": False,
            "error": str(e)
        }
        
    try:
        import pandas
        results["imports"]["pandas"] = {
            "success": True,
            "version": pandas.__version__
        }
    except ImportError as e:
        results["imports"]["pandas"] = {
            "success": False,
            "error": str(e)
        }
        
    try:
        from tradingagents.tradingagents.graph.trading_graph import TradingAgentsGraph
        results["imports"]["TradingAgentsGraph"] = {
            "success": True
        }
    except ImportError as e:
        results["imports"]["TradingAgentsGraph"] = {
            "success": False,
            "error": str(e)
        }
    
    # Print results
    print(json.dumps(results, indent=2))
    
    # Check if all critical components are working
    critical_components = [
        results["environment_variables"]["OPENAI_API_KEY"] == "Present",
        results["imports"]["openai"]["success"],
        results["imports"]["numpy"]["success"],
        results["imports"]["pandas"]["success"],
        results["imports"]["TradingAgentsGraph"]["success"]
    ]
    
    if all(critical_components):
        print("\nAll critical components are working!")
        sys.exit(0)
    else:
        print("\nSome critical components are not working properly.")
        sys.exit(1)

if __name__ == "__main__":
    test_environment() 