# Mentor Matching Assistant

This project uses the **Groq API** and a pre-trained LLM to convert user mentor search criteria into structured JSON queries. It leverages environment variables for API key management and the `dotenv` library for local development.

---

## Features
- Converts user inputs into structured JSON queries.
- Ensures Firebase-compatible field formatting.
- Supports filtering by profession, experience level, availability, and more.

---

## Prerequisites
1. Python 3.8+
2. Groq API Key
3. Required Python libraries:
   - `dotenv`
   - `groq`
   - `json`

---

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <repository_directory>
   pip install dotenv groq json
   python main.py
