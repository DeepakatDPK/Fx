import subprocess
import sys
import os

def install_dependencies():
    """Install required Python packages."""
    requirements = [
        'openai',
        'python-dotenv',
        'numpy',
        'pandas',
        'requests',
        'langchain',
        'langchain-openai'
    ]
    
    print("Installing required packages...")
    for package in requirements:
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])
            print(f"Successfully installed {package}")
        except subprocess.CalledProcessError as e:
            print(f"Failed to install {package}: {str(e)}")
            sys.exit(1)
    
    print("All dependencies installed successfully!")

if __name__ == "__main__":
    install_dependencies() 