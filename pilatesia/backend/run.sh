#!/bin/bash
# Proje kökünde çalıştırın: ./run.sh
# Önce venv içine paketleri kurun: ./venv/bin/pip install -r requirements.txt
cd "$(dirname "$0")"
exec ./venv/bin/python -m uvicorn main:app --reload
