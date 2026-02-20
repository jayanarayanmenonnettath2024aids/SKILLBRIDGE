import os
from typing import Optional

import firebase_admin
from firebase_admin import credentials, firestore

_app: Optional[firebase_admin.App] = None
_db: Optional[firestore.Client] = None


def get_db() -> firestore.Client:
    """Return a singleton Firestore client, initializing Firebase if needed.

    Expects GOOGLE_APPLICATION_CREDENTIALS to point to a Firebase service
    account JSON file. The project ID is taken from that file.
    """
    global _app, _db

    if _db is not None:
        return _db

    cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if not cred_path or not os.path.exists(cred_path):
        raise RuntimeError(
            "GOOGLE_APPLICATION_CREDENTIALS is not set or file does not exist. "
            "Set it in backend/.env to the path of your Firebase service account JSON."
        )

    if not _app:
        cred = credentials.Certificate(cred_path)
        # Initialize with storage bucket
        _app = firebase_admin.initialize_app(cred, {
            'storageBucket': 'pals-33351.appspot.com'
        })

    _db = firestore.client()
    return _db


def get_firebase_app() -> firebase_admin.App:
    """Return the initialized Firebase app, initializing if needed."""
    global _app
    
    if _app is not None:
        return _app
    
    # Initialize by getting db (which initializes the app)
    get_db()
    return _app
