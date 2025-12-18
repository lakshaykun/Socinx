import torch
import requests
from io import BytesIO
from PIL import Image
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from transformers import BlipProcessor, BlipForConditionalGeneration

# ------------------
# App config
# ------------------

app = FastAPI(
    title="Socinx AI Service",
    description="""
    Socinx AI Service provides:
    
    • Text → Embedding generation using all-mpnet-base-v2  
    • Image URL → Caption generation using BLIP  

    Designed for social feeds, recommendations, and semantic search.
    """,
    version="1.0.0"
)

device = "cuda" if torch.cuda.is_available() else "cpu"

# ------------------
# Models (loaded once)
# ------------------

@app.on_event("startup")
def load_models():
    global text_model, caption_processor, caption_model

    # Text embeddings
    text_model = SentenceTransformer(
        "sentence-transformers/all-mpnet-base-v2",
        device=device
    )

    # Image captioning
    caption_processor = BlipProcessor.from_pretrained(
        "Salesforce/blip-image-captioning-base"
    )
    caption_model = BlipForConditionalGeneration.from_pretrained(
        "Salesforce/blip-image-captioning-base"
    ).to(device)

    caption_model.eval()

# ------------------
# Schemas
# ------------------

class TextEmbeddingRequest(BaseModel):
    text: str | list[str]

    class Config:
        schema_extra = {
            "example": {
                "text": "Aesthetic sunset photo at the beach"
            }
        }

class ImageCaptionRequest(BaseModel):
    image_url: str

    class Config:
        schema_extra = {
            "example": {
                "image_url": "https://example.com/image.jpg"
            }
        }

# ------------------
# Routes
# ------------------

@app.post(
    "/embed/text",
    tags=["Embeddings"],
    summary="Generate text embeddings"
)
def embed_text(req: TextEmbeddingRequest):
    """
    Generate normalized semantic embeddings using **all-mpnet-base-v2**.

    - Output dimension: 768
    - Metric: cosine similarity
    """
    if isinstance(req.text, str) and len(req.text) > 5000:
        raise HTTPException(status_code=413, detail="Text too long")

    embedding = text_model.encode(
        req.text,
        normalize_embeddings=True
    )

    return {
        "embedding": embedding.tolist(),
        "dim": 768,
        "model": "all-mpnet-base-v2"
    }

@app.post(
    "/caption/image",
    tags=["Vision"],
    summary="Generate image caption"
)
def caption_image(req: ImageCaptionRequest):
    """
    Generate a natural language caption from an image URL using BLIP.
    """
    try:
        response = requests.get(req.image_url, timeout=5)
        response.raise_for_status()
        image = Image.open(BytesIO(response.content)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image URL")

    inputs = caption_processor(image, return_tensors="pt").to(device)

    with torch.no_grad():
        output = caption_model.generate(
            **inputs,
            max_new_tokens=50,
            num_beams=3
        )

    caption = caption_processor.decode(
        output[0],
        skip_special_tokens=True
    )

    return {"caption": caption}

@app.get("/", tags=["Health"])
def health():
    return {"status": "ok"}
