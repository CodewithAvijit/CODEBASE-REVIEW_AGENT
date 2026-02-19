

```markdown
# 🛡️ Guardian of Code

**An AI-Powered Automated Codebase Review Agent**

Guardian of Code is a high-performance, AI-driven agent designed to automate and elevate the code review process. By integrating directly with GitHub, it acts as a tireless "Principal Security Engineer," allowing developers to maintain top-tier code standards through intelligent, context-aware analysis of single files or entire branches.

---

## 📖 Table of Contents
* [About the Project](#about-the-project)
* [System UI & Workflow](#system-ui--workflow)
* [Key Features](#key-features)
* [Tech Stack](#tech-stack)
* [Getting Started](#getting-started)
* [Author](#author)

---

## 🚀 About the Project

Traditional static analysis tools look for rigid patterns. **Guardian of Code** "thinks" through your architecture. Using LangGraph to orchestrate a multi-step reasoning process, this agent analyzes your code for logic flaws, security vulnerabilities, naming inconsistencies, and adherence to SOLID principles. 

Whether you are reviewing a single utility function or auditing an entire feature branch, Guardian of Code provides a detailed, actionable breakdown of your code's health.

---

## 🖥️ System UI & Workflow

### 1. Secure Authentication
Users securely log in via GitHub OAuth 2.0, granting read-only access to repository contents and metadata.
![Login Screen](/assests/im1.png) 

### 2. Repository & Branch Selection
Seamlessly navigate your GitHub repositories, branches, and directory tree. Choose to review an entire branch or hone in on a specific file.
![Repository Dashboard](/assests/im2.png)

### 3. System Audit Log
Receive a comprehensive integrity score, code quality breakdown, and security audit based on AI analysis.
![Audit Log](/assets/img3.png)

### 4. Workflow of Ai Agent
Receive a comprehensive integrity score, code quality breakdown, and security audit based on AI analysis.
![Agnet flow](/assests/wf.png)
---

## ✨ Key Features

* **Granular Reviews:** Choose between a quick `REVIEW FILE` for targeted feedback or `REVIEW BRANCH` for a comprehensive architectural audit.
* **Intelligent Scoring:** Automatically calculates an *Integrity Score* (e.g., 8/10) based on code quality, security threats, and maintainability.
* **Security Audits:** Flags potential threats (e.g., hardcoded CORS origins, SQL injections) and assigns threat level indicators (Low, Medium, High).
* **Actionable Insights:** Provides "Priority Fixes" and "Executive Summaries," ensuring developers know exactly what to refactor.
* **Privacy-First AI:** Leverages local LLMs via Ollama to ensure your proprietary codebase is never sent to public models.

---

## 🛠️ Tech Stack

This project is built using a modern, scalable, and AI-ready architecture:

* **AI & Orchestration:** LangGraph, LangChain, Ollama, Agentic Workflows, Prompt Engineering
* **Backend:** FastAPI, Spring Boot, Python, Java, RESTful APIs
* **Frontend:** React.js, Tailwind CSS
* **Security & Auth:** GitHub OAuth 2.0, JWT (JSON Web Tokens)
* **Version Control Integration:** Git, GitHub API

---

## ⚙️ Getting Started

*(Add your installation instructions here. For example:)*

### Prerequisites
* Springboot,React,Langchain &Langgraph
* Python 3.10.11+
* Java 25 (for Spring Boot)
* [Ollama](https://ollama.com/) installed locally with your preferred model.
* A GitHub OAuth App configured with your Client ID and Secret.

### Local Setup
1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/guardian-of-code.git](https://github.com/yourusername/guardian-of-code.git)

```






---

## 👨‍💻 Author

Built with ❤️ by **Avijit Bhadra**

