"""
API Keys Configuration Module

This module contains the configuration for various API keys used in the trading system.
For security reasons, these values should be loaded from environment variables in production.

Usage:
    from tradingagents.config.api_keys import get_api_key

    openai_key = get_api_key('OPENAI_API_KEY')
"""

import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

# API Key Configuration
API_KEYS = {
    'OPENAI_API_KEY': os.getenv('OPENAI_API_KEY'),
    'ALPHA_VANTAGE_API_KEY': os.getenv('ALPHA_VANTAGE_API_KEY'),
    'FINNHUB_API_KEY': os.getenv('FINNHUB_API_KEY'),
}

def get_api_key(key_name: str) -> Optional[str]:
    """
    Get an API key by name.
    
    Args:
        key_name (str): The name of the API key to retrieve
        
    Returns:
        Optional[str]: The API key value if found, None otherwise
        
    Raises:
        ValueError: If the key_name is not found in the configuration
    """
    if key_name not in API_KEYS:
        raise ValueError(f"API key '{key_name}' not found in configuration")
    
    return API_KEYS[key_name]

def validate_api_keys() -> bool:
    """
    Validate that all required API keys are present.
    
    Returns:
        bool: True if all required keys are present, False otherwise
    """
    required_keys = ['OPENAI_API_KEY']  # Add other required keys here
    
    for key in required_keys:
        if not get_api_key(key):
            print(f"Warning: Required API key '{key}' is not set")
            return False
    
    return True

# Validate API keys on module import
if not validate_api_keys():
    print("Warning: Some required API keys are missing. Please check your configuration.") 