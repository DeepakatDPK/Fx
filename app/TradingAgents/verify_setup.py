"""
Verification script to test API connections and configuration.
"""

import os
from dotenv import load_dotenv
import openai
import requests
from tradingagents.default_config import DEFAULT_CONFIG, validate_api_keys

def test_openai_connection():
    """Test OpenAI API connection."""
    try:
        openai.api_key = DEFAULT_CONFIG["api_keys"]["openai"]
        response = openai.models.list()
        print("✓ OpenAI API connection successful")
        return True
    except Exception as e:
        print(f"✗ OpenAI API Error: {str(e)}")
        return False

def test_alpha_vantage_connection():
    """Test Alpha Vantage API connection."""
    try:
        api_key = DEFAULT_CONFIG["api_keys"]["alpha_vantage"]
        if not api_key:
            print("✗ Alpha Vantage API key not found")
            return False
            
        url = f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey={api_key}"
        response = requests.get(url)
        if response.status_code == 200:
            print("✓ Alpha Vantage API connection successful")
            return True
        else:
            print(f"✗ Alpha Vantage API Error: Status code {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Alpha Vantage API Error: {str(e)}")
        return False

def test_finnhub_connection():
    """Test Finnhub API connection."""
    try:
        api_key = DEFAULT_CONFIG["api_keys"]["finnhub"]
        if not api_key:
            print("✗ Finnhub API key not found")
            return False
            
        url = f"https://finnhub.io/api/v1/quote?symbol=AAPL&token={api_key}"
        response = requests.get(url)
        if response.status_code == 200:
            print("✓ Finnhub API connection successful")
            return True
        else:
            print(f"✗ Finnhub API Error: Status code {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Finnhub API Error: {str(e)}")
        return False

def main():
    print("Verifying Trading Agents Framework Setup...")
    print("\nChecking API Keys:")
    
    # Load environment variables
    load_dotenv()
    
    # Validate API keys
    if not validate_api_keys():
        print("\n✗ API key validation failed. Please check your .env file.")
        return
    
    print("\nTesting API Connections:")
    
    # Test each API connection
    openai_success = test_openai_connection()
    alpha_vantage_success = test_alpha_vantage_connection()
    finnhub_success = test_finnhub_connection()
    
    # Print summary
    print("\nVerification Summary:")
    print(f"OpenAI API: {'✓' if openai_success else '✗'}")
    print(f"Alpha Vantage API: {'✓' if alpha_vantage_success else '✗'}")
    print(f"Finnhub API: {'✓' if finnhub_success else '✗'}")
    
    if all([openai_success, alpha_vantage_success, finnhub_success]):
        print("\n✓ All API connections successful! The framework is ready to use.")
    else:
        print("\n✗ Some API connections failed. Please check the errors above.")

if __name__ == "__main__":
    main() 