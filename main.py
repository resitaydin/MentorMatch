import os
from dotenv import load_dotenv
from groq import Groq
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

from google.cloud import firestore
from google.oauth2 import service_account

from google.cloud.firestore_v1.base_query import FieldFilter
from google.cloud.firestore_v1.base_query import BaseCompositeFilter

# Path to your service account key file
key_path = "/Users/HAKAN/Documents/GitHub/MentorMatch/serviceAccountKey.json"

# Load credentials
credentials = service_account.Credentials.from_service_account_file(key_path)

# Initialize Firestore client
db = firestore.Client(credentials=credentials)

# CORS middleware to allow requests from specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8501"],  # Allow requests from localhost:8501
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

    2. Experience Level: can be 1, 2, 3 or 0 (null)

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
        onlineFlexible: boolean or null
    }
    - preferredLanguage (string[] or null)
    - experienceLevel (number 1, 2, 3 or null)
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


def parse_query_for_firestore(query):
    firestore_query = {}

    # Map query parameters to Firestore field names
    if query.get("professionArea"):
        firestore_query["profession_area"] = query["professionArea"].lower()

    if query.get("maxPrice") is not None:
        firestore_query["maxPrice"] = query["maxPrice"]

    if query.get("minRating") is not None:
        firestore_query["minRating"] = query["minRating"]

    location = query.get("location")
    if location:
        if location.get("city"):
            firestore_query["location"] = location["city"].lower()
        if location.get("onlineFlexible") is not None:
            firestore_query["onlineFlexible"] = location["onlineFlexible"]

    if query.get("preferredLanguage"):
        for i, lang in enumerate(query["preferredLanguage"]):
            query["preferredLanguage"][i] = lang.lower()
        firestore_query["languages"] = query["preferredLanguage"]

    if query.get("experienceLevel"):
        firestore_query["experience_level"] = query["experienceLevel"]

    if query.get("availability"):
        availability = 0 # 0: no availability, 1: weekdays, 3: weekends, 2: weekdays and weekends
        if "weekdays" in query["availability"]:
            availability = 1
        if "weekends" in query["availability"]:
            if availability == 1:
                availability = 2
            else:
                availability = 3
        firestore_query["availability"] = availability

    age_range = query.get("ageRange")
    if age_range:
        if age_range.get("minAge") is not None:
            firestore_query["minAge"] = age_range["minAge"]
        if age_range.get("maxAge") is not None:
            firestore_query["maxAge"] = age_range["maxAge"]

    if query.get("genderPreference"):
        firestore_query["gender"] = query["genderPreference"].lower()

    return firestore_query


def execute_firestore_query(firestore_query):
    mentors_ref = db.collection('mentors')
    query = mentors_ref

    if 'profession_area' in firestore_query:
        query = query.where(filter=FieldFilter('profession_area', '==', firestore_query['profession_area']))
    else :
        print("No profession area specified")
        return []

    if 'minRating' in firestore_query:
        query = query.where(filter=FieldFilter('rating', '>=', firestore_query['minRating']))
    else:
        query = query.where(filter=FieldFilter('rating', '>=', 0))

    if 'maxPrice' in firestore_query:
        query = query.where(filter=FieldFilter('hourly_price', '<=', firestore_query['maxPrice']))
    else:
        query = query.where(filter=FieldFilter('hourly_price', '<=', 1_000_000))

    if 'location' in firestore_query:
        query = query.where(filter=FieldFilter('location', '==', firestore_query['location']))
    else:
        query = query.where(filter=FieldFilter('location', '!=', ''))

    if 'onlineFlexible' in firestore_query:
        query = query.where(filter=FieldFilter('available_online', '==', firestore_query['onlineFlexible']))
    else:
        query = query.where(filter=FieldFilter('available_online', '!=', ''))

    if 'languages' in firestore_query:
        query = query.where(filter=FieldFilter('languages', 'array_contains_any', firestore_query['languages']))
    else:
        query = query.where(filter=FieldFilter('languages', 'array_contains_any', ['english', 'french', 'spanish', 'german', 'italian', 'portuguese', 'russian', 'chinese', 'japanese', 'korean', 'arabic', 'mandarin']))

    if 'availability' in firestore_query:
        if firestore_query['availability'] == 1:
            query = query.where(filter=FieldFilter('availability', '<=', 2))
        elif firestore_query['availability'] == 2:
            query = query.where(filter=FieldFilter('availability', '==', 2))
        elif firestore_query['availability'] == 3:
            query = query.where(filter=FieldFilter('availability', '>=', 2))
    else:
        query = query.where(filter=FieldFilter('availability', '>', 0))

    if 'experience_level' in firestore_query:
        query = query.where(filter=FieldFilter('experience_level', '>=', firestore_query['experience_level']))
    else:
        query = query.where(filter=FieldFilter('experience_level', '>=', 0))

    if 'minAge' in firestore_query and 'maxAge' in firestore_query:
        query = query.where(filter=BaseCompositeFilter('AND', [FieldFilter('age', '>=', firestore_query['minAge']), FieldFilter('age', '<=', firestore_query['maxAge'])]))
    elif 'minAge' in firestore_query:
        query = query.where(filter=FieldFilter('age', '>=', firestore_query['minAge']))
    elif 'maxAge' in firestore_query:
        query = query.where(filter=FieldFilter('age', '<=', firestore_query['maxAge']))
    else:
        query = query.where(filter=FieldFilter('age', '>=', 0))

    if 'gender' in firestore_query:
        query = query.where(filter=FieldFilter('gender', '==', firestore_query['gender']))
    else:
        query = query.where(filter=FieldFilter('gender', '!=', ''))

    results = query.stream()
    return [doc.to_dict() for doc in results]


