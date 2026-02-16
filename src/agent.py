import json
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
def review_codebase(project_path: str) -> dict:
    """
    Runs full multi-stage AI analysis
    """
    print("📂 Parsing codebase...")
    code = parse_codebase(project_path)
    code = truncate_code(code)

    if not code.strip():
        return {"error": "No supported code files found"}

    print("🧠 Running code quality analysis...")
    code_review = run_analysis(
        SYSTEM_PROMPT,
        CODE_REVIEW_PROMPT.format(code=code),
        code
    )

    print("🔐 Running security audit...")
    security_review = run_analysis(
        SYSTEM_PROMPT,
        SECURITY_REVIEW_PROMPT.format(code=code),
        code
    )

    # STEP 4 — System Design Analysis
    print("🏗 Running system design review...")
    design_review = run_analysis(
        SYSTEM_PROMPT,
        SYSTEM_DESIGN_PROMPT.format(code=code),
        code
    )

    print("🚀 Evaluating production readiness...")
    production_review = run_analysis(
        SYSTEM_PROMPT,
        PRODUCTION_PROMPT.format(code=code),
        code
    )

    print("📊 Generating final report...")

    combined_analysis = json.dumps({
        "code_review": code_review,
        "security_review": security_review,
        "design_review": design_review,
        "production_review": production_review
    })

    final_report = run_analysis(
        SYSTEM_PROMPT,
        FINAL_REPORT_PROMPT.format(analysis=combined_analysis),
        combined_analysis
    )

    return {
        "code_review": code_review,
        "security_review": security_review,
        "design_review": design_review,
        "production_review": production_review,
        "final_report": final_report
    }
