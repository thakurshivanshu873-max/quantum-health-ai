#!/bin/bash
# start_backend.sh — Start the FastAPI backend
echo "🚀 Starting QuantumHealth AI Backend (FastAPI)..."
cd "$(dirname "$0")"
/opt/anaconda3/bin/python -m uvicorn backend.app:app --host 0.0.0.0 --port 8000 --reload
