SYSTEM_PROMPT = """
You are an AI codebase review agent.

CRITICAL RULES:
1. Output ONLY raw JSON.
2. NEVER include markdown.
3. NEVER include ``` or ```json.
4. NEVER wrap response in code blocks.
5. Response MUST start with { and end with }.
6. Base analysis ONLY on provided code.
7. Keep text extremely short (max 15 words).
8. Do NOT list files or methods.
9. Do NOT change JSON keys.
"""

CODE_REVIEW_PROMPT = """
OUTPUT MUST BE RAW JSON ONLY. DO NOT USE CODE BLOCKS.

Analyze the specific code provided for maintainability, DRY, and SOLID principles.

RETURN EXACT JSON:

{{
  "code_review": "<Specific 15-word summary of THIS code>",
  "code_score": 8,
  "major_issues": "<Specific issue or None>",
  "refactoring_need": "<Specific fix or None>"
}}

CODE:
{code}
"""

SECURITY_REVIEW_PROMPT = """
Analyze the specific code provided for actual OWASP vulnerabilities.

RETURN EXACT JSON:

{{
  "security_analysis": "<Specific 15-word security summary>",
  "risk_level": "LOW|MEDIUM|HIGH|CRITICAL",
  "critical_vulnerability": "<Specific vulnerability or 'None'>",
  "security_fix": "<Actionable fix or 'None'>"
}}

CODE:
{code}
"""
SYSTEM_DESIGN_PROMPT = """
Evaluate the architecture and scalability of the specific code provided.

RETURN EXACT JSON:

{{
  "system_design": "<Specific architecture summary>",
  "architecture_type": "Monolith|Microservice|Layered|Frontend|Script",
  "scalability": "GOOD|AVERAGE|POOR",
  "design_issue": "<Specific bottleneck or 'None'>"
}}

CODE:
{code}
"""
PRODUCTION_PROMPT = """
Evaluate if this specific code is ready for production deployment.

RETURN EXACT JSON:

{{
  "production_readiness": "<Specific readiness summary>",
  "is_ready": false,
  "missing_component": "Logging|Monitoring|Error Handling|None",
  "deployment_risk": "<Specific risk or 'None'>"
}}

CODE:
{code}
"""
FINAL_REPORT_PROMPT = """
Combine all analysis results into a final concise verdict.

RETURN EXACT JSON:

{{
  "final_report": {{
    "overall_health": "<Specific system health summary>",
    "strength": "<Main positive aspect>",
    "weakness": "<Main problem area>",
    "priority_fix": "<Most important improvement>",
    "final_score": 8,
    "verdict": "APPROVE|REJECT|WITH_COMMENTS"
  }}
}}

INPUT DATA:
{analysis}
"""
