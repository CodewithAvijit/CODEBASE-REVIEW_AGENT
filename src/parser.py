import os

SUPPORTED_EXTENSIONS = {
    ".py", ".js", ".ts", ".java", ".cpp", ".c",
    ".go", ".rs", ".php", ".jsx", ".tsx"
}

IGNORE_DIRS = {
    "venv", "env", "__pycache__", ".git",
    "node_modules", "dist", "build", ".next",
    ".vscode", ".idea"
}

IGNORE_FILES = {
    "package-lock.json", "yarn.lock", "pnpm-lock.yaml",
    "poetry.lock"
}

MAX_FILES = 20
MAX_LINES_PER_FILE = 250
MAX_TOTAL_CHARS = 20000



def read_file_limited(filepath: str) -> str:
    """Safely read text files with encoding fallback."""
    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            lines = []
            for i, line in enumerate(f):
                if i >= MAX_LINES_PER_FILE:
                    break
                lines.append(line)
            return "".join(lines)
    except Exception:
        return ""



def file_priority(fp: str) -> int:
    """Better priority logic for important files."""
    name = os.path.basename(fp).lower()

    high_priority = [
        "main", "app", "server", "index",
        "application", "startup"
    ]

    mid_priority = [
        "controller", "service", "route",
        "api", "handler", "model"
    ]

    if any(k in name for k in high_priority):
        return 0
    if any(k in name for k in mid_priority):
        return 1

    return 2



def parse_codebase(root_path: str) -> str:
    filepaths = []

    for root, dirs, files in os.walk(root_path):

        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS and not d.startswith(".")]

        for file in files:
            if file in IGNORE_FILES or file.startswith("."):
                continue

            ext = os.path.splitext(file)[1].lower()
            if ext in SUPPORTED_EXTENSIONS:
                filepaths.append(os.path.join(root, file))

    filepaths.sort(key=lambda fp: (file_priority(fp), len(fp)))

    combined_code = []
    current_chars = 0
    files_added = 0

    for fp in filepaths:
        if files_added >= MAX_FILES:
            break

        code = read_file_limited(fp)
        if not code.strip():
            continue

        file_block = f"\n--- FILE: {os.path.basename(fp)} ---\n{code}\n"

        if current_chars + len(file_block) > MAX_TOTAL_CHARS:
            break

        combined_code.append(file_block)
        current_chars += len(file_block)
        files_added += 1

    return "\n".join(combined_code)



def truncate_code(code: str, max_chars: int = MAX_TOTAL_CHARS) -> str:
    """Hard truncate to protect LLM context window."""
    return code[:max_chars]
