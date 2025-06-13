"""
Main setup script that runs both the setup and test scripts.
"""

import subprocess
import sys
from pathlib import Path

def run_script(script_name: str):
    """Run a Python script and handle any errors."""
    try:
        result = subprocess.run([sys.executable, script_name], check=True)
        return result.returncode == 0
    except subprocess.CalledProcessError as e:
        print(f"Error running {script_name}: {str(e)}")
        return False

def main():
    print("Starting Trading Agents Framework Setup...")
    
    # Get the directory of this script
    current_dir = Path(__file__).parent
    
    # Run setup.py
    setup_script = current_dir / "setup.py"
    if setup_script.exists():
        print("\nRunning setup script...")
        if run_script(str(setup_script)):
            print("Setup completed successfully!")
        else:
            print("Setup failed!")
            return
    else:
        print("Error: setup.py not found!")
        return
    
    # Run test_config.py
    test_script = current_dir / "test_config.py"
    if test_script.exists():
        print("\nRunning configuration test...")
        if run_script(str(test_script)):
            print("Configuration test completed!")
        else:
            print("Configuration test failed!")
            return
    else:
        print("Error: test_config.py not found!")
        return
    
    print("\nSetup and testing completed successfully!")
    print("\nNext steps:")
    print("1. Check the test results above to ensure all API connections are working")
    print("2. If any tests failed, check your API keys in the .env file")
    print("3. You can now start using the trading framework!")

if __name__ == "__main__":
    main() 