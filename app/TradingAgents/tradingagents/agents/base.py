from abc import ABC, abstractmethod
from typing import Dict

class BaseAgent(ABC):
    def __init__(self, agent_id: str):
        self.agent_id = agent_id

    @abstractmethod
    def process_task(self, state: Dict) -> Dict:
        pass

    def log(self, message: str):
        print(f"[{self.agent_id}] {message}") 