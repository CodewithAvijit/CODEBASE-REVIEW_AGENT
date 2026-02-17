import json
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END

from parser import parse_codebase, truncate_code
from prompts import (
    SYSTEM_PROMPT,
    CODE_REVIEW_PROMPT,
    SECURITY_REVIEW_PROMPT,
    SYSTEM_DESIGN_PROMPT,
    PRODUCTION_PROMPT,
    FINAL_REPORT_PROMPT
)
from llm import run_analysis
class AgentState(TypedDict):
    project_path: str
    code: str
    code_review: dict
    security_review: dict
    design_review: dict
    production_review: dict
    final_report: dict

def load_code_node(state: AgentState):
    print("📂 Parsing codebase...")
    code = parse_codebase(state["project_path"])
    code = truncate_code(code)
    
    if not code.strip():
        code = "NO CODE FOUND"
        
    return {"code": code}

def code_review_node(state: AgentState):
    print("🧠 Running code quality analysis...")
    result = run_analysis(
        SYSTEM_PROMPT,
        CODE_REVIEW_PROMPT.format(code=state["code"]),
        state["code"]
    )
    return {"code_review": result}

def security_review_node(state: AgentState):
    print("🔐 Running security audit...")
    result = run_analysis(
        SYSTEM_PROMPT,
        SECURITY_REVIEW_PROMPT.format(code=state["code"]),
        state["code"]
    )
    return {"security_review": result}

def design_review_node(state: AgentState):
    print("🏗 Running system design review...")
    result = run_analysis(
        SYSTEM_PROMPT,
        SYSTEM_DESIGN_PROMPT.format(code=state["code"]),
        state["code"]
    )
    return {"design_review": result}

def production_review_node(state: AgentState):
    print("🚀 Evaluating production readiness...")
    result = run_analysis(
        SYSTEM_PROMPT,
        PRODUCTION_PROMPT.format(code=state["code"]),
        state["code"]
    )
    return {"production_review": result}

def final_report_node(state: AgentState):
    print("📊 Generating final report...")
    
    combined_analysis = json.dumps({
        "code_review": state.get("code_review"),
        "security_review": state.get("security_review"),
        "design_review": state.get("design_review"),
        "production_review": state.get("production_review")
    })

    result = run_analysis(
        SYSTEM_PROMPT,
        FINAL_REPORT_PROMPT.format(analysis=combined_analysis),
        combined_analysis
    )
    return {"final_report": result}


workflow = StateGraph(AgentState)

workflow.add_node("load_code", load_code_node)
workflow.add_node("code_review", code_review_node)
workflow.add_node("security_review", security_review_node)
workflow.add_node("design_review", design_review_node)
workflow.add_node("production_review", production_review_node)
workflow.add_node("final_report", final_report_node)

workflow.set_entry_point("load_code")

workflow.add_edge("load_code", "code_review")
workflow.add_edge("load_code", "security_review")
workflow.add_edge("load_code", "design_review")
workflow.add_edge("load_code", "production_review")

workflow.add_edge("code_review", "final_report")
workflow.add_edge("security_review", "final_report")
workflow.add_edge("design_review", "final_report")
workflow.add_edge("production_review", "final_report")
workflow.add_edge("final_report", END)

app_graph = workflow.compile()


def review_codebase(project_path: str) -> dict:
    """
    Runs full multi-stage AI analysis using LangGraph
    """
    print(f"🚀 Starting LangGraph workflow for: {project_path}")
    
    initial_state = {
        "project_path": project_path,
        "code": "",
        "code_review": {},
        "security_review": {},
        "design_review": {},
        "production_review": {},
        "final_report": {}
    }
    
    final_state = app_graph.invoke(initial_state)
    
    return {
        "code_review": final_state["code_review"],
        "security_review": final_state["security_review"],
        "design_review": final_state["design_review"],
        "production_review": final_state["production_review"],
        "final_report": final_state["final_report"]
    }