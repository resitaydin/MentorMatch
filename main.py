import os
from dotenv import load_dotenv
from groq import Groq
import json

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

# Initialize Groq client
client = Groq(api_key=GROQ_API_KEY)

def generate_search_query(user_prompt):
    # System prompt to guide the LLM
    system_prompt = """
    You are a mentor matching assistant. Convert user requests into structured JSON queries.
    RETURN ONLY THE JSON OBJECT, NO EXPLANATIONS OR ADDITIONAL TEXT.

    STRICT FORMATTING RULES:
    1. Subject/Profession rules:
       - First letter capitalized
       - Examples: "Math", "Music", "Programming", "Art", "English"
       - Convert variations (e.g., "piano" -> "Music", "coding" -> "Programming")

    2. Experience Level: only "beginner", "intermediate", "advanced", or null

    3. Availability: only ["weekdays"], ["weekends"], ["weekdays", "weekends"], or null

    4. Rating must be between 0.0 and 5.0

    5. Languages must be real languages in English naming.

    6. Firebase Query Compatible Format:
    - All field names must be valid Firebase field names (no spaces or special characters)
    - Arrays should be formatted for Firebase array-contains queries
    - Use camelCase for all field names
    
    Required fields:
    - professionArea (string, required, exact match from subject list)
    - maxPrice (number or null)
    - minRating (number 0.0-5.0 or null)
    - location: {
        city: string,
        onlineFlexible: boolean
    }
    - preferredLanguage (string[] or null)
    - experienceLevel (string or null)
    - availability (string[] or null)
    - ageRange: {
        minAge: number|null,
        maxAge: number|null
    }
    - genderPreference: string|null
    """
    
    # Complete message structure
    messages = [
        {
            "role": "system",
            "content": system_prompt
        },
        {
            "role": "user",
            "content": f"Convert this request into a search query: {user_prompt}"
        }
    ]

    try:
        # Call Groq API
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.1,
            max_tokens=500
        )

        # Extract and parse the JSON response
        response_text = completion.choices[0].message.content
        # Find the JSON part in the response
        json_start = response_text.find('{')
        json_end = response_text.rfind('}') + 1
        if json_start >= 0 and json_end > 0:
            json_str = response_text[json_start:json_end]
            return json.loads(json_str)
        else:
            raise ValueError("No valid JSON found in the response")

    except Exception as e:
        print(f"Error generating query: {str(e)}")
        return None

def main():
    while True:
        print("\nEnter your mentor search criteria (or 'quit' to exit):")
        user_input = input("> ")
        
        if user_input.lower() == 'quit':
            break
            
        query = generate_search_query(user_input)
        if query:
            print("\nGenerated Query:")
            print(json.dumps(query, indent=2))

if __name__ == "__main__":
    main()