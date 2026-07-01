# Design Spec: Secure MongoDB Credential Management

## Problem
The backend database connection utility (`backend/utils/db.py`) currently contains a hardcoded fallback for the MongoDB URI. This poses a security risk and makes the application less configurable.

## Solution
1. **Explicit `.env` Loading:** Update `backend/utils/db.py` to explicitly load environment variables from the `backend/.env` file.
2. **Remove Hardcoded Fallback:** Remove the hardcoded MongoDB URI fallback from the `os.getenv` call.
3. **Fail-Fast Mechanism:** Add a check to raise a `ValueError` if the `MONGODB_URI` environment variable is not found, ensuring the application does not attempt to connect to an invalid or unconfigured database.

## Implementation Details
- Use `os.path.join(os.path.dirname(__file__), '..', '.env')` to accurately locate the `.env` file relative to the `db.py` script.
- Raise `ValueError("MONGODB_URI environment variable not set.")` if `MONGODB_URI` is None or empty.

## Success Criteria
- The application successfully loads `MONGODB_URI` from `backend/.env`.
- The application crashes on startup if `MONGODB_URI` is missing, preventing unsafe defaults.
- No hardcoded credentials remain in `backend/utils/db.py`.
