import requests

data_test = {
    "video_type": "Tutoriel",
    "video_url": "https://www.youtube.com/watch?v=LgGmaX-l5K8",
    "description_tone": "based on the transcript tone",
    "optional_keywords": "SEO, IA, LangChain",
    "transcript_format": "CHUNKS",
    "transcript": "",
    "languages": ["fr", "en"],
    "translation": "fr",
    "hashtags": "#SEO #LangChain",
    "timestamps_mode": "automatique",
    "manual_timestamps": "",
    "useful_links": [{"Github": "https://github.com/"}, {"LangChain Docs": "https://python.langchain.com"}]
}

response = requests.post("http://127.0.0.1:8000/generate", json=data_test)
print(response.status_code)
print(response.json())