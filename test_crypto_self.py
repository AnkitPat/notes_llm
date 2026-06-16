import json
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend

def test_sign_verify():
    path = 'backend/service-account.json'
    with open(path) as f:
        data = json.load(f)
    pk_str = data.get('private_key', '')
    
    # Load private key
    private_key = serialization.load_pem_private_key(
        pk_str.encode('utf-8'),
        password=None,
        backend=default_backend()
    )
    
    # Sign some data
    message = b"test message"
    signature = private_key.sign(
        message,
        padding.PKCS1v15(),
        hashes.SHA256()
    )
    
    # Get public key
    public_key = private_key.public_key()
    
    # Verify signature
    try:
        public_key.verify(
            signature,
            message,
            padding.PKCS1v15(),
            hashes.SHA256()
        )
        print("Signature verification successful!")
    except Exception as e:
        print(f"Signature verification failed: {e}")

if __name__ == "__main__":
    test_sign_verify()
