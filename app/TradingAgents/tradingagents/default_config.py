import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# API Keys
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
ALPHA_VANTAGE_API_KEY = os.getenv('ALPHA_VANTAGE_API_KEY')
FINNHUB_API_KEY = os.getenv('FINNHUB_API_KEY')

DEFAULT_CONFIG = {
    "project_dir": os.path.abspath(os.path.join(os.path.dirname(__file__), ".")),
    "data_dir": "/Users/yluo/Documents/Code/ScAI/FR1-data",
    "data_cache_dir": os.path.join(
        os.path.abspath(os.path.join(os.path.dirname(__file__), ".")),
        "dataflows/data_cache",
    ),
    # API Keys
    "api_keys": {
        "openai": OPENAI_API_KEY,
        "alpha_vantage": ALPHA_VANTAGE_API_KEY,
        "finnhub": FINNHUB_API_KEY
    },
    # LLM settings
    "deep_think_llm": "o4-mini",
    "quick_think_llm": "gpt-4o-mini",
    # Debate and discussion settings
    "max_debate_rounds": 1,
    "max_risk_discuss_rounds": 1,
    "max_recur_limit": 100,
    # Tool settings
    "online_tools": True,
}

def validate_api_keys():
    """Validate that all required API keys are present."""
    required_keys = ['OPENAI_API_KEY']
    missing_keys = [key for key in required_keys if not os.getenv(key)]
    
    if missing_keys:
        print("Warning: Missing required API keys:")
        for key in missing_keys:
            print(f"- {key}")
        return False
    return True

# Validate API keys on module import
if not validate_api_keys():
    print("Warning: Some required API keys are missing. Please check your .env file.")
