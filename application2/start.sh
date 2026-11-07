#!/bin/sh
# 1) Start the Flask + TensorFlow model API on an internal port
gunicorn -w 1 -b 127.0.0.1:5000 --timeout 120 app:app &

# 2) Wait (up to ~90 s) until the model has loaded
python - <<'PY'
import time, urllib.request
for _ in range(90):
    try:
        urllib.request.urlopen("http://127.0.0.1:5000/health", timeout=2)
        break
    except Exception:
        time.sleep(1)
PY

# 3) Start the Express server (serves the website and forwards /api/predict to Flask)
exec node server/index.js