@app.get("/{user_prompt}")
def generate_query(user_prompt: str):
    query = generate_search_query(user_prompt)
    query = parse_query_for_firestore(query)
    results = execute_firestore_query(query)
    return results

@app.get("/example")
def example_query():
    user_prompt = "I am looking for a math mentor who is available on weekends, speaks English, lives in Paris, and has a rating of at least 3.5, who is female and over 30 and under 50 years old, and charges less than $50 per hour."
    print("User Prompt:" + user_prompt + "\n")
    query = generate_search_query(user_prompt)
    print("Query:" + str(query) + "\n")
    query = parse_query_for_firestore(query)
    print("Parsed Query:" + str(query) + "\n")
    results = execute_firestore_query(query)
    print("Results:" + str(results) + "\n")
    return user_prompt, results

@app.get("/")
def read_root():
    user_prompt = "I need a female English teacher aged 30-40, available online, under $30/hour with at least 4.5 rating"
    print("User Prompt:" + user_prompt + "\n")
    query = generate_search_query(user_prompt)
    print("Query:" + str(query) + "\n")
    query = parse_query_for_firestore(query)
    print("Parsed Query:" + str(query) + "\n")
    results = execute_firestore_query(query)
    print("Results:" + str(results) + "\n")
    # photo_urls = [
    #     "https://img.freepik.com/free-photo/portrait-handsome-young-man-with-arms-crossed-holding-white-headphone-around-his-neck_23-2148096439.jpg?semt=ais_hybrid",
    #     "https://img.freepik.com/free-photo/portrait-smiling-young-businesswoman-standing-with-her-arm-crossed-against-gray-wall_23-2147943827.jpg?semt=ais_hybrid",
    #     "https://img.freepik.com/free-photo/waist-up-shot-smart-confident-stylish-girl-with-curly-hair-combed-bun-standing-profile-gazing-glasses_176420-24692.jpg?semt=ais_hybrid",
    #     "https://img.freepik.com/free-photo/serious-businessman-sitting-table-portrait-minimalism-style-profile_155003-27926.jpg?semt=ais_hybrid",
    #     "https://img.freepik.com/free-photo/woman-portrait-with-blue-lights-visual-effects_23-2149419525.jpg?semt=ais_hybrid"
    # ]
    # # change photo urls for all mentors in database
    # mentor_ref = db.collection('mentors')
    # i = 0
    # for doc in mentor_ref.stream():
    #     doc = doc.to_dict()
    #     doc["photo-url"] = photo_urls[i]
    #     i = (i + 1) % len(photo_urls)
    #     mentor_ref.document(doc["name"]).set(doc)

    # add data to firestore
    # mentor_ref = db.collection('mentors')
    # mentor_ref.add({"hourly_price": 42, "age": 54, "experience_level": 5, "languages": ["german", "english"], "other_details": "Science enthusiast with hands-on lab experience.", "available_online": True, "photo-url": "https://cdn.corporatefinanceinstitute.com/assets/temporary-account-1024x513.jpeg", "profession_area": "science", "rating": 3.9, "availability": 1, "gender": "female", "location": "london", "name": "Alice Martin"})
    # mentor_ref.add({"hourly_price": 88, "age": 38, "experience_level": 2, "languages": ["english"], "other_details": "Science enthusiast with hands-on lab experience.", "available_online": True, "photo-url": "https://cdn.corporatefinanceinstitute.com/assets/temporary-account-1024x513.jpeg", "profession_area": "programming", "rating": 3.1, "availability": 2, "gender": "female", "location": "berlin", "name": "Maria Gonzalez"})
    # mentor_ref.add({"hourly_price": 24, "age": 25, "experience_level": 4, "languages": ["french", "japanese"], "other_details": "Science enthusiast with hands-on lab experience.", "available_online": False, "photo-url": "https://cdn.corporatefinanceinstitute.com/assets/temporary-account-1024x513.jpeg", "profession_area": "science", "rating": 4.7, "availability": 3, "gender": "female", "location": "berlin", "name": "Emily Davis"} )
    return {"Hello": "World"}
