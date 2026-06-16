import json
import subprocess
from cryptography import x509
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend

def compare_keys():
    # Local private key
    path = 'backend/service-account.json'
    with open(path) as f:
        data = json.load(f)
    pk_str = data.get('private_key', '')
    local_pk = serialization.load_pem_private_key(
        pk_str.encode('utf-8'),
        password=None,
        backend=default_backend()
    )
    local_pub_bytes = local_pk.public_key().public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    
    # Remote certificate
    url = "https://www.googleapis.com/robot/v1/metadata/x509/notes-llm%40fir-a0f2a.iam.gserviceaccount.com"
    output = subprocess.check_output(["curl", "-s", url]).decode('utf-8')
    remote_certs = json.loads(output)
    
    # Take the first one or the one matching private_key_id if possible
    cert_id = list(remote_certs.keys())[0]
    cert_str = remote_certs[cert_id]
    
    cert = x509.load_pem_x509_certificate(cert_str.encode('utf-8'), default_backend())
    remote_pub_bytes = cert.public_key().public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    
    print(f"Local Public Key (derived from private key):")
    print(local_pub_bytes.decode('utf-8')[:100] + "...")
    print(f"\nRemote Public Key (from cert {cert_id}):")
    print(remote_pub_bytes.decode('utf-8')[:100] + "...")
    
    if local_pub_bytes == remote_pub_bytes:
        print("\nKEYS MATCH!")
    else:
        print("\nKEYS DO NOT MATCH!")
        print(f"Local key ID (assumed): {data.get('private_key_id')}")
        print(f"Remote key ID: {cert_id}")

if __name__ == "__main__":
    compare_keys()
