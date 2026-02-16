"""
MINIMAL JSON PROMPTS FOR CODEBASE REVIEW AGENT
Optimized for short structured responses
"""


SYSTEM_PROMPT = """
You are a senior code reviewer.

RULES:
- JSON only
- Very short answers
- Max 5 items per list
- No extra text
"""
CODE_REVIEW_PROMPT = """
Review code quality.

Return JSON:
{
 "score": 1-10,
 "issues": [],
 "fixes": []
}

Code:
{code}
"""

SECURITY_REVIEW_PROMPT = """
Check security risks.

Return JSON:
{
 "risk": "LOW/MEDIUM/HIGH",
 "vulnerabilities": []
}

Code:
{code}
"""


SYSTEM_DESIGN_PROMPT = """
Check system design.

Return JSON:
{
 "architecture": "",
 "scalability": "GOOD/OK/POOR",
 "improvements": []
}

Code:
{code}
"""

PRODUCTION_PROMPT = """
Check production readiness.

Return JSON:
{
 "ready": "YES/NO",
 "missing": []
}

Code:
{code}
"""

FINAL_REPORT_PROMPT = """
Summarize analysis.

Return JSON:
{
 "score": 1-10,
 "risks": [],
 "verdict": "READY/NEEDS_FIXES"
}

Analysis:
{analysis}
"""
