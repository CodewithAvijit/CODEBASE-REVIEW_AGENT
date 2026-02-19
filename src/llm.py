import json
import re
import asyncio
from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.output_parsers import StrOutputParser

MODEL_NAME = "mistral:latest"

llm = ChatOllama(
    model=MODEL_NAME,
    temperature=0.0,
    base_url="http://localhost:11434"
)

def extract_json(text: str):
    try:
        text = re.sub(r"```.*?```", "", text, flags=re.DOTALL)

        text = re.sub(r"```json|```", "", text)

        text = text.strip()

        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return json.loads(match.group())

        return {"error": "No JSON found", "raw": text}

    except Exception as e:
        return {"error": str(e), "raw": text}

async def run_analysis(system_prompt: str, task_prompt: str, code: str = ""):
    safe_code = code[:10000] if code else "" 
    actual_task_prompt = task_prompt.replace("{code}", safe_code)

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=actual_task_prompt)
    ]

    chain = llm | StrOutputParser()

    for attempt in range(2):
        try:
     
            response = await chain.ainvoke(messages)
            parsed = extract_json(response)
            if "error" not in parsed:
                return parsed
            await asyncio.sleep(1) 
        except Exception as e:
            last_err = str(e)
    
    return {"error": "Analysis failed", "details": last_err if 'last_err' in locals() else "Unknown"}