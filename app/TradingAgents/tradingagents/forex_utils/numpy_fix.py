import numpy as np
import sys
from types import ModuleType

# Create a wrapper for numpy that provides NaN
class NumpyWrapper(ModuleType):
    def __init__(self, original_module):
        self.__dict__.update(original_module.__dict__)
        self.NaN = np.nan

# Replace numpy in sys.modules
sys.modules['numpy'] = NumpyWrapper(np) 