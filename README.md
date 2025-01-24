# Mentor Matching Platform

The **Mentor Matching Platform** is designed to connect mentees with suitable mentors by leveraging advanced AI-powered technologies and structured data management. This platform ensures efficient mentor-mentee matching through user-friendly interfaces and robust backend support.

---

## Features

Features
- AI-Powered Query Handling:
Utilizes a pre-trained language model (LLM) to intelligently process user inputs and convert them into structured JSON queries. This ensures accurate and efficient mentor matching tailored to user preferences.

- User-Friendly Mentor Search:
Allows users to input their mentor search criteria through an intuitive interface, which is then processed into structured queries for effective matching.

- Structured Data Management:
Ensures compatibility with Firebase by adhering to strict field formatting rules for seamless data storage and retrieval.

- Advanced Filtering Options:
Supports comprehensive filtering, enabling users to search for mentors based on various criteria such as profession, experience level, availability, and more.

- API Integration:
Provides a robust API for querying mentor data from Firestore, facilitating easy integration with other applications and services.

- Environment Variable Management:
Employs environment variables for secure API key management, utilizing the dotenv library for streamlined local development and configuration.

This platform leverages the power of AI to enhance user experience and deliver highly personalized mentor matching results. By combining advanced filtering, structured data, and the intelligence of LLMs, users can find the most suitable mentor matches tailored to their specific needs.

---

## Demo Video 
[Link](https://drive.google.com/file/d/1V6pfH6EGgLMSXsiuTVIIBPHPMqdyrK21/view?usp=drivesdk)

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
   - `uvicorn`
---

## Setup Instructions

1. Install the required libraries:
   ```bash
   pip install dotenv groq json fastapi google-cloud-firestore uvicorn
   ```

2. Set up environment variables for the **Groq API Key** by creating a `.env` file in the project root and adding:
   ```env
   GROQ_API_KEY=your_api_key_here
   ```

3. Ensure your Google Cloud Firestore service account key is available. Set the path to the service account key in your code:
   ```python
   key_path = "/path/to/your/serviceAccountKey.json"
   ```

4. Go to 'source_codes/backend' and open up a new terminal then run the backend:
   ```bash
   uvicorn main:app --reload
   ```
5. Go to /frontend/src and open up another terminal then run the frontend:
   ```bash
   npm i
   npm run dev
   ```
6. Open up the localhost from a browser:
   ```bash
   http://localhost:8501/
   ```
---
7. Now you're ready to use the application!

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