from typing import List, Dict, Optional, Any
from datetime import datetime, timezone
import random
from .base import BrokerInterface

class MockBroker(BrokerInterface):
    def __init__(self):
        self.connected = False
        self.prices = {}
        self.historical_data = {}
        
    def connect(self, credentials: Dict[str, Any]) -> bool:
        self.connected = True
        return True
        
    def disconnect(self) -> None:
        self.connected = False
        
    def is_connected(self) -> bool:
        return self.connected
        
    def get_current_price(self, symbol: str) -> Optional[Dict]:
        if not self.connected:
            return None
            
        if symbol not in self.prices:
            # Generate a random price between 1.0 and 2.0
            self.prices[symbol] = random.uniform(1.0, 2.0)
            
        return {
            "symbol": symbol,
            "bid": self.prices[symbol] - 0.0001,
            "ask": self.prices[symbol] + 0.0001,
            "timestamp": datetime.now(timezone.utc).timestamp()
        }
        
    def get_historical_data(self, symbol: str, timeframe_str: str, start_time_unix: float,
                          end_time_unix: Optional[float] = None, count: Optional[int] = None) -> List[Dict]:
        if not self.connected:
            return []
            
        if end_time_unix is None:
            end_time_unix = datetime.now(timezone.utc).timestamp()
            
        if count is None:
            count = 200  # Default to 200 bars
            
        # Generate mock historical data
        data = []
        current_time = start_time_unix
        timeframe_seconds = self._get_timeframe_seconds(timeframe_str)
        
        # Generate a random starting price
        if symbol not in self.prices:
            self.prices[symbol] = random.uniform(1.0, 2.0)
            
        current_price = self.prices[symbol]
        
        for _ in range(count):
            # Generate random price movement
            price_change = random.uniform(-0.001, 0.001)
            current_price += price_change
            
            # Create a candlestick
            high = current_price + abs(random.uniform(0, 0.0005))
            low = current_price - abs(random.uniform(0, 0.0005))
            open_price = current_price - random.uniform(-0.0002, 0.0002)
            close = current_price + random.uniform(-0.0002, 0.0002)
            
            data.append({
                "timestamp": current_time,
                "open": open_price,
                "high": high,
                "low": low,
                "close": close,
                "volume": random.uniform(100, 1000)
            })
            
            current_time += timeframe_seconds
            
        return data
        
    def get_account_info(self) -> Optional[Dict]:
        if not self.connected:
            return None
            
        return {
            "balance": 10000.0,
            "equity": 10000.0,
            "margin": 0.0,
            "free_margin": 10000.0,
            "margin_level": 0.0,
            "leverage": 100
        }
        
    def place_order(self, symbol: str, order_type: Any, side: Any, volume: float,
                   price: Optional[float] = None, stop_loss: Optional[float] = None,
                   take_profit: Optional[float] = None, time_in_force: Any = None,
                   magic_number: Optional[int] = 0, comment: Optional[str] = "") -> Dict:
        if not self.connected:
            return {"error": "Not connected"}
            
        return {
            "order_id": random.randint(100000, 999999),
            "symbol": symbol,
            "type": order_type,
            "side": side,
            "volume": volume,
            "price": price,
            "stop_loss": stop_loss,
            "take_profit": take_profit,
            "status": "FILLED",
            "timestamp": datetime.now(timezone.utc).timestamp()
        }
        
    def _get_timeframe_seconds(self, timeframe_str: str) -> int:
        timeframe_str = timeframe_str.upper()
        if "M1" == timeframe_str: return 60
        if "M5" == timeframe_str: return 5 * 60
        if "M15" == timeframe_str: return 15 * 60
        if "M30" == timeframe_str: return 30 * 60
        if "H1" == timeframe_str: return 60 * 60
        if "H4" == timeframe_str: return 4 * 60 * 60
        if "D1" == timeframe_str: return 24 * 60 * 60
        if "W1" == timeframe_str: return 7 * 24 * 60 * 60
        if "MN1" == timeframe_str: return 30 * 24 * 60 * 60
        return 60  # Default to 1 minute 