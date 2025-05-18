from fastapi import FastAPI
from pydantic import BaseModel , RootModel, model_validator
from typing import List
from .description_generator import process_video
from fastapi.middleware.cors import CORSMiddleware


#définition d'un modèle pour vérifier qu'une dictionnaire contient une seule clé
class SingleKeyDict(RootModel[dict]):
    @model_validator(mode="before")
    @classmethod
    def check_single_key(cls, value):
        if not isinstance(value, dict):
            raise TypeError("La valeur doit être un dictionnaire.")
        if len(value) != 1:
            raise ValueError("Le dictionnaire doit contenir une seule clé.")
        return value

#définition d'un modèle de donnéees
class VideoData(BaseModel):
    video_type: str
    video_url: str
    description_tone: str
    optional_keywords: str
    transcript_format: str
    transcript: str
    languages: List[str]
    translation: str
    hashtags: str
    timestamps_mode: str
    manual_timestamps: str
    useful_links: List[SingleKeyDict]


app = FastAPI()

# Configuration du CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Autorise toutes les origines en développement
    allow_credentials=True,
    allow_methods=["*"],  # Autorise toutes les méthodes
    allow_headers=["*"],  # Autorise tous les headers
)

@app.post("/generate")
async def generate_description(data: VideoData):
    result = process_video(data.model_dump())
    return result