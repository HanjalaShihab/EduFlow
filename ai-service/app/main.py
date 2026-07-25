"""
EduFlow AI Service
FastAPI-based microservice for face recognition and liveness detection.
"""
import os
import base64
import numpy as np
from typing import List, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI(
    title="EduFlow AI Service",
    description="Face recognition and liveness detection API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class FaceEnrollRequest(BaseModel):
    user_id: int
    institution_id: int
    images: List[str]  # base64 encoded
    poses: List[str]

class FaceVerifyRequest(BaseModel):
    user_id: int
    image: str  # base64 encoded
    threshold: Optional[float] = 0.6

class LivenessCheckRequest(BaseModel):
    image: str  # base64 encoded

class FaceEmbedding(BaseModel):
    user_id: int
    embedding: List[float]
    pose: str

# In-memory store for embeddings (in production, use Redis)
embedding_store: dict = {}

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "eduflow-ai",
        "version": "1.0.0",
        "models_loaded": False,  # Will be True when models are loaded
    }

@app.post("/api/enroll")
async def enroll_face(request: FaceEnrollRequest):
    """
    Enroll a user's face by generating embeddings from multiple images.
    In production, this uses InsightFace to extract 512-dimensional embeddings.
    """
    try:
        if len(request.images) < 3:
            raise HTTPException(status_code=400, detail="At least 3 images required")

        embeddings = []
        for i, (image_b64, pose) in enumerate(zip(request.images, request.poses)):
            # Mock embedding generation - in production, use InsightFace
            mock_embedding = list(np.random.randn(512).astype(np.float32))
            mock_embedding = (mock_embedding / np.linalg.norm(mock_embedding)).tolist()
            
            embedding = FaceEmbedding(
                user_id=request.user_id,
                embedding=mock_embedding,
                pose=pose
            )
            embeddings.append(embedding)

        # Store composite embedding (average of all)
        composite = np.mean([e.embedding for e in embeddings], axis=0).tolist()
        embedding_store[request.user_id] = {
            "embedding": composite,
            "embeddings": [e.model_dump() for e in embeddings],
            "institution_id": request.institution_id,
            "num_images": len(request.images),
        }

        return {
            "status": "success",
            "message": "Face enrolled successfully",
            "user_id": request.user_id,
            "embedding_dimension": 512,
            "num_images": len(request.images),
            "confidence": 0.95,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/verify")
async def verify_face(request: FaceVerifyRequest):
    """
    Verify a face against the enrolled embedding.
    Returns match confidence and liveness score.
    """
    try:
        if request.user_id not in embedding_store:
            raise HTTPException(status_code=404, detail="User not enrolled")

        stored = embedding_store[request.user_id]
        stored_embedding = np.array(stored["embedding"])

        # Decode image and extract embedding (mock)
        query_embedding = np.random.randn(512).astype(np.float32)
        query_embedding = query_embedding / np.linalg.norm(query_embedding)

        # Compute cosine similarity
        similarity = float(np.dot(stored_embedding, query_embedding))
        confidence = max(0.0, min(1.0, (similarity + 1) / 2))

        # Mock liveness score
        liveness_score = 0.95
        liveness_passed = liveness_score > 0.5

        matched = confidence >= request.threshold

        return {
            "matched": matched,
            "confidence": round(confidence, 4),
            "threshold": request.threshold,
            "liveness_score": round(liveness_score, 4),
            "liveness_passed": liveness_passed,
            "similarity": round(similarity, 4),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/liveness")
async def check_liveness(request: LivenessCheckRequest):
    """
    Perform liveness detection on a single image.
    Checks for spoofing attempts.
    """
    try:
        # Mock liveness detection
        liveness_score = 0.92
        is_real = liveness_score > 0.5

        return {
            "is_real": is_real,
            "liveness_score": round(liveness_score, 4),
            "spoof_probability": round(1 - liveness_score, 4),
            "method": "texture_analysis",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...), user_id: int = Form(...)):
    """
    Upload and process an image for face detection and embedding.
    """
    try:
        contents = await file.read()
        image_b64 = base64.b64encode(contents).decode("utf-8")

        # Mock face detection
        face_detected = True
        num_faces = 1

        return {
            "status": "success",
            "face_detected": face_detected,
            "num_faces": num_faces,
            "image_size": len(contents),
            "user_id": user_id,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
        reload=True,
    )
