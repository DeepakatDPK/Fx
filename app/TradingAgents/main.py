import json
import sys
import argparse
import traceback
from datetime import datetime, timezone
import os
from dotenv import load_dotenv

# Apply numpy fix
from tradingagents.forex_utils.numpy_fix import *

from tradingagents.graph.trading_graph import TradingAgentsGraph
from tradingagents.default_config import DEFAULT_CONFIG, validate_api_keys
from tradingagents.forex_agents.position_trader_agent import PositionTraderAgent
from tradingagents.forex_agents.scalper_agent import ScalperAgent
from tradingagents.forex_agents.swing_trader_agent import SwingTraderAgent
from tradingagents.forex_agents.day_trader_agent import DayTraderAgent
from tradingagents.broker_interface.mock_broker import MockBroker
from tradingagents.forex_utils.forex_states import ForexMarketContext, ForexSubAgentTask, ForexTradeProposal
from tradingagents.graph.forex_trading_graph import ForexTradingGraph

def parse_args():
    parser = argparse.ArgumentParser(description='Trading Agent CLI')
    parser.add_argument('--action', required=True, help='Action to perform')
    parser.add_argument('--params', required=True, help='JSON string of parameters')
    return parser.parse_args()

def create_market_context(symbol: str) -> ForexMarketContext:
    return {
        "currency_pair": symbol,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "market_regime": None,
        "relevant_economic_events": [],
        "master_agent_directives": {
            "max_risk_per_trade_pct": 0.01,
            "preferred_direction": None
        }
    }

def create_task(symbol: str, timeframes: list[str]) -> ForexSubAgentTask:
    return {
        "task_id": f"task_{datetime.now(timezone.utc).timestamp()}",
        "currency_pair": symbol,
        "timeframes_to_analyze": timeframes,
        "market_context_snapshot": create_market_context(symbol)
    }

def main():
    try:
        # Load environment variables
        load_dotenv()
        
        # Validate API keys first
        if not validate_api_keys():
            print(json.dumps({
                "success": False,
                "error": "Missing required API keys. Please check your .env file."
            }))
            sys.exit(1)

        parser = argparse.ArgumentParser(description='Trading Agents CLI')
        parser.add_argument('--action', required=True, help='Action to perform')
        parser.add_argument('--params', required=True, help='JSON parameters')
        args = parser.parse_args()

        try:
            params = json.loads(args.params)
        except json.JSONDecodeError:
            print(json.dumps({
                "success": False,
                "error": "Invalid JSON parameters"
            }))
            sys.exit(1)
        
        if args.action == 'analyze':
            try:
                # Get mode from params, default to 'quick'
                mode = params.get('mode', 'quick')

                # Initialize the trading graph
                broker = MockBroker()
                graph = ForexTradingGraph(broker=broker)

                # Process the query
                final_decision = graph.invoke_graph(
                    currency_pair=params.get('query', ''),
                    simulated_time_iso=params.get('date', datetime.now(timezone.utc).isoformat()),
                    mode=mode
                )
                
                # Format the response
                response = {
                    "success": True,
                    "data": {
                        "decision": final_decision
                    }
                }
                
                print(json.dumps(response, indent=4))
                sys.exit(0)
                
            except Exception as e:
                print(json.dumps({
                    "success": False,
                    "error": f"Error during analysis: {str(e)}",
                    "traceback": traceback.format_exc()
                }))
                sys.exit(1)
                
        else:
            print(json.dumps({
                "success": False,
                "error": f"Unknown action: {args.action}"
            }))
            sys.exit(1)
            
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": f"Unexpected error: {str(e)}"
        }))
        sys.exit(1)

if __name__ == "__main__":
    main()
