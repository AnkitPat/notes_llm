# Design Spec: Backend Verification Endpoint

## Overview
Add a `/verify` endpoint to the FastAPI backend to allow user verification via email.

## Requirements
- GET `/verify` endpoint.
- Query parameter `email`.
- Update `backend/data/verified_users.json`.
- Append new email if not present.
