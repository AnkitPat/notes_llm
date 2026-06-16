import json
import base64
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
    cert_str = """-----BEGIN CERTIFICATE-----
MIIDJjCCAg6gAwIBAgIIPSbfPLx0iQswDQYJKoZIhvcNAQEFBQAwNjE0MDIGA1UE
Awwrbm90ZXMtbGxtLmZpci1hMGYyYS5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbTAe
Fw0yNjA2MTAxMzM2NDVaFw0yODA2MjgyMDE2NDRaMDYxNDAyBgNVBAMMK25vdGVz
LWxsbS5maXItYTBmMmEuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20wggEiMA0GCSqG
SIb3DQEBAQUAA4IBDwAwggEKAoIBAQDNzEgWgKteZl1qIbLxgcXecXnmra3s3eoJ
PwTKsHToqTsWwIg5Z9ZgccNQdQWOaqBrh69K/Uhgq9+vs8FhUP0lxWJ53N0nnVl9
Qi5+ZnNT+wMTQ/Ss/snJVcRyEu2xT6jO09v51X33PIJ917es+s+HK9WX2Ader4R0
NtdZ2zruYf8p8iwj3oFi7RyeyHoxCL3PhLg+9oZlfyk6TaX6CaCq+UFn+oYPjmLr
1nOg09PVECft72zA6t5de8UFtw2WlvVRYhyE6u9ih388TLk/WdWmyUcN/QrgKjUd
nbcS+xP9Fv0LQAFcpt+CW7pKsPMGJbbCHiijn1C8BmXDOHNkX6wmZAgMBAAGjODA2
MAwGA1UdEwEB/wQCMAAwDgYDVR0PAQH/BAQDAgeAMBYGA1UdJQEB/wQMMAoGCCsG
AQUFBwMCMA0GCSqGSIb3DQEBBQUAA4IBAQCt2EYFMKpZ6ktUuCi7KCszJGH0JTz0
xyPPkf1kndtBuFalmtb5ruDBue7OZcnXtSPlvuOxKrbcc7mbrK1OlNh+sjC58Y/1
/PUN2sc8za2Vhm9uPpDforrSyVV9yGxUrw2o/Aiyr7gWGCiuVuPqTSRJF2ECKtoT
VlfSOC+AR3VvAbnFKdc9xLSzNdiJyn/P33ZGv7M5aDBL38HkTwCrghJNkSvCnj1G
+dwe5m4Rce3h9pOsnVQ6YXqC2Gw/sn6o7SNZ0M/yN1+pBd27Cdv9JAOzTT8bN10a
KqgS0WLOVkO+5CeXQA/0szSokOVfUaR4Q0uCeBaKfsaMpEldgUIfqsXF
-----END CERTIFICATE-----"""
    cert = x509.load_pem_x509_certificate(cert_str.encode('utf-8'), default_backend())
    remote_pub_bytes = cert.public_key().public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    
    print("Local Public Key:")
    print(local_pub_bytes.decode('utf-8')[:100] + "...")
    print("\nRemote Public Key:")
    print(remote_pub_bytes.decode('utf-8')[:100] + "...")
    
    if local_pub_bytes == remote_pub_bytes:
        print("\nKEYS MATCH!")
    else:
        print("\nKEYS DO NOT MATCH!")

if __name__ == "__main__":
    compare_keys()
