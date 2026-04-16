import pytest
from fastapi.testclient import TestClient
from main import app
import sys
import os

# Add parent path to allow imports just for the test
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

# The API endpoints rely heavily on LLM calls and DB.
# A full test suite would use dependency override in FastAPI 
# to mock the `get_db` and the `extract_recipe_data` function.
