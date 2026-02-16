"""
LLM CLIENT LAYER
Using Ollama (llama3.1) instead of Gemini
"""

import json
import re
import requests

# =========================
# OLLAMA CONFIG
# =========================

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "mistral:latest"


# =========================
# CORE GENERATE FUNCTION
# =========================

def generate_response(prompt: str) -> str:
    """
    Send prompt to Ollama and return response text
    """

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_NAME,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.2,
                    "num_predict": 400
                }
            },
            timeout=120
        )

        return response.json()["response"].strip()

    except Exception as e:
        return json.dumps({"error": str(e)})

def extract_json(text: str):
    try:
        text = re.sub(r"```json|```", "", text)

        match = re.search(r"\{.*\}", text, re.DOTALL)

        if match:
            return json.loads(match.group())

        return {"error": "No JSON found", "raw": text}

    except Exception:
        return {"error": "Invalid JSON format", "raw": text}



def run_analysis(system_prompt: str, task_prompt: str, code: str):
    safe_code = code[:20000]

    final_prompt = f"""
{system_prompt}

{task_prompt}

CODE:
{safe_code}
"""

    raw_output = generate_response(final_prompt)

    return extract_json(raw_output)
