"""
ML Difficulty Microservice
==========================
Uses HuggingFace's free Inference API with facebook/bart-large-mnli
(zero-shot classification) to classify GitHub issue difficulty as
Easy / Medium / Hard — no pre-defined keyword list needed.

Run:  python ml_service.py
Port: 5001
"""

from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import os
import urllib.request
import urllib.error

HF_API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli"
HF_TOKEN   = os.environ.get("HF_TOKEN", "")          # optional — free tier works without
PORT       = int(os.environ.get("ML_PORT", 5001))

CANDIDATE_LABELS = ["easy issue", "medium difficulty issue", "hard issue"]

LABEL_MAP = {
    "easy issue":               "Easy",
    "medium difficulty issue":  "Medium",
    "hard issue":               "Hard",
}


def classify_issue(title: str, body: str) -> dict:
    """
    Calls the HuggingFace zero-shot classification API.
    Returns {"difficulty": "Easy"|"Medium"|"Hard", "scores": {...}}
    """
    # Combine title + first 800 chars of body for the prompt
    text = f"{title}\n\n{body[:800]}" if body else title

    payload = json.dumps({
        "inputs": text,
        "parameters": {"candidate_labels": CANDIDATE_LABELS},
        "options": {"wait_for_model": True}   # waits if model is loading (cold start)
    }).encode("utf-8")

    headers = {"Content-Type": "application/json"}
    if HF_TOKEN:
        headers["Authorization"] = f"Bearer {HF_TOKEN}"

    req = urllib.request.Request(HF_API_URL, data=payload, headers=headers, method="POST")

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        raise RuntimeError(f"HuggingFace API error {e.code}: {error_body}")

    # API returns labels sorted by score (highest first)
    best_label = result["labels"][0]
    scores = dict(zip(result["labels"], result["scores"]))

    return {
        "difficulty": LABEL_MAP[best_label],
        "scores": {LABEL_MAP[k]: round(v, 4) for k, v in scores.items()},
    }


class Handler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        print(f"[ML] {self.address_string()} - {format % args}")

    def send_json(self, code: int, data: dict):
        body = json.dumps(data).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        if self.path == "/health":
            self.send_json(200, {"status": "ok", "model": "facebook/bart-large-mnli"})
        else:
            self.send_json(404, {"error": "Not found"})

    def do_POST(self):
        if self.path != "/classify":
            self.send_json(404, {"error": "Not found"})
            return

        try:
            length  = int(self.headers.get("Content-Length", 0))
            payload = json.loads(self.rfile.read(length))
            title   = payload.get("title", "")
            body    = payload.get("body", "")

            if not title and not body:
                self.send_json(400, {"error": "Provide at least 'title' or 'body'"})
                return

            result = classify_issue(title, body)
            self.send_json(200, result)

        except Exception as exc:
            print(f"[ML] ERROR: {exc}")
            self.send_json(500, {"error": str(exc)})


if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", PORT), Handler)
    print(f"🤖 ML Difficulty Service running on http://localhost:{PORT}")
    print(f"   Model : facebook/bart-large-mnli (zero-shot classification)")
    print(f"   HF Token: {'set ✅' if HF_TOKEN else 'not set — using free anonymous tier'}")
    print(f"   POST http://localhost:{PORT}/classify  {{ title, body }}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 ML service stopped.")
