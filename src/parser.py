import os

SUPPORTED_EXTENSIONS = {
    ".py", ".js", ".ts", ".java", ".cpp", ".c",
    ".go", ".rs", ".php", ".html", ".css",
    ".json", ".yaml", ".yml",".jsx",".tsx"
}

IGNORE_DIRS = {
    "venv", "env", "__pycache__", ".git",
    "node_modules", "dist", "build"
}
MAX_FILES = 10        
MAX_LINES = 100       
MAX_TOTAL_CHARS = 20000  




def read_file_limited(filepath: str) -> str:
    """
    Read only first N lines of file
    """
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            lines = []
            for i, line in enumerate(f):
                if i >= MAX_LINES:
                    break
                lines.append(line)
            return "".join(lines)
    except:
        return ""




def parse_codebase(root_path: str) -> str:
    """
    Extract limited code from project directory
    """

    combined_code = []
    file_count = 0

    for root, dirs, files in os.walk(root_path):

        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

        for file in files:
            if file_count >= MAX_FILES:
                break

            ext = os.path.splitext(file)[1]

            if ext in SUPPORTED_EXTENSIONS:
                filepath = os.path.join(root, file)
                code = read_file_limited(filepath)

                if code:
                    combined_code.append(
                        f"\nFILE: {file}\n{code}"
                    )
                    file_count += 1

    final_code = "\n".join(combined_code)

    return final_code[:MAX_TOTAL_CHARS]



def truncate_code(code: str, max_chars: int = MAX_TOTAL_CHARS) -> str:
    """
    Extra safety truncation
    """
    return code[:max_chars]
