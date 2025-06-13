import os
import site
import shutil

def patch_pandas_ta():
    # Get site-packages directory
    site_packages = site.getsitepackages()[0]
    squeeze_pro_path = os.path.join(site_packages, 'pandas_ta', 'momentum', 'squeeze_pro.py')
    
    # Create backup
    backup_path = squeeze_pro_path + '.bak'
    if not os.path.exists(backup_path):
        shutil.copy2(squeeze_pro_path, backup_path)
    
    # Read the file
    with open(squeeze_pro_path, 'r') as f:
        content = f.read()
    
    # Replace NaN with nan
    content = content.replace('from numpy import NaN as npNaN', 'from numpy import nan as npNaN')
    
    # Write back
    with open(squeeze_pro_path, 'w') as f:
        f.write(content)
    
    print("Successfully patched pandas_ta")

if __name__ == "__main__":
    patch_pandas_ta() 