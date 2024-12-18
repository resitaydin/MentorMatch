Here’s a revised version of the README for your project:

---

# Mentor Matching Assistant

The **Mentor Matching Assistant** leverages the **Groq API** and a pre-trained language model (LLM) to convert user mentor search criteria into structured JSON queries. It integrates with Firebase and uses environment variables for API key management, along with the `dotenv` library for local development.

---

## Features
- Converts user inputs into structured JSON queries for mentor matching.
- Ensures compatibility with Firebase by adhering to strict field formatting rules.
- Supports advanced filtering options, including profession, experience level, availability, and more.
- Provides an API for querying mentor data from Firestore.

---

## Prerequisites
Before setting up the project, ensure you have the following:

1. Python 3.8+  
2. **Groq API Key**  
3. Required Python libraries:
   - `dotenv`
   - `groq`
   - `json`
   - `fastapi`
   - `google-cloud-firestore`

---

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <repository_directory>
   ```

2. Install the required libraries:
   ```bash
   pip install dotenv groq json fastapi google-cloud-firestore
   ```

3. Set up environment variables for the **Groq API Key** by creating a `.env` file in the project root and adding:
   ```env
   GROQ_API_KEY=your_api_key_here
   ```

4. Ensure your Google Cloud Firestore service account key is available. Set the path to the service account key in your code:
   ```python
   key_path = "/path/to/your/serviceAccountKey.json"
   ```

5. Run the application:
   ```bash
   python main.py
   ```

---

## API Endpoints

### `GET /{user_prompt}`
- **Description**: Converts the user’s prompt into a query and retrieves matching mentors from Firestore.
- **Example Usage**: 
  ```bash
  curl http://localhost:8000/I%20am%20looking%20for%20a%20math%20mentor%20who%20is%20available%20on%20weekends%20and%20charges%20less%20than%20$50/hour
  ```
- **Response**: Returns a list of mentors matching the criteria.

### `GET /example`
- **Description**: Provides an example query based on a predefined prompt, prints the query at each step.
- **Example Usage**: 
  ```bash
  curl http://localhost:8000/example
  ```
- **Response**: Prints the user prompt, generated query, parsed query, and results.

### `GET /`
- **Description**: A simple root endpoint for testing the server.
- **Response**: Returns `{"Hello": "World"}`.

---

## Code Overview

### Core Functions

1. **`generate_search_query(user_prompt)`**: 
   - Converts the user's search prompt into a structured JSON query using Groq and a pre-trained LLM.
   
2. **`parse_query_for_firestore(query)`**: 
   - Maps the generated query parameters into Firestore-compatible field names and formats.
   
3. **`execute_firestore_query(firestore_query)`**: 
   - Executes the Firestore query based on the parsed query, retrieving mentor data that matches the search criteria.

### Example Search Query

Given the user prompt:

```text
"I am looking for a math mentor who is available on weekends, speaks English, lives in Paris, and has a rating of at least 3.5, who is female and over 30 and under 50 years old, and charges less than $50 per hour."
```

The assistant will generate a query that looks for mentors in the "math" profession with:
- **Availability**: Weekends only
- **Location**: Paris
- **Rating**: At least 3.5
- **Age Range**: Between 30 and 50
- **Gender Preference**: Female
- **Hourly Price**: Less than $50

The query will be formatted and sent to Firestore, where mentors matching the criteria are retrieved.

---

## Firebase Setup

Make sure Firestore is set up in your Google Cloud project, and that the service account key file is correctly linked to the application.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.