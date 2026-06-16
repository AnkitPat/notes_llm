import json
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend

def test_key():
    path = 'backend/service-account.json'
    with open(path) as f:
        data = json.load(f)
    pk_str = data.get('private_key', '')
    
    try:
        key = serialization.load_pem_private_key(
            pk_str.encode('utf-8'),
            password=None,
            backend=default_backend()
        )
        print("Successfully loaded private key using cryptography!")
    except Exception as e:
        print(f"Failed to load private key: {e}")

if __name__ == "__main__":
    test_key()
