"""
MINIMAL JSON PROMPTS FOR CODEBASE REVIEW AGENT
Optimized for short structured responses
"""


SYSTEM_PROMPT = """
You are a senior code reviewer.

STRICT RULES:
- Respond ONLY in valid JSON.
- Keep answers VERY SHORT.
- No explanations or paragraphs.
- Max 5 bullet items per field.
- Use simple words.

Return compact JSON only.
"""
CODE_REVIEW_PROMPT = """
Analyze code quality.

Return ONLY JSON:

{{
  "score": 1-10,
  "issues": ["short points"],
  "suggestions": ["short fixes"]
}}

Code:
{code}
"""



SECURITY_REVIEW_PROMPT = """
Check security risks.

Return ONLY JSON:

{{
  "risk_level": "LOW/MEDIUM/HIGH",
  "vulnerabilities": ["short points"]
}}

Code:
{code}
"""
SYSTEM_DESIGN_PROMPT = """
Review system design.

Return ONLY JSON:

{{
  "architecture": "type",
  "scalability": "GOOD/OK/POOR",
  "improvements": ["short points"]
}}

Code:
{code}
"""

PRODUCTION_PROMPT = """
Check production readiness.

Return ONLY JSON:

{{
  "ready": "YES/NO",
  "missing": ["short points"]
}}

Code:
{code}
"""
FINAL_REPORT_PROMPT = """
Summarize analysis.

Return ONLY JSON:

{{
  "overall_score": 1-10,
  "critical_risks": ["short points"],
  "final_verdict": "READY / NEEDS_FIXES"
}}

Analysis:
{analysis}
"""

