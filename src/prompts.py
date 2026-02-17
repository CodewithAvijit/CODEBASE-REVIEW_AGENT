
SYSTEM_PROMPT = """
You are an expert Principal Software Engineer and Security Architect.
Your task is to review code and provide output in strict JSON format.

CRITICAL RULES:
1. Output ONLY valid JSON.
2. Do NOT use Markdown code blocks (no ```json).
3. Do NOT include conversational text, preambles, or explanations outside the JSON.
4. Keep values concise and actionable.
5. If the code is empty or not provided, return an error JSON structure.
"""

CODE_REVIEW_PROMPT = """
Analyze the provided code for Clean Code principles, readability, and maintainability.
Focus on: DRY (Don't Repeat Yourself), SOLID principles, and error handling.

RETURN JSON STRUCTURE:
{{
  "score": <integer_1_to_10>,
  "quality_summary": "<string_1_sentence_verdict>",
  "issues": [
    {{"severity": "high|medium|low", "description": "<short_technical_issue>"}}
  ],
  "refactoring_suggestions": ["<specific_actionable_fix>"]
}}

CODE TO REVIEW:
{code}
"""

SECURITY_REVIEW_PROMPT = """
Analyze the provided code for security vulnerabilities using OWASP Top 10 guidelines.
Look specifically for: Injection (SQL/Command), Hardcoded Secrets, Insecure Deserialization, and Improper Error Handling.

RETURN JSON STRUCTURE:
{{
  "security_score": <integer_1_to_10>,
  "risk_level": "CRITICAL|HIGH|MEDIUM|LOW",
  "vulnerabilities": [
    {{"type": "<vulnerability_type>", "location": "<function_or_line>", "description": "<short_description>"}}
  ],
  "remediation_steps": ["<specific_fix_command_or_pattern>"]
}}

CODE TO REVIEW:
{code}
"""

SYSTEM_DESIGN_PROMPT = """
Analyze the system architecture, modularity, and scalability of the provided code.
Identify the architectural pattern (MVC, Microservices, Monolith, etc.) and bottlenecks.

RETURN JSON STRUCTURE:
{{
  "architecture_style": "<detected_pattern>",
  "scalability_rating": "GOOD|NEEDS_WORK|POOR",
  "bottlenecks": ["<component_or_logic_limiting_scale>"],
  "design_improvements": ["<architectural_change_suggestion>"]
}}

CODE TO REVIEW:
{code}
"""

PRODUCTION_PROMPT = """
Evaluate if this code is production-ready.
Check for: Logging, Error Handling, Configuration Management, and Comments/Documentation.

RETURN JSON STRUCTURE:
{{
  "is_production_ready": <boolean_true_false>,
  "missing_requirements": ["<critical_missing_feature_for_prod>"],
  "deployment_risks": ["<potential_failure_point>"]
}}

CODE TO REVIEW:
{code}
"""

FINAL_REPORT_PROMPT = """
Synthesize the provided analysis reports into a final executive summary.
Weigh security risks higher than style issues.

INPUT DATA:
{analysis}

RETURN JSON STRUCTURE:
{{
  "executive_summary": "<3_sentence_overview>",
  "final_score": <integer_1_to_10>,
  "critical_blockers": ["<list_of_items_preventing_merge>"],
  "top_3_recommendations": ["<highest_impact_fix_1>", "<highest_impact_fix_2>", "<highest_impact_fix_3>"],
  "merge_verdict": "APPROVE | REJECT"
}}
"""