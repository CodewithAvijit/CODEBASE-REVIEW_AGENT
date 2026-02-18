import json
import asyncio
from typing import TypedDict
from langgraph.graph import StateGraph, END

from parser import parse_codebase, truncate_code
from prompts import *
from llm import run_analysis


# ================= STATE =================

class AgentState(TypedDict):
    project_path: str
    code: str
    code_review: dict
    security_review: dict
    design_review: dict
    production_review: dict
    final_report: dict


# ================= CONCURRENCY CONTROL =================
# Local LLM cannot handle many parallel requests
ollama_semaphore = asyncio.Semaphore(2)


# ================= NODES =================

async def load_code_node(state: AgentState):
    print("📂 Parsing codebase...")
    code = parse_codebase(state["project_path"])

    # Keep only limited code in memory
    code = truncate_code(code[:12000])

    return {"code": code}


async def code_review_node(state: AgentState):
    async with ollama_semaphore:
        print("🧠 Code Quality Check...")
        result = await run_analysis(
            SYSTEM_PROMPT,
            CODE_REVIEW_PROMPT,
            state["code"]
        )
        return {"code_review": result}


async def security_review_node(state: AgentState):
    async with ollama_semaphore:
        print("🔐 Security Check...")
        result = await run_analysis(
            SYSTEM_PROMPT,
            SECURITY_REVIEW_PROMPT,
            state["code"]
        )
        return {"security_review": result}


async def design_review_node(state: AgentState):
    async with ollama_semaphore:
        print("🏗 Design Check...")
        result = await run_analysis(
            SYSTEM_PROMPT,
            SYSTEM_DESIGN_PROMPT,
            state["code"]
        )
        return {"design_review": result}


async def production_review_node(state: AgentState):
    async with ollama_semaphore:
        print("🚀 Production Readiness Check...")
        result = await run_analysis(
            SYSTEM_PROMPT,
            PRODUCTION_PROMPT,
            state["code"]
        )
        return {"production_review": result}


async def final_report_node(state: AgentState):
    print("📊 Generating Final Report...")

    combined = json.dumps({
        "code": state.get("code_review"),
        "security": state.get("security_review"),
        "design": state.get("design_review"),
        "production": state.get("production_review")
    })

    prompt = FINAL_REPORT_PROMPT.replace("{analysis}", combined)

    result = await run_analysis(SYSTEM_PROMPT, prompt)

    return {"final_report": result}


# ================= GRAPH =================

workflow = StateGraph(AgentState)

workflow.add_node("load_code", load_code_node)
workflow.add_node("code_review", code_review_node)
workflow.add_node("security_review", security_review_node)
workflow.add_node("design_review", design_review_node)
workflow.add_node("production_review", production_review_node)
workflow.add_node("final_report", final_report_node)

workflow.set_entry_point("load_code")

# Parallel fan-out
workflow.add_edge("load_code", "code_review")
workflow.add_edge("load_code", "security_review")
workflow.add_edge("load_code", "design_review")
workflow.add_edge("load_code", "production_review")

# Fan-in
workflow.add_edge("code_review", "final_report")
workflow.add_edge("security_review", "final_report")
workflow.add_edge("design_review", "final_report")
workflow.add_edge("production_review", "final_report")

workflow.add_edge("final_report", END)

app_graph = workflow.compile()


# ================= MAIN ENTRY FUNCTION =================

async def review_codebase(project_path: str) -> dict:
    """
    Main public function used by FastAPI.
    Returns ONLY review JSON — never returns code.
    """

    initial_state = {
        "project_path": project_path,
        "code": "",  # required for state schema
        "code_review": {},
        "security_review": {},
        "design_review": {},
        "production_review": {},
        "final_report": {}
    }

    final_state = await app_graph.ainvoke(initial_state)

    # 🔥 CRITICAL FIX: DO NOT RETURN FULL STATE
    # Only return clean review data

    return {
        "code_review": final_state.get("code_review"),
        "security_review": final_state.get("security_review"),
        "design_review": final_state.get("design_review"),
        "production_review": final_state.get("production_review"),
        "final_report": final_state.get("final_report")
    }
