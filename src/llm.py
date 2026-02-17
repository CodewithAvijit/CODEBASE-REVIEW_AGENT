

import json
import re
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser



MODEL_NAME = "mistral:latest"

llm = ChatOllama(
    model=MODEL_NAME,
    temperature=0.2,
    base_url="http://localhost:11434"
)

def extract_json(text: str):
    """
    Robust JSON extraction helper
    """
    try:
        text = re.sub(r"```json|```", "", text)
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return json.loads(match.group())
        return {"error": "No JSON found", "raw": text}
    except Exception:
        return {"error": "Invalid JSON format", "raw": text}

def run_analysis(system_prompt: str, task_prompt: str, code: str = ""):
    """
    Uses LangChain to run the analysis and return parsed JSON.
    """
    safe_code = code[:20000]

    prompt = ChatPromptTemplate.from_messages([
        ("system", "{system_prompt}"),
        ("user", "{task_prompt}\n\nCODE:\n{code}")
    ])

    chain = prompt | llm | StrOutputParser()

    try:
        response = chain.invoke({
            "system_prompt": system_prompt,
            "task_prompt": task_prompt,
            "code": safe_code
        })
        return extract_json(response)
    except Exception as e:
        return {"error": str(e)}