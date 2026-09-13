#!/bin/bash
# start_frontend.sh — Start the React frontend
echo "🎨 Starting QuantumHealth AI Frontend (Vite)..."
cd "$(dirname "$0")/frontend"
npm run dev
